import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { LogOut, ArrowLeft } from "lucide-react";
import Keypad from "@/components/Keypad";
import PumpSelector from "@/components/PumpSelector";
import BarcodeInput from "@/components/BarcodeInput";
import { fuelService } from "@/services/fuelService";
import { authService } from "@/services/authService";
import { transactionService } from "@/services/transactionService";

const FuelActivationPage = () => {
  const [amount, setAmount] = useState("");
  const [selectedPump, setSelectedPump] = useState<number | null>(null);
  const [barcode, setBarcode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  const handleBack = () => {
    navigate("/navigation");
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const handlePumpSelect = (pumpNumber: number) => {
    setSelectedPump(pumpNumber);
  };

  const handleBarcodeChange = (value: string) => {
    setBarcode(value);
  };

  const handleContinue = async () => {
    if (!amount || !selectedPump) {
      toast({
        title: "Missing Information",
        description: "Please enter amount and select pump number",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const numericAmount = parseFloat(amount);

      const result = await fuelService.activatePump({
        pumpNumber: selectedPump,
        amount: numericAmount,
        barcode,
        discountApplied: !!barcode,
      });

      if (result.success) {
      const fuelLiters = result.fuelLiters ?? 0;
      const subsidyLiters = result.subsidyLiters ?? 0;

      // Determine discountApplied from the activation result, NOT just presence of barcode.
      // Use a tiny epsilon in case of floating rounding errors.
      const discountApplied = (subsidyLiters > 0.0001) || ((result.discountPercent ?? 0) > 0);

      // Persist transaction (subsidy in liters)
      transactionService.addTransaction({
        transactionId: result.transactionId,
        pumpNumber: selectedPump,
        amount: numericAmount,
        barcode,
        discountApplied,
        fuelLiters,
        subsidyLiters,
        subsidyType: result.subsidyType,
        discountPercent: result.discountPercent,
        pricePerLiter: result.pricePerLiter,
      });

  toast({
    title: "Pump Activated",
    description: `Pump ${selectedPump} activated — Dispensed ${fuelLiters.toFixed(2)} ℓ (Subsidy: ${subsidyLiters > 0 ? subsidyLiters.toFixed(2) + " ℓ" : "0.00 ℓ"})`,
  });

        // Reset form
        setAmount("");
        setSelectedPump(null);
        setBarcode("");
      } else {
        toast({
          title: "Activation Failed",
          description: result.message || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "System error. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">N</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">NOCTS Admin</h1>
              <p className="text-sm text-muted-foreground">Fuel Pump Control</p>
            </div>
          </div>
          <Button variant="destructive" size="lg" onClick={handleLogout}>
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Amount Entry */}
            <div className="space-y-6">
              <Card className="bg-surface-elevated border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Fuel Amount (RM)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-primary mb-2">
                      RM {amount || "0.00"}
                    </div>
                    <p className="text-muted-foreground">Enter amount to dispense</p>
                  </div>
                  <Keypad onValueChange={handleAmountChange} />
                </CardContent>
              </Card>

              {/* Barcode Scanner */}
              <Card className="bg-surface-elevated border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">User Barcode</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarcodeInput value={barcode} onChange={handleBarcodeChange} />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Pump Selection */}
            <div className="space-y-6">
              <Card className="bg-surface-elevated border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Select Fuel Pump</CardTitle>
                </CardHeader>
                <CardContent>
                  <PumpSelector
                    selectedPump={selectedPump}
                    onPumpSelect={handlePumpSelect}
                  />
                </CardContent>
              </Card>

              {/* Continue Button */}
              <Card className="bg-surface-elevated border-border">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Amount:{" "}
                        <span className="text-primary font-medium">
                          RM {amount || "0.00"}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Pump:{" "}
                        <span className="text-primary font-medium">
                          {selectedPump ? `#${selectedPump}` : "Not selected"}
                        </span>
                      </p>
                      {barcode && (
                        <p className="text-sm text-muted-foreground">
                          Barcode:{" "}
                          <span className="text-success font-medium">Scanned</span>
                        </p>
                      )}
                    </div>
                    <Button
                      variant="kiosk"
                      size="kiosk"
                      className="w-full"
                      onClick={handleContinue}
                      disabled={isProcessing || !amount || !selectedPump}
                    >
                      {isProcessing ? "Processing..." : "Continue"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FuelActivationPage;
