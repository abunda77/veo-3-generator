'use server';

/**
 * @fileOverview AI-powered tool to enhance prompt quality for Google Veo standards.
 *
 * - enhancePromptQuality - Enhances the given prompt to align with Google Veo standards.
 * - EnhancePromptQualityInput - Input type for the enhancePromptQuality function.
 * - EnhancePromptQualityOutput - Return type for the enhancePromptQuality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhancePromptQualityInputSchema = z.object({
  prompt: z.string().describe('The prompt to be enhanced.'),
});
export type EnhancePromptQualityInput = z.infer<typeof EnhancePromptQualityInputSchema>;

const EnhancePromptQualityOutputSchema = z.object({
  enhancedPrompt: z.string().describe('The enhanced prompt aligned with Google Veo standards.'),
  explanation: z.string().describe('Explanation of the enhancements made.'),
});
export type EnhancePromptQualityOutput = z.infer<typeof EnhancePromptQualityOutputSchema>;

export async function enhancePromptQuality(input: EnhancePromptQualityInput): Promise<EnhancePromptQualityOutput> {
  return enhancePromptQualityFlow(input);
}

const enhancePromptQualityPrompt = ai.definePrompt({
  name: 'enhancePromptQualityPrompt',
  input: {schema: EnhancePromptQualityInputSchema},
  output: {schema: EnhancePromptQualityOutputSchema},
  prompt: `You are an AI prompt enhancement tool designed to improve prompts to meet Google Veo standards.

  Analyze the following prompt and provide an enhanced version that aligns with Google Veo's best practices for video generation.
  Explain the changes you made and why they improve the prompt.

  Original Prompt: {{{prompt}}}
  `,
});

const enhancePromptQualityFlow = ai.defineFlow(
  {
    name: 'enhancePromptQualityFlow',
    inputSchema: EnhancePromptQualityInputSchema,
    outputSchema: EnhancePromptQualityOutputSchema,
  },
  async input => {
    const {output} = await enhancePromptQualityPrompt(input);
    return output!;
  }
);
