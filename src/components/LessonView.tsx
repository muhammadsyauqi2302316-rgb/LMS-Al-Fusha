import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Volume2,
  BookOpen,
  HelpCircle,
  BookmarkCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { Course, Lesson, LessonProgress, VocabItem } from '../types/lms';
import { speakArabic } from '../utils/arabicTTS';
import { useAuth } from '../context/AuthContext';
import { saveLessonProgressToFirestore, saveVocabToFirestore } from '../services/lmsService';

interface LessonViewProps {
  course: Course;
  lesson: Lesson;
  onBack: () => void;
  onLessonCompleted: (lessonId: string, score: number) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  course,
  lesson,
  onBack,
  onLessonCompleted
}) => {
  const { userProfile, addXP } = useAuth();
  const [activeTab, setActiveTab] = useState<'content' | 'vocabulary' | 'quiz'>('content');
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [savedVocabIds, setSavedVocabIds] = useState<Record<string, boolean>>({});

  const handleSpeak = (text: string) => {
    speakArabic(text);
  };

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    if (isQuizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    let correctCount = 0;
    lesson.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / lesson.quiz.length) * 100);
    setQuizScore(scorePercentage);
    setIsQuizSubmitted(true);

    if (scorePercentage >= 70) {
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      // Add XP & save progress to Firestore
      await addXP(50);
      if (userProfile) {
        const progress: LessonProgress = {
          userId: userProfile.id,
          lessonId: lesson.id,
          courseId: course.id,
          completed: true,
          quizScore: scorePercentage,
          updatedAt: new Date().toISOString()
        };
        await saveLessonProgressToFirestore(userProfile.id, progress);
        onLessonCompleted(lesson.id, scorePercentage);
      }
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setIsQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleSaveVocab = async (vocab: VocabItem) => {
    if (!userProfile) return;
    try {
      await saveVocabToFirestore(userProfile.id, vocab);
      setSavedVocabIds((prev) => ({ ...prev, [vocab.id]: true }));
    } catch (err) {
      console.error('Failed to bookmark vocab:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Kembali ke daftar kursus"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {course.title}
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 font-tajawal">
              {lesson.title}
            </h1>
            <p className="text-sm font-arabic text-emerald-800 font-semibold mt-0.5" dir="rtl">
              {lesson.titleArabic}
            </p>
          </div>
        </div>

        {/* Visibility Toggles */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setShowTransliteration(!showTransliteration)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
              showTransliteration
                ? 'bg-slate-100 text-slate-800 border-slate-300'
                : 'bg-white text-slate-400 border-slate-200'
            }`}
            title="Sembunyikan/Tampilkan Transliterasi Latin"
          >
            {showTransliteration ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Latin</span>
          </button>
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
              showTranslation
                ? 'bg-slate-100 text-slate-800 border-slate-300'
                : 'bg-white text-slate-400 border-slate-200'
            }`}
            title="Sembunyikan/Tampilkan Arti Bahasa Indonesia"
          >
            {showTranslation ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Arti</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 pt-2">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'content'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Materi Pembelajaran</span>
        </button>
        <button
          onClick={() => setActiveTab('vocabulary')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'vocabulary'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>Kosakata ({lesson.vocabulary.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'quiz'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Kuis Uji Kompetensi ({lesson.quiz.length})</span>
        </button>
      </div>

      {/* Tab: Content */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {lesson.sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 font-tajawal">
                  {section.title}
                </h2>
              </div>

              {/* Main Arabic display if present */}
              {section.arabicText && (
                <div className="p-4 sm:p-6 rounded-xl bg-emerald-50/60 border border-emerald-200/60 flex flex-col items-center text-center relative group">
                  <button
                    onClick={() => handleSpeak(section.arabicText!)}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-white/90 hover:bg-emerald-600 hover:text-white text-emerald-700 shadow-xs border border-emerald-200 transition-colors"
                    title="Dengarkan pengucapan audio"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <p className="font-arabic text-2xl sm:text-3xl text-emerald-950 font-bold leading-relaxed mb-2" dir="rtl">
                    {section.arabicText}
                  </p>
                  {showTransliteration && section.transliteration && (
                    <p className="text-xs sm:text-sm text-emerald-800/80 italic font-medium">
                      "{section.transliteration}"
                    </p>
                  )}
                  {showTranslation && section.indonesian && (
                    <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1 max-w-xl">
                      {section.indonesian}
                    </p>
                  )}
                </div>
              )}

              {/* Explanation text */}
              {section.explanation && (
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
                  <p>{section.explanation}</p>
                </div>
              )}

              {/* Dialogue lines if present */}
              {section.dialogueLines && (
                <div className="space-y-3 pt-2">
                  {section.dialogueLines.map((line, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white font-bold text-xs">
                          {line.speaker}
                        </span>
                        {line.speakerArabic && (
                          <span className="font-arabic text-sm text-slate-600 font-semibold">
                            ({line.speakerArabic})
                          </span>
                        )}
                      </div>

                      <div className="flex-1 sm:text-right">
                        <div className="flex items-center sm:justify-end gap-2">
                          <button
                            onClick={() => handleSpeak(line.arabic)}
                            className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600"
                            title="Dengar audio"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <p className="font-arabic text-xl text-slate-900 font-bold" dir="rtl">
                            {line.arabic}
                          </p>
                        </div>
                        {showTransliteration && (
                          <p className="text-xs text-slate-500 italic mt-0.5">
                            {line.transliteration}
                          </p>
                        )}
                        {showTranslation && (
                          <p className="text-xs text-slate-700 font-medium mt-0.5">
                            {line.translation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Table Data if present */}
              {section.tableData && (
                <div className="overflow-x-auto rounded-xl border border-slate-200 mt-2">
                  <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
                    <thead className="bg-slate-50 text-slate-700 font-semibold">
                      <tr>
                        {section.tableData.headers.map((head, hIdx) => (
                          <th key={hIdx} className="px-4 py-3 text-left">
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {section.tableData.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/50">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-4 py-3 text-slate-800">
                              {cIdx === 1 ? (
                                <span className="font-arabic text-lg font-bold text-emerald-800" dir="rtl">
                                  {cell}
                                </span>
                              ) : (
                                cell
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}

          {/* Bottom Action: Proceed to Quiz */}
          <div className="flex justify-end p-4 bg-white rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('quiz')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 active:scale-[0.99] transition-all"
            >
              <span>Kerjakan Kuis Evaluasi</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab: Vocabulary */}
      {activeTab === 'vocabulary' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
            <span>Dengarkan audio pengucapan atau simpan kosakata ke perbendaharaan pribadi Anda.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lesson.vocabulary.map((vocab) => {
              const isSaved = savedVocabIds[vocab.id];

              return (
                <div
                  key={vocab.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                      {vocab.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSpeak(vocab.arabic)}
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        title="Dengar audio"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSaveVocab(vocab)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isSaved
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-500 hover:text-amber-600'
                        }`}
                        title={isSaved ? 'Tersimpan di Bank Mufradat' : 'Simpan ke Bank Mufradat'}
                      >
                        <BookmarkCheck className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-center py-2">
                    <p className="font-arabic text-3xl font-bold text-slate-900 leading-normal" dir="rtl">
                      {vocab.arabic}
                    </p>
                    <p className="text-xs text-slate-500 italic mt-1">
                      {vocab.transliteration}
                    </p>
                    <p className="text-sm font-semibold text-emerald-700 mt-1">
                      {vocab.meaning}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Quiz */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {/* Result Banner if submitted */}
          {isQuizSubmitted && quizScore !== null && (
            <div
              className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left ${
                quizScore >= 70
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl ${
                    quizScore >= 70
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {quizScore}%
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {quizScore >= 70 ? 'Mumtaz! Anda Lulus Kuis Bab Ini' : 'Terus Semangat! Coba Ulangi Materi'}
                  </h3>
                  <p className="text-xs sm:text-sm opacity-90">
                    {quizScore >= 70
                      ? 'Nilai Anda tercatat di database Firestore dan mendapatkan +50 XP.'
                      : 'Skor minimal untuk kelulusan modul adalah 70%. Anda dapat mengulang kuis.'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleResetQuiz}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-800 font-semibold text-xs sm:text-sm border shadow-xs hover:bg-slate-50"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Kuis</span>
              </button>
            </div>
          )}

          {/* Questions list */}
          <div className="space-y-5">
            {lesson.quiz.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;

              return (
                <div
                  key={q.id}
                  className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {qIdx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 font-tajawal">
                        {q.question}
                      </h4>
                      {q.arabicPhrase && (
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleSpeak(q.arabicPhrase!)}
                            className="p-1 rounded-md text-emerald-700 hover:bg-emerald-50"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <p className="font-arabic text-xl font-bold text-emerald-800" dir="rtl">
                            {q.arabicPhrase}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 gap-2.5 pt-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      let btnClasses = 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white';

                      if (isQuizSubmitted) {
                        if (optIdx === q.correctIndex) {
                          btnClasses = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold ring-1 ring-emerald-500';
                        } else if (isSelected && optIdx !== q.correctIndex) {
                          btnClasses = 'border-red-400 bg-red-50 text-red-800 line-through';
                        } else {
                          btnClasses = 'border-slate-200 text-slate-400 bg-slate-50/50';
                        }
                      } else if (isSelected) {
                        btnClasses = 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold ring-2 ring-emerald-600/30';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectAnswer(q.id, optIdx)}
                          disabled={isQuizSubmitted}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnClasses}`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </span>

                          {isQuizSubmitted && optIdx === q.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {isQuizSubmitted && isSelected && optIdx !== q.correctIndex && (
                            <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation feedback after submit */}
                  {isQuizSubmitted && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                      <span className="font-bold text-slate-900 block mb-0.5">Penjelasan Kaidah:</span>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          {!isQuizSubmitted && (
            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex justify-between items-center">
              <span className="text-xs text-slate-500">
                Terjawab {Object.keys(selectedAnswers).length} dari {lesson.quiz.length} soal
              </span>
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < lesson.quiz.length}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all active:scale-[0.99]"
              >
                Kirim & Nilai Kuis
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
