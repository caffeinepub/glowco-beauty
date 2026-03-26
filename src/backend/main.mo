import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Types
  public type Product = {
    id : Nat;
    name : Text;
    brand : Text;
    category : Text;
    price : Float;
    originalPrice : Float;
    rating : Float;
    reviewCount : Nat;
    imageUrl : Text;
    description : Text;
    inStock : Bool;
    isFeatured : Bool;
    isNew : Bool;
  };

  public type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  public type OrderItem = {
    productId : Nat;
    quantity : Nat;
    price : Float;
  };

  public type Order = {
    id : Nat;
    userId : Principal;
    items : [OrderItem];
    totalAmount : Float;
    status : Text;
    createdAt : Int;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };

    public func compareByCategory(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.category, p2.category);
    };

    public func compareByName(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.name, p2.name);
    };

    public func compareByBrand(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.brand, p2.brand);
    };
  };

  // State
  // Products
  var nextProductId = 1;
  let products = Map.empty<Nat, Product>();

  // Carts & Wishlists
  let carts = Map.empty<Principal, [CartItem]>();
  let wishlists = Map.empty<Principal, [Nat]>();

  // Orders
  var nextOrderId = 1;
  let orders = Map.empty<Nat, Order>();

  // Mixins & Auth
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Stripe integration
  var configuration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    configuration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    configuration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Product Methods
  func getNextProductId() : Nat {
    let id = nextProductId;
    nextProductId += 1;
    id;
  };

  public shared ({ caller }) func addProduct(product : Product) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let id = getNextProductId();
    let newProduct : Product = {
      product with
      id;
    };
    products.add(id, newProduct);
    id;
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not products.containsKey(product.id)) {
      Runtime.trap("Product not found");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    products.remove(id);
  };

  public query func getProduct(id : Nat) : async ?Product {
    products.get(id);
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query func getProductsByCategory(category : Text) : async [Product] {
    products.values().toArray().filter(
      func(p) {
        p.category.contains(#text category) or p.name.contains(#text category) or p.brand.contains(#text category);
      }
    );
  };

  // Cart Methods
  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than 0");
    };

    if (not products.containsKey(productId)) {
      Runtime.trap("Product not found");
    };

    let existingCart = switch (carts.get(caller)) {
      case (null) { [] };
      case (?items) { items };
    };

    let updatedCart = existingCart.map(
      func(item) {
        if (item.productId == productId) {
          { item with quantity };
        } else {
          item;
        };
      }
    );

    let cart : [CartItem] = if (existingCart.size() == updatedCart.size()) {
      updatedCart.concat([{ productId; quantity }]);
    } else {
      updatedCart;
    };

    carts.add(caller, cart);
  };

  public shared ({ caller }) func removeFromCart(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    let cart = switch (carts.get(caller)) {
      case (null) { [] };
      case (?items) { items };
    };

    let filteredCart = cart.filter(func(item) { item.productId != productId });
    carts.add(caller, filteredCart);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?items) { items };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    carts.remove(caller);
  };

  // Wishlist Methods
  public shared ({ caller }) func addToWishlist(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    if (productId == 0) {
      Runtime.trap("Invalid Product ID");
    };

    if (not products.containsKey(productId)) {
      Runtime.trap("Product not found");
    };

    let wishlist = switch (wishlists.get(caller)) {
      case (null) { [] };
      case (?items) { items };
    };
    if (wishlist.filter(func(id) { id == productId }).size() > 0) {
      Runtime.trap("Product already in wishlist");
    };
    let updatedWishlist = wishlist.concat([productId]);
    wishlists.add(caller, updatedWishlist);
  };

  public shared ({ caller }) func removeFromWishlist(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    let wishlist = switch (wishlists.get(caller)) {
      case (null) { [] };
      case (?items) { items };
    };
    let filteredWishlist = wishlist.filter(func(id) { id != productId });
    wishlists.add(caller, filteredWishlist);
  };

  public query ({ caller }) func getWishlist() : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    switch (wishlists.get(caller)) {
      case (null) { [] };
      case (?items) { items };
    };
  };

  // Order Methods
  func getNextOrderId() : Nat {
    let id = nextOrderId;
    nextOrderId += 1;
    id;
  };

  public shared ({ caller }) func placeOrder() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    let cart = switch (carts.get(caller)) {
      case (null) { [] };
      case (?items) { items };
    };
    if (cart.size() == 0) {
      Runtime.trap("Cart is empty");
    };
    let items = cart.map(
      func(item) {
        let product = switch (products.get(item.productId)) {
          case (null) { Runtime.trap("Product not found") };
          case (?p) { p };
        };
        {
          productId = item.productId;
          quantity = item.quantity;
          price = product.price;
        };
      }
    );

    let totalAmount = items.map(func(item) { item.price * item.quantity.toFloat() }).foldLeft(
      0.0,
      func(sum, val) { sum + val },
    );

    let orderId = getNextOrderId();
    let newOrder : Order = {
      id = orderId;
      userId = caller;
      items = items;
      totalAmount;
      status = "Pending";
      createdAt = Time.now();
    };

    orders.add(orderId, newOrder);
    carts.remove(caller);
    orderId;
  };

  public query ({ caller }) func getUserOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    orders.values().toArray().filter(func(order) { order.userId == caller });
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let order = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?o) { o };
    };
    let updatedOrder = { order with status };
    orders.add(orderId, updatedOrder);
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    orders.values().toArray();
  };

  // Price Helpers
  public query func getPriceWithDiscount(originalPrice : Float, discountRate : Float) : async Float {
    let discountAmount = originalPrice * discountRate / 100.0;
    originalPrice - discountAmount;
  };

  public query func comparePrices(price1 : Float, price2 : Float) : async Text {
    if (Float.compare(price1, price2) == #less) {
      "Price 1 is less than Price 2";
    } else {
      "Price 2 is less than or equal to Price 1";
    };
  };

  // Featured & New Products
  public query func getFeaturedProducts() : async [Product] {
    products.values().toArray().filter(func(p) { p.isFeatured }).sort();
  };

  public query func getNewProducts() : async [Product] {
    products.values().toArray().filter(func(p) { p.isNew }).sort();
  };
};

