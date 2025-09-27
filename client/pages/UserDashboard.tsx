import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Pizza, 
  Clock, 
  Star, 
  ChefHat, 
  ShoppingCart,
  Truck,
  CheckCircle,
  Plus,
  Heart,
  User,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

export default function UserDashboard() {
  const [favorites, setFavorites] = useState<number[]>([1, 3]);
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [tab, setTab] = useState<string>('orders');
  const [searchParams, setSearchParams] = useSearchParams();
  const [form, setForm] = useState<{ firstName: string; lastName: string; phone: string }>({ firstName: '', lastName: '', phone: '' });

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t && ['orders','menu','history','profile'].includes(t)) setTab(t);
  }, [searchParams]);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem("auth_user");
        setUser(raw ? JSON.parse(raw) : null);
      } catch {}

      const token = localStorage.getItem("auth_token");
      if (!token) return;

      Promise.all([
        fetch("/api/auth/profile", { headers: { Authorization: `Bearer ${token}` } })
          .then(r => r.text()).then(t => { try { return JSON.parse(t); } catch { return null; } })
          .then(d => { const u = d?.user || null; setProfile(u); if (u) setForm({ firstName: u.firstName || '', lastName: u.lastName || '', phone: u.phone || '' }); }).catch(() => {}),
        fetch(`/api/orders/user`, { headers: { Authorization: `Bearer ${token}` } })
          .then(r => r.text()).then(t => { try { return JSON.parse(t); } catch { return { orders: [] }; } })
          .then(d => setOrders(Array.isArray(d?.orders) ? d.orders : [])).catch(() => setOrders([]))
      ]).catch(() => {});
    };

    load();
    const handler = () => load();
    window.addEventListener('orders:change', handler as any);
    document.addEventListener('visibilitychange', handler);
    return () => {
      window.removeEventListener('orders:change', handler as any);
      document.removeEventListener('visibilitychange', handler);
    };
  }, []);

  const currentOrders = useMemo(() => {
    return orders
      .filter((o) => o.status !== "delivered")
      .map((o) => ({
        id: o.id,
        status: o.status,
        estimatedTime: o.estimatedDelivery ? Math.max(0, Math.round((new Date(o.estimatedDelivery).getTime() - Date.now()) / 60000)) : 15,
        items: (o.items || []).map((i: any) => i.name),
        total: o.total || 0,
        placedAt: o.placedAt ? new Date(o.placedAt) : new Date(),
      }));
  }, [orders]);

  const orderHistory = useMemo(() => {
    return orders
      .filter((o) => o.status === "delivered")
      .map((o) => ({
        id: o.id,
        status: o.status,
        items: (o.items || []).map((i: any) => i.name),
        total: o.total || 0,
        deliveredAt: o.actualDelivery ? new Date(o.actualDelivery) : (o.estimatedDelivery ? new Date(o.estimatedDelivery) : new Date()),
        rating: 0,
      }));
  }, [orders]);

  const availablePizzas = [
    {
      id: 1,
      name: "Margherita Supreme",
      description: "Fresh mozzarella, tomato sauce, and basil on our signature crust",
      price: 16.99,
      image: "https://images.pexels.com/photos/8471703/pexels-photo-8471703.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.8,
      isVegetarian: true,
      cookTime: "12-15 mins"
    },
    {
      id: 2,
      name: "Pepperoni Blaze",
      description: "Spicy pepperoni with extra cheese and our special hot sauce",
      price: 19.99,
      image: "https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.9,
      isVegetarian: false,
      cookTime: "15-18 mins"
    },
    {
      id: 3,
      name: "Mediterranean Delight",
      description: "Olives, feta cheese, tomatoes, and herbs from the Mediterranean",
      price: 21.99,
      image: "https://images.pexels.com/photos/1435903/pexels-photo-1435903.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.7,
      isVegetarian: true,
      cookTime: "14-16 mins"
    },
    {
      id: 4,
      name: "Meat Lovers",
      description: "Pepperoni, sausage, ham, and bacon on a thick crust",
      price: 24.99,
      image: "https://images.pexels.com/photos/1460874/pexels-photo-1460874.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.6,
      isVegetarian: false,
      cookTime: "18-20 mins"
    },
    {
      id: 5,
      name: "Veggie Paradise",
      description: "Fresh vegetables, mushrooms, peppers, and onions",
      price: 18.99,
      image: "https://images.pexels.com/photos/2619970/pexels-photo-2619970.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.5,
      isVegetarian: true,
      cookTime: "12-14 mins"
    },
    {
      id: 6,
      name: "BBQ Chicken",
      description: "Grilled chicken, BBQ sauce, red onions, and cilantro",
      price: 22.99,
      image: "https://images.pexels.com/photos/29839587/pexels-photo-29839587.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.7,
      isVegetarian: false,
      cookTime: "16-18 mins"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "order_received": return "bg-yellow-100 text-yellow-800";
      case "in_kitchen": return "bg-orange-100 text-orange-800";
      case "out_for_delivery": return "bg-blue-100 text-blue-800";
      case "delivered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "order_received": return Clock;
      case "in_kitchen": return ChefHat;
      case "out_for_delivery": return Truck;
      case "delivered": return CheckCircle;
      default: return Clock;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "order_received": return "Order Received";
      case "in_kitchen": return "In Kitchen";
      case "out_for_delivery": return "Out for Delivery";
      case "delivered": return "Delivered";
      default: return status;
    }
  };

  const toggleFavorite = (pizzaId: number) => {
    if (favorites.includes(pizzaId)) {
      setFavorites(favorites.filter(id => id !== pizzaId));
    } else {
      setFavorites([...favorites, pizzaId]);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {profile?.firstName || user?.firstName || user?.email || "Guest"}!</h1>
          <p className="text-muted-foreground">Manage your orders and discover delicious pizzas</p>
        </div>

        <Tabs value={tab} onValueChange={(v)=>{ setTab(v); setSearchParams(p=>{ const np = new URLSearchParams(p); np.set('tab', v); return np; }); }} className="space-y-8">
          <TabsList className="grid w-full lg:w-auto grid-cols-4">
            <TabsTrigger value="orders">Current Orders</TabsTrigger>
            <TabsTrigger value="menu">Pizza Menu</TabsTrigger>
            <TabsTrigger value="history">Order History</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Current Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Active Orders</h2>
              <Button asChild className="bg-pizza-600 hover:bg-pizza-700">
                <Link to="/build-pizza">
                  <Plus className="mr-2 h-4 w-4" />
                  New Order
                </Link>
              </Button>
            </div>

            {currentOrders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Pizza className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No active orders</h3>
                  <p className="text-muted-foreground mb-4">Ready to order your next delicious pizza?</p>
                  <Button asChild className="bg-pizza-600 hover:bg-pizza-700">
                    <Link to="/build-pizza">Order Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {currentOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <Card key={order.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <Link to={`/order-status?orderId=${order.id}`} className="absolute inset-0" aria-label={`View order ${order.id}`}></Link>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                            <p className="text-sm text-muted-foreground">
                              Placed {order.placedAt.toLocaleTimeString()}
                            </p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="text-sm text-muted-foreground">
                              • {item}
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center">
                        <div className="text-lg font-semibold">${order.total.toFixed(2)}</div>
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-muted-foreground">
                            <Clock className="inline h-4 w-4 mr-1" />
                            Est. {order.estimatedTime} mins
                          </div>
                          <Button asChild size="sm" variant="outline">
                            <Link to={`/order-status?orderId=${order.id}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Pizza Menu Tab */}
          <TabsContent value="menu" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Pizza Menu</h2>
              <Button asChild variant="outline">
                <Link to="/build-pizza">
                  <ChefHat className="mr-2 h-4 w-4" />
                  Build Custom Pizza
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availablePizzas.map((pizza) => (
                <Card key={pizza.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative">
                    <img 
                      src={pizza.image}
                      alt={pizza.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                      onClick={() => toggleFavorite(pizza.id)}
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          favorites.includes(pizza.id) 
                            ? "fill-red-500 text-red-500" 
                            : "text-gray-600"
                        }`} 
                      />
                    </Button>
                    <div className="absolute top-2 left-2 flex gap-2">
                      {pizza.isVegetarian && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          🌱 Veg
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md">
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{pizza.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{pizza.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{pizza.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{pizza.cookTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-pizza-600">${pizza.price}</span>
                      <Button size="sm" className="bg-pizza-600 hover:bg-pizza-700">
                        <ShoppingCart className="mr-1 h-3 w-3" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Order History Tab */}
          <TabsContent value="history" className="space-y-6">
            <h2 className="text-2xl font-bold">Order History</h2>
            
            {orderHistory.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No order history</h3>
                  <p className="text-muted-foreground">Your previous orders will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orderHistory.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <Link to={`/order-status?orderId=${order.id}`} className="absolute inset-0" aria-label={`View order ${order.id}`}></Link>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            Delivered on {order.deliveredAt.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(order.status)}>
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Delivered
                          </Badge>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < order.rating 
                                    ? "fill-yellow-400 text-yellow-400" 
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
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
                        <div className="flex gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/order-status?orderId=${order.id}`}>View</Link>
                          </Button>
                          <Button variant="outline" size="sm">Reorder</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-2xl font-bold">Profile</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profile?.email || user?.email || "-"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile?.phone || "-"}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div>123 Pizza Street</div>
                      <div className="text-sm text-muted-foreground">Food City, FC 12345</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="grid gap-1">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" value={form.firstName} onChange={(e)=>setForm(f=>({...f, firstName: e.target.value}))} />
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" value={form.lastName} onChange={(e)=>setForm(f=>({...f, lastName: e.target.value}))} />
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" value={form.phone} onChange={(e)=>setForm(f=>({...f, phone: e.target.value}))} />
                    </div>
                    <Button variant="outline" className="w-full" onClick={async ()=>{
                      const token = localStorage.getItem('auth_token');
                      if (!token) return;
                      const res = await fetch('/api/auth/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
                      const text = await res.text();
                      const data = (()=>{ try { return JSON.parse(text); } catch { return null; } })();
                      if (res.ok && data?.user) {
                        setProfile(data.user);
                        try { localStorage.setItem('auth_user', JSON.stringify({ ...(JSON.parse(localStorage.getItem('auth_user')||'{}')), ...data.user })); } catch {}
                        window.dispatchEvent(new Event('auth:change'));
                      }
                    }}>
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Orders</span>
                    <span className="font-semibold">{orders.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Favorite Pizza</span>
                    <span className="font-semibold">{(() => { const counts: Record<string, number> = {}; orders.forEach(o => (o.items||[]).forEach((i: any)=>{counts[i.name]=(counts[i.name]||0)+1;})); const fav = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]; return fav ? fav[0] : "-"; })()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Spent</span>
                    <span className="font-semibold">${orders.reduce((s,o)=>s+(o.total||0),0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="font-semibold">-</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
