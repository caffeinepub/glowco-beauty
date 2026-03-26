import { Button } from "@/components/ui/button";
import { ArrowRight, Flame } from "lucide-react";
import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";

const PROMO_IMAGES = [
  "https://images.unsplash.com/photo-1583241800698-e8ab01830e77?w=200",
  "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=200",
  "https://images.unsplash.com/photo-1577003833619-76bbd7f82948?w=200",
] as const;

export default function PromoStrip() {
  const { setActivePage } = useAppContext();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-promo rounded-3xl overflow-hidden flex flex-col sm:flex-row items-center gap-4 p-6 sm:p-0"
      >
        <div className="sm:w-2/5 flex gap-3 justify-center sm:pl-8">
          {PROMO_IMAGES.map((img, i) => (
            <div
              key={img}
              className={`rounded-xl overflow-hidden shadow-card ${
                i === 1 ? "w-20 h-28" : "w-16 h-24 mt-4"
              }`}
            >
              <img
                src={img}
                alt="Trending product"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="sm:flex-1 sm:py-10 sm:pr-8">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Trending Now
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Glow Festival
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Handpicked bestsellers loved by beauty enthusiasts. Up to 30% off
            this season.
          </p>
          <Button
            type="button"
            data-ocid="promo.shop_now.button"
            onClick={() => setActivePage("products")}
            className="bg-primary text-primary-foreground hover:bg-rose-mauveHover rounded-full uppercase text-xs tracking-wider font-bold px-6"
          >
            Shop Now <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
