import { RequestHandler } from "express";
import { z } from "zod";

// Validation schemas
const UpdateStockSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  newStock: z.number().min(0, "Stock cannot be negative"),
});

const AddInventoryItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["base", "sauce", "cheese", "vegetable", "meat"]),
  stock: z.number().min(0, "Stock cannot be negative"),
  unit: z.string().min(1, "Unit is required"),
  lowStockThreshold: z.number().min(0, "Threshold cannot be negative"),
  pricePerUnit: z.number().min(0, "Price cannot be negative"),
});

// Mock inventory database
let inventory = new Map([
  // Pizza Bases
  ["base_thin", { 
    id: "base_thin", 
    name: "Thin Crust", 
    category: "base", 
    stock: 45, 
    unit: "pieces", 
    lowStockThreshold: 20, 
    pricePerUnit: 2.50, 
    lastUpdated: new Date() 
  }],
  ["base_thick", { 
    id: "base_thick", 
    name: "Thick Crust", 
    category: "base", 
    stock: 32, 
    unit: "pieces", 
    lowStockThreshold: 20, 
    pricePerUnit: 3.00, 
    lastUpdated: new Date() 
  }],
  ["base_stuffed", { 
    id: "base_stuffed", 
    name: "Stuffed Crust", 
    category: "base", 
    stock: 18, 
    unit: "pieces", 
    lowStockThreshold: 20, 
    pricePerUnit: 4.00, 
    lastUpdated: new Date() 
  }],
  ["base_gf", { 
    id: "base_gf", 
    name: "Gluten-Free", 
    category: "base", 
    stock: 15, 
    unit: "pieces", 
    lowStockThreshold: 10, 
    pricePerUnit: 4.50, 
    lastUpdated: new Date() 
  }],
  
  // Sauces
  ["sauce_tomato", { 
    id: "sauce_tomato", 
    name: "Tomato Sauce", 
    category: "sauce", 
    stock: 25, 
    unit: "liters", 
    lowStockThreshold: 15, 
    pricePerUnit: 8.00, 
    lastUpdated: new Date() 
  }],
  ["sauce_bbq", { 
    id: "sauce_bbq", 
    name: "BBQ Sauce", 
    category: "sauce", 
    stock: 12, 
    unit: "liters", 
    lowStockThreshold: 10, 
    pricePerUnit: 12.00, 
    lastUpdated: new Date() 
  }],
  ["sauce_pesto", { 
    id: "sauce_pesto", 
    name: "Pesto", 
    category: "sauce", 
    stock: 8, 
    unit: "liters", 
    lowStockThreshold: 5, 
    pricePerUnit: 15.00, 
    lastUpdated: new Date() 
  }],
  
  // Cheese
  ["cheese_mozzarella", { 
    id: "cheese_mozzarella", 
    name: "Mozzarella", 
    category: "cheese", 
    stock: 35, 
    unit: "kg", 
    lowStockThreshold: 20, 
    pricePerUnit: 18.00, 
    lastUpdated: new Date() 
  }],
  ["cheese_cheddar", { 
    id: "cheese_cheddar", 
    name: "Cheddar", 
    category: "cheese", 
    stock: 22, 
    unit: "kg", 
    lowStockThreshold: 15, 
    pricePerUnit: 22.00, 
    lastUpdated: new Date() 
  }],
  ["cheese_parmesan", { 
    id: "cheese_parmesan", 
    name: "Parmesan", 
    category: "cheese", 
    stock: 8, 
    unit: "kg", 
    lowStockThreshold: 5, 
    pricePerUnit: 45.00, 
    lastUpdated: new Date() 
  }],
  
  // Vegetables
  ["veg_mushrooms", { 
    id: "veg_mushrooms", 
    name: "Mushrooms", 
    category: "vegetable", 
    stock: 12, 
    unit: "kg", 
    lowStockThreshold: 10, 
    pricePerUnit: 8.50, 
    lastUpdated: new Date() 
  }],
  ["veg_peppers", { 
    id: "veg_peppers", 
    name: "Bell Peppers", 
    category: "vegetable", 
    stock: 18, 
    unit: "kg", 
    lowStockThreshold: 12, 
    pricePerUnit: 6.00, 
    lastUpdated: new Date() 
  }],
  ["veg_onions", { 
    id: "veg_onions", 
    name: "Red Onions", 
    category: "vegetable", 
    stock: 25, 
    unit: "kg", 
    lowStockThreshold: 15, 
    pricePerUnit: 3.50, 
    lastUpdated: new Date() 
  }],
  
  // Meat
  ["meat_pepperoni", { 
    id: "meat_pepperoni", 
    name: "Pepperoni", 
    category: "meat", 
    stock: 20, 
    unit: "kg", 
    lowStockThreshold: 15, 
    pricePerUnit: 25.00, 
    lastUpdated: new Date() 
  }],
  ["meat_sausage", { 
    id: "meat_sausage", 
    name: "Italian Sausage", 
    category: "meat", 
    stock: 16, 
    unit: "kg", 
    lowStockThreshold: 12, 
    pricePerUnit: 18.00, 
    lastUpdated: new Date() 
  }],
]);

// Helper function to check admin authorization
const requireAdmin = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.substring(7);
  
  // Mock token validation (in real app, verify JWT)
  if (!token.startsWith('mock_jwt_token_')) {
    return res.status(401).json({ error: "Invalid token" });
  }

  // Check if admin role
  if (!token.includes('_admin')) {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
};

// Helper function to send low stock email alerts
const sendLowStockAlert = async (item: any) => {
  console.log(`🚨 LOW STOCK ALERT: ${item.name} has ${item.stock} ${item.unit} remaining (threshold: ${item.lowStockThreshold})`);
  // In real app, send email to admin
};

export const handleGetInventory: RequestHandler = async (req, res) => {
  try {
    const inventoryArray = Array.from(inventory.values());
    
    // Check for low stock items
    const lowStockItems = inventoryArray.filter(item => item.stock <= item.lowStockThreshold);
    
    res.json({
      inventory: inventoryArray,
      lowStockItems,
      totalItems: inventoryArray.length,
      categoryCounts: {
        base: inventoryArray.filter(item => item.category === "base").length,
        sauce: inventoryArray.filter(item => item.category === "sauce").length,
        cheese: inventoryArray.filter(item => item.category === "cheese").length,
        vegetable: inventoryArray.filter(item => item.category === "vegetable").length,
        meat: inventoryArray.filter(item => item.category === "meat").length,
      }
    });
  } catch (error) {
    console.error("Get inventory error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleUpdateStock: RequestHandler = async (req, res) => {
  try {
    const validatedData = UpdateStockSchema.parse(req.body);
    
    const item = inventory.get(validatedData.itemId);
    if (!item) {
      return res.status(404).json({
        error: "Inventory item not found"
      });
    }

    const oldStock = item.stock;
    item.stock = validatedData.newStock;
    item.lastUpdated = new Date();
    
    inventory.set(validatedData.itemId, item);

    // Check if stock went below threshold and send alert
    if (oldStock > item.lowStockThreshold && item.stock <= item.lowStockThreshold) {
      await sendLowStockAlert(item);
    }

    res.json({
      message: "Stock updated successfully",
      item,
      previousStock: oldStock
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }
    
    console.error("Update stock error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleAddInventoryItem: RequestHandler = async (req, res) => {
  try {
    const validatedData = AddInventoryItemSchema.parse(req.body);
    
    const newItem = {
      id: `${validatedData.category}_${Date.now()}`,
      ...validatedData,
      lastUpdated: new Date(),
    };
    
    inventory.set(newItem.id, newItem);

    res.status(201).json({
      message: "Inventory item added successfully",
      item: newItem
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }
    
    console.error("Add inventory item error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleDeleteInventoryItem: RequestHandler = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const item = inventory.get(itemId);
    if (!item) {
      return res.status(404).json({
        error: "Inventory item not found"
      });
    }

    inventory.delete(itemId);

    res.json({
      message: "Inventory item deleted successfully",
      deletedItem: item
    });
  } catch (error) {
    console.error("Delete inventory item error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleGetLowStockItems: RequestHandler = async (req, res) => {
  try {
    const inventoryArray = Array.from(inventory.values());
    const lowStockItems = inventoryArray.filter(item => item.stock <= item.lowStockThreshold);
    
    res.json({
      lowStockItems,
      count: lowStockItems.length
    });
  } catch (error) {
    console.error("Get low stock items error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Apply admin middleware to protected routes
export const protectedUpdateStock = [requireAdmin, handleUpdateStock];
export const protectedAddInventoryItem = [requireAdmin, handleAddInventoryItem];
export const protectedDeleteInventoryItem = [requireAdmin, handleDeleteInventoryItem];
