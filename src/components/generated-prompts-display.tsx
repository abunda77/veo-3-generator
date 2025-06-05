// This component replaces EnglishTranslationDisplay.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";

interface GeneratedPromptsDisplayProps {
  indonesianPrompt: string | null;
  onIndonesianPromptChange: (newPrompt: string) => void;
  englishPrompt: string | null;
  isProcessingInitial: boolean;
  isTranslatingEdited: boolean;
}

export function GeneratedPromptsDisplay({ 
  indonesianPrompt, 
  onIndonesianPromptChange, 
  englishPrompt,
  isProcessingInitial,
  isTranslatingEdited
}: GeneratedPromptsDisplayProps) {
  const [localIndonesianPrompt, setLocalIndonesianPrompt] = useState(indonesianPrompt || "");
  const [keyIndonesian, setKeyIndonesian] = useState(0);
  const [keyEnglish, setKeyEnglish] = useState(0);

  useEffect(() => {
    setLocalIndonesianPrompt(indonesianPrompt || "");
    if (indonesianPrompt !== null) {
      setKeyIndonesian(prevKey => prevKey + 1);
    }
  }, [indonesianPrompt]);

  useEffect(() => {
    if (englishPrompt !== null) {
      setKeyEnglish(prevKey => prevKey + 1);
    }
  }, [englishPrompt]);

  const handleLocalIndonesianChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalIndonesianPrompt(e.target.value);
    onIndonesianPromptChange(e.target.value);
  };
  
  const isLoading = isProcessingInitial || isTranslatingEdited;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">Prompt Bahasa Indonesia (Dapat Diedit)</CardTitle>
        </CardHeader>
        <CardContent>
          {isProcessingInitial ? (
            <Skeleton className="h-32 w-full" />
          ) : indonesianPrompt !== null ? (
             <div key={keyIndonesian} className="animate-fade-in">
              <Textarea
                value={localIndonesianPrompt}
                onChange={handleLocalIndonesianChange}
                placeholder="Prompt Bahasa Indonesia akan muncul di sini setelah dibuat dari formulir..."
                className="h-32 bg-card border-input"
                aria-label="Prompt Bahasa Indonesia yang dapat diedit"
              />
            </div>
          ) : (
            <p className="text-muted-foreground h-32 flex items-center justify-center">
              Isi formulir dan klik "Buat Prompt (ID & EN)" untuk melihat prompt Bahasa Indonesia di sini.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">Final Prompt (English - Read-only)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-3/4" />
            </div>
          ) : englishPrompt ? (
            <div key={keyEnglish} className="animate-fade-in">
              <Textarea
                value={englishPrompt}
                readOnly
                className="h-32 bg-muted/30 border-dashed"
                aria-label="Final English prompt (read-only)"
              />
            </div>
          ) : (
             <p className="text-muted-foreground h-32 flex items-center justify-center">
              Prompt Bahasa Inggris akan muncul di sini setelah diterjemahkan.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
