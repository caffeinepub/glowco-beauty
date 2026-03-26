import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import CartDrawer from "./CartDrawer";

interface HeaderProps {
  onSearchChange: (q: string) => void;
  searchQuery: string;
}

export default function Header({ onSearchChange, searchQuery }: HeaderProps) {
  const { cartCount, wishlistCount, setActivePage, activePage } =
    useAppContext();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal ? `${principal.slice(0, 8)}...` : null;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-xs">
      {/* Tier 1 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        {/* Logo */}
        <button
          type="button"
          data-ocid="nav.logo.link"
          onClick={() => setActivePage("home")}
          className="flex-shrink-0 font-serif text-xl sm:text-2xl font-bold tracking-widest text-foreground uppercase hover:text-primary transition-colors"
        >
          GLOW &amp; CO.
        </button>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-auto hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              data-ocid="header.search_input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search for products, brands..."
              className="pl-10 bg-[oklch(0.95_0_0)] border-0 rounded-full text-sm focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-auto sm:ml-0">
          <Button
            type="button"
            data-ocid="header.wishlist.button"
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setActivePage("wishlist")}
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center bg-primary text-primary-foreground rounded-full">
                {wishlistCount}
              </Badge>
            )}
          </Button>

          {identity ? (
            <Button
              type="button"
              data-ocid="header.user.button"
              variant="ghost"
              size="sm"
              className="hidden sm:flex items-center gap-1 text-xs"
              onClick={clear}
            >
              <User className="h-4 w-4" />
              <span>{shortPrincipal}</span>
            </Button>
          ) : (
            <Button
              type="button"
              data-ocid="header.login.button"
              variant="ghost"
              size="icon"
              onClick={login}
              disabled={isLoggingIn}
              title="Login"
            >
              <User className="h-5 w-5" />
            </Button>
          )}

          <Button
            type="button"
            data-ocid="header.cart.button"
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center bg-primary text-primary-foreground rounded-full">
                {cartCount}
              </Badge>
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pb-3 border-t border-border">
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products..."
              className="pl-10 bg-[oklch(0.95_0_0)] border-0 rounded-full text-sm"
            />
          </div>
          <div className="flex gap-3 mt-3">
            {!identity ? (
              <Button
                type="button"
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-rose-mauveHover"
                onClick={login}
              >
                Login
              </Button>
            ) : (
              <Button type="button" size="sm" variant="outline" onClick={clear}>
                Logout
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setActivePage("admin");
                setMobileMenuOpen(false);
              }}
            >
              Admin
            </Button>
          </div>
        </div>
      )}

      {/* Tier 2: Nav links */}
      <div className="hidden sm:block border-t border-border">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-6 py-2">
          {(["home", "products"] as const).map((page) => (
            <button
              type="button"
              key={page}
              data-ocid={`nav.${page}.link`}
              onClick={() => setActivePage(page)}
              className={`text-xs font-medium uppercase tracking-widest transition-colors ${
                activePage === page
                  ? "text-primary border-b-2 border-primary pb-0.5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {page === "home" ? "Home" : "All Products"}
            </button>
          ))}
          {identity && (
            <button
              type="button"
              data-ocid="nav.admin.link"
              onClick={() => setActivePage("admin")}
              className={`text-xs font-medium uppercase tracking-widest transition-colors ${
                activePage === "admin"
                  ? "text-primary border-b-2 border-primary pb-0.5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Admin
            </button>
          )}
          <div className="ml-auto flex items-center gap-4">
            {identity ? (
              <span className="text-xs text-muted-foreground">
                Logged in as {shortPrincipal}
              </span>
            ) : (
              <Button
                type="button"
                data-ocid="nav.login.button"
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-rose-mauveHover text-xs uppercase tracking-wider rounded-full px-5"
                onClick={login}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}
