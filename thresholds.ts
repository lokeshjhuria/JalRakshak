export const WATER_THRESHOLDS = {
  ph: { min: 6.5, max: 8.5 },
  turbidity: { max: 5 },
  tds: { max: 500 }
} as const;

export type WaterStatus = 'safe' | 'warning' | 'critical';
