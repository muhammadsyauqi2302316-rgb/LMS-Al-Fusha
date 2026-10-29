import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Volume2,
  BookOpen,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';
import { TashkeelResponse } from '../types/lms';
import { speakArabic } from '../utils/arabicTTS';

export const AiTutorView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'tashkeel' | 'ask'>('tashkeel');

  // Tashkeel state
  const [arabicInput, setArabicInput] = useState('ذهب الطالب الى المدرسة في الصباح');
  const [tashkeelResult, setTashkeelResult] = useState<TashkeelResponse | null>(null);
  const [isTashkeelLoading, setIsTashkeelLoading] = useState(false);
  const [tashkeelError, setTashkeelError] = useState('');
  const [copied, setCopied] = useState(false);

  // Ask AI state
  const [question, setQuestion] = useState('Apa perbedaan antara Mubtada\' dan Fa\'il dalam bahasa Arab?');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isAskLoading, setIsAskLoading] = useState(false);
  const [askError, setAskError] = useState('');

  const sampleArabicPresets = [
    'ذهب الطالب الى المدرسة في الصباح',
    'ان العلم نور يهدي العقول',
    'كتب الولد الرسالة بالقلم الجديد',
    'المؤمن القوي خير واحب الى الله من المؤمن الضعيف'
  ];

  const handleAnalyzeTashkeel = async (textToAnalyze?: string) => {
    const text = textToAnalyze || arabicInput;
    if (!text.trim()) return;

    setIsTashkeelLoading(true);
    setTashkeelError('');
    try {
      const res = await fetch('/api/gemini/tashkeel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      setTashkeelResult(data);
    } catch (err: unknown) {
      console.error(err);
      setTashkeelError(err instanceof Error ? err.message : 'Gagal memproses I\'rab dengan Gemini AI');
    } finally {
      setIsTashkeelLoading(false);
    }
  };

  const handleAskUstadz = async () => {
    if (!question.trim()) return;

    setIsAskLoading(true);
    setAskError('');
    try {
      const res = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context: 'Nahwu, Shorof & Kaidah Bahasa Arab' })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${res.status}`);
      }

      const data = await res.json();
      setAnswer(data.reply);
    } catch (err: unknown) {
      console.error(err);
      setAskError(err instanceof Error ? err.message : 'Gagal memanggil asisten AI');
    } finally {
      setIsAskLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-700 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Didukung Gemini AI Server-Side</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-tajawal">
            Asisten Cerdas & Laboratorium I'rab AI
          </h1>
          <p className="mt-2 text-sm text-amber-100/90 leading-relaxed">
            Analisis kedudukan I'rab kalimat bahasa Arab, lengkapi harakat otomatis (Tashkeel), dan tanyakan segala kemusykilan kaidah Nahwu-Shorof.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 pt-2">
        <button
          onClick={() => setActiveSubTab('tashkeel')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === 'tashkeel'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Tashkeel & Bedah I'rab</span>
        </button>
        <button
          onClick={() => setActiveSubTab('ask')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === 'ask'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span>Tanya Ustadz AI (Q&A Nahwu)</span>
        </button>
      </div>

      {/* Tab: Tashkeel & I'rab */}
      {activeSubTab === 'tashkeel' && (
        <div className="space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Masukkan Kalimat atau Frasa Bahasa Arab:
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={arabicInput}
                onChange={(e) => setArabicInput(e.target.value)}
                placeholder="Tulis kalimat Arab di sini (contoh: ذهب الطالب الى المدرسة)..."
                dir="rtl"
                className="w-full p-4 rounded-xl border border-slate-300 font-arabic text-xl sm:text-2xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
              />
            </div>

            {/* Presets */}
            <div>
              <p className="text-xs text-slate-500 mb-2 font-medium">Contoh Kalimat Siap Uji:</p>
              <div className="flex flex-wrap gap-2">
                {sampleArabicPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setArabicInput(preset);
                      handleAnalyzeTashkeel(preset);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 font-arabic text-xs sm:text-sm transition-colors text-right"
                    dir="rtl"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleAnalyzeTashkeel()}
                disabled={isTashkeelLoading || !arabicInput.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all active:scale-[0.99]"
              >
                {isTashkeelLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Menganalisis Kaidah...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Bedah Harakat & I'rab</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {tashkeelError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{tashkeelError}</span>
            </div>
          )}

          {/* Analysis Results Display */}
          {tashkeelResult && (
            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Hasil Tashkeel & Analisis I'rab
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => speakArabic(tashkeelResult.vocalized)}
                    className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    title="Dengarkan pengucapan audio"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Dengar Audio</span>
                  </button>
                  <button
                    onClick={() => handleCopy(tashkeelResult.vocalized)}
                    className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    title="Salin teks berharakat"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              {/* Vocalized Hero Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-50/80 to-teal-50/50 border border-emerald-200/80 text-center space-y-2">
                <p className="font-arabic text-3xl sm:text-4xl text-emerald-950 font-bold leading-loose tracking-wide" dir="rtl">
                  {tashkeelResult.vocalized}
                </p>
                <p className="text-xs sm:text-sm text-emerald-800/80 italic font-medium">
                  "{tashkeelResult.transliteration}"
                </p>
                <div className="pt-2 border-t border-emerald-200/50 max-w-xl mx-auto">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Terjemahan:</p>
                  <p className="text-sm sm:text-base font-semibold text-slate-800">
                    {tashkeelResult.translation}
                  </p>
                </div>
                {tashkeelResult.summary && (
                  <p className="text-xs text-slate-600 max-w-xl mx-auto mt-2 bg-white/70 p-2.5 rounded-lg border border-emerald-100">
                    💡 <b>Kaidah:</b> {tashkeelResult.summary}
                  </p>
                )}
              </div>

              {/* Word-by-word Breakdown Table */}
              {tashkeelResult.words && tashkeelResult.words.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Tabel Analisis Kata per Kata (I'rab & Shighah):
                  </h3>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
                      <thead className="bg-slate-50 text-slate-700 font-semibold">
                        <tr>
                          <th className="px-4 py-3 text-right">Kata</th>
                          <th className="px-4 py-3 text-left">Jenis Kalimah</th>
                          <th className="px-4 py-3 text-left">Akar / Shighah</th>
                          <th className="px-4 py-3 text-left">Kedudukan I'rab</th>
                          <th className="px-4 py-3 text-left">Arti</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {tashkeelResult.words.map((item, wIdx) => (
                          <tr key={wIdx} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 text-right">
                              <span className="font-arabic text-xl font-bold text-emerald-800" dir="rtl">
                                {item.word}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200">
                                {item.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-600 font-arabic text-base">
                              {item.root || '-'}
                            </td>
                            <td className="px-4 py-3 font-medium text-slate-800">
                              {item.irab}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {item.meaning}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab: Tanya Ustadz AI */}
      {activeSubTab === 'ask' && (
        <div className="space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Tanyakan materi atau keraguan seputar Kaidah Bahasa Arab:
            </label>
            <div className="relative">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Tulis pertanyaanmu (contoh: Kapan Isim dibaca Rafa' dan apa saja tanda-tandanya?)..."
                className="w-full p-3.5 pr-28 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAskUstadz();
                }}
              />
              <button
                onClick={handleAskUstadz}
                disabled={isAskLoading || !question.trim()}
                className="absolute right-2 top-2 bottom-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                {isAskLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Kirim</span>
              </button>
            </div>

            {/* Quick suggested questions */}
            <div>
              <p className="text-xs text-slate-500 mb-2 font-medium">Contoh Pertanyaan Populer:</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  'Apa perbedaan antara Jumlah Ismiyyah dan Jumlah Fi\'liyyah?',
                  'Kapan isim menjadi Majrur selain dengan huruf Jar?',
                  'Bagaimana rumus pembagian Tashrif Fi\'il Tsulatsi?',
                  'Apa tanda jazm pada fi\'il mu\'tal akhir?'
                ].map((sampleQ, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuestion(sampleQ);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 transition-colors border border-slate-200 text-left"
                  >
                    {sampleQ}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {askError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{askError}</span>
            </div>
          )}

          {/* AI Answer Card */}
          {answer && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm border-b border-slate-100 pb-3">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Jawaban & Penjelasan Ustadz AI</span>
              </div>
              <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-line text-slate-800">
                {answer}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
