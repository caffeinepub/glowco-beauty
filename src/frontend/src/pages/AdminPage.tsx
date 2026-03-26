import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit2,
  Loader2,
  Package,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend";
import { SAMPLE_PRODUCTS } from "../data/sampleProducts";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddProduct,
  useAllOrders,
  useAllProducts,
  useDeleteProduct,
  useIsAdmin,
  useUpdateOrderStatus,
  useUpdateProduct,
} from "../hooks/useQueries";

const EMPTY_PRODUCT: Omit<Product, "id"> = {
  name: "",
  brand: "",
  category: "Face",
  price: 0,
  originalPrice: 0,
  rating: 4.5,
  reviewCount: BigInt(0),
  imageUrl: "",
  description: "",
  inStock: true,
  isFeatured: false,
  isNew: false,
};

export default function AdminPage() {
  const { identity, login } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: allProducts, isLoading: productsLoading } = useAllProducts();
  const { data: allOrders, isLoading: ordersLoading } = useAllOrders();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateOrderStatus = useUpdateOrderStatus();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(EMPTY_PRODUCT);

  const products =
    allProducts && allProducts.length > 0 ? allProducts : SAMPLE_PRODUCTS;

  const openAdd = () => {
    setEditingProduct(null);
    setForm(EMPTY_PRODUCT);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      rating: p.rating,
      reviewCount: p.reviewCount,
      imageUrl: p.imageUrl,
      description: p.description,
      inStock: p.inStock,
      isFeatured: p.isFeatured,
      isNew: p.isNew,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ ...form, id: editingProduct.id });
        toast.success("Product updated");
      } else {
        await addProduct.mutateAsync({ ...form, id: BigInt(0) });
        toast.success("Product added");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (!identity) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Package className="h-16 w-16 text-border mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold mb-2">Admin Panel</h2>
        <p className="text-muted-foreground mb-6">
          Please login to access the admin panel.
        </p>
        <Button
          type="button"
          data-ocid="admin.login.button"
          onClick={login}
          className="bg-primary text-primary-foreground hover:bg-rose-mauveHover rounded-full px-8"
        >
          Login
        </Button>
      </main>
    );
  }

  if (adminLoading) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground mt-4">Checking permissions...</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Admin Panel
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage products and orders
          </p>
        </div>
        {isAdmin && (
          <Button
            type="button"
            data-ocid="admin.add_product.button"
            onClick={openAdd}
            className="bg-primary text-primary-foreground hover:bg-rose-mauveHover rounded-full gap-2"
          >
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        )}
      </div>

      {!isAdmin && (
        <div data-ocid="admin.error_state" className="text-center py-12">
          <p className="text-muted-foreground">
            You don&apos;t have admin privileges.
          </p>
        </div>
      )}

      {isAdmin && (
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger data-ocid="admin.products.tab" value="products">
              <Package className="h-4 w-4 mr-2" /> Products ({products.length})
            </TabsTrigger>
            <TabsTrigger data-ocid="admin.orders.tab" value="orders">
              <ShoppingCart className="h-4 w-4 mr-2" /> Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            {productsLoading ? (
              <div
                data-ocid="admin.products.loading_state"
                className="text-center py-12"
              >
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              </div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p, idx) => (
                      <TableRow
                        key={p.id.toString()}
                        data-ocid={`admin.product.row.${idx + 1}`}
                      >
                        <TableCell>
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="h-12 w-12 object-cover rounded-lg"
                          />
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                          {p.name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {p.brand}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {p.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${p.price.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {p.inStock ? (
                              <Badge className="bg-green-100 text-green-700 text-xs w-fit">
                                In Stock
                              </Badge>
                            ) : (
                              <Badge
                                variant="destructive"
                                className="text-xs w-fit"
                              >
                                Out of Stock
                              </Badge>
                            )}
                            {p.isNew && (
                              <Badge className="bg-primary/10 text-primary text-xs w-fit">
                                New
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              type="button"
                              data-ocid={`admin.edit_button.${idx + 1}`}
                              variant="ghost"
                              size="icon"
                              onClick={() => openEdit(p)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              data-ocid={`admin.delete_button.${idx + 1}`}
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(p.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders">
            {ordersLoading ? (
              <div
                data-ocid="admin.orders.loading_state"
                className="text-center py-12"
              >
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              </div>
            ) : !allOrders || allOrders.length === 0 ? (
              <div
                data-ocid="admin.orders.empty_state"
                className="text-center py-12"
              >
                <ShoppingCart className="h-12 w-12 text-border mx-auto mb-3" />
                <p className="text-muted-foreground">No orders yet</p>
              </div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allOrders.map((order, idx) => (
                      <TableRow
                        key={order.id.toString()}
                        data-ocid={`admin.order.row.${idx + 1}`}
                      >
                        <TableCell className="font-mono text-xs">
                          #{order.id.toString()}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {order.userId.toString().slice(0, 12)}...
                        </TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell className="font-semibold">
                          ${order.totalAmount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`text-xs ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : order.status === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            onValueChange={(v) =>
                              updateOrderStatus
                                .mutateAsync({ orderId: order.id, status: v })
                                .then(() => toast.success("Status updated"))
                                .catch(() => toast.error("Update failed"))
                            }
                            defaultValue={order.status}
                          >
                            <SelectTrigger
                              data-ocid={`admin.order.status.${idx + 1}`}
                              className="w-32 h-7 text-xs"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "pending",
                                "processing",
                                "shipped",
                                "completed",
                                "cancelled",
                              ].map((s) => (
                                <SelectItem
                                  key={s}
                                  value={s}
                                  className="text-xs"
                                >
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Product Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          data-ocid="admin.product.dialog"
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="p-name">Product Name</Label>
              <Input
                data-ocid="admin.product.name.input"
                id="p-name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Velvet Matte Lipstick"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-brand">Brand</Label>
              <Input
                data-ocid="admin.product.brand.input"
                id="p-brand"
                value={form.brand}
                onChange={(e) =>
                  setForm((f) => ({ ...f, brand: e.target.value }))
                }
                placeholder="e.g. GlowCo"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger data-ocid="admin.product.category.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Lips", "Eyes", "Face", "Skin", "Nails"].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-price">Price ($)</Label>
              <Input
                data-ocid="admin.product.price.input"
                id="p-price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    price: Number.parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-orig-price">Original Price ($)</Label>
              <Input
                data-ocid="admin.product.original_price.input"
                id="p-orig-price"
                type="number"
                step="0.01"
                value={form.originalPrice}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    originalPrice: Number.parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="p-image">Image URL</Label>
              <Input
                data-ocid="admin.product.image.input"
                id="p-image"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="p-desc">Description</Label>
              <Textarea
                data-ocid="admin.product.description.textarea"
                id="p-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Product description..."
                rows={3}
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                data-ocid="admin.product.in_stock.switch"
                checked={form.inStock}
                onCheckedChange={(v) => setForm((f) => ({ ...f, inStock: v }))}
              />
              <Label>In Stock</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                data-ocid="admin.product.featured.switch"
                checked={form.isFeatured}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, isFeatured: v }))
                }
              />
              <Label>Featured</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                data-ocid="admin.product.is_new.switch"
                checked={form.isNew}
                onCheckedChange={(v) => setForm((f) => ({ ...f, isNew: v }))}
              />
              <Label>New Arrival</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              data-ocid="admin.product.cancel.button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              data-ocid="admin.product.save.button"
              onClick={handleSave}
              disabled={addProduct.isPending || updateProduct.isPending}
              className="bg-primary text-primary-foreground hover:bg-rose-mauveHover"
            >
              {addProduct.isPending || updateProduct.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {editingProduct ? "Update" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
