'use server';

/**
 * @fileOverview This file defines a Genkit flow to explain the headache and migraine risk levels.
 *
 * - `explainRiskLevels` - A function that takes EEG bands and heart rate data as input and returns an explanation of the headache and migraine risk levels.
 * - `ExplainRiskLevelsInput` - The input type for the `explainRiskLevels` function.
 * - `ExplainRiskLevelsOutput` - The return type for the `explainRiskLevels` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainRiskLevelsInputSchema = z.object({
  delta: z.number().describe('Delta EEG band value.'),
  theta: z.number().describe('Theta EEG band value.'),
  lowAlpha: z.number().describe('Low Alpha EEG band value.'),
  highAlpha: z.number().describe('High Alpha EEG band value.'),
  highBeta: z.number().describe('High Beta EEG band value.'),
  highGamma: z.number().describe('High Gamma EEG band value.'),
  heartRate: z.number().describe('Heart rate value.'),
  headacheRisk: z.number().describe('Headache risk value (0-100).'),
  migraineRisk: z.number().describe('Migraine risk value (0-100).'),
});
export type ExplainRiskLevelsInput = z.infer<typeof ExplainRiskLevelsInputSchema>;

const ExplainRiskLevelsOutputSchema = z.object({
  explanation: z.string().describe('Explanation of the headache and migraine risk levels based on the input data.'),
});
export type ExplainRiskLevelsOutput = z.infer<typeof ExplainRiskLevelsOutputSchema>;

export async function explainRiskLevels(input: ExplainRiskLevelsInput): Promise<ExplainRiskLevelsOutput> {
  return explainRiskLevelsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainRiskLevelsPrompt',
  input: {schema: ExplainRiskLevelsInputSchema},
  output: {schema: ExplainRiskLevelsOutputSchema},
  prompt: `You are a medical expert analyzing biosignal data to explain headache and migraine risk levels to users.\n\n  Based on the following EEG band values and heart rate data, explain why the headache risk is {{{headacheRisk}}}% and the migraine risk is {{{migraineRisk}}}%. Keep the explanation concise and easy to understand.  Specifically mention which EEG bands (delta, theta, alpha, beta, gamma) and heart rate are contributing to the current risk levels.\n\n  EEG Bands:\n  - Delta: {{{delta}}}\n  - Theta: {{{theta}}}\n  - Low Alpha: {{{lowAlpha}}}\n  - High Alpha: {{{highAlpha}}}\n  - High Beta: {{{highBeta}}}\n  - High Gamma: {{{highGamma}}}\n  Heart Rate: {{{heartRate}}}\n\n  Explanation: `,
});

const explainRiskLevelsFlow = ai.defineFlow(
  {
    name: 'explainRiskLevelsFlow',
    inputSchema: ExplainRiskLevelsInputSchema,
    outputSchema: ExplainRiskLevelsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
