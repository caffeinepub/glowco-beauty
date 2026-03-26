# GlowCo Beauty

## Current State
New project with empty Motoko backend and no frontend.

## Requested Changes (Diff)

### Add
- Full-stack cosmetic e-commerce website inspired by Nykaa
- Product catalog with categories (Makeup: Lips, Eyes, Face, Skin, Nails)
- Product listing with name, brand, price, discount, rating, image, description
- Shopping cart (add/remove/update quantity)
- User authentication (login/register)
- Wishlist functionality
- Product search and category filtering
- Admin: add/edit/delete products
- Hero banner section
- Featured/new arrivals section
- Promotional banners
- Order placement flow

### Modify
- None

### Remove
- None

## Implementation Plan
1. Backend (Motoko):
   - Products: CRUD with fields (id, name, brand, category, subcategory, price, originalPrice, rating, reviewCount, imageUrl, description, inStock, isFeatured, isNew)
   - Cart: per-user cart items (productId, quantity)
   - Wishlist: per-user wishlist
   - Orders: place order, list orders
   - Categories: predefined list
   - Authorization for admin vs user roles

2. Frontend:
   - Header with logo, search, cart icon, wishlist, login
   - Category nav bar
   - Hero banner
   - Shop by Category tiles
   - New Arrivals product grid
   - Trending promo banner
   - Product detail modal/page
   - Cart sidebar/drawer
   - Auth modal (login/register)
   - Footer with links and newsletter
