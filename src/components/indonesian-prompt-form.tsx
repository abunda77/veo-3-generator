"use client";

import type { IndonesianPromptFormData } from "@/lib/schemas";
import { IndonesianPromptSchema, defaultIndonesianPromptValues } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface IndonesianPromptFormProps {
  onFormChange: (data: IndonesianPromptFormData) => void;
  isTranslating: boolean;
}

const formFields: Array<{ name: keyof IndonesianPromptFormData; label: string; placeholder: string; isTextarea?: boolean }> = [
  { name: "subject", label: "Subject", placeholder: "e.g., Seorang wanita muda" },
  { name: "action", label: "Action", placeholder: "e.g., berjalan di taman" },
  { name: "expression", label: "Expression", placeholder: "e.g., tersenyum bahagia" },
  { name: "place", label: "Place", placeholder: "e.g., taman kota yang ramai" },
  { name: "time", label: "Time", placeholder: "e.g., sore hari keemasan" },
  { name: "cameraMovement", label: "Camera Movement", placeholder: "e.g., close up, panning shot" },
  { name: "lighting", label: "Lighting", placeholder: "e.g., cahaya alami, dramatis" },
  { name: "videoStyle", label: "Video Style", placeholder: "e.g., sinematik, dokumenter" },
  { name: "videoMood", label: "Video Mood", placeholder: "e.g., ceria, melankolis" },
  { name: "soundMusic", label: "Sound/Music", placeholder: "e.g., musik instrumental yang menenangkan" },
  { name: "spokenSentence", label: "Spoken Sentence", placeholder: "e.g., 'Ini hari yang indah.'", isTextarea: true },
  { name: "additionalDetails", label: "Additional Details", placeholder: "e.g., Mengenakan gaun merah, ada anjing kecil berlarian.", isTextarea: true },
];

export function IndonesianPromptForm({ onFormChange, isTranslating }: IndonesianPromptFormProps) {
  const form = useForm<IndonesianPromptFormData>({
    resolver: zodResolver(IndonesianPromptSchema),
    defaultValues: defaultIndonesianPromptValues,
    mode: "onChange",
  });

  const watchedValues = form.watch();

  useEffect(() => {
    // Check if form is valid before calling onFormChange
    // This prevents incomplete data from being sent for translation too early
    const aFieldIsNotEmpty = Object.values(watchedValues).some(value => typeof value === 'string' && value.trim() !== '');
    if (form.formState.isValid && aFieldIsNotEmpty) {
      onFormChange(watchedValues);
    } else if (!aFieldIsNotEmpty) {
      // If all fields are empty, maybe signal to clear translation
      onFormChange(defaultIndonesianPromptValues);
    }
  }, [watchedValues, onFormChange, form.formState.isValid]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Indonesian Prompt</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formFields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: formFieldProps }) => (
                    <FormItem>
                      <FormLabel>{field.label}{IndonesianPromptSchema.shape[field.name].isOptional() ? '' : ' *'}</FormLabel>
                      <FormControl>
                        {field.isTextarea ? (
                          <Textarea placeholder={field.placeholder} {...formFieldProps} className="h-24"/>
                        ) : (
                          <Input placeholder={field.placeholder} {...formFieldProps} />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <Button type="button" disabled={isTranslating || !form.formState.isValid} onClick={() => onFormChange(form.getValues())}>
                {isTranslating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Translate Prompt
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
