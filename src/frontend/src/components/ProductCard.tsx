import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "../backend";
import { useAppContext } from "../context/AppContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 1 }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted, setSelectedProduct } =
    useAppContext();
  const wishlisted = isWishlisted(product.id);
  const discountPct =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to bag!`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <div
      data-ocid={`product.item.${index}`}
      className="group bg-white rounded-xl border border-border hover:shadow-card transition-all duration-300 overflow-hidden"
    >
      {/* Image area */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[oklch(0.97_0_0)]">
        <button
          type="button"
          className="w-full h-full cursor-pointer"
          onClick={() => setSelectedProduct(product)}
          aria-label={`View ${product.name}`}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </button>
        {discountPct > 0 ? (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-semibold pointer-events-none">
            -{discountPct}%
          </Badge>
        ) : product.isNew ? (
          <Badge className="absolute top-2 left-2 bg-foreground text-background text-xs font-semibold pointer-events-none">
            NEW
          </Badge>
        ) : null}
        <button
          type="button"
          data-ocid={`product.wishlist.toggle.${index}`}
          onClick={handleWishlist}
          className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-xs"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              wishlisted ? "fill-primary text-primary" : "text-muted-foreground"
            }`}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
          {product.brand}
        </p>
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-2">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${
                  star <= Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-border"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount.toString()})
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-bold text-sm text-foreground">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <Button
          type="button"
          data-ocid={`product.add_button.${index}`}
          onClick={handleAddToCart}
          disabled={!product.inStock}
          size="sm"
          className="w-full bg-primary text-primary-foreground hover:bg-rose-mauveHover text-xs uppercase tracking-widest font-semibold rounded-full"
        >
          <ShoppingBag className="h-3 w-3 mr-1" />
          {product.inStock ? "Add to Bag" : "Out of Stock"}
        </Button>
      </div>
    </div>
  );
}
