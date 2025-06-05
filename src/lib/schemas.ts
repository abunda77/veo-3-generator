import { z } from "zod";

export const IndonesianPromptSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  action: z.string().min(1, "Action is required"),
  expression: z.string().optional(),
  place: z.string().optional(),
  time: z.string().optional(),
  cameraMovement: z.string().optional(),
  lighting: z.string().optional(),
  videoStyle: z.string().optional(),
  videoMood: z.string().optional(),
  soundMusic: z.string().optional(),
  spokenSentence: z.string().optional(),
  additionalDetails: z.string().optional(),
});

export type IndonesianPromptFormData = z.infer<typeof IndonesianPromptSchema>;

export const defaultIndonesianPromptValues: IndonesianPromptFormData = {
  subject: "",
  action: "",
  expression: "",
  place: "",
  time: "",
  cameraMovement: "",
  lighting: "",
  videoStyle: "",
  videoMood: "",
  soundMusic: "",
  spokenSentence: "",
  additionalDetails: "",
};
