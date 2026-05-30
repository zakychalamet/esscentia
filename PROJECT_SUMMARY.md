# Esscentia - Premium Parfum E-Commerce Platform

A complete full-stack e-commerce website for selling premium parfum products, built with **Next.js 16.2.6**, **React 19**, and **TypeScript**, with **Tailwind CSS** for styling.

---

## 🎯 Project Overview

Esscentia is a modern e-commerce platform featuring:
- **Shop Interface**: Browse, search, filter, and purchase products
- **Admin Dashboard**: Manage products and orders
- **Shopping Cart**: Add items, apply promo codes, calculate totals
- **User Authentication**: Login/Register with demo admin account
- **Responsive Design**: Works seamlessly on desktop and mobile devices

---

## 📦 What's Included

### Core Pages

#### **Shop Pages** (/app)
- **Homepage** (`/`) - Hero section, featured products, benefits
- **Products** (`/products`) - Full catalog with filters, search, and sorting
- **Product Detail** (`/products/[id]`) - Individual product information
- **Shopping Cart** (`/cart`) - Cart management with promo codes
- **Checkout** (`/checkout`) - Shipping and payment information
- **Login** (`/login`) - User authentication (demo: admin@esscentia.com / admin123)
- **Register** (`/register`) - New user registration

#### **Informational Pages**
- **About** (`/about`) - Company information and values
- **Contact** (`/contact`) - Contact form and information
- **FAQ** (`/faq`) - Frequently asked questions
- **Privacy Policy** (`/privacy`) - Data privacy information
- **Terms & Conditions** (`/terms`) - Legal terms

### Admin Section (/app/admin)
- **Dashboard** (`/`)
  - Total products, orders, customers stats
  - Recent orders table
  - Popular products list
  - Quick action buttons

- **Product Management** (`/products`)
  - View all products in table format
  - Add new products
  - Edit existing products
  - Delete products
  - Product statistics

- **Order Management** (`/orders`)
  - View all customer orders
  - Filter by status (Pending, Processing, Shipped, Completed)
  - View detailed order information
  - Update order status
  - Download invoices

### Core Libraries & Components

**lib/**
- `products.ts` - 8 premium parfum products with full data
- `cart-context.tsx` - Shopping cart management (localStorage)
- `auth-context.tsx` - User authentication (localStorage)

**components/**
- `Navbar.tsx` - Navigation with cart badge and user menu
- `Footer.tsx` - Footer with links
- `Button.tsx` - Reusable button component (variant-based)
- `Input.tsx` - Reusable input with labels and error handling
- `ProductCard.tsx` - Product card component with ratings and images

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0+
- npm or yarn

### Installation

```bash
# Clone or navigate to the project directory
cd d:\Code\laragon\www\esscentia

# Install dependencies (already done)
npm install

# Start the development server
npm run dev
```

The application will be available at: **http://localhost:3000**

---

## 🔐 Authentication

### Demo Accounts

**Admin Account:**
- Email: `admin@esscentia.com`
- Password: `admin123`
- Access: Admin Dashboard, Product Management, Order Management

**Regular Accounts:**
- Any email + password (min 6 characters) creates a regular user account
- Access: Shop, cart, checkout

---

## 🛍️ Shop Features

### Product Catalog
- **8 Premium Parfum Products** with detailed information:
  - Noir Essence (Rp 450.000)
  - Rose Garden (Rp 380.000)
  - Ocean Breeze (Rp 320.000)
  - Midnight Passion (Rp 520.000)
  - Classic Gentleman (Rp 400.000)
  - Vanilla Dreams (Rp 360.000)
  - Spice Adventure (Rp 440.000)
  - Cherry Blossom (Rp 390.000)

### Shopping Features
- ✅ Browse products with star ratings
- ✅ Search by name, brand, or scent
- ✅ Filter by category (Pria, Wanita, Bunga, Woody, Citrus)
- ✅ Filter by price range
- ✅ Sort by newest, price (low→high, high→low), or rating
- ✅ Add products to cart
- ✅ Apply promo codes (DISKON10, DISKON20)
- ✅ Free shipping on orders >Rp 500.000
- ✅ Fast checkout process

---

## 👨‍💼 Admin Features

### Dashboard Statistics
- Total products
- Total orders
- Active customers
- Revenue tracking
- Recent orders display

### Product Management
- View all products in table format
- Create new products
- Edit product details (name, price, category, images, etc.)
- Delete products
- View inventory statistics

### Order Management
- View all customer orders
- Filter orders by status
- View detailed customer information
- Update order status
- Download order invoices
- Order statistics (total orders, sales, pending, completed)

---

## 🎨 Design & Styling

- **Tailwind CSS 4** - Utility-first CSS framework
- **Responsive Design** - Mobile-first approach
- **Color Scheme** - Purple primary color (#9d2d4d)
- **Icons** - Lucide React icons library

---

## 📱 Device Compatibility

- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)

---

## 🔧 Technical Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.2.6 | React framework |
| React | 19.2.4 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.0 | Styling |
| Lucide React | 0.x | Icons |

---

## 📁 Project Structure

```
esscentia/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx (dashboard)
│   │   ├── products/page.tsx
│   │   └── orders/page.tsx
│   ├── products/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── faq/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── layout.tsx (root layout)
│   └── page.tsx (homepage)
├── lib/
│   ├── products.ts
│   ├── cart-context.tsx
│   └── auth-context.tsx
├── components/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── ProductCard.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── postcss.config.mjs
```

---

## 🚀 Build & Deploy

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm run start
```

### Lint & Format
```bash
npm run lint
```

---

## 💾 Data Persistence

- **Cart Data**: Stored in `localStorage` (persists across sessions)
- **User Authentication**: Stored in `localStorage` (persists across sessions)
- **Products**: In-memory data structure (resets on server restart for demo)

### Production Notes
For production deployment, replace:
- localStorage with a proper database (PostgreSQL, MongoDB, etc.)
- Mock authentication with proper auth service (next-auth, Auth0, etc.)
- In-memory product data with database

---

## 🎯 Features Checklist

### Shop Interface
- [x] Homepage with hero section
- [x] Product catalog with 8 products
- [x] Product detail pages
- [x] Search functionality
- [x] Category filtering
- [x] Price range filtering
- [x] Product sorting
- [x] Shopping cart
- [x] Checkout process
- [x] Promo codes (DISKON10, DISKON20)
- [x] User registration
- [x] User login
- [x] Responsive design

### Admin Interface
- [x] Admin dashboard with statistics
- [x] Product management (CRUD)
- [x] Order management
- [x] Order status tracking
- [x] Admin layout with sidebar

### Supporting Pages
- [x] About page
- [x] Contact page with form
- [x] FAQ page
- [x] Privacy policy
- [x] Terms & conditions

---

## 📞 Support

For questions or issues:
- Email: support@esscentia.com
- WhatsApp: +62 812-3456-7890
- Address: Jl. Kemang Raya No. 123, Jakarta Selatan

---

## 📄 License

This project is created for demonstration purposes.

---

## ✨ Key Features Summary

1. **Full E-Commerce Platform** - Complete shopping experience from browsing to checkout
2. **Separate Admin Panel** - Independent admin interface for management
3. **Real-Time Cart** - Shopping cart with localStorage persistence
4. **User Authentication** - Secure login system with demo account
5. **Responsive Design** - Works perfectly on all devices
6. **Modern UI/UX** - Clean, professional design with Tailwind CSS
7. **Easy to Extend** - Well-structured code for future enhancements

---

**Built with ❤️ using Next.js, React, & Tailwind CSS**
