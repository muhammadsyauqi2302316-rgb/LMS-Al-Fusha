import React, { useState } from 'react';
import {
  MessageSquare,
  Volume2,
  Send,
  Sparkles,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { MuhadatsahResponse } from '../types/lms';
import { speakArabic } from '../utils/arabicTTS';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  details?: MuhadatsahResponse;
  timestamp: string;
}

export const MuhadatsahView: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState('At-Ta\'aruf (Perkenalan Diri)');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ! أَهْلًا وَسَهْلًا بِكَ فِي حِوَارِنَا الْيَوْمِيِّ. كَيْفَ حَالُكَ يَا صَدِيقِي؟',
      details: {
        arabicResponse: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ! أَهْلًا وَسَهْلًا بِكَ فِي حِوَارِنَا الْيَوْمِيِّ. كَيْفَ حَالُكَ يَا صَدِيقِي؟',
        transliteration: "Assalamu 'alaikum warahmatullahi wabarakatuh! Ahlan wa sahlan bika fii hiwarinal yawmii. Kayfa haaluka yaa shadiiqii?",
        indonesianTranslation: 'Semoga keselamatan tercurah kepadamu! Selamat datang di percakapan harian kita. Bagaimana kabarmu wahai kawanku?',
        correctionFeedback: 'Mumtaz! Mulailah menjawab dengan sapaan atau kabarmu.',
        suggestedNextReplies: [
          'وَعَلَيْكُمُ السَّلَامُ، أَنَا بِخَيْرٍ وَالْحَمْدُ لِلَّهِ (Wa\'alaikumussalam, saya baik alhamdulillah)',
          'أَهْلًا بِكَ يَا أُسْتَاذُ، كَيْفَ صِحَّتُكَ؟ (Halo ustadz, bagaimana kesehatan Anda?)'
        ]
      },
      timestamp: 'Baru saja'
    }
  ]);

  const topics = [
    { title: 'At-Ta\'aruf (Perkenalan Diri)', icon: '🤝' },
    { title: 'Fil Math\'am (Di Restoran Arab)', icon: '🍽️' },
    { title: 'Fil Jami\'ah (Di Lingkungan Kampus)', icon: '🎓' },
    { title: 'Fil Matar was Safar (Di Bandara & Perjalanan)', icon: '✈️' }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      const historyPayload = newHistory.map((m) => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch('/api/gemini/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          topic: selectedTopic,
          history: historyPayload.slice(-6)
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data: MuhadatsahResponse = await res.json();

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'assistant',
        text: data.arabicResponse,
        details: data,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const fallbackAiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'assistant',
        text: 'أَحْسَنْتَ! كَلَامُكَ وَاضِحٌ وَمَفْهُومٌ.',
        details: {
          arabicResponse: 'أَحْسَنْتَ! كَلَامُكَ وَاضِحٌ وَمَفْهُومٌ.',
          transliteration: "Ahsanta! Kalaamuka waadhihun wa mafhuum.",
          indonesianTranslation: 'Bagus sekali! Kalimatmu jelas dan mudah dipahami.',
          suggestedNextReplies: ['شُكْرًا جَزِيلًا يَا أُسْتَاذُ (Terima kasih banyak ustadz)']
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentSuggestedReplies =
    messages[messages.length - 1]?.details?.suggestedNextReplies || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-teal-950 text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/20 text-teal-200 border border-teal-300/30 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>Latihan Dialog Interaktif Real-Time</span>
          </div>
          <h1 className="text-2xl font-bold font-tajawal">
            Muhadatsah AI: Partner Percakapan Bahasa Arab
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-xl">
            Latih kelancaran berbicara bahasa Arab Fusha bersama Ustadz AI. Dilengkapi harakat, transliterasi, audio pengucapan, dan koreksi gramatika langsung.
          </p>
        </div>

        {/* Topic Selector */}
        <div className="shrink-0">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-teal-200 mb-1">
            Pilih Situasi / Topik:
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => {
              setSelectedTopic(e.target.value);
            }}
            className="bg-white/10 border border-white/20 text-white text-xs rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-teal-400 font-medium"
          >
            {topics.map((t, idx) => (
              <option key={idx} value={t.title} className="text-slate-900">
                {t.icon} {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[580px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isAi = msg.sender === 'assistant';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] sm:max-w-[78%] ${
                  isAi ? 'self-start mr-auto' : 'self-end ml-auto flex-row-reverse'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isAi
                      ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xs'
                      : 'bg-slate-700 text-white'
                  }`}
                >
                  {isAi ? 'ع' : 'أَنَا'}
                </div>

                {/* Bubble */}
                <div
                  className={`rounded-2xl p-4 shadow-xs space-y-2 ${
                    isAi
                      ? 'bg-white border border-slate-200 text-slate-900 rounded-tl-none'
                      : 'bg-emerald-600 text-white rounded-tr-none'
                  }`}
                >
                  {/* Arabic text with audio */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] opacity-70 font-medium">
                      {isAi ? 'Ustadz AI' : 'Pelajar'} • {msg.timestamp}
                    </span>
                    {isAi && (
                      <button
                        onClick={() => speakArabic(msg.text)}
                        className="p-1 rounded-md text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title="Dengar pengucapan audio"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p
                    className={`font-arabic text-xl sm:text-2xl font-bold leading-relaxed ${
                      isAi ? 'text-slate-900' : 'text-white'
                    }`}
                    dir="rtl"
                  >
                    {msg.text}
                  </p>

                  {/* Transliteration & Indonesian translation for AI messages */}
                  {msg.details && (
                    <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                      <p className="text-emerald-800 italic font-medium">
                        "{msg.details.transliteration}"
                      </p>
                      <p className="text-slate-600 font-semibold">
                        {msg.details.indonesianTranslation}
                      </p>
                      {msg.details.correctionFeedback && (
                        <div className="mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{msg.details.correctionFeedback}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3 self-start mr-auto max-w-[70%]">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                ع
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 shadow-xs text-xs text-slate-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>Ustadz AI sedang menyusun tanggapan & harakat...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Replies Quick Bar */}
        {currentSuggestedReplies.length > 0 && !isLoading && (
          <div className="px-4 py-2 bg-emerald-50/70 border-t border-emerald-100 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[11px] font-bold text-emerald-800 shrink-0 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Saran Respon:
            </span>
            <div className="flex gap-2">
              {currentSuggestedReplies.map((reply, rIdx) => {
                const arabicOnly = reply.split('(')[0]?.trim() || reply;
                return (
                  <button
                    key={rIdx}
                    onClick={() => handleSendMessage(arabicOnly)}
                    className="px-3 py-1 rounded-lg bg-white border border-emerald-200 hover:border-emerald-400 text-emerald-900 text-xs font-arabic whitespace-nowrap shadow-2xs hover:bg-emerald-100 transition-colors"
                    dir="rtl"
                  >
                    {reply}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tulis pesan bahasa Arab atau Indonesia (contoh: كَيْفَ أَذْهَبُ إِلَى الْمَطَارِ؟)..."
              dir="auto"
              className="flex-1 p-3 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center gap-1.5 active:scale-[0.99]"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
