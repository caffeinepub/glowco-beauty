import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Heart, ShoppingBag, Star, X } from "lucide-react";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";

export default function ProductModal() {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    isWishlisted,
  } = useAppContext();

  if (!selectedProduct) return null;

  const p = selectedProduct;
  const wishlisted = isWishlisted(p.id);
  const discountPct =
    p.originalPrice > p.price
      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
      : 0;

  return (
    <Dialog
      open={!!selectedProduct}
      onOpenChange={(o) => !o && setSelectedProduct(null)}
    >
      <DialogContent
        data-ocid="product.modal"
        className="max-w-2xl p-0 overflow-hidden rounded-2xl"
      >
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-2/5 bg-[oklch(0.97_0_0)] relative">
            <img
              src={p.imageUrl}
              alt={p.name}
              className="w-full h-64 sm:h-full object-cover"
            />
            {discountPct > 0 && (
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                -{discountPct}%
              </Badge>
            )}
          </div>

          <div className="sm:w-3/5 p-6 flex flex-col">
            <button
              type="button"
              data-ocid="product.modal.close_button"
              onClick={() => setSelectedProduct(null)}
              className="self-end -mt-2 -mr-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              {p.brand}
            </p>
            <h2 className="font-serif text-xl font-bold text-foreground mt-1 mb-3">
              {p.name}
            </h2>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${
                      s <= Math.floor(p.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-border"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {p.rating} ({p.reviewCount.toString()} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold text-foreground">
                ${p.price.toFixed(2)}
              </span>
              {p.originalPrice > p.price && (
                <span className="text-sm text-muted-foreground line-through">
                  ${p.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex gap-2 mb-4">
              <Badge variant="secondary" className="text-xs">
                {p.category}
              </Badge>
              {p.isNew && (
                <Badge className="bg-foreground text-background text-xs">
                  NEW
                </Badge>
              )}
              {p.isFeatured && (
                <Badge className="bg-primary text-primary-foreground text-xs">
                  Featured
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
              {p.description}
            </p>

            <div className="flex gap-3">
              <Button
                type="button"
                data-ocid="product.modal.add_button"
                onClick={() => {
                  addToCart(p);
                  toast.success(`${p.name} added to bag!`);
                  setSelectedProduct(null);
                }}
                disabled={!p.inStock}
                className="flex-1 bg-primary text-primary-foreground hover:bg-rose-mauveHover rounded-full uppercase text-xs tracking-wider font-bold"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {p.inStock ? "Add to Bag" : "Out of Stock"}
              </Button>
              <Button
                type="button"
                data-ocid="product.modal.wishlist.button"
                variant="outline"
                size="icon"
                onClick={() => {
                  toggleWishlist(p.id);
                  toast.success(
                    wishlisted ? "Removed from wishlist" : "Added to wishlist",
                  );
                }}
                className="rounded-full border-border"
              >
                <Heart
                  className={`h-4 w-4 ${
                    wishlisted
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
