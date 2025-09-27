# 🍕 PizzaHub - Delicious Pizza Delivery Application

A modern, full-stack pizza delivery application built with React, TypeScript, and Express.js, featuring a beautiful UI and seamless user experience.

![PizzaHub Logo](public/favicon.svg)

## ✨ Features

### 🍕 Core Features
- **Pizza Builder** - Customize your pizza with various toppings, sizes, and crusts
- **Menu Browsing** - Browse through a variety of delicious pizzas
- **User Authentication** - Secure login and registration system
- **Order Management** - Track your orders and view order history
- **Admin Dashboard** - Manage inventory, orders, and user accounts
- **Payment Integration** - Mock Razorpay payment system
- **Responsive Design** - Works perfectly on desktop and mobile devices

### 🎨 UI/UX Features
- **Dark Theme** - Modern dark mode interface
- **Interactive Components** - Smooth animations and transitions
- **Toast Notifications** - Real-time feedback for user actions
- **Form Validation** - Client-side and server-side validation
- **Loading States** - Visual feedback during API calls

### 🔧 Technical Features
- **TypeScript** - Full type safety throughout the application
- **Serverless Functions** - Deployed on Netlify Functions
- **RESTful API** - Well-structured API endpoints
- **CORS Support** - Cross-origin resource sharing enabled
- **Error Handling** - Comprehensive error handling and user feedback

## 🚀 Live Demo

**🌐 Website**: (https://pizzza-express.netlify.app)

### Test Credentials
- **Regular User**: `test@example.com` / `password123`
- **Admin User**: `admin@example.com` / `admin123`

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **Lucide React** - Beautiful icons
- **Framer Motion** - Smooth animations

### Backend
- **Express.js** - Web application framework
- **Node.js** - JavaScript runtime
- **Zod** - Schema validation
- **Serverless Functions** - Netlify Functions

### Deployment
- **Netlify** - Hosting and serverless functions
- **GitHub** - Version control and CI/CD

## 📁 Project Structure

```
PizzaHub/
├── client/                 # Frontend React application
│   ├── components/         # Reusable UI components
│   │   ├── layout/         # Header, Footer components
│   │   ├── payment/        # Payment-related components
│   │   └── ui/             # Base UI components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions
├── server/                 # Backend Express application
│   └── routes/             # API route handlers
├── netlify/                # Netlify serverless functions
│   └── functions/          # Individual function files
├── shared/                 # Shared code between frontend and backend
└── public/                 # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/pizzahub.git
   cd pizzahub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:client` - Build client only
- `npm run build:server` - Build server only
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run typecheck` - Run TypeScript type checking

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Password reset
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/user` - Get user orders
- `GET /api/orders/all` - Get all orders (admin)
- `GET /api/orders/:orderId` - Get specific order
- `PUT /api/orders/:orderId/status` - Update order status
- `DELETE /api/orders/:orderId` - Cancel order

### Inventory
- `GET /api/inventory` - Get inventory items
- `POST /api/inventory/items` - Add inventory item (admin)
- `PUT /api/inventory/stock` - Update stock (admin)
- `DELETE /api/inventory/items/:itemId` - Delete item (admin)

### Payment
- `POST /api/payment/create-order` - Create Razorpay order (🚧THIS FEATURE IS DOWN RIGHT NOW, ONLY COD IS AVALIABLE)
- `POST /api/payment/verify` - Verify payment

## 🎨 UI Components

The application uses a comprehensive set of UI components built with Radix UI and styled with Tailwind CSS:

- **Forms** - Input, Button, Checkbox, Select, etc.
- **Layout** - Card, Sheet, Dialog, Tabs, etc.
- **Navigation** - Header, Footer, Breadcrumb, etc.
- **Feedback** - Toast, Alert, Progress, etc.
- **Data Display** - Table, Badge, Avatar, etc.

# Build the project

```


**🍕 Enjoy your delicious pizza experience with PizzaHub!**
