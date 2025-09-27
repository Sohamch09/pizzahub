import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  ChefHat, 
  Truck, 
  CheckCircle, 
  Search,
  MapPin,
  Phone,
  User
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface OrderDetails {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: "order_received" | "in_kitchen" | "out_for_delivery" | "delivered";
  placedAt: Date;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  driverName?: string;
  driverPhone?: string;
}

export default function OrderStatus() {
  const [orderId, setOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [params] = useSearchParams();

  useEffect(() => {
    const q = params.get('orderId');
    if (q) {
      setOrderId(q);
      searchOrder(q);
    }
  }, [params]);


  const searchOrder = async (explicitId?: string) => {
    const id = (explicitId ?? orderId).trim();
    if (!id) {
      setError("Please enter an order ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/orders/${encodeURIComponent(id)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const text = await res.text();
      const data = (() => { try { return JSON.parse(text); } catch { return null; } })();
      if (res.ok && data?.order) {
        const o = data.order;
        const normalized: OrderDetails = {
          id: o.id,
          customerName: o.customerName || 'Customer',
          customerPhone: o.customerPhone || '-',
          customerAddress: `${o.deliveryAddress?.street || ''}, ${o.deliveryAddress?.city || ''}, ${o.deliveryAddress?.state || ''} ${o.deliveryAddress?.zipCode || ''}`.trim(),
          items: (o.items || []).map((i: any) => ({ name: i.name, quantity: i.quantity, price: i.price })),
          total: o.total || 0,
          status: o.status,
          placedAt: new Date(o.placedAt),
          estimatedDelivery: new Date(o.estimatedDelivery),
          actualDelivery: o.actualDelivery ? new Date(o.actualDelivery) : undefined,
          driverName: o.driverName || undefined,
          driverPhone: o.driverPhone || undefined,
        };
        setOrderDetails(normalized);
      } else {
        setOrderDetails(null);
        if (res.status === 401) setError("Please log in to view your orders.");
        else if (res.status === 403) setError("You can only view your own orders.");
        else setError("Order not found. Please check your order ID and try again.");
      }
    } catch {
      setError("Failed to fetch order. Please try again.");
      setOrderDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: OrderDetails["status"]) => {
    switch (status) {
      case "order_received": return "bg-yellow-100 text-yellow-800";
      case "in_kitchen": return "bg-orange-100 text-orange-800";
      case "out_for_delivery": return "bg-blue-100 text-blue-800";
      case "delivered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: OrderDetails["status"]) => {
    switch (status) {
      case "order_received": return Clock;
      case "in_kitchen": return ChefHat;
      case "out_for_delivery": return Truck;
      case "delivered": return CheckCircle;
      default: return Clock;
    }
  };

  const getStatusText = (status: OrderDetails["status"]) => {
    switch (status) {
      case "order_received": return "Order Received";
      case "in_kitchen": return "In Kitchen";
      case "out_for_delivery": return "Out for Delivery";
      case "delivered": return "Delivered";
      default: return status;
    }
  };

  const getProgressValue = (status: OrderDetails["status"]) => {
    switch (status) {
      case "order_received": return 25;
      case "in_kitchen": return 50;
      case "out_for_delivery": return 75;
      case "delivered": return 100;
      default: return 0;
    }
  };

  const getEstimatedTime = (order: OrderDetails) => {
    if (order.status === "delivered") {
      return order.actualDelivery ? 
        `Delivered at ${order.actualDelivery.toLocaleTimeString()}` :
        "Delivered";
    }
    
    const now = new Date();
    const estimatedTime = Math.max(0, Math.floor((order.estimatedDelivery.getTime() - now.getTime()) / (1000 * 60)));
    
    if (estimatedTime === 0) {
      return "Arriving any moment!";
    }
    
    return `Est. ${estimatedTime} minutes`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pizza-50 via-pizza-100 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-foreground">Track Your Order</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter your order ID to get real-time updates on your delicious pizza
          </p>
        </div>

        {/* Search Form */}
        <Card className="shadow-xl border-0 mb-8">
          <CardHeader>
            <CardTitle>Find Your Order</CardTitle>
            <CardDescription>
              Enter the order ID you received via email or SMS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="orderId">Order ID</Label>
                <Input
                  id="orderId"
                  placeholder="e.g., ORD-001"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchOrder()}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => searchOrder()}
                  disabled={loading}
                  className="bg-pizza-600 hover:bg-pizza-700"
                >
                  <Search className="mr-2 h-4 w-4" />
                  {loading ? "Searching..." : "Track Order"}
                </Button>
              </div>
            </div>
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Order Details */}
        {orderDetails && (
          <div className="space-y-6">
            {/* Order Status */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Order #{orderDetails.id}</CardTitle>
                    <CardDescription>
                      Placed {orderDetails.placedAt.toLocaleString()}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(orderDetails.status)}>
                    {(() => { const Icon = getStatusIcon(orderDetails.status); return <Icon className="mr-1 h-3 w-3" />; })()}
                    {getStatusText(orderDetails.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Order Progress</span>
                    <span>{getProgressValue(orderDetails.status)}%</span>
                  </div>
                  <Progress value={getProgressValue(orderDetails.status)} className="h-3" />
                  <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                    <div className="text-center">Received</div>
                    <div className="text-center">In Kitchen</div>
                    <div className="text-center">Out for Delivery</div>
                    <div className="text-center">Delivered</div>
                  </div>
                </div>

                {/* Estimated Time */}
                <div className="text-center p-4 bg-pizza-50 rounded-lg">
                  <h3 className="font-semibold text-lg text-pizza-800">
                    {getEstimatedTime(orderDetails)}
                  </h3>
                  {orderDetails.status === "out_for_delivery" && orderDetails.driverName && (
                    <p className="text-sm text-pizza-600 mt-1">
                      Driver: {orderDetails.driverName}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 border-t font-bold text-lg">
                    <span>Total</span>
                    <span>${orderDetails.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer & Delivery Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{orderDetails.customerName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{orderDetails.customerPhone}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">{orderDetails.customerAddress}</span>
                  </div>
                </CardContent>
              </Card>

              {orderDetails.status === "out_for_delivery" && orderDetails.driverName && (
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Delivery Driver
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{orderDetails.driverName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{orderDetails.driverPhone}</span>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Phone className="mr-2 h-4 w-4" />
                      Call Driver
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
