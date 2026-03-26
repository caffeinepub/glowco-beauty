import { Skeleton } from "@/components/ui/skeleton";
import { PackageSearch } from "lucide-react";
import { motion } from "motion/react";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";
import { SAMPLE_PRODUCTS } from "../data/sampleProducts";
import { useProductsByCategory } from "../hooks/useQueries";

const CATEGORIES = ["All", "Lips", "Eyes", "Face", "Skin", "Nails"];

export default function ProductsPage({ searchQuery }: { searchQuery: string }) {
  const { activeCategory, setActiveCategory } = useAppContext();
  const { data: backendProducts, isLoading } =
    useProductsByCategory(activeCategory);

  const baseProducts =
    backendProducts && backendProducts.length > 0
      ? backendProducts
      : activeCategory === "All"
        ? SAMPLE_PRODUCTS
        : SAMPLE_PRODUCTS.filter((p) => p.category === activeCategory);

  const filtered = searchQuery
    ? baseProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : baseProducts;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-1">
          {activeCategory === "All" ? "All Products" : activeCategory}
        </h1>
        <p className="text-sm text-muted-foreground">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            type="button"
            key={cat}
            data-ocid={`products.${cat.toLowerCase()}.tab`}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"].map((k) => (
            <div
              key={k}
              className="rounded-xl border border-border overflow-hidden"
            >
              <Skeleton className="aspect-[3/4] w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-ocid="products.empty_state"
          className="flex flex-col items-center justify-center py-20 gap-4 text-center"
        >
          <PackageSearch className="h-16 w-16 text-border" />
          <div>
            <p className="font-semibold text-foreground">No products found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : "No products in this category yet"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id.toString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
            >
              <ProductCard product={p} index={i + 1} />
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
