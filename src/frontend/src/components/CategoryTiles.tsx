import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";

const CATEGORY_TILES = [
  {
    name: "Lips",
    image: "https://images.unsplash.com/photo-1586495777744-4e6232bf2e24?w=200",
    emoji: "💋",
  },
  {
    name: "Eyes",
    image: "https://images.unsplash.com/photo-1512207846876-bb54ef5056fe?w=200",
    emoji: "👁️",
  },
  {
    name: "Face",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200",
    emoji: "✨",
  },
  {
    name: "Skin",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200",
    emoji: "🌿",
  },
  {
    name: "Nails",
    image: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200",
    emoji: "💅",
  },
];

export default function CategoryTiles() {
  const { setActiveCategory, setActivePage } = useAppContext();

  return (
    <section className="py-14 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-wide">
          Shop by Category
        </h2>
        <div className="w-16 h-0.5 bg-primary mx-auto mt-3" />
      </div>
      <div className="flex justify-center gap-6 sm:gap-10 flex-wrap">
        {CATEGORY_TILES.map((cat, i) => (
          <motion.button
            key={cat.name}
            data-ocid={`category_tile.${cat.name.toLowerCase()}.button`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            onClick={() => {
              setActiveCategory(cat.name);
              setActivePage("products");
            }}
            className="flex flex-col items-center gap-3 group"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all duration-300 shadow-card">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <span className="text-sm font-semibold text-foreground uppercase tracking-wider">
              {cat.name}
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
