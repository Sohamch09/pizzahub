import { RequestHandler } from "express";
import { z } from "zod";

// Validation schemas
const CreateOrderSchema = z.object({
  items: z.array(z.object({
    name: z.string().min(1, "Item name is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    price: z.number().min(0, "Price cannot be negative"),
    customizations: z.object({
      base: z.string().optional(),
      sauce: z.string().optional(),
      cheese: z.string().optional(),
      vegetables: z.array(z.string()).optional(),
      meat: z.string().optional(),
      size: z.string().optional(),
    }).optional(),
  })),
  deliveryAddress: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "ZIP code is required"),
    phone: z.string().min(10, "Phone number is required"),
  }),
  paymentMethod: z.enum(["card", "cash", "razorpay"]),
  paymentDetails: z.object({
    razorpayPaymentId: z.string().optional(),
    razorpayOrderId: z.string().optional(),
    razorpaySignature: z.string().optional(),
  }).optional(),
});

const UpdateOrderStatusSchema = z.object({
  status: z.enum(["order_received", "in_kitchen", "out_for_delivery", "delivered"]),
});

// Orders database (in-memory for demo). Starts empty; only real user orders will appear.
let orders = new Map<string, any>();

let nextOrderNumber = 1;

// Helper function to generate order ID
const generateOrderId = (): string => {
  const orderNumber = nextOrderNumber++;
  return `ORD-${orderNumber.toString().padStart(3, '0')}`;
};

// Helper function to calculate estimated delivery time
const calculateEstimatedDelivery = (): Date => {
  // Base cooking time: 15-20 minutes
  const cookingTime = 15 + Math.random() * 5;
  // Delivery time: 10-15 minutes
  const deliveryTime = 10 + Math.random() * 5;
  const totalTime = (cookingTime + deliveryTime) * 60 * 1000; // Convert to milliseconds
  
  return new Date(Date.now() + totalTime);
};

// Helper function to update inventory after order
const updateInventoryAfterOrder = async (items: any[]) => {
  console.log("📦 Updating inventory after order:", items);
  // In real app, deduct stock quantities based on pizza ingredients
  // This would connect to the inventory system
};

// Helper function to send order confirmation email
const sendOrderConfirmation = async (order: any) => {
  console.log(`📧 Order confirmation email sent to ${order.customerEmail} for order ${order.id}`);
  // In real app, send actual email
};

// Helper function to notify admin of new order
const notifyAdminNewOrder = async (order: any) => {
  console.log(`🔔 Admin notification: New order ${order.id} received`);
  // In real app, send notification to admin dashboard
};

export const handleCreateOrder: RequestHandler = async (req, res) => {
  try {
    const validatedData = CreateOrderSchema.parse(req.body);
    
    // Extract user info from token (mock implementation)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7);
    const tokenParts = token.split('_');
    const userId = tokenParts[3] || 'guest';

    // Calculate total
    const total = validatedData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create new order
    const orderId = generateOrderId();
    const newOrder = {
      id: orderId,
      userId,
      customerName: "Customer", // In real app, get from user profile
      customerEmail: "customer@example.com", // In real app, get from user profile
      customerPhone: validatedData.deliveryAddress.phone,
      items: validatedData.items,
      deliveryAddress: validatedData.deliveryAddress,
      total,
      status: "order_received" as const,
      paymentMethod: validatedData.paymentMethod,
      paymentStatus: validatedData.paymentMethod === "cash" ? "pending" : "completed",
      paymentDetails: validatedData.paymentDetails,
      placedAt: new Date(),
      estimatedDelivery: calculateEstimatedDelivery(),
      driverName: null,
      driverPhone: null,
    };

    orders.set(orderId, newOrder);

    // Update inventory
    await updateInventoryAfterOrder(validatedData.items);

    // Send confirmations
    await sendOrderConfirmation(newOrder);
    await notifyAdminNewOrder(newOrder);

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }
    
    console.error("Create order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleGetOrder: RequestHandler = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Require auth and ensure only owner or admin can view the order
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.substring(7);
    const tokenParts = token.split('_');
    const userId = tokenParts[3];
    const isAdmin = token.includes('_admin');

    const order = orders.get(orderId);
    if (!order) {
      return res.status(404).json({
        error: "Order not found"
      });
    }

    if (!isAdmin && order.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You can only view your own orders" });
    }

    res.json({
      order
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleGetUserOrders: RequestHandler = async (req, res) => {
  try {
    // Extract user ID from token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7);
    const tokenParts = token.split('_');
    const userId = tokenParts[3];

    const userOrders = Array.from(orders.values()).filter(order => order.userId === userId);
    
    res.json({
      orders: userOrders,
      count: userOrders.length
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleGetAllOrders: RequestHandler = async (req, res) => {
  try {
    // Check admin authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7);
    if (!token.includes('_admin')) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const allOrders = Array.from(orders.values());
    
    // Filter by status if provided
    const { status } = req.query;
    const filteredOrders = status ? 
      allOrders.filter(order => order.status === status) : 
      allOrders;

    res.json({
      orders: filteredOrders,
      count: filteredOrders.length,
      stats: {
        total: allOrders.length,
        order_received: allOrders.filter(o => o.status === 'order_received').length,
        in_kitchen: allOrders.filter(o => o.status === 'in_kitchen').length,
        out_for_delivery: allOrders.filter(o => o.status === 'out_for_delivery').length,
        delivered: allOrders.filter(o => o.status === 'delivered').length,
      }
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleUpdateOrderStatus: RequestHandler = async (req, res) => {
  try {
    const { orderId } = req.params;
    const validatedData = UpdateOrderStatusSchema.parse(req.body);
    
    // Check admin authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7);
    if (!token.includes('_admin')) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const order = orders.get(orderId);
    if (!order) {
      return res.status(404).json({
        error: "Order not found"
      });
    }

    const oldStatus = order.status;
    order.status = validatedData.status;

    // Assign driver when order goes out for delivery
    if (validatedData.status === "out_for_delivery" && !order.driverName) {
      const drivers = ["Mike Wilson", "Sarah Davis", "Tom Brown", "Lisa Johnson"];
      const driverPhones = ["+1 (555) 444-7777", "+1 (555) 333-9999", "+1 (555) 222-8888", "+1 (555) 111-7777"];
      const randomIndex = Math.floor(Math.random() * drivers.length);
      
      order.driverName = drivers[randomIndex];
      order.driverPhone = driverPhones[randomIndex];
    }

    // Set actual delivery time when delivered
    if (validatedData.status === "delivered") {
      order.actualDelivery = new Date();
    }

    orders.set(orderId, order);

    // Send status update notification
    console.log(`📱 Status update notification sent for order ${orderId}: ${oldStatus} → ${validatedData.status}`);

    res.json({
      message: "Order status updated successfully",
      order,
      previousStatus: oldStatus
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }
    
    console.error("Update order status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleCancelOrder: RequestHandler = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Require auth and ensure only owner or admin can cancel
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.substring(7);
    const tokenParts = token.split('_');
    const userId = tokenParts[3];
    const isAdmin = token.includes('_admin');

    const order = orders.get(orderId);
    if (!order) {
      return res.status(404).json({
        error: "Order not found"
      });
    }

    if (!isAdmin && order.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You can only cancel your own orders" });
    }

    // Only allow cancellation if order hasn't been delivered
    if (order.status === "delivered") {
      return res.status(400).json({
        error: "Cannot cancel delivered order"
      });
    }

    // Mark as cancelled (you might want to add this status to the enum)
    order.status = "order_received"; // In real app, add "cancelled" status
    order.cancelledAt = new Date();

    orders.set(orderId, order);

    res.json({
      message: "Order cancelled successfully",
      order
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleGetOrderStats: RequestHandler = async (req, res) => {
  try {
    const allOrders = Array.from(orders.values());
    
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = allOrders.length > 0 ? totalRevenue / allOrders.length : 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysOrders = allOrders.filter(order => 
      order.placedAt >= today
    );

    res.json({
      stats: {
        totalOrders: allOrders.length,
        totalRevenue,
        averageOrderValue,
        todaysOrders: todaysOrders.length,
        todaysRevenue: todaysOrders.reduce((sum, order) => sum + order.total, 0),
        statusBreakdown: {
          order_received: allOrders.filter(o => o.status === 'order_received').length,
          in_kitchen: allOrders.filter(o => o.status === 'in_kitchen').length,
          out_for_delivery: allOrders.filter(o => o.status === 'out_for_delivery').length,
          delivered: allOrders.filter(o => o.status === 'delivered').length,
        }
      }
    });
  } catch (error) {
    console.error("Get order stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
