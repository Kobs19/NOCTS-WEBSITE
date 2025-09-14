import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScanLine, X } from "lucide-react";

interface BarcodeInputProps {
  value: string;
  onChange: (value: string) => void;
}

const BarcodeInput = ({ value, onChange }: BarcodeInputProps) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleScanClick = () => {
    setIsScanning(true);
    // Simulate barcode scanning
    setTimeout(() => {
      const mockBarcode = `BC${Date.now().toString().slice(-8)}`;
      onChange(mockBarcode);
      setIsScanning(false);
    }, 2000);
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Scan or enter barcode"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 text-lg pr-12"
          disabled={isScanning}
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-8 w-8 p-0"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        <Button
          variant="secondary"
          size="lg"
          onClick={handleScanClick}
          disabled={isScanning}
          className="w-full"
        >
          <ScanLine className="mr-2 h-5 w-5" />
          {isScanning ? "Scanning..." : "Scan Barcode"}
        </Button>
      </div>

      {value && (
        <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
          <p className="text-sm text-success font-medium">
            Barcode detected: {value}
          </p>
        </div>
      )}
    </div>
  );
};

export default BarcodeInput;