import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShoppingCart, Plus, Minus, Pizza, ArrowRight } from "lucide-react";
import RazorpayCheckout from "@/components/payment/RazorpayCheckout";

interface PizzaCustomization {
  base: string;
  sauce: string;
  cheese: string;
  vegetables: string[];
  meat?: string;
  size: string;
}

export default function PizzaBuilder() {
  const navigate = useNavigate();
  const [pizza, setPizza] = useState<PizzaCustomization>({
    base: "",
    sauce: "",
    cheese: "",
    vegetables: [],
    size: "medium"
  });

  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);

  const pizzaBases = [
    { id: "thin", name: "Thin Crust", price: 0, description: "Crispy and light" },
    { id: "thick", name: "Thick Crust", price: 2, description: "Classic and fluffy" },
    { id: "stuffed", name: "Stuffed Crust", price: 4, description: "Cheese-filled edges" },
    { id: "gluten-free", name: "Gluten-Free", price: 3, description: "Wheat-free option" },
    { id: "cauliflower", name: "Cauliflower", price: 5, description: "Low-carb alternative" }
  ];

  const sauces = [
    { id: "tomato", name: "Classic Tomato", price: 0, description: "Traditional pizza sauce" },
    { id: "bbq", name: "BBQ Sauce", price: 1, description: "Sweet and smoky" },
    { id: "pesto", name: "Pesto", price: 2, description: "Basil and garlic" },
    { id: "white", name: "White Sauce", price: 1.5, description: "Creamy garlic base" },
    { id: "buffalo", name: "Buffalo Sauce", price: 1.5, description: "Spicy and tangy" }
  ];

  const cheeses = [
    { id: "mozzarella", name: "Mozzarella", price: 0, description: "Classic stretchy cheese" },
    { id: "cheddar", name: "Cheddar", price: 1, description: "Sharp and flavorful" },
    { id: "parmesan", name: "Parmesan", price: 2, description: "Aged and nutty" },
    { id: "goat", name: "Goat Cheese", price: 3, description: "Creamy and tangy" },
    { id: "vegan", name: "Vegan Cheese", price: 2, description: "Plant-based option" }
  ];

  const vegetables = [
    { id: "mushrooms", name: "Mushrooms", price: 1 },
    { id: "peppers", name: "Bell Peppers", price: 1 },
    { id: "onions", name: "Red Onions", price: 0.5 },
    { id: "tomatoes", name: "Cherry Tomatoes", price: 1 },
    { id: "olives", name: "Black Olives", price: 1.5 },
    { id: "spinach", name: "Fresh Spinach", price: 1 },
    { id: "jalapenos", name: "Jalapeños", price: 1 },
    { id: "corn", name: "Sweet Corn", price: 1 }
  ];

  const sizes = [
    { id: "small", name: "Small (10\")", multiplier: 0.8, description: "Perfect for 1-2 people" },
    { id: "medium", name: "Medium (12\")", multiplier: 1, description: "Great for 2-3 people" },
    { id: "large", name: "Large (14\")", multiplier: 1.3, description: "Ideal for 3-4 people" },
    { id: "xlarge", name: "X-Large (16\")", multiplier: 1.6, description: "Family size for 4+ people" }
  ];

  const basePrice = 12.99;

  const calculatePrice = () => {
    let total = basePrice;
    
    // Add base price
    const selectedBase = pizzaBases.find(b => b.id === pizza.base);
    if (selectedBase) total += selectedBase.price;
    
    // Add sauce price
    const selectedSauce = sauces.find(s => s.id === pizza.sauce);
    if (selectedSauce) total += selectedSauce.price;
    
    // Add cheese price
    const selectedCheese = cheeses.find(c => c.id === pizza.cheese);
    if (selectedCheese) total += selectedCheese.price;
    
    // Add vegetables price
    pizza.vegetables.forEach(vegId => {
      const veg = vegetables.find(v => v.id === vegId);
      if (veg) total += veg.price;
    });
    
    // Apply size multiplier
    const selectedSize = sizes.find(s => s.id === pizza.size);
    if (selectedSize) total *= selectedSize.multiplier;
    
    return total * quantity;
  };

  const handleVegetableChange = (vegId: string, checked: boolean) => {
    if (checked) {
      setPizza(prev => ({
        ...prev,
        vegetables: [...prev.vegetables, vegId]
      }));
    } else {
      setPizza(prev => ({
        ...prev,
        vegetables: prev.vegetables.filter(id => id !== vegId)
      }));
    }
  };

  const isValidPizza = pizza.base && pizza.sauce && pizza.cheese;

  const handleAddToCart = () => {
    if (!isValidPizza) return;
    setShowCheckout(true);
  };

  const createOrderItems = () => {
    const baseName = pizzaBases.find(b => b.id === pizza.base)?.name || "";
    const sauceName = sauces.find(s => s.id === pizza.sauce)?.name || "";
    const cheeseName = cheeses.find(c => c.id === pizza.cheese)?.name || "";
    const vegNames = pizza.vegetables.map(vegId =>
      vegetables.find(v => v.id === vegId)?.name
    ).filter(Boolean);

    const sizeName = sizes.find(s => s.id === pizza.size)?.name || "";

    let pizzaName = "Custom Pizza";
    if (baseName && sauceName && cheeseName) {
      pizzaName = `Custom ${sizeName} - ${baseName}, ${sauceName}, ${cheeseName}`;
      if (vegNames.length > 0) {
        pizzaName += `, ${vegNames.join(", ")}`;
      }
    }

    return [{
      name: pizzaName,
      quantity: quantity,
      price: calculatePrice() / quantity, // Price per pizza
      customizations: pizza
    }];
  };

  const handlePaymentSuccess = (paymentData: any) => {
    console.log("Payment successful:", paymentData);
    setShowCheckout(false);

    // Navigate to success page with order details
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
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-foreground">Build Your Perfect Pizza</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create your dream pizza by selecting from our premium ingredients. Every pizza is made fresh to order.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pizza Builder Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Size Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Size</CardTitle>
                <CardDescription>Select the perfect size for your appetite</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={pizza.size} onValueChange={(value) => setPizza(prev => ({ ...prev, size: value }))}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sizes.map((size) => (
                      <div key={size.id} className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50">
                        <RadioGroupItem value={size.id} id={size.id} />
                        <Label htmlFor={size.id} className="flex-1 cursor-pointer">
                          <div className="font-medium">{size.name}</div>
                          <div className="text-sm text-muted-foreground">{size.description}</div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Base Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Pizza Base</CardTitle>
                <CardDescription>Choose your foundation</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={pizza.base} onValueChange={(value) => setPizza(prev => ({ ...prev, base: value }))}>
                  <div className="space-y-3">
                    {pizzaBases.map((base) => (
                      <div key={base.id} className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50">
                        <RadioGroupItem value={base.id} id={base.id} />
                        <Label htmlFor={base.id} className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{base.name}</div>
                              <div className="text-sm text-muted-foreground">{base.description}</div>
                            </div>
                            {base.price > 0 && (
                              <Badge variant="secondary">+${base.price.toFixed(2)}</Badge>
                            )}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Sauce Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Sauce</CardTitle>
                <CardDescription>Pick your flavor base</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={pizza.sauce} onValueChange={(value) => setPizza(prev => ({ ...prev, sauce: value }))}>
                  <div className="space-y-3">
                    {sauces.map((sauce) => (
                      <div key={sauce.id} className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50">
                        <RadioGroupItem value={sauce.id} id={sauce.id} />
                        <Label htmlFor={sauce.id} className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{sauce.name}</div>
                              <div className="text-sm text-muted-foreground">{sauce.description}</div>
                            </div>
                            {sauce.price > 0 && (
                              <Badge variant="secondary">+${sauce.price.toFixed(2)}</Badge>
                            )}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Cheese Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Cheese</CardTitle>
                <CardDescription>Select your cheese type</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={pizza.cheese} onValueChange={(value) => setPizza(prev => ({ ...prev, cheese: value }))}>
                  <div className="space-y-3">
                    {cheeses.map((cheese) => (
                      <div key={cheese.id} className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50">
                        <RadioGroupItem value={cheese.id} id={cheese.id} />
                        <Label htmlFor={cheese.id} className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{cheese.name}</div>
                              <div className="text-sm text-muted-foreground">{cheese.description}</div>
                            </div>
                            {cheese.price > 0 && (
                              <Badge variant="secondary">+${cheese.price.toFixed(2)}</Badge>
                            )}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Vegetables Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Vegetables</CardTitle>
                <CardDescription>Add your favorite veggies (multiple selection allowed)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {vegetables.map((vegetable) => (
                    <div key={vegetable.id} className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50">
                      <Checkbox
                        id={vegetable.id}
                        checked={pizza.vegetables.includes(vegetable.id)}
                        onCheckedChange={(checked) => handleVegetableChange(vegetable.id, checked as boolean)}
                      />
                      <Label htmlFor={vegetable.id} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{vegetable.name}</span>
                          <Badge variant="secondary">+${vegetable.price.toFixed(2)}</Badge>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pizza className="h-5 w-5" />
                  Your Pizza
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pizza Preview */}
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-pizza-400 to-orange-400 rounded-full flex items-center justify-center mb-4">
                    <Pizza className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="font-semibold">Custom Pizza</h3>
                  <p className="text-sm text-muted-foreground">
                    {sizes.find(s => s.id === pizza.size)?.name || "Select size"}
                  </p>
                </div>

                <Separator />

                {/* Order Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base pizza</span>
                    <span>${basePrice.toFixed(2)}</span>
                  </div>
                  
                  {pizza.base && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>{pizzaBases.find(b => b.id === pizza.base)?.name}</span>
                      <span>+${(pizzaBases.find(b => b.id === pizza.base)?.price || 0).toFixed(2)}</span>
                    </div>
                  )}
                  
                  {pizza.sauce && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>{sauces.find(s => s.id === pizza.sauce)?.name}</span>
                      <span>+${(sauces.find(s => s.id === pizza.sauce)?.price || 0).toFixed(2)}</span>
                    </div>
                  )}
                  
                  {pizza.cheese && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>{cheeses.find(c => c.id === pizza.cheese)?.name}</span>
                      <span>+${(cheeses.find(c => c.id === pizza.cheese)?.price || 0).toFixed(2)}</span>
                    </div>
                  )}
                  
                  {pizza.vegetables.map(vegId => {
                    const veg = vegetables.find(v => v.id === vegId);
                    return veg ? (
                      <div key={vegId} className="flex justify-between text-muted-foreground">
                        <span>{veg.name}</span>
                        <span>+${veg.price.toFixed(2)}</span>
                      </div>
                    ) : null;
                  })}
                </div>

                <Separator />

                {/* Quantity */}
                <div className="flex items-center justify-between">
                  <span className="font-medium">Quantity</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${calculatePrice().toFixed(2)}</span>
                </div>

                {/* Add to Cart Button */}
                <Button
                  className="w-full bg-pizza-600 hover:bg-pizza-700"
                  disabled={!isValidPizza}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Proceed to Checkout
                </Button>

                {!isValidPizza && (
                  <p className="text-sm text-muted-foreground text-center">
                    Please select base, sauce, and cheese to continue
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Checkout Dialog */}
        <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Complete Your Order</DialogTitle>
              <DialogDescription>
                Review your pizza and complete the payment to place your order
              </DialogDescription>
            </DialogHeader>

            <RazorpayCheckout
              amount={calculatePrice()}
              orderItems={createOrderItems()}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
