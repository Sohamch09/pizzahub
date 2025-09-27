import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Star, ChefHat, Clock, MapPin, Mail, Pizza } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-pizza-900/40 via-pizza-700/30 to-orange-700/20" />
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <Badge className="bg-pizza-600">Our Story</Badge>
              <h1 className="text-4xl md:text-6xl font-extrabold">
                Crafted With Fire. Served With Love.
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                At PizzaHub, every pie is a celebration. We hand-stretch our dough, simmer sauces for hours, and source the freshest toppings to deliver bold flavors that ignite your senses.
              </p>
              <div className="flex gap-3">
                <Button className="bg-pizza-600 hover:bg-pizza-700" asChild>
                  <a href="/menu">Explore Menu</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/build-pizza">Build Your Pizza</a>
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4 text-muted-foreground">
                <div className="flex items-center gap-2"><Flame className="h-5 w-5 text-pizza-500" /><span>Wood-fired flavors</span></div>
                <div className="flex items-center gap-2"><Star className="h-5 w-5 text-yellow-400" /><span>5★ loved by foodies</span></div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-card/60 border rounded-3xl p-4 md:p-6 shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1460874/pexels-photo-1460874.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Signature pizza fresh from the oven"
                  className="w-full h-80 object-cover rounded-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 bg-pizza-600 text-white p-3 rounded-full shadow-lg">
                <Pizza className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ChefHat className="h-5 w-5 text-pizza-500" /> Chef-Driven</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Our chefs obsess over balance: crisp crusts, tangy sauces, creamy cheeses, and toppings that sing together.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-pizza-500" /> Fresh & Fast</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                From oven to doorstep in minutes, without compromising quality. Hot, fresh, unforgettable.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-pizza-500" /> Premium Ingredients</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                We source responsibly and locally whenever possible—because better ingredients make better pizza.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Visit & Contact */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Visit Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-pizza-600 mt-0.5" /><span>123 Pizza Street, Food City, FC 12345</span></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-pizza-600" /><span>hello@pizzahub.com</span></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
