'use client';

import { useState, useCallback } from 'react';
import { QuizAnswers, BudgetTier, Routine } from '../../lib/ritual-of-glow/types';
import { buildRoutine, swapTier } from '../../lib/ritual-of-glow/engine';
import QuizEngine from '../../components/ritual-of-glow/QuizEngine';
import ResultsPage from '../../components/ritual-of-glow/ResultsPage';
import LandingHero from '../../components/ritual-of-glow/LandingHero';

type AppView = 'landing' | 'quiz' | 'results';

export default function RitualOfGlowPage() {
  const [view, setView] = useState<AppView>('landing');
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [routine, setRoutine] = useState<Routine | null>(null);

  const handleStartQuiz = useCallback(() => {
    setView('quiz');
  }, []);

  const handleQuizComplete = useCallback((quizAnswers: QuizAnswers) => {
    setAnswers(quizAnswers);
    const result = buildRoutine(quizAnswers);
    setRoutine(result);
    setView('results');
  }, []);

  const handleTierToggle = useCallback(
    (newTier: BudgetTier) => {
      if (!answers) return;
      const result = swapTier(routine!, answers, newTier);
      setRoutine(result);
    },
    [answers, routine]
  );

  const handleRestart = useCallback(() => {
    setView('landing');
    setAnswers(null);
    setRoutine(null);
  }, []);

  return (
    <>
      {view === 'landing' && <LandingHero onStart={handleStartQuiz} />}
      {view === 'quiz' && <QuizEngine onComplete={handleQuizComplete} />}
      {view === 'results' && routine && answers && (
        <ResultsPage
          routine={routine}
          answers={answers}
          onTierToggle={handleTierToggle}
          onRestart={handleRestart}
        />
      )}
    </>
  );
}
