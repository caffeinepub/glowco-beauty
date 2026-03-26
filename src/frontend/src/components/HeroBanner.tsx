import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";

export default function HeroBanner() {
  const { setActivePage } = useAppContext();

  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
        {/* Text block */}
        <motion.div
          className="flex-1 text-white z-10"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span className="text-xs font-medium uppercase tracking-widest text-amber-200">
              New Collection 2026
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-white">
            Discover Your
            <br />
            <em className="not-italic text-amber-200">Perfect Glow</em>
          </h1>
          <p className="text-sm sm:text-base text-white/80 mb-8 max-w-md leading-relaxed">
            Curated luxury cosmetics crafted for every skin tone. From bold lips
            to luminous skin — your beauty ritual starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              data-ocid="hero.shop_now.button"
              onClick={() => setActivePage("products")}
              className="bg-white text-[oklch(0.42_0.05_30)] hover:bg-white/90 rounded-full uppercase text-xs tracking-widest font-bold px-8 py-3 shadow-md"
            >
              Shop Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              data-ocid="hero.new_arrivals.button"
              variant="outline"
              onClick={() => setActivePage("products")}
              className="border-white/50 text-white hover:bg-white/10 rounded-full uppercase text-xs tracking-widest font-medium px-8 py-3 bg-transparent"
            >
              New Arrivals
            </Button>
          </div>
        </motion.div>

        {/* Hero image collage */}
        <motion.div
          className="flex-1 relative hidden sm:block"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          <div className="relative h-[380px]">
            <div className="absolute right-0 top-0 w-52 h-64 rounded-2xl overflow-hidden shadow-xl border-2 border-white/20">
              <img
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400"
                alt="Beauty product"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute left-0 top-12 w-48 h-56 rounded-2xl overflow-hidden shadow-xl border-2 border-white/20">
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400"
                alt="Makeup"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute right-24 bottom-0 w-44 h-44 rounded-2xl overflow-hidden shadow-xl border-2 border-white/20">
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400"
                alt="Skincare"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
    </section>
  );
}
