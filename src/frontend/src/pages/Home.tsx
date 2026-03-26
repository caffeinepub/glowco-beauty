import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import CategoryTiles from "../components/CategoryTiles";
import HeroBanner from "../components/HeroBanner";
import ProductCard from "../components/ProductCard";
import PromoStrip from "../components/PromoStrip";
import { SAMPLE_PRODUCTS } from "../data/sampleProducts";
import { useFeaturedProducts, useNewProducts } from "../hooks/useQueries";

const SKELETON_KEYS = ["a", "b", "c", "d"];

function ProductSkeleton() {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-8 w-full rounded-full" />
      </div>
    </div>
  );
}

export default function Home() {
  const { data: newProducts, isLoading: newLoading } = useNewProducts();
  const { data: featuredProducts, isLoading: featuredLoading } =
    useFeaturedProducts();

  const newItems =
    newProducts && newProducts.length > 0
      ? newProducts
      : SAMPLE_PRODUCTS.filter((p) => p.isNew);

  const featuredItems =
    featuredProducts && featuredProducts.length > 0
      ? featuredProducts
      : SAMPLE_PRODUCTS.filter((p) => p.isFeatured);

  return (
    <main>
      <HeroBanner />
      <CategoryTiles />

      {/* New Arrivals */}
      <section className="py-14 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-wide uppercase">
            New Arrivals
          </h2>
          <div className="w-16 h-0.5 bg-primary mx-auto mt-3" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newLoading
            ? SKELETON_KEYS.map((k) => <ProductSkeleton key={k} />)
            : newItems.slice(0, 8).map((p, i) => (
                <motion.div
                  key={p.id.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                >
                  <ProductCard product={p} index={i + 1} />
                </motion.div>
              ))}
        </div>
      </section>

      <PromoStrip />

      {/* Featured */}
      <section className="py-14 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-wide uppercase">
            Featured Products
          </h2>
          <div className="w-16 h-0.5 bg-primary mx-auto mt-3" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredLoading
            ? SKELETON_KEYS.map((k) => <ProductSkeleton key={k} />)
            : featuredItems.slice(0, 8).map((p, i) => (
                <motion.div
                  key={p.id.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                >
                  <ProductCard product={p} index={i + 1} />
                </motion.div>
              ))}
        </div>
      </section>
    </main>
  );
}
