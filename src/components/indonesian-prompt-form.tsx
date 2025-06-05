
"use client";

import type { IndonesianPromptFormData } from "@/lib/schemas";
import { IndonesianPromptSchema, defaultIndonesianPromptValues } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormFieldConfig {
  name: keyof IndonesianPromptFormData;
  label: string;
  placeholder?: string;
  isTextarea?: boolean;
  selectOptions?: Array<{ value: string; label: string }>;
}

const cameraMovementOptions = [
  { value: "Static", label: "Diam (Static)" },
  { value: "Pan", label: "Geser (Pan)" },
  { value: "Tilt", label: "Miring (Tilt)" },
  { value: "Zoom In", label: "Zoom In" },
  { value: "Zoom Out", label: "Zoom Out" },
  { value: "Tracking Shot", label: "Mengikuti (Tracking Shot)" },
  { value: "Handheld Shot", label: "Bidikan Genggam (Handheld Shot)" },
  { value: "Drone Shot", label: "Bidikan Drone (Drone Shot)" },
  { value: "Lainnya", label: "Lainnya..." },
];

const lightingOptions = [
  { value: "Natural", label: "Alami (Natural)" },
  { value: "Studio", label: "Studio" },
  { value: "Low Key", label: "Low Key (Gelap)" },
  { value: "High Key", label: "High Key (Terang)" },
  { value: "Backlight", label: "Cahaya Belakang (Backlight)" },
  { value: "Side Light", label: "Cahaya Samping (Side Light)" },
  { value: "Spotlight", label: "Lampu Sorot (Spotlight)" },
  { value: "Lainnya", label: "Lainnya..." },
];

const videoStyleOptions = [
  { value: "Cinematic", label: "Sinematik (Cinematic)" },
  { value: "Documentary", label: "Dokumenter (Documentary)" },
  { value: "Vlog", label: "Vlog" },
  { value: "Animation", label: "Animasi (Animation)" },
  { value: "Black and White", label: "Hitam Putih (Black and White)" },
  { value: "Vintage", label: "Vintage" },
  { value: "Cartoon", label: "Kartun (Cartoon)" },
  { value: "Realistic", label: "Realistis (Realistic)" },
  { value: "Lainnya", label: "Lainnya..." },
];

const videoMoodOptions = [
  { value: "Cheerful", label: "Ceria (Cheerful)" },
  { value: "Melancholic", label: "Melankolis (Melancholic)" },
  { value: "Suspenseful", label: "Tegang (Suspenseful)" },
  { value: "Romantic", label: "Romantis (Romantic)" },
  { value: "Mysterious", label: "Misterius (Mysterious)" },
  { value: "Nostalgic", label: "Nostalgia (Nostalgic)" },
  { value: "Inspirational", label: "Inspiratif (Inspirational)" },
  { value: "Scary", label: "Menakutkan (Scary)" },
  { value: "Lainnya", label: "Lainnya..." },
];

const formFields: Array<FormFieldConfig> = [
  { name: "subject", label: "Subject", placeholder: "e.g., Seorang wanita muda" },
  { name: "action", label: "Action", placeholder: "e.g., berjalan di taman" },
  { name: "expression", label: "Expression", placeholder: "e.g., tersenyum bahagia" },
  { name: "place", label: "Place", placeholder: "e.g., taman kota yang ramai" },
  { name: "time", label: "Time", placeholder: "e.g., sore hari keemasan" },
  { name: "cameraMovement", label: "Camera Movement", selectOptions: cameraMovementOptions, placeholder: "e.g., mengikuti subjek dari belakang" },
  { name: "lighting", label: "Lighting", selectOptions: lightingOptions, placeholder: "e.g., cahaya senja hangat" },
  { name: "videoStyle", label: "Video Style", selectOptions: videoStyleOptions, placeholder: "e.g., gaya Wes Anderson" },
  { name: "videoMood", label: "Video Mood", selectOptions: videoMoodOptions, placeholder: "e.g., penuh harapan dan optimis" },
  { name: "soundMusic", label: "Sound/Music", placeholder: "e.g., musik instrumental yang menenangkan" },
  { name: "spokenSentence", label: "Spoken Sentence", placeholder: "e.g., 'Ini hari yang indah.'", isTextarea: true },
  { name: "additionalDetails", label: "Additional Details", placeholder: "e.g., Mengenakan gaun merah, ada anjing kecil berlarian.", isTextarea: true },
];

interface IndonesianPromptFormProps {
  onFormValuesChange: (data: IndonesianPromptFormData) => void;
  onGeneratePrompts: () => void;
  isProcessing: boolean;
}

export function IndonesianPromptForm({ onFormValuesChange, onGeneratePrompts, isProcessing }: IndonesianPromptFormProps) {
  const form = useForm<IndonesianPromptFormData>({
    resolver: zodResolver(IndonesianPromptSchema),
    defaultValues: defaultIndonesianPromptValues,
    mode: "onChange", // Keep mode to onChange for instant validation
  });

  const watchedValues = form.watch();

  useEffect(() => {
    // This effect now only informs the parent about form value changes
    // It doesn't trigger translation directly.
    onFormValuesChange(watchedValues);
  }, [JSON.stringify(watchedValues), onFormValuesChange]);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Indonesian Prompt</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formFields.map((fieldConfig) => (
                <FormField
                  key={fieldConfig.name}
                  control={form.control}
                  name={fieldConfig.name}
                  render={({ field: formFieldProps }) => {
                    const currentFieldValue = formFieldProps.value || "";
                    
                    if (fieldConfig.selectOptions) {
                      const isStandardOption = fieldConfig.selectOptions.some(
                        opt => opt.value === currentFieldValue && opt.value !== 'Lainnya'
                      );
                      const selectTriggerValue = isStandardOption ? currentFieldValue : "Lainnya";
                      const showCustomInput = !isStandardOption || currentFieldValue === "Lainnya";

                      return (
                        <FormItem>
                          <FormLabel>{fieldConfig.label}{IndonesianPromptSchema.shape[fieldConfig.name].isOptional() ? '' : ' *'}</FormLabel>
                          <Select
                            value={selectTriggerValue}
                            onValueChange={(selectedValue) => {
                              if (selectedValue === "Lainnya") {
                                form.setValue(fieldConfig.name, "", { shouldValidate: true, shouldDirty: true });
                              } else {
                                form.setValue(fieldConfig.name, selectedValue, { shouldValidate: true, shouldDirty: true });
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={`Pilih ${fieldConfig.label.toLowerCase()}`} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {fieldConfig.selectOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {showCustomInput && (
                            <Input
                              {...formFieldProps} 
                              value={currentFieldValue === "Lainnya" ? "" : currentFieldValue} 
                              onChange={(e) => form.setValue(fieldConfig.name, e.target.value, { shouldValidate: true, shouldDirty: true })}
                              placeholder={fieldConfig.placeholder || `Detail untuk ${fieldConfig.label.toLowerCase()}`}
                              className="mt-2"
                            />
                          )}
                          <FormMessage />
                        </FormItem>
                      );
                    }
                    
                    return (
                      <FormItem>
                        <FormLabel>{fieldConfig.label}{IndonesianPromptSchema.shape[fieldConfig.name].isOptional() ? '' : ' *'}</FormLabel>
                        <FormControl>
                          {fieldConfig.isTextarea ? (
                            <Textarea placeholder={fieldConfig.placeholder} {...formFieldProps} className="h-24"/>
                          ) : (
                            <Input placeholder={fieldConfig.placeholder} {...formFieldProps} />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <Button type="button" disabled={isProcessing || !form.formState.isValid} onClick={onGeneratePrompts}>
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Buat Prompt (ID & EN)
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
