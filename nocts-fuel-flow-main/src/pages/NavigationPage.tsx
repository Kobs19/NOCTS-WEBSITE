import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, Fuel, BarChart3 } from "lucide-react";
import { authService } from "@/services/authService";

const NavigationPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  const handleFuelActivation = () => {
    navigate("/dashboard");
  };

  const handleMonthlyReport = () => {
    navigate("/monthly-report");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
  <img 
    src="/only logo.png" 
    alt="NOCTS Logo" 
    className="w-full h-full object-cover" 
  />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">NOCTS Admin Page</h1>
            </div>
          </div>
          <Button variant="destructive" size="lg" onClick={handleLogout}>
            <LogOut className="mr-2 h-5 w-5" />
            Log Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              What would you like to do?
            </h2>
          </div>

          <div className="space-y-6">
            {/* Activate Fuel Pump Card */}
            <Card 
              className="bg-surface-elevated border-border hover:bg-surface cursor-pointer transition-all duration-200 hover:shadow-elevated"
              onClick={handleFuelActivation}
            >
              <CardContent className="p-8">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Fuel className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-foreground">
                      Activate fuel pump
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      Control fuel dispensing and process customer transactions
                    </p>
                  </div>
                  <div className="text-muted-foreground">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* View Monthly Report Card */}
            <Card 
              className="bg-surface-elevated border-border hover:bg-surface cursor-pointer transition-all duration-200 hover:shadow-elevated"
              onClick={handleMonthlyReport}
            >
              <CardContent className="p-8">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-info/10 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-info" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-foreground">
                      View monthly report
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      Access sales data and performance analytics
                    </p>
                  </div>
                  <div className="text-muted-foreground">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NavigationPage;