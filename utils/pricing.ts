// Pricing utilities for Phoenix Automation

export const HOURLY_RATE = 700; // R700 per hour
export const MATERIAL_MARKUP = 0.30; // 30% markup
export const DAILY_TRAVEL_COST = 300; // R300 per day

export interface MaterialItem {
  name: string;
  quantity: number;
  unitPrice: number;
  source?: string;
}

export interface JobEstimate {
  laborHours: number;
  materials: MaterialItem[];
  includeTravel: boolean;
}

export interface QuoteBreakdown {
  laborCost: number;
  materialsCost: number;
  materialsWithMarkup: number;
  travelCost: number;
  totalCost: number;
  breakdown: string;
}

export function calculateQuote(estimate: JobEstimate): QuoteBreakdown {
  // Calculate labor cost
  const laborCost = estimate.laborHours * HOURLY_RATE;

  // Calculate materials cost
  const materialsCost = estimate.materials.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0
  );

  // Apply 30% markup to materials
  const materialsWithMarkup = materialsCost * (1 + MATERIAL_MARKUP);

  // Add travel cost if applicable
  const travelCost = estimate.includeTravel ? DAILY_TRAVEL_COST : 0;

  // Calculate total
  const totalCost = laborCost + materialsWithMarkup + travelCost;

  // Create detailed breakdown
  const breakdown = formatQuoteBreakdown({
    laborCost,
    materialsCost,
    materialsWithMarkup,
    travelCost,
    totalCost,
    laborHours: estimate.laborHours,
    materials: estimate.materials,
  });

  return {
    laborCost,
    materialsCost,
    materialsWithMarkup,
    travelCost,
    totalCost,
    breakdown,
  };
}

function formatQuoteBreakdown(data: {
  laborCost: number;
  materialsCost: number;
  materialsWithMarkup: number;
  travelCost: number;
  totalCost: number;
  laborHours: number;
  materials: MaterialItem[];
}): string {
  let breakdown = `**Quote Breakdown:**\n\n`;

  // Labor
  breakdown += `**Labor:** ${data.laborHours} hour${data.laborHours !== 1 ? 's' : ''} = R ${data.laborCost.toFixed(2)}\n\n`;

  // Materials
  if (data.materials.length > 0) {
    breakdown += `**Materials:**\n`;
    data.materials.forEach((item) => {
      const itemTotal = item.quantity * item.unitPrice;
      breakdown += `- ${item.name}: ${item.quantity} × R ${item.unitPrice.toFixed(2)} = R ${itemTotal.toFixed(2)}`;
      if (item.source) {
        breakdown += ` (${item.source})`;
      }
      breakdown += `\n`;
    });
    breakdown += `\nSubtotal: R ${data.materialsCost.toFixed(2)}\n`;
    breakdown += `With 30% markup: R ${data.materialsWithMarkup.toFixed(2)}\n\n`;
  }

  // Travel
  if (data.travelCost > 0) {
    breakdown += `**Travel Cost:** R ${data.travelCost.toFixed(2)}\n\n`;
  }

  // Total
  breakdown += `**TOTAL ESTIMATE: R ${data.totalCost.toFixed(2)}**\n\n`;
  breakdown += `*Note: This is an estimate based on current market prices. For an accurate quote, please click "Request a Quote" for a formal consultation.*`;

  return breakdown;
}

export function formatCurrency(amount: number): string {
  return `R ${amount.toFixed(2)}`;
}
