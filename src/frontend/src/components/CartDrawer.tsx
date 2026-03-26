import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";
import { useActor } from "../hooks/useActor";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { cartItems, removeFromCart, updateCartQuantity, clearCart } =
    useAppContext();
  const { actor } = useActor();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const handleCheckout = async () => {
    if (!actor) {
      toast.error("Please login to checkout");
      return;
    }
    try {
      const items = cartItems.map((item) => ({
        productName: item.product.name,
        currency: "usd",
        quantity: BigInt(item.quantity),
        priceInCents: BigInt(Math.round(item.product.price * 100)),
        productDescription: item.product.description,
      }));
      const url = window.location.href;
      const sessionUrl = await actor.createCheckoutSession(items, url, url);
      if (sessionUrl) window.location.href = sessionUrl;
      else toast.error("Checkout not configured");
    } catch {
      toast.error("Checkout failed. Please try again.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        data-ocid="cart.sheet"
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0"
      >
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="font-serif text-lg flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Your Bag
            {cartItems.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({cartItems.length} items)
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div
            data-ocid="cart.empty_state"
            className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center"
          >
            <ShoppingBag className="h-16 w-16 text-border" />
            <div>
              <p className="font-semibold text-foreground">Your bag is empty</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add some products to get started
              </p>
            </div>
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="bg-primary text-primary-foreground hover:bg-rose-mauveHover rounded-full uppercase text-xs tracking-wider"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="px-6 py-4 space-y-4">
                {cartItems.map((item, idx) => (
                  <div
                    key={item.product.id.toString()}
                    data-ocid={`cart.item.${idx + 1}`}
                    className="flex gap-3"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-20 w-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">
                        {item.product.brand}
                      </p>
                      <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
                        {item.product.name}
                      </p>
                      <p className="text-sm font-bold text-foreground mt-1">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          data-ocid={`cart.qty_minus.${idx + 1}`}
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.quantity - 1,
                            )
                          }
                          className="h-6 w-6 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          data-ocid={`cart.qty_plus.${idx + 1}`}
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.quantity + 1,
                            )
                          }
                          className="h-6 w-6 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      data-ocid={`cart.remove.${idx + 1}`}
                      onClick={() => removeFromCart(item.product.id)}
                      className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-border px-6 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-bold text-lg">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Taxes and shipping calculated at checkout
              </p>
              <Button
                type="button"
                data-ocid="cart.checkout.button"
                onClick={handleCheckout}
                className="w-full bg-primary text-primary-foreground hover:bg-rose-mauveHover uppercase tracking-wider text-sm font-semibold rounded-full py-3"
              >
                Checkout
              </Button>
              <Button
                type="button"
                data-ocid="cart.clear.button"
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="w-full text-muted-foreground text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear Bag
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
