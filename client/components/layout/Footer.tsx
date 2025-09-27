import { Link } from "react-router-dom";
import { Pizza, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-pizza-500 p-2 rounded-full">
                <Pizza className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-pizza-600">PizzaHub</span>
            </Link>
            <p className="text-muted-foreground">
              Crafting the perfect pizza experience with fresh ingredients and authentic flavors since 2025.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/menu" className="block text-muted-foreground hover:text-pizza-600 transition-colors">
                Menu
              </Link>
              <Link to="/build-pizza" className="block text-muted-foreground hover:text-pizza-600 transition-colors">
                Build Pizza
              </Link>
              <Link to="/about" className="block text-muted-foreground hover:text-pizza-600 transition-colors">
                About Us
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-pizza-600" />
                <span className="text-muted-foreground">hello@pizzahub.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-pizza-600 mt-0.5" />
                <span className="text-muted-foreground">123 Pizza Street<br />Food City, FC 12345</span>
              </div>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <div className="space-y-2">
              <Link to="/order-status" className="block text-muted-foreground hover:text-pizza-600 transition-colors">
                Track Order
              </Link>
              <Link to="/dashboard?tab=profile" className="block text-muted-foreground hover:text-pizza-600 transition-colors">
                My Account
              </Link>
            </div>
          </div>

        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 PizzaHub. All rights reserved.</p>
          <p className="mt-2">Built by <a href="https://sohamchoudhury.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-pizza-600 hover:underline">Soham Choudhury</a></p>
        </div>
      </div>
    </footer>
  );
}
