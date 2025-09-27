import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CreditCard, 
  Wallet, 
  Banknote, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

interface RazorpayCheckoutProps {
  amount: number;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: any) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayCheckout({
  amount,
  orderItems,
  onPaymentSuccess,
  onPaymentError
}: RazorpayCheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    zipCode: ""
  });

  const paymentMethods = [
    {
      id: "cash",
      name: "Cash on Delivery",
      description: "Pay when your pizza arrives",
      icon: Banknote,
      enabled: true
    }
  ];

  // Razorpay integration removed; only Cash on Delivery supported.

  const handlePayment = async () => {
    setError(null);
    const phoneDigits = (deliveryInfo.phone || '').replace(/\D/g, '');
    const zipDigits = (deliveryInfo.zipCode || '').replace(/\D/g, '');
    if (!deliveryInfo.name || !deliveryInfo.address || !deliveryInfo.city) {
      setError("Please complete name, address and city");
      return;
    }
    if (phoneDigits.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    if (zipDigits.length < 4) {
      setError("Please enter a valid ZIP/Postal code");
      return;
    }

    setLoading(true);

    try {
      // Cash on delivery only
      const orderData = {
        items: orderItems,
        deliveryAddress: {
          street: deliveryInfo.address,
          city: deliveryInfo.city,
          state: "State",
          zipCode: zipDigits,
          phone: phoneDigits
        },
        paymentMethod: "cash",
        total: amount
      };

      const token = localStorage.getItem('auth_token') || 'mock_jwt_token_user-1_user';
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const text = await response.text();
      const result = (() => { try { return JSON.parse(text); } catch { return null; } })();

      if (response.ok) {
        onPaymentSuccess({
          method: 'cash',
          orderId: result.order.id,
          ...result
        });
      } else {
        throw new Error(result?.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {orderItems.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.name} x{item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{amount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Information */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Information</CardTitle>
          <CardDescription>Where should we deliver your delicious pizza?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={deliveryInfo.name}
                onChange={(e) => setDeliveryInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={deliveryInfo.phone}
                onChange={(e) => setDeliveryInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              value={deliveryInfo.address}
              onChange={(e) => setDeliveryInfo(prev => ({ ...prev, address: e.target.value }))}
              placeholder="123 Pizza Street, Food Colony"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={deliveryInfo.city}
                onChange={(e) => setDeliveryInfo(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Mumbai"
              />
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={deliveryInfo.zipCode}
                onChange={(e) => setDeliveryInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                placeholder="400001"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Choose how you'd like to pay for your order</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <div
                    key={method.id}
                    className={`flex items-center space-x-3 border rounded-lg p-4 ${
                      !method.enabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted/50 cursor-pointer'
                    }`}
                  >
                    <RadioGroupItem 
                      value={method.id} 
                      id={method.id}
                      disabled={!method.enabled}
                    />
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <Label htmlFor={method.id} className="cursor-pointer">
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-muted-foreground">{method.description}</div>
                      </Label>
                    </div>
                  </div>
                );
              })}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Button */}
      <Card>
        <CardContent className="pt-6">
          
          <Button 
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-pizza-600 hover:bg-pizza-700 text-white py-6 text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <>
                  <Banknote className="mr-2 h-5 w-5" />
                  Place Order (Cash on Delivery)
                </>
              </>
            )}
          </Button>
          
        </CardContent>
      </Card>
    </div>
  );
}
