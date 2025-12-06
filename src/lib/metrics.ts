import type { DevicePythonDataPoint } from '@/types';

// Headache Risk Calculation
export function computeHeadacheRisk(data: DevicePythonDataPoint): { risk: number; label: string } {
  let risk = 0;
  // High theta and low alpha can be indicators
  risk += Math.max(0, (data.theta - 20) * 1.5);
  risk += Math.max(0, (15 - data.lowAlpha) * 1.5);
  // Elevated heart rate can contribute
  risk += Math.max(0, (data.heartRate - 85) * 1);
  risk = Math.min(100, Math.max(0, risk));

  let label = 'Low';
  if (risk > 66) label = 'High';
  else if (risk > 33) label = 'Moderate';

  return { risk, label };
}

// Migraine Risk Calculation
export function computeMigraineRisk(data: DevicePythonDataPoint): { risk: number; label: string } {
  let risk = 0;
  // High gamma and beta can be precursors
  risk += Math.max(0, (data.highGamma - 8) * 2.5);
  risk += Math.max(0, (data.highBeta - 10) * 2);
  // Significant changes in temperature
  // (This would require historical data, for now a simple check)
  if (data.temperature > 37.5 || data.temperature < 36.5) {
    risk += 10;
  }
  risk = Math.min(100, Math.max(0, risk));

  let label = 'Low';
  if (risk > 66) label = 'High';
  else if (risk > 33) label = 'Moderate';

  return { risk, label };
}

// Stress Level Calculation
export function computeStressLevel(heartRate: number, highBeta: number, highGamma: number): { level: number; label: string } {
  const hrScore = Math.min(50, Math.max(0, (heartRate - 70) * 2.5));
  const betaScore = Math.min(25, Math.max(0, (highBeta - 8) * 3));
  const gammaScore = Math.min(25, Math.max(0, (highGamma - 6) * 3));
  
  const level = Math.min(100, Math.max(0, hrScore + betaScore + gammaScore));
  
  let label = 'Calm';
  if (level > 70) label = 'High Stress';
  else if (level > 40) label = 'Mild Stress';

  return { level, label };
}

// Heart Health State
export function getHeartHealthState(heartRate: number): { label: string; color: string } {
  if (heartRate < 60) return { label: 'Too Low', color: 'text-blue-500' };
  if (heartRate > 100) return { label: 'Too High', color: 'text-destructive' };
  return { label: 'Normal', color: 'text-green-500' };
}

// Body Temperature State
export function getTempState(temperature: number): { label: string; color: string } {
  if (temperature > 37.5) return { label: 'Fever', color: 'text-destructive' };
  if (temperature > 37.2) return { label: 'Slightly Elevated', color: 'text-yellow-500' };
  return { label: 'Normal', color: 'text-green-500' };
}


// Sleep Analysis
export function analyzeSleepPatterns(data: Omit<DevicePythonDataPoint, 'id' | 'timestamp' | 'ax' | 'ay' | 'az' | 'gx' | 'gy' | 'gz' | 'heartRate' | 'temperature'>): { level: number; case: string } {
    const { delta, theta, lowAlpha, highAlpha, highBeta, highGamma } = data;

    const sleepinessScore = (delta * 0.4) + (theta * 0.3) - (highBeta * 0.15) - (highGamma * 0.15);
    const sleepLevel = Math.min(100, Math.max(0, sleepinessScore));

    let sleepCase = 'Awake';
    if (sleepLevel > 75) {
        sleepCase = 'Possible microsleep risk';
    } else if (sleepLevel > 50) {
        sleepCase = 'Very sleepy';
    } else if (sleepLevel > 25) {
        sleepCase = 'Drowsy';
    }

    return { level: Math.round(sleepLevel), case: sleepCase };
}


// Risk Explanation
export function explainRiskLevels(data: DevicePythonDataPoint & {headacheRisk: number, migraineRisk: number}): { explanation: string } {
    const { headacheRisk, migraineRisk, heartRate, theta, lowAlpha, highBeta, highGamma } = data;
    
    let explanation = `Your current risk levels have been calculated based on your biosignals.\n\n`;

    if (headacheRisk > 33) {
        explanation += `The headache risk of ${headacheRisk.toFixed(0)}% is elevated. `;
        if (theta > 20) explanation += `Elevated theta waves are a contributing factor. `;
        if (lowAlpha < 15) explanation += `Lower alpha waves are also playing a role. `;
        if (heartRate > 85) explanation += `A slightly increased heart rate is also a contributor. `;
    } else {
        explanation += `Your headache risk is low, which is great. `;
    }

    explanation += `\n`;

    if (migraineRisk > 33) {
        explanation += `The migraine risk of ${migraineRisk.toFixed(0)}% is elevated. `;
        if (highBeta > 10) explanation += `Increased high-beta wave activity is a key indicator. `;
        if (highGamma > 8) explanation += `High-gamma waves are also higher than usual. `;
    } else {
        explanation += `Your migraine risk is also low. `;
    }

    return { explanation };
}
