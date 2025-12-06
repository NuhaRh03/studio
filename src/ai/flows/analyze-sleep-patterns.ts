'use server';

/**
 * @fileOverview Analyzes sleep patterns based on EEG data and classifies sleep stages using LLM reasoning.
 *
 * - analyzeSleepPatterns - A function that analyzes sleep patterns and classifies sleep stages.
 * - AnalyzeSleepPatternsInput - The input type for the analyzeSleepPatterns function.
 * - AnalyzeSleepPatternsOutput - The return type for the analyzeSleepPatterns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSleepPatternsInputSchema = z.object({
  delta: z.number().describe('Delta EEG band value.'),
  theta: z.number().describe('Theta EEG band value.'),
  lowAlpha: z.number().describe('Low Alpha EEG band value.'),
  highAlpha: z.number().describe('High Alpha EEG band value.'),
  highBeta: z.number().describe('High Beta EEG band value.'),
  highGamma: z.number().describe('High Gamma EEG band value.'),
});

export type AnalyzeSleepPatternsInput = z.infer<typeof AnalyzeSleepPatternsInputSchema>;

const AnalyzeSleepPatternsOutputSchema = z.object({
  sleepLevel: z
    .number()
    .describe('Sleep level 0-100 (0 = fully awake, 100 = very sleepy).'),
  sleepCase: z
    .string()
    .describe(
      'Sleep case: Awake, Drowsy, Very sleepy, Possible microsleep risk.'
    ),
});

export type AnalyzeSleepPatternsOutput = z.infer<typeof AnalyzeSleepPatternsOutputSchema>;

export async function analyzeSleepPatterns(
  input: AnalyzeSleepPatternsInput
): Promise<AnalyzeSleepPatternsOutput> {
  return analyzeSleepPatternsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSleepPatternsPrompt',
  input: {schema: AnalyzeSleepPatternsInputSchema},
  output: {schema: AnalyzeSleepPatternsOutputSchema},
  prompt: `You are an expert in sleep analysis and can determine sleep level and sleep quality based on EEG data.

  Given the following EEG band values, determine the sleep level (0-100, 0 = fully awake, 100 = very sleepy) and classify the sleep stage as one of the following:
  Awake, Drowsy, Very sleepy, Possible microsleep risk.

  EEG Data:
  Delta: {{delta}}
  Theta: {{theta}}
  Low Alpha: {{lowAlpha}}
  High Alpha: {{highAlpha}}
  High Beta: {{highBeta}}
  High Gamma: {{highGamma}}

  Consider delta and theta waves to indicate sleepiness, and overall low activation to indicate fatigue. Use highBeta and highGamma as indicators of being awake.

  Ensure that the sleepLevel is a number between 0 and 100, and sleepCase is one of the allowed string values.

  Output:
  {
    "sleepLevel": "sleepLevel",
    "sleepCase": "sleepCase"
  }`,
});

const analyzeSleepPatternsFlow = ai.defineFlow(
  {
    name: 'analyzeSleepPatternsFlow',
    inputSchema: AnalyzeSleepPatternsInputSchema,
    outputSchema: AnalyzeSleepPatternsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
