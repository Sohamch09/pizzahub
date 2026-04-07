import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import RazorpayCheckout from "@/components/payment/RazorpayCheckout";

export default function Menu() {
  const navigate = useNavigate();
  const [selectedPizza, setSelectedPizza] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const pizzas = [
    {
      id: 1,
      name: "Margherita Supreme",
      description: "Fresh mozzarella, tomato sauce, and basil on our signature crust",
      price: 16.99,
      image: "https://images.pexels.com/photos/8471703/pexels-photo-8471703.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.8,
      tags: ["Vegetarian", "Popular"],
    },
    {
      id: 2,
      name: "Pepperoni Blaze",
      description: "Spicy pepperoni with extra cheese and our special hot sauce",
      price: 19.99,
      image: "https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.9,
      tags: ["Best Seller"],
    },
    {
      id: 3,
      name: "Mediterranean Delight",
      description: "Olives, feta cheese, tomatoes, and herbs from the Mediterranean",
      price: 21.99,
      image: "https://images.pexels.com/photos/1435903/pexels-photo-1435903.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.7,
      tags: ["Vegetarian"],
    },
    {
      id: 4,
      name: "Meat Lovers",
      description: "Pepperoni, sausage, ham, and bacon on a thick crust",
      price: 24.99,
      image: "https://images.pexels.com/photos/1460874/pexels-photo-1460874.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.6,
      tags: ["Loaded"],
    },
    {
      id: 5,
      name: "Veggie Paradise",
      description: "Fresh vegetables, mushrooms, peppers, and onions",
      price: 18.99,
      image: "https://images.pexels.com/photos/2619970/pexels-photo-2619970.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.5,
      tags: ["Vegetarian"],
    },
    {
      id: 6,
      name: "BBQ Chicken",
      description: "Grilled chicken, BBQ sauce, red onions, and cilantro",
      price: 22.99,
      image: "https://images.pexels.com/photos/29839587/pexels-photo-29839587.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.7,
      tags: ["Chef's Special"],
    },
  ];

  const handleAddToCart = (pizza: any) => {
    setSelectedPizza(pizza);
    setShowCheckout(true);
  };

  const handlePaymentSuccess = (paymentData: any) => {
    setShowCheckout(false);
    const params = new URLSearchParams({
      orderId: paymentData.orderId || 'ORD-' + Date.now(),
      paymentId: paymentData.paymentId || '',
      method: paymentData.method || 'cash'
    });
    try { localStorage.setItem('last_order_id', String(paymentData.orderId || '')); } catch {}
    window.dispatchEvent(new Event('orders:change'));
    navigate(`/payment-success?${params.toString()}`);
  };

  const handlePaymentError = (error: any) => {
    console.error("Payment error:", error);
    setShowCheckout(false);
    try {
      // @ts-ignore
      const { toast } = require("@/hooks/use-toast");
      toast({ title: "Payment failed", description: "Please check details and try again", variant: "destructive" });
    } catch {}
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-4xl font-bold">Our Menu</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Explore our handcrafted pizzas made with premium ingredients. Order your favorite or build your own!</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pizzas.map((pizza) => (
            <Card key={pizza.id} className="group hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
              <div className="relative">
                <img
                  src={pizza.image}
                  alt={pizza.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {pizza.tags.map((tag) => (
                    <Badge key={tag} className="bg-pizza-600/90">{tag}</Badge>
                  ))}
                </div>
                <div className="absolute top-4 right-4 bg-card/90 rounded-full p-2 shadow-md">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{pizza.rating}</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 space-y-3 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold">{pizza.name}</h3>
                <p className="text-muted-foreground flex-grow">{pizza.description}</p>
                <div className="flex items-center justify-between pt-4 mt-auto">
                  <span className="text-2xl font-bold text-pizza-500">${pizza.price}</span>
                  <Button size="sm" onClick={() => handleAddToCart(pizza)}>Add to Cart</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Complete Your Order</DialogTitle>
              <DialogDescription>
                Review your order details and complete the payment to place your order.
              </DialogDescription>
            </DialogHeader>

            {selectedPizza && (
              <RazorpayCheckout
                amount={selectedPizza.price}
                orderItems={[
                  {
                    name: selectedPizza.name,
                    quantity: 1,
                    price: selectedPizza.price
                  }
                ]}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

