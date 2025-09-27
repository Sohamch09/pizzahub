import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  TrendingUp,
  Plus,
  Minus,
  Edit,
  Trash2,
  Check,
  X,
  Clock,
  ChefHat,
  Truck
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

interface InventoryItem {
  id: string;
  name: string;
  category: "base" | "sauce" | "cheese" | "vegetable" | "meat";
  stock: number;
  unit: string;
  lowStockThreshold: number;
  pricePerUnit: number;
  lastUpdated: Date;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: string[];
  total: number;
  status: "order_received" | "in_kitchen" | "out_for_delivery" | "delivered";
  placedAt: Date;
  estimatedDelivery?: Date;
}

export default function AdminDashboard() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    // Pizza Bases
    { id: "base_thin", name: "Thin Crust", category: "base", stock: 45, unit: "pieces", lowStockThreshold: 20, pricePerUnit: 2.50, lastUpdated: new Date() },
    { id: "base_thick", name: "Thick Crust", category: "base", stock: 32, unit: "pieces", lowStockThreshold: 20, pricePerUnit: 3.00, lastUpdated: new Date() },
    { id: "base_stuffed", name: "Stuffed Crust", category: "base", stock: 18, unit: "pieces", lowStockThreshold: 20, pricePerUnit: 4.00, lastUpdated: new Date() },
    { id: "base_gf", name: "Gluten-Free", category: "base", stock: 15, unit: "pieces", lowStockThreshold: 10, pricePerUnit: 4.50, lastUpdated: new Date() },
    
    // Sauces
    { id: "sauce_tomato", name: "Tomato Sauce", category: "sauce", stock: 25, unit: "liters", lowStockThreshold: 15, pricePerUnit: 8.00, lastUpdated: new Date() },
    { id: "sauce_bbq", name: "BBQ Sauce", category: "sauce", stock: 12, unit: "liters", lowStockThreshold: 10, pricePerUnit: 12.00, lastUpdated: new Date() },
    { id: "sauce_pesto", name: "Pesto", category: "sauce", stock: 8, unit: "liters", lowStockThreshold: 5, pricePerUnit: 15.00, lastUpdated: new Date() },
    
    // Cheese
    { id: "cheese_mozzarella", name: "Mozzarella", category: "cheese", stock: 35, unit: "kg", lowStockThreshold: 20, pricePerUnit: 18.00, lastUpdated: new Date() },
    { id: "cheese_cheddar", name: "Cheddar", category: "cheese", stock: 22, unit: "kg", lowStockThreshold: 15, pricePerUnit: 22.00, lastUpdated: new Date() },
    { id: "cheese_parmesan", name: "Parmesan", category: "cheese", stock: 8, unit: "kg", lowStockThreshold: 5, pricePerUnit: 45.00, lastUpdated: new Date() },
    
    // Vegetables
    { id: "veg_mushrooms", name: "Mushrooms", category: "vegetable", stock: 12, unit: "kg", lowStockThreshold: 10, pricePerUnit: 8.50, lastUpdated: new Date() },
    { id: "veg_peppers", name: "Bell Peppers", category: "vegetable", stock: 18, unit: "kg", lowStockThreshold: 12, pricePerUnit: 6.00, lastUpdated: new Date() },
    { id: "veg_onions", name: "Red Onions", category: "vegetable", stock: 25, unit: "kg", lowStockThreshold: 15, pricePerUnit: 3.50, lastUpdated: new Date() },
    { id: "veg_tomatoes", name: "Cherry Tomatoes", category: "vegetable", stock: 14, unit: "kg", lowStockThreshold: 10, pricePerUnit: 7.00, lastUpdated: new Date() },
    
    // Meat
    { id: "meat_pepperoni", name: "Pepperoni", category: "meat", stock: 20, unit: "kg", lowStockThreshold: 15, pricePerUnit: 25.00, lastUpdated: new Date() },
    { id: "meat_sausage", name: "Italian Sausage", category: "meat", stock: 16, unit: "kg", lowStockThreshold: 12, pricePerUnit: 18.00, lastUpdated: new Date() },
  ]);

  const [orders, setOrders] = useState<Order[]>([]);

  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [stockUpdate, setStockUpdate] = useState<{ [key: string]: number }>({});

  const lowStockItems = inventory.filter(item => item.stock <= item.lowStockThreshold);

  const updateStock = (itemId: string, newStock: number) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, stock: newStock, lastUpdated: new Date() }
        : item
    ));
    setEditingStock(null);
    setStockUpdate(prev => ({ ...prev, [itemId]: 0 }));
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const text = await res.text();
      const data = (() => { try { return JSON.parse(text); } catch { return null; } })();
      if (res.ok && data?.order) {
        const o = data.order;
        setOrders(prev => prev.map(ord => ord.id === o.id ? {
          id: o.id,
          customerName: o.customerName,
          customerEmail: o.customerEmail,
          items: (o.items || []).map((i: any) => i.name),
          total: o.total,
          status: o.status,
          placedAt: new Date(o.placedAt),
          estimatedDelivery: o.estimatedDelivery ? new Date(o.estimatedDelivery) : undefined,
        } : ord));
      }
    } catch {}
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "order_received": return "bg-yellow-100 text-yellow-800";
      case "in_kitchen": return "bg-orange-100 text-orange-800"; 
      case "out_for_delivery": return "bg-blue-100 text-blue-800";
      case "delivered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "order_received": return Clock;
      case "in_kitchen": return ChefHat;
      case "out_for_delivery": return Truck;
      case "delivered": return Check;
      default: return Clock;
    }
  };

  const getNextStatus = (currentStatus: Order["status"]): Order["status"] | null => {
    switch (currentStatus) {
      case "order_received": return "in_kitchen";
      case "in_kitchen": return "out_for_delivery";
      case "out_for_delivery": return "delivered";
      default: return null;
    }
  };

  const getCategoryIcon = (category: InventoryItem["category"]) => {
    switch (category) {
      case "base": return "🍞";
      case "sauce": return "🍅";
      case "cheese": return "🧀";
      case "vegetable": return "🥬";
      case "meat": return "🥓";
      default: return "📦";
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        const res = await fetch('/api/orders/all', { headers: { Authorization: `Bearer ${token}` } });
        const text = await res.text();
        const data = (() => { try { return JSON.parse(text); } catch { return null; } })();
        if (res.ok && Array.isArray(data?.orders)) {
          const mapped: Order[] = data.orders.map((o: any) => ({
            id: o.id,
            customerName: o.customerName,
            customerEmail: o.customerEmail,
            items: (o.items || []).map((i: any) => i.name),
            total: o.total,
            status: o.status,
            placedAt: new Date(o.placedAt),
            estimatedDelivery: o.estimatedDelivery ? new Date(o.estimatedDelivery) : undefined,
          }));
          setOrders(mapped);
        } else {
          setOrders([]);
        }
      } catch {
        setOrders([]);
      }
    };
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage inventory, orders, and monitor performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-pizza-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Orders</p>
                  <p className="text-2xl font-bold">{orders.filter(o => o.status !== 'delivered').length}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-pizza-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock Items</p>
                  <p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Order Value</p>
                  <p className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-pizza-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-8">
          <TabsList className="grid w-full lg:w-auto grid-cols-3">
            <TabsTrigger value="orders">Order Management</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Order Management Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Order Management</h2>
              <div className="text-sm text-muted-foreground">
                {orders.filter(o => o.status !== 'delivered').length} active orders
              </div>
            </div>

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">Low Stock Alert</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    {lowStockItems.length} items are running low on stock. Check the inventory tab.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {orders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                const nextStatus = getNextStatus(order.status);
                
                return (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            {order.customerName} • {order.customerEmail}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Placed {order.placedAt.toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right space-y-2">
                          <Badge className={getStatusColor(order.status)}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {order.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          {nextStatus && (
                            <div>
                              <Button 
                                size="sm" 
                                onClick={() => updateOrderStatus(order.id, nextStatus)}
                                className="bg-pizza-600 hover:bg-pizza-700"
                              >
                                Move to {nextStatus.replace('_', ' ')}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-1 mb-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm text-muted-foreground">
                            • {item}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-semibold">${order.total.toFixed(2)}</div>
                        {order.estimatedDelivery && order.status !== 'delivered' && (
                          <div className="text-sm text-muted-foreground">
                            Est. delivery: {order.estimatedDelivery.toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Inventory Management</h2>
              <Button className="bg-pizza-600 hover:bg-pizza-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Stock Levels</CardTitle>
                <CardDescription>Monitor and update ingredient stock levels</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Low Stock Alert</TableHead>
                      <TableHead>Price/Unit</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.map((item) => (
                      <TableRow key={item.id} className={item.stock <= item.lowStockThreshold ? "bg-red-50" : ""}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span>{getCategoryIcon(item.category)}</span>
                            {item.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {editingStock === item.id ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={stockUpdate[item.id] || item.stock}
                                  onChange={(e) => setStockUpdate(prev => ({
                                    ...prev,
                                    [item.id]: parseInt(e.target.value) || 0
                                  }))}
                                  className="w-20"
                                />
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => updateStock(item.id, stockUpdate[item.id] || item.stock)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => setEditingStock(null)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <span className={item.stock <= item.lowStockThreshold ? "text-red-600 font-medium" : ""}>
                                  {item.stock} {item.unit}
                                </span>
                                {item.stock <= item.lowStockThreshold && (
                                  <AlertTriangle className="h-4 w-4 text-red-600" />
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>≤ {item.lowStockThreshold} {item.unit}</TableCell>
                        <TableCell>${item.pricePerUnit.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setEditingStock(item.id);
                                setStockUpdate(prev => ({ ...prev, [item.id]: item.stock }));
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateStock(item.id, item.stock + 10)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Orders Today</span>
                    <span className="font-semibold">{totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Revenue Today</span>
                    <span className="font-semibold">${totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Order Value</span>
                    <span className="font-semibold">${averageOrderValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Orders in Kitchen</span>
                    <span className="font-semibold">{orders.filter(o => o.status === 'in_kitchen').length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  {lowStockItems.length === 0 ? (
                    <p className="text-muted-foreground">All inventory levels are healthy</p>
                  ) : (
                    <div className="space-y-2">
                      {lowStockItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                          <span className="text-sm">{item.name}</span>
                          <span className="text-sm text-red-600 font-medium">
                            {item.stock} {item.unit} left
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
