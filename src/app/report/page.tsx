'use client';

import React, { useState, useMemo } from 'react';
import { useDeviceData } from '@/hooks/use-device-data';
import { Button } from '@/components/ui/button';
import { computeStressLevel, analyzeSleepPatterns } from '@/lib/metrics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, FileDown, Brain, Heart, Activity, SmilePlus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

// Mock report output type
export type GenerateSessionReportOutput = {
  brainActivitySummary: string;
  heartAndTemperatureSummary: string;
  stressAndSleepSummary: string;
  sentimentAndEmotionalTrend: string;
  finalConclusion: string;
  recommendations: string;
};

// Mock report generation
async function generateSessionReport(
  input: any
): Promise<GenerateSessionReportOutput> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    brainActivitySummary: `Brain activity shows a predominance of alpha waves, suggesting a relaxed state for about 60% of the session. There were brief periods of higher beta activity, indicating focused attention.`,
    heartAndTemperatureSummary: `Heart rate was stable, averaging ${input.averageHeartRate.toFixed(
      0
    )} bpm. The range from ${input.minHeartRate.toFixed(0)} to ${input.maxHeartRate.toFixed(
      0
    )} bpm is within healthy limits for a resting state.`,
    stressAndSleepSummary: `The average stress level was low at ${input.averageStressLevel.toFixed(
      0
    )}%. The majority of the session was spent in an 'Awake' and relaxed state.`,
    sentimentAndEmotionalTrend: `Sentiment remained neutral throughout the session, with no significant emotional fluctuations detected.`,
    finalConclusion: `This was a calm and stable session, reflecting a good state of wellness. Key indicators for stress and physical health are all within optimal ranges.`,
    recommendations:
      '- Continue with current mindfulness or relaxation practices.\n- Ensure consistent sleep schedule to maintain low stress levels.\n- Monitor for any sharp increases in beta waves, which could indicate rising stress.',
  };
}


export default function ReportPage() {
  // Get the last 10 minutes of data (assuming 1 point every 2 seconds)
  const dataPoints = useDeviceData(300);
  const [report, setReport] = useState<GenerateSessionReportOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const sessionData = useMemo(() => {
    if (dataPoints.length < 2) return null;

    const sessionSlice = dataPoints.slice(-150); // Use last 5 mins (150 points)

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

    const heartRates = sessionSlice.map(p => p.heartRate);
    const stressLevels = sessionSlice.map(p => computeStressLevel(p.heartRate, p.highBeta, p.highGamma).level);

    return {
      averageHeartRate: avg(heartRates),
      minHeartRate: Math.min(...heartRates),
      maxHeartRate: Math.max(...heartRates),
      averageDelta: avg(sessionSlice.map(p => p.delta)),
      averageTheta: avg(sessionSlice.map(p => p.theta)),
      averageAlpha: avg(sessionSlice.map(p => p.lowAlpha) + sessionSlice.map(p => p.highAlpha)) / 2,
      averageBeta: avg(sessionSlice.map(p => p.highBeta)),
      averageGamma: avg(sessionSlice.map(p => p.highGamma)),
      averageStressLevel: avg(stressLevels),
      overallWellnessScore: 100 - avg(stressLevels), // simplified
      dominantSentiment: "Neutral", // placeholder
      dataForSleepAnalysis: sessionSlice.map(p => ({
        delta: p.delta, theta: p.theta, lowAlpha: p.lowAlpha, highAlpha: p.highAlpha, highBeta: p.highBeta, highGamma: p.highGamma,
      }))
    };
  }, [dataPoints]);

  const handleGenerateReport = async () => {
    if (!sessionData) return;
    setIsGenerating(true);
    setReport(null);
    try {
      const sleepAnalyses = sessionData.dataForSleepAnalysis.map(dp => analyzeSleepPatterns(dp));
      
      const sleepCases = sleepAnalyses.map(sa => sa!.case);
      const timeInStates = sleepCases.reduce((acc, c) => {
        acc[c] = (acc[c] || 0) + 2; // Assuming 2 seconds per data point
        return acc;
      }, {} as Record<string, number>);

      const reportData = {
        ...sessionData,
        timeInAwake: timeInStates['Awake'] || 0,
        timeInDrowsy: timeInStates['Drowsy'] || 0,
        timeInVerySleepy: timeInStates['Very sleepy'] || 0,
        timeInPossibleMicrosleepRisk: timeInStates['Possible microsleep risk'] || 0,
      };
      
      const result = await generateSessionReport(reportData);
      setReport(result);
    } catch (error) {
      console.error('Error generating report:', error);
      // You could use toast here to show an error
    } finally {
      setIsGenerating(false);
    }
  };
  
  const canGenerate = dataPoints.length > 10;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Session Report</h2>
            <p className="text-muted-foreground">
                Generate a summary of your recent activity.
            </p>
        </div>
        <Button onClick={handleGenerateReport} disabled={isGenerating || !canGenerate}>
          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Generate Report
        </Button>
      </div>
      {!canGenerate && (
        <Card className="text-center p-8">
            <CardTitle>Waiting for more data...</CardTitle>
            <CardDescription>A minimum amount of data is required to generate a report.</CardDescription>
        </Card>
      )}

      {isGenerating && <ReportSkeleton />}

      {report && (
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Wellness Report</CardTitle>
              <CardDescription>Summary of the last 5 minutes of your session.</CardDescription>
            </div>
            <Button variant="outline" disabled>
              <FileDown className="mr-2 h-4 w-4" />
              Export as PDF
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <ReportSection icon={<Brain className="h-5 w-5 text-primary" />} title="Brain Activity Summary" content={report.brainActivitySummary} />
            <Separator />
            <ReportSection icon={<Heart className="h-5 w-5 text-primary" />} title="Heart & Temperature Summary" content={report.heartAndTemperatureSummary} />
            <Separator />
            <ReportSection icon={<Activity className="h-5 w-5 text-primary" />} title="Stress & Sleep Summary" content={report.stressAndSleepSummary} />
            <Separator />
            <ReportSection icon={<SmilePlus className="h-5 w-5 text-primary" />} title="Sentiment & Emotional Trend" content={report.sentimentAndEmotionalTrend} />
            <Separator />
             <div className="space-y-2 rounded-lg bg-primary/10 p-4">
              <h3 className="font-semibold text-primary">Final Conclusion</h3>
              <p className="text-sm text-foreground/90">{report.finalConclusion}</p>
            </div>
            <div className="space-y-2 rounded-lg border border-dashed p-4">
              <h3 className="font-semibold">Recommendations</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{report.recommendations}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const ReportSection = ({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) => (
    <div className="grid grid-cols-[25px_1fr] items-start gap-4">
        {icon}
        <div className="space-y-1">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{content}</p>
        </div>
    </div>
)

const ReportSkeleton = () => (
    <Card className="w-full">
        <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Separator />
            <Skeleton className="h-20 w-full" />
            <Separator />
            <Skeleton className="h-20 w-full" />
            <Separator />
            <Skeleton className="h-20 w-full" />
        </CardContent>
    </Card>
)
