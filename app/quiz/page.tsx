'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  quizQuestions,
  calculateQuizResult,
} from '@/lib/fragrance-quiz';
import { fetchProducts, Product } from '@/lib/products';
import { CatalogNav, CatalogFooter } from '@/components/CatalogChrome';
import { useAuth } from '@/lib/auth-context';

function formatPrice(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function FragranceQuizPage() {
  const { user, isLoading: authLoading, updateUser } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [hasLoadedSavedResult, setHasLoadedSavedResult] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProducts()
      .then(setAllProducts)
      .catch(console.error);
  }, []);

  // Load saved results on mount (exactly once after auth finishes loading)
  useEffect(() => {
    if (authLoading) return;
    if (!hasLoadedSavedResult) {
      if (user?.quizResult) {
        try {
          const parsed = JSON.parse(user.quizResult);
          setAnswers(parsed);
          setShowResults(true);
        } catch (e) {
          console.error('Failed to parse saved quizResult:', e);
        }
      }
      setHasLoadedSavedResult(true);
    }
  }, [user, authLoading, hasLoadedSavedResult]);

  const totalSteps = quizQuestions.length;
  const currentQuestion = quizQuestions[step];
  const progress = showResults ? 100 : ((step + 1) / totalSteps) * 100;
  const selectedOption = currentQuestion ? answers[currentQuestion.id] : undefined;

  const result = useMemo(() => {
    if (!showResults) return null;
    return calculateQuizResult(answers);
  }, [showResults, answers]);

  const targetFamilyForLink = useMemo(() => {
    if (!result) return 'Woody';
    let targetFamily = result.family;
    if (targetFamily === 'Fresh') targetFamily = 'Citrus';
    else if (targetFamily === 'Amber') targetFamily = 'Vanilla';
    else if (targetFamily === 'Aromatic') targetFamily = 'Floral';
    else if (targetFamily === 'Leather') targetFamily = 'Woody';
    return targetFamily;
  }, [result]);

  const recommendations = useMemo(() => {
    if (!result || allProducts.length === 0) return [];
    return allProducts
      .filter((p) => p.family === targetFamilyForLink && p.inStock)
      .sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0))
      .slice(0, 3);
  }, [targetFamilyForLink, allProducts, result]);

  const selectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const goNext = async () => {
    if (!currentQuestion || !answers[currentQuestion.id]) return;
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      setShowResults(true);
      if (user) {
        setIsSaving(true);
        try {
          const res = await fetch('/api/quiz/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              quizResult: JSON.stringify(answers),
            }),
          });
          if (res.ok) {
            const data = await res.json();
            updateUser(data.user);
          }
        } catch (e) {
          console.error('Failed to save quiz results:', e);
        } finally {
          setIsSaving(false);
        }
      }
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

  const restart = async () => {
    setStep(0);
    setAnswers({});
    setShowResults(false);

    if (user) {
      setIsSaving(true);
      try {
        const res = await fetch('/api/quiz/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            quizResult: null,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          updateUser(data.user);
        }
      } catch (e) {
        console.error('Failed to clear quiz result:', e);
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] text-[#4A3728] flex flex-col">
        <CatalogNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-[#8D4F38] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-stone-500 text-sm font-serif">Memuat kuis...</p>
          </div>
        </div>
        <CatalogFooter variant="catalog" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] text-[#4A3728] flex flex-col">
        <CatalogNav />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-md w-full bg-white/80 border border-stone-200/80 p-8 md:p-10 shadow-sm text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#EDEAE4] flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-[#4A3728] mb-4">
              Cari Aroma Khas Anda
            </h1>
            <p className="text-stone-600 text-sm leading-relaxed mb-8">
              Temukan wewangian ideal Anda dengan menjawab beberapa pertanyaan. Silakan masuk atau mendaftar terlebih dahulu untuk memulai kuis dan menyimpan hasilnya.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/login?redirect=/quiz"
                className="w-full py-3 bg-[#4A3728] text-[#F9F7F2] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#8C7355] transition text-center"
              >
                Masuk ke Akun
              </Link>
              <Link
                href="/register?redirect=/quiz"
                className="w-full py-3 border border-[#4A3728] text-[#4A3728] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#4A3728] hover:text-[#F9F7F2] transition text-center"
              >
                Daftar Baru
              </Link>
            </div>
          </div>
        </main>
        <CatalogFooter variant="catalog" />
      </div>
    );
  }

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
                Jawab beberapa pertanyaan di bawah ini untuk menemukan kelompok wewangian yang paling sesuai dengan esensi Anda.
              </p>
            </div>

            {currentQuestion && (
              <div className="mb-10">
                <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 text-center mb-3">
                  Pertanyaan {step + 1} dari {totalSteps}
                </p>
                <h2 className="text-xl md:text-2xl font-serif text-[#4A3728] text-center mb-8 lg:mb-10">
                  {currentQuestion.question}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
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
                ← Kembali
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={!selectedOption || isSaving}
                className="px-8 py-3 bg-[#8D4F38] text-[#F9F7F2] text-xs uppercase tracking-[0.2em] hover:bg-[#7a4532] transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Memuat...
                  </>
                ) : step < totalSteps - 1 ? (
                  'Lanjut'
                ) : (
                  'Lihat Hasil'
                )}
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
                Direkomendasikan Untuk Anda
              </h2>

              {recommendations.length > 0 ? (
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
              ) : (
                <div className="text-center py-10 text-stone-500 text-sm">
                  Tidak ada produk rekomendasi yang tersedia saat ini.
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={`/products?family=${encodeURIComponent(targetFamilyForLink)}`}
                  className="px-8 py-3 bg-[#8D4F38] text-[#F9F7F2] text-xs uppercase tracking-[0.2em] hover:bg-[#7a4532] transition"
                >
                  Belanja Koleksi {result.family}
                </Link>
                <button
                  type="button"
                  onClick={restart}
                  disabled={isSaving}
                  className="px-8 py-3 border border-[#4A3728] text-[#4A3728] text-xs uppercase tracking-[0.15em] hover:bg-[#4A3728] hover:text-[#F9F7F2] transition disabled:opacity-50"
                >
                  Ulangi Kuis
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
