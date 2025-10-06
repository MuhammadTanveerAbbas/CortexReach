
'use server';

/**
 * @fileOverview Generates personalized cold emails using AI.
 *
 * - generatePersonalizedEmails - A function that generates personalized cold emails.
 * - GeneratePersonalizedEmailsInput - The input type for the generatePersonalizedEmails function.
 * - GeneratePersonalizedEmailsOutput - The return type for the generatePersonalizedEmails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedEmailsInputSchema = z.object({
  prospectName: z.string().describe('The name of the prospect.'),
  prospectCompany: z.string().describe('The company of the prospect.'),
  prospectJobTitle: z.string().describe('The job title of the prospect.'),
  emailContext: z.string().describe('Information about the prospect to personalize the email.'),
});
export type GeneratePersonalizedEmailsInput = z.infer<
  typeof GeneratePersonalizedEmailsInputSchema
>;

const GeneratePersonalizedEmailsOutputSchema = z.object({
  subjectLine: z.string().describe('The subject line of the email.'),
  body: z.string().describe('The body of the email.'),
});
export type GeneratePersonalizedEmailsOutput = z.infer<
  typeof GeneratePersonalizedEmailsOutputSchema
>;

export async function generatePersonalizedEmails(
  input: GeneratePersonalizedEmailsInput
): Promise<GeneratePersonalizedEmailsOutput> {
  try {
    return await generatePersonalizedEmailsFlow(input);
  } catch (error) {
    console.error('Error in generatePersonalizedEmails flow:', error);
    // Return a structured error or re-throw a custom error
    throw new Error('Failed to generate personalized email. Please try again later.');
  }
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedEmailsPrompt',
  input: {schema: GeneratePersonalizedEmailsInputSchema},
  output: {schema: GeneratePersonalizedEmailsOutputSchema},
  prompt: `You are a world class cold email copywriter and an expert in generating high reply rate emails. Your task is to write a compelling, well structured, and hyper personalized email based on the provided prospect information. The email should sound authentic, avoid corporate jargon, and be detailed enough to show genuine effort while remaining concise.

  **Prospect Information:**
  - **Name:** {{{prospectName}}}
  - **Company:** {{{prospectCompany}}}
  - **Job Title:** {{{prospectJobTitle}}}
  - **Context/Talking Points:** {{#if emailContext}}{{{emailContext}}}{{else}}No additional context provided.{{/if}}

  **Follow these rules meticulously:**

  1.  **Subject Line:**
      - Craft a captivating and intriguing subject line.
      - **CRITICAL:** The first letter of the subject line MUST be capitalized.
      - You may add a single, relevant emoji at the beginning of the subject line to make it stand out, but use it sparingly and professionally.
      - Keep it short and feel like an internal message from a colleague.
      - Absolutely NO generic, salesy phrases like "Quick question," or "Meeting request."
      - Personalize it based on the context if a strong hook exists.

  2.  **Opening:**
      - Begin with a highly personalized opening that builds immediate rapport and demonstrates research.
      - Directly reference the specific context provided (e.g., a conference meeting, a shared interest from their bio, or recent company news). Don't just mention it; connect it to your reason for outreach.

  3.  **Value Proposition:**
      - Clearly and concisely articulate the unique value you offer.
      - Connect your solution directly to a probable challenge or goal relevant to their specific role and company. Frame it as a direct benefit to them.
      - Example: Instead of "Our tool does X," say "For a {{{prospectJobTitle}}} at a company like {{{prospectCompany}}}, managing [problem] can be a challenge. Our solution helps by..."

  4.  **Call to Action (CTA):**
      - Use a single, clear, and low friction call to action.
      - The goal is to start a conversation, not to book a meeting immediately.
      - Ask an interest based question like, "Is addressing [specific problem] a priority for your team at {{{prospectCompany}}} currently?" or "Would a solution for [challenge] be helpful for your Q3 goals?".

  5.  **Tone and Style:**
      - Maintain a natural, conversational, and professional tone.
      - Keep sentences and paragraphs short for readability. The ideal length is 2-3 short paragraphs.
      - **CRITICAL:** Do not use bullet points, hyphens, em dashes, or numbered lists in any generated text. The entire email body must be in well structured paragraphs.

  Based on these rules, generate the subject line and email body.
  `,
});

const generatePersonalizedEmailsFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedEmailsFlow',
    inputSchema: GeneratePersonalizedEmailsInputSchema,
    outputSchema: GeneratePersonalizedEmailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI model failed to generate a response.");
    }
    return output;
  }
);
