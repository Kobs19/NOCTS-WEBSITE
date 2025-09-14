// src/services/fuelService.ts

interface EligibilityResult {
  eligible: boolean;
  subsidyType: string;
  discountPercent: number;
  message: string;
}

interface ActivationRequest {
  pumpNumber: number;
  amount: number;   // RM
  barcode?: string;
  discountApplied?: boolean;
}

interface ActivationResult {
  success: boolean;
  transactionId?: string;
  message?: string;
  fuelLiters?: number;
  subsidyLiters?: number;
  pricePerLiter?: number;
  subsidyType?: string;
  discountPercent?: number;
}

class FuelService {
  private marketPrice = 3.40; // RM per liter
  private subsidizedPrice = 2.00; // RM per liter (example)

  async checkEligibility(barcode: string): Promise<EligibilityResult> {
    if (!barcode || barcode.trim() === "") {
      return {
        eligible: false,
        subsidyType: "No Fuel Subsidy",
        discountPercent: 0,
        message: "No barcode provided",
      };
    }

    const prefix = barcode.trim().charAt(0).toUpperCase();

    if (prefix === "E") {
      return {
        eligible: true,
        subsidyType: "Fuel Subsidy",
        discountPercent: Math.round(
          (1 - this.subsidizedPrice / this.marketPrice) * 100
        ),
        message: "Eligible for fuel subsidy",
      };
    }

    if (prefix === "I") {
      return {
        eligible: false,
        subsidyType: "No Fuel Subsidy",
        discountPercent: 0,
        message: "Not eligible for fuel subsidy",
      };
    }

    // fallback: unknown prefix → treat as ineligible
    return {
      eligible: false,
      subsidyType: "No Fuel Subsidy",
      discountPercent: 0,
      message: "Invalid barcode",
    };
  }

  async activatePump(request: ActivationRequest): Promise<ActivationResult> {
    try {
      const eligibility: EligibilityResult = request.barcode
        ? await this.checkEligibility(request.barcode)
        : {
            eligible: false,
            subsidyType: "No Fuel Subsidy",
            discountPercent: 0,
            message: "No subsidy",
          };

      let fuelLiters: number;
      let subsidyLiters = 0;
      let pricePerLiter = this.marketPrice;

      if (eligibility.eligible) {
        // Eligible → calculate with subsidized price
        pricePerLiter = this.subsidizedPrice;
        fuelLiters = request.amount / pricePerLiter;

        // subsidy in liters = difference between subsidized vs market liters
        subsidyLiters =
          fuelLiters - request.amount / this.marketPrice;
      } else {
        // Ineligible → normal price
        fuelLiters = request.amount / this.marketPrice;
      }

      return {
        success: true,
        transactionId: `TXN${Date.now()}${request.pumpNumber}`,
        message: `Pump ${request.pumpNumber} activated successfully`,
        fuelLiters,
        subsidyLiters,
        pricePerLiter,
        subsidyType: eligibility.subsidyType,
        discountPercent: eligibility.discountPercent,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to activate pump. Please try again.",
      };
    }
  }
}

export const fuelService = new FuelService();
