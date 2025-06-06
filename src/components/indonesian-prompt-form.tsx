
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
  { value: "Pan Left", label: "Geser Kiri (Pan Left)" },
  { value: "Pan Right", label: "Geser Kanan (Pan Right)" },
  { value: "Tilt", label: "Miring (Tilt)" },
  { value: "Tilt Up", label: "Miring ke Atas (Tilt Up)" },
  { value: "Tilt Down", label: "Miring ke Bawah (Tilt Down)" },
  { value: "Zoom In", label: "Zoom In" },
  { value: "Zoom Out", label: "Zoom Out" },
  { value: "Dolly Shot", label: "Gerak Dolly (Dolly Shot)" },
  { value: "Dolly In", label: "Dolly Masuk (Dolly In)" },
  { value: "Dolly Out", label: "Dolly Keluar (Dolly Out)" },
  { value: "Truck Left", label: "Gerak ke Kiri (Truck Left)" },
  { value: "Truck Right", label: "Gerak ke Kanan (Truck Right)" },
  { value: "Pedestal Up", label: "Naik (Pedestal Up)" },
  { value: "Pedestal Down", label: "Turun (Pedestal Down)" },
  { value: "Tracking Shot", label: "Mengikuti (Tracking Shot)" },
  { value: "Handheld Shot", label: "Bidikan Genggam (Handheld Shot)" },
  { value: "Drone Shot", label: "Bidikan Drone (Drone Shot)" },
  { value: "Crane Shot", label: "Bidikan Derek (Crane Shot)" },
  { value: "Boom Shot", label: "Bidikan Boom (Boom Shot)" },
  { value: "POV Shot", label: "Sudut Pandang Subjektif (POV Shot)" },
  { value: "Arc Shot", label: "Bidikan Melengkung (Arc Shot)" },
  { value: "Dutch Angle", label: "Sudut Miring (Dutch Angle)" },
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
  { value: "Soft Light", label: "Cahaya Lembut (Soft Light)" },
  { value: "Hard Light", label: "Cahaya Keras (Hard Light)" },
  { value: "Colored Light", label: "Cahaya Berwarna (Colored Light)" },
  { value: "Morning Light", label: "Cahaya Pagi (Morning Light)" },
  { value: "Night Light", label: "Cahaya Malam (Night Light)" },
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
    mode: "onChange",
  });

  const watchedValues = form.watch();

  useEffect(() => {
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
