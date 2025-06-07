"use client";

import type { EnhancePromptQualityOutput } from "@/ai/flows/enhance-prompt-quality";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Info, Loader2, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface PromptEnhancementSectionProps {
  englishPrompt: string | null;
  onEnhance: (prompt: string) => void;
  enhancementResult: EnhancePromptQualityOutput | null;
  isLoading: boolean;
}

export function PromptEnhancementSection({
  englishPrompt,
  onEnhance,
  enhancementResult,
  isLoading,
}: PromptEnhancementSectionProps) {
  
  const [enhancedPromptKey, setEnhancedPromptKey] = useState(0);
  const [explanationKey, setExplanationKey] = useState(0);

  useEffect(() => {
    if (enhancementResult?.enhancedPrompt) {
      setEnhancedPromptKey(prev => prev + 1);
    }
  }, [enhancementResult?.enhancedPrompt]);

  useEffect(() => {
     if (enhancementResult?.explanation) {
      setExplanationKey(prev => prev + 1);
    }
  }, [enhancementResult?.explanation]);


  const handleEnhanceClick = () => {
    if (englishPrompt) {
      onEnhance(englishPrompt);
    }
  };

  const isEnabled = englishPrompt !== null && !isLoading;

  return (
    <Card className="border-yellow-500/20 overflow-hidden">
      <CardHeader className="bg-yellow-500/5 pb-4">
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Prompt Enhancement
        </CardTitle>
        <CardDescription>
          Improve your English prompt based on Google Veo standards.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {!englishPrompt ? (
          <div className="p-4 border border-dashed rounded-md bg-muted/10 text-center text-muted-foreground">
            <p>Buat prompt Bahasa Inggris terlebih dahulu untuk menggunakan fitur peningkatan kualitas.</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-11/12" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-4/5" />
            </div>
            <Skeleton className="h-32 w-full" />
          </div>
        ) : enhancementResult ? (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-md bg-yellow-500/5 border border-yellow-500/20">
              <h3 className="font-medium text-sm flex items-center gap-1 mb-2 text-muted-foreground">
                <Info className="h-4 w-4" />
                Analisis dan Peningkatan
              </h3>
              <div key={explanationKey} className="text-sm leading-relaxed text-foreground/80">
                {enhancementResult.explanation}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-sm flex items-center gap-1 mb-2 text-muted-foreground">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                Prompt yang Ditingkatkan
              </h3>
              <Textarea
                key={enhancedPromptKey}
                value={enhancementResult.enhancedPrompt}
                readOnly
                className="min-h-[120px] bg-card focus-visible:ring-yellow-500/20 border-yellow-500/20"
              />
            </div>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex justify-end border-t bg-muted/5 py-4">
        <Button 
          onClick={handleEnhanceClick}
          disabled={!isEnabled}
          className="bg-yellow-500 hover:bg-yellow-600 text-white gap-1 transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Meningkatkan Prompt...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Enhance Prompt Quality
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
