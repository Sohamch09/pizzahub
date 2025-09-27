import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, ArrowLeft, MessageCircle } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({ 
  title, 
  description = "This page is under construction. We're working hard to bring you an amazing experience!" 
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pizza-50 via-pizza-100 to-orange-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto bg-pizza-100 p-4 rounded-full w-fit">
              <Construction className="h-12 w-12 text-pizza-600" />
            </div>
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <CardDescription className="text-center">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>Want this page built out? Let me know what you'd like to see here!</p>
            </div>
            
            <div className="space-y-2">
              <Button asChild className="w-full bg-pizza-600 hover:bg-pizza-700">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/build-pizza">
                  Continue Building Pizza
                </Link>
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-center text-muted-foreground">
                <MessageCircle className="inline h-3 w-3 mr-1" />
                This is a placeholder page. Request specific content to complete it.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
