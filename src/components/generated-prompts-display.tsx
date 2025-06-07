// This component replaces EnglishTranslationDisplay.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { ArrowDownToLine, Languages, Pencil } from "lucide-react";

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
      <Card className="border-primary/20 overflow-hidden">
        <CardHeader className="bg-primary/5 pb-4">
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Pencil className="h-5 w-5 text-primary" />
            Prompt Bahasa Indonesia (Dapat Diedit)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {isProcessingInitial ? (
            <div className="space-y-2 py-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-11/12" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-6 w-10/12" />
            </div>
          ) : indonesianPrompt !== null ? (
             <div key={keyIndonesian} className="animate-fade-in">
              <Textarea
                value={localIndonesianPrompt}
                onChange={handleLocalIndonesianChange}
                placeholder="Prompt Bahasa Indonesia akan muncul di sini setelah dibuat dari formulir..."
                className="h-32 bg-card border-input focus:border-primary focus-visible:ring-primary/20 transition-all duration-200"
                aria-label="Prompt Bahasa Indonesia yang dapat diedit"
              />
            </div>
          ) : (
            <div className="text-muted-foreground h-32 flex flex-col items-center justify-center gap-2 border border-dashed rounded-md p-4 bg-muted/10">
              <ArrowDownToLine className="h-6 w-6 text-muted-foreground/60" />
              <p className="text-center">Isi formulir dan klik "Buat Prompt (ID & EN)" untuk melihat prompt Bahasa Indonesia di sini.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-blue-500/20 overflow-hidden">
        <CardHeader className="bg-blue-500/5 pb-4">
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Languages className="h-5 w-5 text-blue-500" />
            Final Prompt (English - Read-only)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="space-y-2 py-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-11/12" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-6 w-10/12" />
            </div>
          ) : englishPrompt ? (
            <div key={keyEnglish} className="animate-fade-in">
              <Textarea
                value={englishPrompt}
                readOnly
                className="h-32 bg-muted/20 border-dashed focus-visible:ring-blue-500/20 text-foreground/90"
                aria-label="Final English prompt (read-only)"
              />
            </div>
          ) : (
            <div className="text-muted-foreground h-32 flex flex-col items-center justify-center gap-2 border border-dashed rounded-md p-4 bg-muted/10">
              <Languages className="h-6 w-6 text-muted-foreground/60" />
              <p className="text-center">Prompt Bahasa Inggris akan muncul di sini setelah diterjemahkan.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
