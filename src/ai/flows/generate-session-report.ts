// src/ai/flows/generate-session-report.ts
'use server';

/**
 * @fileOverview Generates a comprehensive session report based on biosignal data.
 *
 * - generateSessionReport - A function that generates the session report.
 * - GenerateSessionReportInput - The input type for the generateSessionReport function.
 * - GenerateSessionReportOutput - The return type for the generateSessionReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSessionReportInputSchema = z.object({
  averageHeartRate: z.number().describe('Average heart rate during the session.'),
  minHeartRate: z.number().describe('Minimum heart rate during the session.'),
  maxHeartRate: z.number().describe('Maximum heart rate during the session.'),
  averageDelta: z.number().describe('Average delta wave level during the session.'),
  averageTheta: z.number().describe('Average theta wave level during the session.'),
  averageAlpha: z.number().describe('Average alpha wave level during the session.'),
  averageBeta: z.number().describe('Average beta wave level during the session.'),
  averageGamma: z.number().describe('Average gamma wave level during the session.'),
  averageStressLevel: z.number().describe('Average stress level during the session.'),
  timeInAwake: z.number().describe('Time spent in awake state (seconds).'),
  timeInDrowsy: z.number().describe('Time spent in drowsy state (seconds).'),
  timeInVerySleepy: z.number().describe('Time spent in very sleepy state (seconds).'),
  timeInPossibleMicrosleepRisk: z.number().describe('Time spent in possible microsleep risk state (seconds).'),
  dominantSentiment: z.string().describe('Dominant sentiment during the session (Positive, Neutral, Negative).'),
  overallWellnessScore: z.number().describe('Overall wellness score for the session.'),
});

export type GenerateSessionReportInput = z.infer<typeof GenerateSessionReportInputSchema>;

const GenerateSessionReportOutputSchema = z.object({
  brainActivitySummary: z.string().describe('Summary of brain activity during the session.'),
  heartAndTemperatureSummary: z.string().describe('Summary of heart and temperature data during the session.'),
  stressAndSleepSummary: z.string().describe('Summary of stress and sleep patterns during the session.'),
  sentimentAndEmotionalTrend: z.string().describe('Summary of sentiment and emotional trends during the session.'),
  finalConclusion: z.string().describe('Final conclusion and overall assessment of the session.'),
  recommendations: z.string().describe('Textual recommendations based on the session data.'),
});

export type GenerateSessionReportOutput = z.infer<typeof GenerateSessionReportOutputSchema>;

export async function generateSessionReport(input: GenerateSessionReportInput): Promise<GenerateSessionReportOutput> {
  return generateSessionReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSessionReportPrompt',
  input: { schema: GenerateSessionReportInputSchema },
  output: { schema: GenerateSessionReportOutputSchema },
  prompt: `You are an AI expert in analyzing biosignal data and generating wellness reports.

  Based on the following session data, generate a comprehensive report with summaries for brain activity, heart and temperature, stress and sleep, and sentiment and emotional trends. Provide a final conclusion and actionable recommendations.

  Session Data:
  - Average Heart Rate: {{{averageHeartRate}}} bpm
  - Min Heart Rate: {{{minHeartRate}}} bpm
  - Max Heart Rate: {{{maxHeartRate}}} bpm
  - Average EEG Levels: Delta={{{averageDelta}}}, Theta={{{averageTheta}}}, Alpha={{{averageAlpha}}}, Beta={{{averageBeta}}}, Gamma={{{averageGamma}}}
  - Average Stress Level: {{{averageStressLevel}}}
  - Time in Sleep States: Awake={{{timeInAwake}}}s, Drowsy={{{timeInDrowsy}}}s, Very Sleepy={{{timeInVerySleepy}}}s, Possible Microsleep Risk={{{timeInPossibleMicrosleepRisk}}}s
  - Dominant Sentiment: {{{dominantSentiment}}}
  - Overall Wellness Score: {{{overallWellnessScore}}}

  Report Structure:
  1. Brain Activity Summary: Summarize the brain activity based on EEG levels.
  2. Heart & Temperature Summary: Summarize heart rate trends.
  3. Stress & Sleep Summary: Summarize stress and sleep patterns.
  4. Sentiment & Emotional Trend: Summarize the dominant sentiment and emotional trends.
  5. Final Conclusion: Provide an overall assessment of the session.
  6. Recommendations: Suggest actionable steps based on the data.

  Output format: JSON
  {
    "brainActivitySummary": "...",
    "heartAndTemperatureSummary": "...",
    "stressAndSleepSummary": "...",
    "sentimentAndEmotionalTrend": "...",
    "finalConclusion": "...",
    "recommendations": "..."
  }
  `,
});

const generateSessionReportFlow = ai.defineFlow(
  {
    name: 'generateSessionReportFlow',
    inputSchema: GenerateSessionReportInputSchema,
    outputSchema: GenerateSessionReportOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
