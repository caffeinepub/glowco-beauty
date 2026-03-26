import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart } from "lucide-react";
import { SiFacebook, SiInstagram, SiX, SiYoutube } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-footer text-footer mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-serif text-xl font-bold text-footer mb-4 tracking-widest uppercase">
              GLOW &amp; CO.
            </h3>
            <p className="text-sm text-footer/70 leading-relaxed mb-5">
              Luxury cosmetics crafted with care. Discover beauty that
              celebrates you.
            </p>
            <div className="flex gap-3">
              {(
                [
                  { icon: SiInstagram, label: "Instagram" },
                  { icon: SiFacebook, label: "Facebook" },
                  { icon: SiX, label: "X" },
                  { icon: SiYoutube, label: "Youtube" },
                ] as const
              ).map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  aria-label={label}
                  className="h-8 w-8 rounded-full bg-footer/20 border border-footer/30 flex items-center justify-center text-footer/80 cursor-default"
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-footer mb-4">
              Shop
            </h4>
            <ul className="space-y-2 text-sm text-footer/70">
              {[
                "New Arrivals",
                "Best Sellers",
                "Lips",
                "Eyes",
                "Face",
                "Skin",
                "Nails",
              ].map((item) => (
                <li key={item}>
                  <span className="cursor-default hover:text-footer transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-footer mb-4">
              Help
            </h4>
            <ul className="space-y-2 text-sm text-footer/70">
              {[
                "About Us",
                "Contact",
                "FAQ",
                "Shipping & Returns",
                "Privacy Policy",
                "Terms of Service",
              ].map((item) => (
                <li key={item}>
                  <span className="cursor-default hover:text-footer transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-widest text-footer mb-4">
              Stay in the Glow
            </h4>
            <p className="text-sm text-footer/70 mb-4">
              Subscribe for exclusive offers, beauty tips, and early access to
              new launches.
            </p>
            <div className="flex gap-2">
              <Input
                data-ocid="footer.newsletter.input"
                type="email"
                placeholder="Your email address"
                className="bg-footer/20 border-footer/30 text-footer placeholder:text-footer/50 text-sm rounded-full focus-visible:ring-footer/50"
              />
              <Button
                type="button"
                data-ocid="footer.newsletter.button"
                className="bg-footer/30 text-footer border border-footer/40 hover:bg-footer/50 rounded-full flex-shrink-0 px-4 text-xs uppercase tracking-wider"
              >
                Join
              </Button>
            </div>
          </div>
        </div>

        {/* Payment + copyright */}
        <div className="border-t border-footer/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-footer/60">
            <span>Secure payments:</span>
            {["VISA", "MC", "PayPal", "Amex"].map((p) => (
              <span
                key={p}
                className="px-2 py-0.5 rounded bg-footer/20 border border-footer/30 font-bold text-footer/80 text-[10px] tracking-wider"
              >
                {p}
              </span>
            ))}
          </div>
          <p className="text-xs text-footer/60 text-center">
            &copy; {year} GlowCo Beauty. Built with{" "}
            <Heart className="inline h-3 w-3 text-primary" /> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-footer transition-colors underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
