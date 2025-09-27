import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone,
  Pizza,
  ArrowRight,
  Download,
  Star
} from "lucide-react";

interface OrderDetails {
  id: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  estimatedDelivery: string;
  paymentMethod: string;
  status: string;
}

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  
  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');
  const method = searchParams.get('method');

  useEffect(() => {
    // In a real app, fetch order details from API
    // For now, we'll use mock data
    if (orderId) {
      setOrderDetails({
        id: orderId,
        items: [
          { name: "Custom Pizza", quantity: 1, price: 21.99 }
        ],
        total: 21.99,
        estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toLocaleTimeString(),
        paymentMethod: method || 'card',
        status: 'order_received'
      });
    }
  }, [orderId, method]);

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pizza-50 via-pizza-100 to-orange-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <Pizza className="h-16 w-16 mx-auto text-muted-foreground mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading order details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-pizza-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Header */}
        <Card className="shadow-xl border-0 mb-8">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-green-100 p-4 rounded-full w-fit mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-green-800">
              Order Confirmed!
            </CardTitle>
            <CardDescription className="text-lg">
              Thank you for choosing PizzaHub. Your delicious pizza is on its way!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 font-medium">Order ID: {orderDetails.id}</p>
              {paymentId && (
                <p className="text-green-700 text-sm">Payment ID: {paymentId}</p>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Estimated delivery: {orderDetails.estimatedDelivery}</span>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="shadow-xl border-0 mb-8">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg text-pizza-600">₹{orderDetails.total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Payment Method</span>
                <span className="capitalize">
                  {orderDetails.paymentMethod === 'razorpay' ? 'Card/UPI/Wallet' : orderDetails.paymentMethod}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card className="shadow-xl border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pizza className="h-5 w-5" />
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
              <div className="bg-orange-100 p-2 rounded-full">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-orange-800">Order Received</p>
                <p className="text-sm text-orange-700">Your order has been confirmed and is being prepared</p>
              </div>
            </div>
            
            <div className="mt-4 p-4 border border-dashed border-pizza-200 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                💡 <strong>Track your order:</strong> We'll send you SMS updates as your pizza moves through our kitchen and out for delivery
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-xl border-0 mb-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="h-auto p-4">
                <Link to={`/order-status?orderId=${orderDetails.id}`}>
                  <div className="text-center">
                    <MapPin className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Track Order</div>
                    <div className="text-xs text-muted-foreground">Real-time updates</div>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-4">
                <Link to="/dashboard">
                  <div className="text-center">
                    <Pizza className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Order History</div>
                    <div className="text-xs text-muted-foreground">View past orders</div>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-4">
                <div className="text-center">
                  <Download className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">Download Receipt</div>
                  <div className="text-xs text-muted-foreground">PDF invoice</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rating Prompt */}
        <Card className="shadow-xl border-0 mb-8 bg-pizza-50 border-pizza-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="font-semibold text-pizza-800">How was your experience?</h3>
              <p className="text-sm text-pizza-700">
                We'd love to hear your feedback once you receive your order
              </p>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="p-1 hover:scale-110 transition-transform"
                    onClick={() => console.log(`Rated ${star} stars`)}
                  >
                    <Star className="h-6 w-6 text-yellow-400 hover:text-yellow-500" />
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Shopping */}
        <div className="text-center space-y-4">
          <Button asChild className="bg-pizza-600 hover:bg-pizza-700">
            <Link to="/build-pizza">
              <Pizza className="mr-2 h-4 w-4" />
              Order Another Pizza
            </Link>
          </Button>
          
          <div>
            <Button asChild variant="link">
              <Link to="/">
                <ArrowRight className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>

        {/* Contact Support */}
        <Card className="shadow-xl border-0 mt-8">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Need help with your order?
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" size="sm">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Support
                </Button>
                <Button variant="outline" size="sm">
                  Live Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
