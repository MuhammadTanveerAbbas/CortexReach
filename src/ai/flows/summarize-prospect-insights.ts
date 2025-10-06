
'use server';

/**
 * @fileOverview Summarizes key insights about specific prospects for tailored outreach.
 *
 * - summarizeProspectInsights - A function that summarizes prospect insights.
 * - SummarizeProspectInsightsInput - The input type for the summarizeProspectInsights function.
 * - SummarizeProspectInsightsOutput - The return type for the summarizeProspectInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeProspectInsightsInputSchema = z.object({
  prospectDetails: z
    .string()
    .describe('Detailed information about the prospect, including their background, interests, recent activities, articles they have written, or social media posts.'),
});
export type SummarizeProspectInsightsInput = z.infer<typeof SummarizeProspectInsightsInputSchema>;

const SummarizeProspectInsightsOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary paragraph of the most important, actionable insights about the prospect for a sales outreach email.'),
});
export type SummarizeProspectInsightsOutput = z.infer<typeof SummarizeProspectInsightsOutputSchema>;

export async function summarizeProspectInsights(
  input: SummarizeProspectInsightsInput
): Promise<SummarizeProspectInsightsOutput> {
  try {
    return await summarizeProspectInsightsFlow(input);
  } catch (error) {
    console.error('Error in summarizeProspectInsights flow:', error);
    throw new Error('Failed to summarize prospect insights. Please try again later.');
  }
}

const prompt = ai.definePrompt({
  name: 'summarizeProspectInsightsPrompt',
  input: {schema: SummarizeProspectInsightsInputSchema},
  output: {schema: SummarizeProspectInsightsOutputSchema},
  prompt: `You are an expert sales development researcher and an expert copywriter. Your task is to analyze the provided prospect details and extract the most actionable insights that can be used to write a highly personalized cold email. Your focus is to find the perfect "hook."

  **Prospect Details:**
  {{{prospectDetails}}}

  **Instructions:**
  1.  Analyze all the provided details.
  2.  Identify the single most compelling piece of information that can serve as a conversation starter. This could be a recent achievement, a specific interest, a shared connection, a recently published article, or a strong opinion they expressed.
  3.  Synthesize this key insight into a concise, well written summary paragraph.
  4.  The output should be directly usable by a salesperson as talking points for their email.
  5.  **CRITICAL:** Do not use bullet points, hyphens, or em dashes. The entire output must be a single paragraph.

  **Actionable Summary:**`,
});

const summarizeProspectInsightsFlow = ai.defineFlow(
  {
    name: 'summarizeProspectInsightsFlow',
    inputSchema: SummarizeProspectInsightsInputSchema,
    outputSchema: SummarizeProspectInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI model failed to generate a response.");
    }
    return output;
  }
);
