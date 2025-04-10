
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="h-16 w-16 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 text-gray-900">404</h1>
          <p className="text-xl text-gray-700 mb-6">
            Oops! The page you're looking for cannot be found.
          </p>
          <p className="mb-8 text-gray-600">
            The page you are trying to access might have been removed, had its
            name changed, or is temporarily unavailable.
          </p>
          <Button asChild className="bg-bank-primary hover:bg-bank-primary/90">
            <Link to="/">
              Return Home
            </Link>
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
