"use client";

import type { EnhancePromptQualityOutput } from "@/ai/flows/enhance-prompt-quality";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Sparkles } from "lucide-react";
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Prompt Enhancement</CardTitle>
        <CardDescription>
          Improve your English prompt based on Google Veo standards.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <div>
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div>
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        ) : enhancementResult ? (
          <>
            <div>
              <h3 className="text-lg font-medium mb-1 font-headline">Enhanced Prompt:</h3>
              <div key={enhancedPromptKey} className="animate-fade-in">
                <Textarea
                  value={enhancementResult.enhancedPrompt}
                  readOnly
                  className="h-24 bg-muted/30 border-dashed"
                  aria-label="Enhanced prompt"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1 font-headline">Explanation:</h3>
               <div key={explanationKey} className="animate-fade-in">
                <Textarea
                  value={enhancementResult.explanation}
                  readOnly
                  className="h-32 bg-muted/30 border-dashed"
                  aria-label="Explanation of prompt enhancement"
                />
              </div>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground">
            Translate your Indonesian prompt first, then click "Enhance Prompt" to get suggestions.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleEnhanceClick}
          disabled={!englishPrompt || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Enhance Prompt
        </Button>
      </CardFooter>
    </Card>
  );
}
