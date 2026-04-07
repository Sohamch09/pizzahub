import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Pizza, 
  Clock, 
  Truck, 
  Star, 
  ChefHat, 
  Flame,
  Award,
  Users,
  MapPin,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const featuredPizzas = [
    {
      id: 1,
      name: "Margherita Supreme",
      description: "Fresh mozzarella, tomato sauce, and basil on our signature crust",
      price: 16.99,
      image: "https://images.pexels.com/photos/8471703/pexels-photo-8471703.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.8,
      isVegetarian: true,
      isPopular: true
    },
    {
      id: 2,
      name: "Pepperoni Blaze",
      description: "Spicy pepperoni with extra cheese and our special hot sauce",
      price: 19.99,
      image: "https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.9,
      isVegetarian: false,
      isPopular: true
    },
    {
      id: 3,
      name: "Mediterranean Delight",
      description: "Olives, feta cheese, tomatoes, and herbs from the Mediterranean",
      price: 21.99,
      image: "https://images.pexels.com/photos/1435903/pexels-photo-1435903.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.7,
      isVegetarian: true,
      isPopular: false
    }
  ];

  const stats = [
    { number: "10K+", label: "Happy Customers", icon: Users },
    { number: "25+", label: "Pizza Varieties", icon: Pizza },
    { number: "30min", label: "Average Delivery", icon: Clock },
    { number: "5★", label: "Average Rating", icon: Star }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pizza-50 via-pizza-100 to-orange-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pizza-500/10 to-orange-500/10" />
        <div className="absolute top-20 right-10 w-32 h-32 bg-pizza-200 rounded-full opacity-50" />
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-pizza-500 hover:bg-pizza-600 text-white">
                  🔥 Now delivering in 30 minutes!
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Delicious Pizza
                  <span className="text-pizza-600"> Made Fresh</span>
                  <br />
                  Just for You
                </h1>
                <p className="text-xl text-gray-600 max-w-lg">
                  Handcrafted pizzas with premium ingredients, delivered hot to your door. 
                  Build your perfect pizza or choose from our chef's specials.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-pizza-600 hover:bg-pizza-700 text-white px-8" asChild>
                  <Link to="/build-pizza">
                    <ChefHat className="mr-2 h-5 w-5" />
                    Build Your Pizza
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="border-pizza-600 text-pizza-600 hover:bg-pizza-50" asChild>
                  <Link to="/menu">
                    View Menu
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <stat.icon className="h-6 w-6 text-pizza-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10 bg-card/80 border border-border rounded-3xl shadow-2xl p-8 backdrop-blur">
                <img
                  src="https://images.pexels.com/photos/1460874/pexels-photo-1460874.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Delicious Pizza fresh from the oven"
                  className="w-full h-80 object-cover rounded-2xl"
                />
                <div className="absolute -top-4 -right-4 bg-pizza-600 text-white p-3 rounded-full shadow-lg">
                  <Flame className="h-6 w-6" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-pizza-400/20 to-orange-400/20 rounded-3xl transform rotate-3" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pizzas */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="border-pizza-600 text-pizza-600">
              Chef's Specials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Most Popular Pizzas
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our customer favorites, crafted with premium ingredients and traditional techniques
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPizzas.map((pizza) => (
              <Card key={pizza.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative">
                  <img
                    src={pizza.image}
                    alt={pizza.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {pizza.isPopular && (
                      <Badge className="bg-pizza-600 hover:bg-pizza-700">
                        🔥 Popular
                      </Badge>
                    )}
                    {pizza.isVegetarian && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        🌱 Vegetarian
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 bg-card/90 rounded-full p-2 shadow-md">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{pizza.rating}</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{pizza.name}</h3>
                  <p className="text-muted-foreground mb-4">{pizza.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-pizza-600">${pizza.price}</span>
                    <Button size="sm">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Why Choose PizzaHub?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to delivering the best pizza experience with quality ingredients and exceptional service
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-pizza-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Clock className="h-8 w-8 text-pizza-600" />
              </div>
              <h3 className="text-xl font-semibold">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Hot and fresh pizzas delivered to your door in 30 minutes or less
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-pizza-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Award className="h-8 w-8 text-pizza-600" />
              </div>
              <h3 className="text-xl font-semibold">Premium Quality</h3>
              <p className="text-muted-foreground">
                Only the finest ingredients sourced from trusted suppliers
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-pizza-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <ChefHat className="h-8 w-8 text-pizza-600" />
              </div>
              <h3 className="text-xl font-semibold">Custom Made</h3>
              <p className="text-muted-foreground">
                Build your perfect pizza with our wide selection of toppings
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-pizza-600 text-white">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Order Your Perfect Pizza?
          </h2>
          <p className="text-xl text-pizza-100 max-w-2xl mx-auto">
            Join thousands of satisfied customers and experience the PizzaHub difference today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-pizza-600 hover:bg-pizza-50" asChild>
              <Link to="/register">
                <Users className="mr-2 h-5 w-5" />
                Sign Up Now
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-pizza-600" asChild>
              <Link to="/build-pizza">
                Build Pizza
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
