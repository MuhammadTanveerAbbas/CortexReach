
'use server';

/**
 * @fileOverview An AI agent for rating the effectiveness of an email.
 *
 * - rateEmailEffectiveness - A function that rates the effectiveness of an email.
 * - RateEmailEffectivenessInput - The input type for the rateEmailEffectiveness function.
 * - RateEmailEffectivenessOutput - The return type for the rateEmailEffectiveness function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RateEmailEffectivenessInputSchema = z.object({
  emailContent: z.string().describe('The content of the email to be rated, including subject and body.'),
  targetAudience: z.string().describe('The job title or role of the target audience for the email.'),
  goal: z.string().describe('The primary goal of the email (e.g., to get a reply, to schedule a meeting, to drive a click).'),
});
export type RateEmailEffectivenessInput = z.infer<typeof RateEmailEffectivenessInputSchema>;

const RateEmailEffectivenessOutputSchema = z.object({
  effectivenessScore: z.number().describe('A score from 0 to 100 representing the predicted effectiveness of the email, where 100 is perfect.'),
  engagementPredictions: z.object({
    openRate: z.number().describe('The predicted open rate of the email (as a percentage, e.g., 45.5 for 45.5%).'),
    clickThroughRate: z.number().describe('The predicted click through rate of the email (as a percentage).'),
    conversionRate: z.number().describe('The predicted conversion rate of the email (as a percentage, based on the stated goal).'),
  }).describe('Predictions of key engagement metrics for the email.'),
  suggestions: z.array(z.string()).describe('A list of specific, actionable suggestions for improving the email, phrased as clear instructions.'),
});
export type RateEmailEffectivenessOutput = z.infer<typeof RateEmailEffectivenessOutputSchema>;

export async function rateEmailEffectiveness(input: RateEmailEffectivenessInput): Promise<RateEmailEffectivenessOutput> {
  try {
    return await rateEmailEffectivenessFlow(input);
  } catch (error) {
    console.error('Error in rateEmailEffectiveness flow:', error);
    throw new Error('Failed to rate email effectiveness. Please try again later.');
  }
}

const prompt = ai.definePrompt({
  name: 'rateEmailEffectivenessPrompt',
  input: {schema: RateEmailEffectivenessInputSchema},
  output: {schema: RateEmailEffectivenessOutputSchema},
  prompt: `You are a world class copywriter and an expert email marketing analyst. Your task is to critically evaluate the provided email based on its content, target audience, and stated goal. Provide a comprehensive, data driven analysis to help the user dramatically improve its performance.

  **Email Content to Analyze:**
  {{{emailContent}}}

  **Target Audience:** {{{targetAudience}}}
  **Primary Goal:** {{{goal}}}

  **Your Analysis Must Include:**

  1.  **Effectiveness Score (0-100):** Provide a precise score reflecting the email's likelihood of achieving its goal. A score of 0 is a complete failure, and 100 is a guaranteed success. Be critical and justify your score based on copywriting best practices.

  2.  **Engagement Predictions (%):**
      - Predict the Open Rate based on the subject line's appeal.
      - Predict the Click Through Rate based on the CTA's clarity and relevance.
      - Predict the Conversion Rate based on the overall persuasiveness and alignment with the goal.

  3.  **Actionable Improvement Suggestions:**
      - Provide a list of 3-5 concise, high-impact suggestions for improvement.
      - Each suggestion must be a single, direct sentence.
      - Focus only on the most critical changes that will increase reply rates.
      - No fluff or filler. Be direct and prescriptive.
      - **CRITICAL:** Do not use bullet points, hyphens, or em dashes in any of your generated text. The entire output must be well structured paragraphs or lists.

  Evaluate the email holistically and provide an honest, expert assessment.
`,
});

const rateEmailEffectivenessFlow = ai.defineFlow(
  {
    name: 'rateEmailEffectivenessFlow',
    inputSchema: RateEmailEffectivenessInputSchema,
    outputSchema: RateEmailEffectivenessOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI model failed to generate a response.");
    }
    return output;
  }
);
