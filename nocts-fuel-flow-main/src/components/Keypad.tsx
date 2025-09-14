import { useState } from "react";
import { Button } from "@/components/ui/button";

interface KeypadProps {
  onValueChange: (value: string) => void;
}

const Keypad = ({ onValueChange }: KeypadProps) => {
  const [value, setValue] = useState("");

  const handleNumberClick = (num: string) => {
    const newValue = value + num;
    setValue(newValue);
    onValueChange(newValue);
  };

  const handleDecimalClick = () => {
    if (!value.includes(".")) {
      const newValue = value + ".";
      setValue(newValue);
      onValueChange(newValue);
    }
  };

  const handleClear = () => {
    setValue("");
    onValueChange("");
  };

  const handleBackspace = () => {
    const newValue = value.slice(0, -1);
    setValue(newValue);
    onValueChange(newValue);
  };

  const buttons = [
    { label: "1", action: () => handleNumberClick("1") },
    { label: "2", action: () => handleNumberClick("2") },
    { label: "3", action: () => handleNumberClick("3") },
    { label: "4", action: () => handleNumberClick("4") },
    { label: "5", action: () => handleNumberClick("5") },
    { label: "6", action: () => handleNumberClick("6") },
    { label: "7", action: () => handleNumberClick("7") },
    { label: "8", action: () => handleNumberClick("8") },
    { label: "9", action: () => handleNumberClick("9") },
    { label: "Clear", action: handleClear, className: "bg-destructive hover:bg-destructive/80 text-destructive-foreground" },
    { label: "0", action: () => handleNumberClick("0") },
    { label: ".", action: handleDecimalClick },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant="pump"
          size="kiosk"
          className={button.className}
          onClick={button.action}
        >
          {button.label}
        </Button>
      ))}
      <div className="col-span-3">
        <Button
          variant="secondary"
          size="kiosk"
          className="w-full"
          onClick={handleBackspace}
        >
          Backspace
        </Button>
      </div>
    </div>
  );
};

export default Keypad;