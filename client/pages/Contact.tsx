import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Clock, Phone, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 space-y-12">
        <div className="text-center space-y-3">
          <Badge className="bg-pizza-600">Get in Touch</Badge>
          <h1 className="text-4xl font-bold">Contact PizzaHub</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Have a question, feedback, or special request? We'd love to hear from you. Reach us via the form or through our direct channels.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Store Info */}
          <div className="space-y-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Direct Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-muted-foreground group">
                  <div className="bg-muted p-3 rounded-full group-hover:bg-pizza-100 group-hover:text-pizza-600 transition-colors">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <span>(555) 123-4567</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground group">
                  <div className="bg-muted p-3 rounded-full group-hover:bg-pizza-100 group-hover:text-pizza-600 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <span>hello@pizzahub.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Location & Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 text-muted-foreground group">
                  <div className="bg-muted p-3 rounded-full group-hover:bg-pizza-100 group-hover:text-pizza-600 transition-colors mt-1">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Address</p>
                    <span>123 Pizza Street<br />Food City, FC 12345</span>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-muted-foreground group">
                  <div className="bg-muted p-3 rounded-full group-hover:bg-pizza-100 group-hover:text-pizza-600 transition-colors mt-1">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Store Hours</p>
                    <p>Mon - Fri: 11:00 AM - 10:00 PM</p>
                    <p>Sat - Sun: 11:00 AM - 11:30 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="hover:shadow-md transition-shadow border-pizza-200">
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>Fill out the form below and our team will be in touch shortly.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Your message here..." className="min-h-[120px]" required />
                </div>
                <Button type="submit" className="w-full bg-pizza-600 hover:bg-pizza-700" disabled={loading}>
                  {loading ? "Sending..." : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
