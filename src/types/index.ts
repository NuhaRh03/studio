export interface DevicePythonDataPoint {
  id: string;
  ax: number;
  ay: number;
  az: number;
  gx: number;
  gy: number;
  gz: number;
  delta: number;
  theta: number;
  lowAlpha: number;
  highAlpha: number;
  highBeta: number;
  highGamma: number;
  heartRate: number;
  temperature: number;
  timestamp: number;
}
