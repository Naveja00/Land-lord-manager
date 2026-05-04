'use client';

import { useState, useCallback } from 'react';
import { QuizAnswers } from '../../lib/ritual-of-glow/types';
import { quizQuestions } from '../../lib/ritual-of-glow/quiz-data';

interface QuizEngineProps {
  onComplete: (answers: QuizAnswers) => void;
}

export default function QuizEngine({ onComplete }: QuizEngineProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [showProxy, setShowProxy] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const question = quizQuestions[currentStep];
  const totalSteps = quizQuestions.length;
  const progress = ((currentStep) / totalSteps) * 100;

  const handleAnswer = useCallback(
    (value: string) => {
      setIsTransitioning(true);

      const updated = { ...answers, [question.id]: value };
      setAnswers(updated);

      setTimeout(() => {
        if (currentStep < totalSteps - 1) {
          setCurrentStep((s) => s + 1);
          setShowProxy(false);
          setIsTransitioning(false);
        } else {
          onComplete(updated as QuizAnswers);
        }
      }, 400);
    },
    [answers, currentStep, onComplete, question.id, totalSteps]
  );

  const handleProxyAnswer = useCallback(
    (mappedValue: string) => {
      handleAnswer(mappedValue);
    },
    [handleAnswer]
  );

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setShowProxy(false);
    }
  }, [currentStep]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-600/15 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-60 w-60 rounded-full bg-pink-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-xs text-purple-300/60">
            <span>
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-purple-900/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div
          className={`rounded-2xl border border-purple-500/20 bg-purple-950/40 p-8 backdrop-blur-xl transition-all duration-400 ${
            isTransitioning
              ? 'translate-y-4 opacity-0'
              : 'translate-y-0 opacity-100'
          }`}
        >
          {/* Step label */}
          <div className="mb-2 text-sm font-medium text-pink-400">
            {question.title}
          </div>

          <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">
            {question.subtitle}
          </h2>

          {/* Main options */}
          {!showProxy && (
            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="group w-full rounded-xl border border-purple-500/20 bg-purple-900/30 p-4 text-left transition-all duration-200 hover:border-pink-500/40 hover:bg-purple-800/40 hover:shadow-[0_0_20px_rgba(244,114,182,0.15)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <div className="font-semibold text-white group-hover:text-pink-300 transition-colors">
                        {option.label}
                      </div>
                      <div className="text-sm text-purple-300/60">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Proxy fallback options */}
          {showProxy && (
            <div className="space-y-3">
              <div className="mb-4 rounded-lg border border-pink-500/30 bg-pink-500/10 p-3 text-sm text-pink-200">
                {question.proxyFallback.prompt}
              </div>
              {Object.entries(question.proxyFallback.mappings).map(
                ([label, value]) => (
                  <button
                    key={label}
                    onClick={() => handleProxyAnswer(value)}
                    className="group w-full rounded-xl border border-purple-500/20 bg-purple-900/30 p-4 text-left transition-all duration-200 hover:border-pink-500/40 hover:bg-purple-800/40 hover:shadow-[0_0_20px_rgba(244,114,182,0.15)]"
                  >
                    <span className="text-white group-hover:text-pink-300 transition-colors">
                      {label}
                    </span>
                  </button>
                )
              )}
            </div>
          )}

          {/* Bottom controls */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="text-sm text-purple-400 transition-colors hover:text-pink-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Back
            </button>

            {!showProxy && (
              <button
                onClick={() => setShowProxy(true)}
                className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300 transition-all hover:border-pink-500/30 hover:bg-pink-500/10 hover:text-pink-300"
              >
                I&apos;m Not Sure
              </button>
            )}

            {showProxy && (
              <button
                onClick={() => setShowProxy(false)}
                className="text-sm text-purple-400 transition-colors hover:text-pink-300"
              >
                Show original options
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
