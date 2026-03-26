import { useAppContext } from "../context/AppContext";

const CATEGORIES = ["All", "Lips", "Eyes", "Face", "Skin", "Nails"];

export default function CategoryNav() {
  const { activeCategory, setActiveCategory, setActivePage } = useAppContext();

  return (
    <nav className="bg-white border-b border-border sticky top-[105px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-0 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              data-ocid={`category.${cat.toLowerCase()}.tab`}
              onClick={() => {
                setActiveCategory(cat);
                setActivePage("products");
              }}
              className={`flex-shrink-0 px-5 py-3 text-xs font-semibold uppercase tracking-widest transition-all border-b-2 ${
                activeCategory === cat
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
