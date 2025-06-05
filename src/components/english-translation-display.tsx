"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

interface EnglishTranslationDisplayProps {
  translation: string | null;
  isLoading: boolean;
}

export function EnglishTranslationDisplay({ translation, isLoading }: EnglishTranslationDisplayProps) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (translation !== null) {
      setKey(prevKey => prevKey + 1);
    }
  }, [translation]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">English Translation</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
          </div>
        ) : translation ? (
          <div key={key} className="animate-fade-in">
            <Textarea
              value={translation}
              readOnly
              className="h-40 bg-muted/30 border-dashed"
              aria-label="English translation of the prompt"
            />
          </div>
        ) : (
          <p className="text-muted-foreground">Enter details in the Indonesian prompt form to see the translation here.</p>
        )}
      </CardContent>
    </Card>
  );
}
