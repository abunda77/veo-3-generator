
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
  { value: "Diam (Static)", label: "Diam (Static)" },
  { value: "Geser (Pan)", label: "Geser (Pan)" },
  { value: "Geser Kiri (Pan Left)", label: "Geser Kiri (Pan Left)" },
  { value: "Geser Kanan (Pan Right)", label: "Geser Kanan (Pan Right)" },
  { value: "Miring (Tilt)", label: "Miring (Tilt)" },
  { value: "Miring ke Atas (Tilt Up)", label: "Miring ke Atas (Tilt Up)" },
  { value: "Miring ke Bawah (Tilt Down)", label: "Miring ke Bawah (Tilt Down)" },
  { value: "Zoom In", label: "Zoom In" },
  { value: "Zoom Out", label: "Zoom Out" },
  { value: "Gerak Dolly (Dolly Shot)", label: "Gerak Dolly (Dolly Shot)" },
  { value: "Dolly Masuk (Dolly In)", label: "Dolly Masuk (Dolly In)" },
  { value: "Dolly Keluar (Dolly Out)", label: "Dolly Keluar (Dolly Out)" },
  { value: "Gerak ke Kiri (Truck Left)", label: "Gerak ke Kiri (Truck Left)" },
  { value: "Gerak ke Kanan (Truck Right)", label: "Gerak ke Kanan (Truck Right)" },
  { value: "Naik (Pedestal Up)", label: "Naik (Pedestal Up)" },
  { value: "Turun (Pedestal Down)", label: "Turun (Pedestal Down)" },
  { value: "Mengikuti (Tracking Shot)", label: "Mengikuti (Tracking Shot)" },
  { value: "Bidikan Genggam (Handheld Shot)", label: "Bidikan Genggam (Handheld Shot)" },
  { value: "Bidikan Drone (Drone Shot)", label: "Bidikan Drone (Drone Shot)" },
  { value: "Bidikan Derek (Crane Shot)", label: "Bidikan Derek (Crane Shot)" },
  { value: "Bidikan Boom (Boom Shot)", label: "Bidikan Boom (Boom Shot)" },
  { value: "Sudut Pandang Subjektif (POV Shot)", label: "Sudut Pandang Subjektif (POV Shot)" },
  { value: "Bidikan Melengkung (Arc Shot)", label: "Bidikan Melengkung (Arc Shot)" },
  { value: "Sudut Miring (Dutch Angle)", label: "Sudut Miring (Dutch Angle)" },
  { value: "Lainnya", label: "Lainnya..." },
];

const lightingOptions = [
  { value: "Alami (Natural)", label: "Alami (Natural)" },
  { value: "Studio", label: "Studio" },
  { value: "Low Key (Gelap)", label: "Low Key (Gelap)" },
  { value: "High Key (Terang)", label: "High Key (Terang)" },
  { value: "Cahaya Belakang (Backlight)", label: "Cahaya Belakang (Backlight)" },
  { value: "Cahaya Samping (Side Light)", label: "Cahaya Samping (Side Light)" },
  { value: "Lampu Sorot (Spotlight)", label: "Lampu Sorot (Spotlight)" },
  { value: "Cahaya Lembut (Soft Light)", label: "Cahaya Lembut (Soft Light)" },
  { value: "Cahaya Keras (Hard Light)", label: "Cahaya Keras (Hard Light)" },
  { value: "Cahaya Berwarna (Colored Light)", label: "Cahaya Berwarna (Colored Light)" },
  { value: "Cahaya Pagi (Morning Light)", label: "Cahaya Pagi (Morning Light)" },
  { value: "Cahaya Malam (Night Light)", label: "Cahaya Malam (Night Light)" },
  { value: "Lainnya", label: "Lainnya..." },
];

const videoStyleOptions = [
  { value: "Sinematik (Cinematic)", label: "Sinematik (Cinematic)" },
  { value: "Dokumenter (Documentary)", label: "Dokumenter (Documentary)" },
  { value: "Vlog", label: "Vlog" },
  { value: "Animasi (Animation)", label: "Animasi (Animation)" },
  { value: "Hitam Putih (Black and White)", label: "Hitam Putih (Black and White)" },
  { value: "Vintage", label: "Vintage" },
  { value: "Kartun (Cartoon)", label: "Kartun (Cartoon)" },
  { value: "Realistis (Realistic)", label: "Realistis (Realistic)" },
  { value: "Stop Motion", label: "Stop Motion" },
  { value: "Grafik Gerak (Motion Graphics)", label: "Grafik Gerak (Motion Graphics)" },
  { value: "Selang Waktu (Timelapse)", label: "Selang Waktu (Timelapse)" },
  { value: "Gerak Lambat (Slow Motion)", label: "Gerak Lambat (Slow Motion)" },
  { value: "Hyperlapse", label: "Hyperlapse" },
  { value: "Lainnya", label: "Lainnya..." },
];

const videoMoodOptions = [
  { value: "Ceria (Cheerful)", label: "Ceria (Cheerful)" },
  { value: "Melankolis (Melancholic)", label: "Melankolis (Melancholic)" },
  { value: "Tegang (Suspenseful)", label: "Tegang (Suspenseful)" },
  { value: "Romantis (Romantic)", label: "Romantis (Romantic)" },
  { value: "Misterius (Mysterious)", label: "Misterius (Mysterious)" },
  { value: "Nostalgia (Nostalgic)", label: "Nostalgia (Nostalgic)" },
  { value: "Inspiratif (Inspirational)", label: "Inspiratif (Inspirational)" },
  { value: "Menakutkan (Scary)", label: "Menakutkan (Scary)" },
  { value: "Damai (Peaceful)", label: "Damai (Peaceful)" },
  { value: "Energetik (Energetic)", label: "Energetik (Energetic)" },
  { value: "Sedih (Sad)", label: "Sedih (Sad)" },
  { value: "Lucu (Funny)", label: "Lucu (Funny)" },
  { value: "Dramatis (Dramatic)", label: "Dramatis (Dramatic)" },
  { value: "Lainnya", label: "Lainnya..." },
];

const soundMusicOptions = [
  { value: "Musik Instrumental yang Menenangkan", label: "Musik Instrumental yang Menenangkan" },
  { value: "Musik Klasik", label: "Musik Klasik" },
  { value: "Musik Pop", label: "Musik Pop" },
  { value: "Musik Rock", label: "Musik Rock" },
  { value: "Musik Jazz", label: "Musik Jazz" },
  { value: "Musik Elektronik", label: "Musik Elektronik" },
  { value: "Suara Alam (e.g., Burung Berkicau, Ombak Laut)", label: "Suara Alam (e.g., Burung, Ombak)" },
  { value: "Suara Hujan", label: "Suara Hujan" },
  { value: "Musik Latar Epik", label: "Musik Latar Epik" },
  { value: "Suara Ambient", label: "Suara Ambient" },
  { value: "Musik Tradisional", label: "Musik Tradisional" },
  { value: "Musik Akustik", label: "Musik Akustik" },
  { value: "Lainnya", label: "Lainnya..." },
];

const formFields: Array<FormFieldConfig> = [
  { name: "subject", label: "Subject", placeholder: "e.g., Seorang wanita muda" },
  { name: "action", label: "Action", placeholder: "e.g., berjalan di taman" },
  { name: "expression", label: "Expression", placeholder: "e.g., tersenyum bahagia" },
  { name: "place", label: "Place", placeholder: "e.g., taman kota yang ramai" },
  { name: "time", label: "Time", placeholder: "e.g., sore hari keemasan" },
  { name: "cameraMovement", label: "Camera Movement", selectOptions: cameraMovementOptions, placeholder: "Detail gerakan kamera..." },
  { name: "lighting", label: "Lighting", selectOptions: lightingOptions, placeholder: "Detail pencahayaan..." },
  { name: "videoStyle", label: "Video Style", selectOptions: videoStyleOptions, placeholder: "Detail gaya video..." },
  { name: "videoMood", label: "Video Mood", selectOptions: videoMoodOptions, placeholder: "Detail suasana video..." },
  { name: "soundMusic", label: "Sound/Music", selectOptions: soundMusicOptions, placeholder: "e.g., musik instrumental yang menenangkan" },
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
    mode: "onChange", // Trigger validation on change
  });

  const watchedValues = form.watch();

  useEffect(() => {
    // Using JSON.stringify to ensure the effect runs only when values actually change,
    // not just when the watchedValues object reference changes.
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
                    // Get current value, ensure it's a string for comparison, default to empty string if null/undefined
                    const currentFieldValue = typeof formFieldProps.value === 'string' ? formFieldProps.value : "";

                    if (fieldConfig.selectOptions) {
                      // Check if the current value is one of the standard options (excluding "Lainnya")
                      const isStandardOption = fieldConfig.selectOptions.some(
                        opt => opt.value === currentFieldValue && opt.value !== 'Lainnya'
                      );
                      // Determine what to display in the SelectTrigger:
                      // - If it's a standard option, display its value.
                      // - If it's a custom value (not "Lainnya" and not in options), or if "Lainnya" was explicitly selected, display "Lainnya".
                      const selectTriggerValue = isStandardOption ? currentFieldValue : "Lainnya";
                      
                      // Show custom input if:
                      // 1. "Lainnya" is selected OR
                      // 2. The current value is not a standard option (implying it's custom text)
                      const showCustomInput = !isStandardOption || currentFieldValue === "Lainnya";

                      return (
                        <FormItem>
                          <FormLabel>{fieldConfig.label}{IndonesianPromptSchema.shape[fieldConfig.name].isOptional() ? '' : ' *'}</FormLabel>
                          <Select
                            value={selectTriggerValue}
                            onValueChange={(selectedValue) => {
                              if (selectedValue === "Lainnya") {
                                // When "Lainnya" is selected, we want to clear the field
                                // so the user can type a new custom value.
                                // If it was already a custom value, this effectively prepares the input.
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
                              {...formFieldProps} // Spread existing props like name, onBlur, ref
                              value={currentFieldValue === "Lainnya" ? "" : currentFieldValue} // If "Lainnya" was the value, start input empty
                              onChange={(e) => form.setValue(fieldConfig.name, e.target.value, { shouldValidate: true, shouldDirty: true })}
                              placeholder={fieldConfig.placeholder || `Detail untuk ${fieldConfig.label.toLowerCase()}`}
                              className="mt-2"
                            />
                          )}
                          <FormMessage />
                        </FormItem>
                      );
                    }

                    // Fallback for non-select fields (Input or Textarea)
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

