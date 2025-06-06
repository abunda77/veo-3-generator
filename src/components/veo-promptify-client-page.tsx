"use client";

import type { IndonesianPromptFormData } from "@/lib/schemas";
import { defaultIndonesianPromptValues } from "@/lib/schemas";
import { translateIndonesianPrompt } from "@/ai/flows/translate-indonesian-prompt";
import { translateFreeformIndonesian } from "@/ai/flows/translate-freeform-indonesian-flow";
import { enhancePromptQuality, type EnhancePromptQualityOutput } from "@/ai/flows/enhance-prompt-quality";
import { useState, useCallback, useTransition, useEffect } from "react";
import { IndonesianPromptForm } from "./indonesian-prompt-form";
import { GeneratedPromptsDisplay } from "./generated-prompts-display";
import { PromptEnhancementSection } from "./prompt-enhancement-section";
import { AppHeader } from "./app-header";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

// Debounce helper
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
}

function formatIndonesianPromptFromData(data: IndonesianPromptFormData): string {
  const parts: string[] = [];
  if (data.subject) parts.push(`Subjek: ${data.subject}`);
  if (data.action) parts.push(`Aksi: ${data.action}`);
  if (data.expression) parts.push(`Ekspresi: ${data.expression}`);
  if (data.place) parts.push(`Tempat: ${data.place}`);
  if (data.time) parts.push(`Waktu: ${data.time}`);
  if (data.cameraMovement) parts.push(`Pergerakan Kamera: ${data.cameraMovement}`);
  if (data.lighting) parts.push(`Pencahayaan: ${data.lighting}`);
  if (data.videoStyle) parts.push(`Gaya Video: ${data.videoStyle}`);
  if (data.videoMood) parts.push(`Suasana Video: ${data.videoMood}`);
  if (data.soundMusic) parts.push(`Suara/Musik: ${data.soundMusic}`);
  if (data.spokenSentence) parts.push(`Kalimat Diucapkan: ${data.spokenSentence}`);
  if (data.additionalDetails) parts.push(`Detail Tambahan: ${data.additionalDetails}`);
  
  return parts.filter(Boolean).join(", ");
}


export default function VeoPromptifyClientPage() {
  const [currentFormData, setCurrentFormData] = useState<IndonesianPromptFormData>(defaultIndonesianPromptValues);
  const [formDataAtGeneration, setFormDataAtGeneration] = useState<IndonesianPromptFormData | null>(null);
  const [generatedIndonesianPrompt, setGeneratedIndonesianPrompt] = useState<string | null>(null);
  const [finalEnglishPrompt, setFinalEnglishPrompt] = useState<string | null>(null);
  const [enhancementResult, setEnhancementResult] = useState<EnhancePromptQualityOutput | null>(null);
  
  const [isProcessingInitialPrompts, startInitialPromptProcessingTransition] = useTransition();
  const [isTranslatingEdited, startEditedTranslationTransition] = useTransition();
  const [isEnhancing, startEnhancementTransition] = useTransition();

  const { toast } = useToast();

  // Stable callback to update current form data
  const handleFormValuesChange = useCallback((data: IndonesianPromptFormData) => {
    setCurrentFormData(data);
  }, []);

  // Effect to clear prompts if form data changes after generation
  useEffect(() => {
    if (formDataAtGeneration && JSON.stringify(currentFormData) !== JSON.stringify(formDataAtGeneration)) {
      if (generatedIndonesianPrompt !== null || finalEnglishPrompt !== null) {
        setGeneratedIndonesianPrompt(null);
        setFinalEnglishPrompt(null);
        setEnhancementResult(null);
        setFormDataAtGeneration(null); // Reset: prompts are now cleared, new generation will set this again
        // Optionally, inform user why prompts were cleared
        // toast({
        //   title: "Formulir berubah",
        //   description: "Prompt telah dihapus karena input formulir diubah. Silakan buat ulang.",
        //   variant: "default"
        // });
      }
    }
  }, [currentFormData, formDataAtGeneration, generatedIndonesianPrompt, finalEnglishPrompt, toast]);


  const handleGenerateInitialPrompts = useCallback(async () => {
    if (!currentFormData.subject || !currentFormData.action) {
      toast({
        title: "Input Kurang",
        description: "Mohon isi setidaknya bidang Subjek dan Aksi.",
        variant: "destructive",
      });
      return;
    }

    startInitialPromptProcessingTransition(async () => {
      try {
        const indonesianText = formatIndonesianPromptFromData(currentFormData);
        setGeneratedIndonesianPrompt(indonesianText);

        const formDataWithDefaults = {
          ...currentFormData,
          expression: currentFormData.expression || '',
          place: currentFormData.place || '',
          time: currentFormData.time || '',
          cameraMovement: currentFormData.cameraMovement || '',
          lighting: currentFormData.lighting || '',
          videoStyle: currentFormData.videoStyle || '',
          videoMood: currentFormData.videoMood || '',
          soundMusic: currentFormData.soundMusic || '',
          spokenSentence: currentFormData.spokenSentence || '',
          additionalDetails: currentFormData.additionalDetails || ''
        };

        const translationResult = await translateIndonesianPrompt(formDataWithDefaults);
        setFinalEnglishPrompt(translationResult.englishPrompt);
        setEnhancementResult(null); // Clear previous enhancement
        setFormDataAtGeneration(currentFormData); // Store form data used for this generation
      } catch (error) {
        console.error("Initial prompt generation/translation error:", error);
        toast({
          title: "Error Pembuatan Prompt",
          description: "Gagal membuat atau menerjemahkan prompt. Silakan coba lagi.",
          variant: "destructive",
        });
        setGeneratedIndonesianPrompt(null);
        setFinalEnglishPrompt(null);
        setFormDataAtGeneration(null);
      }
    });
  }, [currentFormData, toast]);

  const translateEditedIndonesianText = useCallback(async (editedText: string) => {
    if (!editedText.trim()) {
      setFinalEnglishPrompt(null);
      setEnhancementResult(null);
      return;
    }
    startEditedTranslationTransition(async () => {
      try {
        const result = await translateFreeformIndonesian({ text: editedText });
        setFinalEnglishPrompt(result.translatedText);
        setEnhancementResult(null); // Clear previous enhancement
        // When freeform text is translated, it implies the "form data at generation" is no longer strictly the source.
        // We might want to nullify formDataAtGeneration here, or handle it based on desired UX.
        // For now, let's assume editing the Indonesian prompt means the original form data is less relevant for *this specific generated text pair*.
        // setFormDataAtGeneration(null); // Or update it if we parse editedText back to form fields (complex)
      } catch (error) {
        console.error("Edited translation error:", error);
        toast({
          title: "Error Terjemahan",
          description: "Gagal menerjemahkan prompt yang diedit. Silakan coba lagi.",
          variant: "destructive",
        });
      }
    });
  }, [toast]);
  
  const debouncedTranslateEdited = useCallback(debounce(translateEditedIndonesianText, 750), [translateEditedIndonesianText]);

  const handleIndonesianPromptEdit = useCallback((newText: string) => {
    setGeneratedIndonesianPrompt(newText); 
    debouncedTranslateEdited(newText);
     // If user edits the Indonesian prompt, the link to original structured form data is weakened.
    // Clear formDataAtGeneration so that subsequent direct form edits don't incorrectly clear these manually edited/translated prompts.
    // A new "Generate" click will re-establish this link.
    setFormDataAtGeneration(null);
  }, [debouncedTranslateEdited]);


  const handleEnhancePrompt = useCallback(async (promptToEnhance: string) => {
    if (!promptToEnhance) return;
    startEnhancementTransition(async () => {
      try {
        const result = await enhancePromptQuality({ prompt: promptToEnhance });
        setEnhancementResult(result);
      } catch (error) {
        console.error("Enhancement error:", error);
        toast({
          title: "Enhancement Error",
          description: "Failed to enhance the prompt. Please try again.",
          variant: "destructive",
        });
        setEnhancementResult(null);
      }
    });
  }, [toast]);

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <IndonesianPromptForm 
              onFormValuesChange={handleFormValuesChange} 
              onGeneratePrompts={handleGenerateInitialPrompts}
              isProcessing={isProcessingInitialPrompts} 
            />
          </div>
          <div className="space-y-8">
            <GeneratedPromptsDisplay
              indonesianPrompt={generatedIndonesianPrompt}
              onIndonesianPromptChange={handleIndonesianPromptEdit}
              englishPrompt={finalEnglishPrompt}
              isProcessingInitial={isProcessingInitialPrompts}
              isTranslatingEdited={isTranslatingEdited}
            />
            { (generatedIndonesianPrompt || finalEnglishPrompt) && <Separator />}
            <PromptEnhancementSection
              englishPrompt={finalEnglishPrompt}
              onEnhance={handleEnhancePrompt}
              enhancementResult={enhancementResult}
              isLoading={isEnhancing}
            />
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} VeoPromptify. All rights reserved.
      </footer>
    </div>
  );
}

