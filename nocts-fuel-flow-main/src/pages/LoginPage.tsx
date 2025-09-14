import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import petrolStationBg from "@/assets/petrol-station-bg.jpg";

const LoginPage = () => {
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!staffId || !password) {
      toast({
        title: "Error",
        description: "Please enter both Staff ID and Password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await authService.login(staffId, password);
      if (result.success) {
        toast({
          title: "Login Successful",
          description: `Welcome, ${result.user?.name}`,
        });
        navigate("/navigation");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Connection failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(${petrolStationBg})`,
      }}
    >
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      
      <Card className="w-full max-w-md mx-4 relative z-10 bg-card/90 backdrop-blur-md border-border shadow-elevated">
        <CardHeader className="text-center pb-8">
<div className="mx-auto -mb-10 w-64 h-64 rounded-full overflow-hidden flex items-center justify-center">
  <img 
    src="/only logo.png" 
    alt="NOCTS Logo" 
    className="w-full h-full object-cover" 
  />
</div>

          <CardTitle className="text-3xl font-bold text-foreground !-mt-4">
            NOCTS Admin
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Staff Authentication Portal
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="staffId" className="text-sm font-medium text-foreground">
                Staff ID
              </label>
              <Input
                id="staffId"
                type="text"
                placeholder="Enter your staff ID"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="h-12 text-lg"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-lg"
                disabled={isLoading}
              />
            </div>
            
            <Button
              type="submit"
              variant="kiosk"
              size="kiosk"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;