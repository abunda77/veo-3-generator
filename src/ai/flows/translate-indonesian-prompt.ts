// This is an autogenerated file from Firebase Studio.

'use server';

/**
 * @fileOverview Automatically translates an Indonesian prompt into English for use with AI video generation tools.
 *
 * - translateIndonesianPrompt - A function that translates the Indonesian prompt.
 * - TranslateIndonesianPromptInput - The input type for the translateIndonesianPrompt function.
 * - TranslateIndonesianPromptOutput - The return type for the translateIndonesianPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateIndonesianPromptInputSchema = z.object({
  subject: z.string().describe('The subject of the video prompt in Indonesian.'),
  action: z.string().describe('The action taking place in the video in Indonesian.'),
  expression: z.string().describe('The expression or emotion in the video in Indonesian.'),
  place: z.string().describe('The location or setting of the video in Indonesian.'),
  time: z.string().describe('The time or duration of the video in Indonesian.'),
  cameraMovement: z.string().describe('The camera movement in the video in Indonesian.'),
  lighting: z.string().describe('The lighting style of the video in Indonesian.'),
  videoStyle: z.string().describe('The overall style of the video in Indonesian.'),
  videoMood: z.string().describe('The mood or atmosphere of the video in Indonesian.'),
  soundMusic: z.string().describe('The sound or music in the video in Indonesian.'),
  spokenSentence: z.string().describe('Any spoken sentence or dialogue in Indonesian.'),
  additionalDetails: z.string().describe('Any additional details for the video in Indonesian.'),
});
export type TranslateIndonesianPromptInput = z.infer<typeof TranslateIndonesianPromptInputSchema>;

const TranslateIndonesianPromptOutputSchema = z.object({
  englishPrompt: z.string().describe('The translated English prompt.'),
});
export type TranslateIndonesianPromptOutput = z.infer<typeof TranslateIndonesianPromptOutputSchema>;

export async function translateIndonesianPrompt(
  input: TranslateIndonesianPromptInput
): Promise<TranslateIndonesianPromptOutput> {
  return translateIndonesianPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateIndonesianPromptPrompt',
  input: {schema: TranslateIndonesianPromptInputSchema},
  output: {schema: TranslateIndonesianPromptOutputSchema},
  prompt: `Translate the following Indonesian prompt into English:

Subject: {{{subject}}}
Action: {{{action}}}
Expression: {{{expression}}}
Place: {{{place}}}
Time: {{{time}}}
Camera Movement: {{{cameraMovement}}}
Lighting: {{{lighting}}}
Video Style: {{{videoStyle}}}
Video Mood: {{{videoMood}}}
Sound/Music: {{{soundMusic}}}
Spoken Sentence: {{{spokenSentence}}}
Additional Details: {{{additionalDetails}}}`,
});

const translateIndonesianPromptFlow = ai.defineFlow(
  {
    name: 'translateIndonesianPromptFlow',
    inputSchema: TranslateIndonesianPromptInputSchema,
    outputSchema: TranslateIndonesianPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
