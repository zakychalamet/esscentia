'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  quizQuestions,
  calculateQuizResult,
} from '@/lib/fragrance-quiz';
import { fetchProducts, Product } from '@/lib/products';
import { CatalogNav, CatalogFooter } from '@/components/CatalogChrome';

function formatPrice(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function FragranceQuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts()
      .then(setAllProducts)
      .catch(console.error);
  }, []);

  const totalSteps = quizQuestions.length;
  const currentQuestion = quizQuestions[step];
  const progress = showResults ? 100 : ((step + 1) / totalSteps) * 100;
  const selectedOption = currentQuestion ? answers[currentQuestion.id] : undefined;

  const result = useMemo(() => {
    if (!showResults) return null;
    return calculateQuizResult(answers);
  }, [showResults, answers]);

  const recommendations = useMemo(() => {
    if (!result || allProducts.length === 0) return [];
    return allProducts
      .filter((p) => p.family === result.family && p.inStock)
      .sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0))
      .slice(0, 3);
  }, [result, allProducts]);

  const selectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const goNext = () => {
    if (!currentQuestion || !answers[currentQuestion.id]) return;
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      setShowResults(true);
    }
  };

  const goBack = () => {
    if (showResults) {
      setShowResults(false);
      setStep(totalSteps - 1);
      return;
    }
    if (step > 0) setStep((s) => s - 1);
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A3728] flex flex-col">
      <CatalogNav />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Progress */}
        <div className="h-px bg-stone-200 mb-12">
          <div
            className="h-px bg-[#4A3728] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {!showResults ? (
          <>
            <div className="text-center mb-10 lg:mb-14">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#4A3728] mb-4">
                Find Your Signature Scent
              </h1>
              <p className="text-stone-600 text-sm md:text-[15px] max-w-xl mx-auto leading-relaxed">
                Answer a few sensory questions to reveal the fragrance that resonates with your
                personal essence.
              </p>
            </div>

            {currentQuestion && (
              <div className="mb-10">
                <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 text-center mb-3">
                  Question {step + 1} of {totalSteps}
                </p>
                <h2 className="text-xl md:text-2xl font-serif text-[#4A3728] text-center mb-8 lg:mb-10">
                  {currentQuestion.question}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                  {currentQuestion.options.map((option) => {
                    const isSelected = selectedOption === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => selectOption(currentQuestion.id, option.id)}
                        className={`text-left border bg-white transition overflow-hidden group ${
                          isSelected
                            ? 'border-[#4A3728] ring-1 ring-[#4A3728]'
                            : 'border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <div className="aspect-square overflow-hidden bg-stone-100">
                          <img
                            src={option.image}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4 border-t border-stone-100">
                          <p className="font-medium text-[#4A3728] mb-1">{option.label}</p>
                          <p className="text-xs text-stone-500 leading-relaxed">
                            {option.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 0}
                className="text-sm text-stone-600 hover:text-[#4A3728] disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={!selectedOption}
                className="px-8 py-3 bg-[#8D4F38] text-[#F9F7F2] text-xs uppercase tracking-[0.2em] hover:bg-[#7a4532] transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {step < totalSteps - 1 ? 'Next Step' : 'See Results'}
              </button>
            </div>
          </>
        ) : (
          result && (
            <div>
              <div className="text-center mb-12">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#8C7355] mb-3">
                  Your Essence · {result.profile.tagline}
                </p>
                <h1 className="text-3xl md:text-4xl font-serif text-[#4A3728] mb-4">
                  {result.profile.title}
                </h1>
                <p className="text-stone-600 text-sm md:text-[15px] max-w-2xl mx-auto leading-relaxed">
                  {result.profile.description}
                </p>
              </div>

              <h2 className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-6 text-center">
                Recommended For You
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                {recommendations.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group border border-stone-200 bg-white overflow-hidden hover:border-[#8D4F38] transition"
                  >
                    <div className="aspect-square overflow-hidden bg-stone-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <p className="font-serif text-[#4A3728] mb-1">{product.name}</p>
                      <p className="text-sm text-[#8D4F38]">{formatPrice(product.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={`/products?family=${encodeURIComponent(result.family)}`}
                  className="px-8 py-3 bg-[#8D4F38] text-[#F9F7F2] text-xs uppercase tracking-[0.2em] hover:bg-[#7a4532] transition"
                >
                  Shop {result.family} Collection
                </Link>
                <button
                  type="button"
                  onClick={restart}
                  className="px-8 py-3 border border-[#4A3728] text-[#4A3728] text-xs uppercase tracking-[0.15em] hover:bg-[#4A3728] hover:text-[#F9F7F2] transition"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          )
        )}
      </main>

      <CatalogFooter variant="catalog" />
    </div>
  );
}
