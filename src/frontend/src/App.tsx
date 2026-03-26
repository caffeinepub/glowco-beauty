import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import CategoryNav from "./components/CategoryNav";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ProductModal from "./components/ProductModal";
import { AppProvider, useAppContext } from "./context/AppContext";
import AdminPage from "./pages/AdminPage";
import Home from "./pages/Home";
import ProductsPage from "./pages/ProductsPage";

function AppContent() {
  const { activePage } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearchChange={setSearchQuery} searchQuery={searchQuery} />
      <CategoryNav />

      <div className="flex-1">
        <AnimatePresence mode="wait">
          {activePage === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Home />
            </motion.div>
          )}
          {activePage === "products" && (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ProductsPage searchQuery={searchQuery} />
            </motion.div>
          )}
          {activePage === "admin" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <AdminPage />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
      <ProductModal />
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
