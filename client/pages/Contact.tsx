import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 space-y-8">
        <div className="text-center space-y-3">
          <Badge className="bg-pizza-600">Get in Touch</Badge>
          <h1 className="text-4xl font-bold">Contact PizzaHub</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">We'd love to hear from you. Reach us via email or visit our location.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Email</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3 text-muted-foreground">
              <Mail className="h-5 w-5 text-pizza-600" />
              <span>hello@pizzahub.com</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="flex items-start gap-3 text-muted-foreground">
              <MapPin className="h-5 w-5 text-pizza-600 mt-0.5" />
              <span>123 Pizza Street<br />Food City, FC 12345</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
