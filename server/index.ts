import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

// Import auth routes
import {
  handleRegister,
  handleLogin,
  handleForgotPassword,
  handleVerifyEmail,
  handleGetProfile,
  handleUpdateProfile
} from "./routes/auth";

// Import inventory routes
import {
  handleGetInventory,
  protectedUpdateStock,
  protectedAddInventoryItem,
  protectedDeleteInventoryItem,
  handleGetLowStockItems
} from "./routes/inventory";

// Import order routes
import {
  handleCreateOrder,
  handleGetOrder,
  handleGetUserOrders,
  handleGetAllOrders,
  handleUpdateOrderStatus,
  handleCancelOrder,
  handleGetOrderStats
} from "./routes/orders";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Demo route
  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/register", handleRegister);
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/forgot-password", handleForgotPassword);
  app.get("/api/auth/verify-email/:token", handleVerifyEmail);
  app.get("/api/auth/profile", handleGetProfile);
  app.put("/api/auth/profile", handleUpdateProfile);

  // Inventory routes
  app.get("/api/inventory", handleGetInventory);
  app.get("/api/inventory/low-stock", handleGetLowStockItems);
  app.put("/api/inventory/stock", ...protectedUpdateStock);
  app.post("/api/inventory/items", ...protectedAddInventoryItem);
  app.delete("/api/inventory/items/:itemId", ...protectedDeleteInventoryItem);

  // Order routes
  app.post("/api/orders", handleCreateOrder);
  app.get("/api/orders/stats", handleGetOrderStats);
  app.get("/api/orders/user", handleGetUserOrders);
  app.get("/api/orders/all", handleGetAllOrders);
  app.get("/api/orders/:orderId", handleGetOrder);
  app.put("/api/orders/:orderId/status", handleUpdateOrderStatus);
  app.delete("/api/orders/:orderId", handleCancelOrder);

  // Razorpay payment routes (mock implementation)
  app.post("/api/payment/create-order", (req, res) => {
    // Mock Razorpay order creation
    const { amount, currency = "INR" } = req.body;

    const mockOrder = {
      id: `order_${Date.now()}`,
      entity: "order",
      amount: amount * 100, // Razorpay expects amount in paise
      amount_paid: 0,
      amount_due: amount * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
      status: "created",
      created_at: Math.floor(Date.now() / 1000)
    };

    res.json(mockOrder);
  });

  app.post("/api/payment/verify", (req, res) => {
    // Mock payment verification
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    console.log("Payment verification:", { razorpay_payment_id, razorpay_order_id, razorpay_signature });

    // In real app, verify signature using Razorpay secret
    res.json({
      success: true,
      message: "Payment verified successfully"
    });
  });

  return app;
}
