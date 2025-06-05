"use client";

import type { IndonesianPromptFormData } from "@/lib/schemas";
import { defaultIndonesianPromptValues } from "@/lib/schemas";
import { translateIndonesianPrompt } from "@/ai/flows/translate-indonesian-prompt";
import { enhancePromptQuality, type EnhancePromptQualityOutput } from "@/ai/flows/enhance-prompt-quality";
import { useState, useCallback, useTransition } from "react";
import { IndonesianPromptForm } from "./indonesian-prompt-form";
import { EnglishTranslationDisplay } from "./english-translation-display";
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


export default function VeoPromptifyClientPage() {
  const [indonesianPromptData, setIndonesianPromptData] = useState<IndonesianPromptFormData>(defaultIndonesianPromptValues);
  const [englishPrompt, setEnglishPrompt] = useState<string | null>(null);
  const [enhancementResult, setEnhancementResult] = useState<EnhancePromptQualityOutput | null>(null);
  
  const [isTranslating, startTranslationTransition] = useTransition();
  const [isEnhancing, startEnhancementTransition] = useTransition();

  const { toast } = useToast();

  const handleTranslate = useCallback(async (data: IndonesianPromptFormData) => {
    const allEmpty = Object.values(data).every(val => val === "");
    if (allEmpty) {
      setEnglishPrompt(null);
      setEnhancementResult(null); // Also clear enhancement if prompt is cleared
      return;
    }

    // Only proceed if subject and action are present, as they are marked required
    if (!data.subject || !data.action) {
        setEnglishPrompt(null); // Clear previous translation if required fields are missing
        return;
    }

    startTranslationTransition(async () => {
      try {
        const result = await translateIndonesianPrompt(data);
        setEnglishPrompt(result.englishPrompt);
        setEnhancementResult(null); // Clear previous enhancement when new translation occurs
      } catch (error) {
        console.error("Translation error:", error);
        toast({
          title: "Translation Error",
          description: "Failed to translate the prompt. Please try again.",
          variant: "destructive",
        });
        setEnglishPrompt(null);
      }
    });
  }, [toast]);

  const debouncedTranslate = useCallback(debounce(handleTranslate, 750), [handleTranslate]);

  const handleFormChange = useCallback((data: IndonesianPromptFormData) => {
    setIndonesianPromptData(data);
    const allEmpty = Object.values(data).every(val => val === "");
     if (allEmpty) {
      setEnglishPrompt(null);
      setEnhancementResult(null);
    } else if (data.subject && data.action) { // only call debounce if required fields are present
      debouncedTranslate(data);
    } else {
      // If required fields are not present but some other fields are, clear previous translation
      setEnglishPrompt(null);
    }
  }, [debouncedTranslate]);

  const handleEnhancePrompt = useCallback(async (promptToEnhance: string) => {
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
            <IndonesianPromptForm onFormChange={handleFormChange} isTranslating={isTranslating} />
          </div>
          <div className="space-y-8">
            <EnglishTranslationDisplay translation={englishPrompt} isLoading={isTranslating} />
            <Separator />
            <PromptEnhancementSection
              englishPrompt={englishPrompt}
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
