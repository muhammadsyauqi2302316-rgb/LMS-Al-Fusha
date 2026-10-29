import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Search,
  Plus,
  CheckCircle2,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react';
import { VocabItem } from '../types/lms';
import { speakArabic } from '../utils/arabicTTS';
import { useAuth } from '../context/AuthContext';
import { getUserSavedVocabulary, saveVocabToFirestore } from '../services/lmsService';

const DEFAULT_VOCABULARY: VocabItem[] = [
  { id: 'mv-1', arabic: 'مَدْرَسَةٌ', transliteration: 'Madrasatun', meaning: 'Sekolah', category: 'Pendidikan', exampleSentence: 'الْمَدْرَسَةُ نَظِيفَةٌ وَجَمِيلَةٌ', exampleTranslation: 'Sekolah itu bersih dan indah' },
  { id: 'mv-2', arabic: 'جَامِعَةٌ', transliteration: "Jaami'atun", meaning: 'Universitas', category: 'Pendidikan', exampleSentence: 'أَدْرُسُ فِي جَامِعَةِ مَالَانْج', exampleTranslation: 'Saya belajar di Universitas Malang' },
  { id: 'mv-3', arabic: 'أُسْتَاذٌ', transliteration: 'Ustaadzun', meaning: 'Guru / Dosen / Profesor', category: 'Pendidikan', exampleSentence: 'يَشْرَحُ الْأُسْتَاذُ الدَّرْسَ', exampleTranslation: 'Ustadz menjelaskan pelajaran' },
  { id: 'mv-4', arabic: 'مَطْعَمٌ', transliteration: "Math'amun", meaning: 'Restoran / Rumah Makan', category: 'Makanan', exampleSentence: 'نَأْكُلُ الْغَدَاءَ فِي الْمَطْعَمِ', exampleTranslation: 'Kita makan siang di restoran' },
  { id: 'mv-5', arabic: 'شَايٌ', transliteration: 'Syaayun', meaning: 'Teh', category: 'Makanan', exampleSentence: 'أَشْرَبُ الشَّايَ السَّاخِنَ', exampleTranslation: 'Saya meminum teh panas' },
  { id: 'mv-6', arabic: 'قَهْوَةٌ', transliteration: 'Qahwatun', meaning: 'Kopi', category: 'Makanan', exampleSentence: 'الْقَهْوَةُ الْعَرَبِيَّةُ لَذِيذَةٌ', exampleTranslation: 'Kopi Arab sangat lezat' },
  { id: 'mv-7', arabic: 'صَبَاحٌ', transliteration: 'Shabaahun', meaning: 'Pagi hari', category: 'Waktu', exampleSentence: 'صَبَاحُ الْخَيْرِ يَا أَخِي', exampleTranslation: 'Selamat pagi saudaraku' },
  { id: 'mv-8', arabic: 'مَسَاءٌ', transliteration: "Masaa'un", meaning: 'Sore / Petang', category: 'Waktu', exampleSentence: 'مَسَاءُ النُّورِ وَالسُّرُورِ', exampleTranslation: 'Selamat petang yang bercahaya' },
  { id: 'mv-9', arabic: 'سَيَّارَةٌ', transliteration: 'Sayyaaratun', meaning: 'Mobil', category: 'Transportasi', exampleSentence: 'رَكِبْتُ السَّيَّارَةَ إِلَى الْمَدِينَةِ', exampleTranslation: 'Saya naik mobil menuju kota' },
  { id: 'mv-10', arabic: 'طَائِرَةٌ', transliteration: "Thaa'iratun", meaning: 'Pesawat terbang', category: 'Transportasi', exampleSentence: 'سَافَرْتُ بِالطَّائِرَةِ', exampleTranslation: 'Saya bepergian dengan pesawat' },
  { id: 'mv-11', arabic: 'كِتَابٌ', transliteration: 'Kitaabun', meaning: 'Buku', category: 'Pendidikan', exampleSentence: 'هَذَا كِتَابٌ مُفِيدٌ جِدًّا', exampleTranslation: 'Ini adalah buku yang sangat bermanfaat' },
  { id: 'mv-12', arabic: 'حَقِيبَةٌ', transliteration: 'Haqiybatun', meaning: 'Tas', category: 'Pendidikan', exampleSentence: 'وَضَعْتُ الْأَقْلَامَ فِي الْحَقِيبَةِ', exampleTranslation: 'Saya menaruh pulpen-pulpen di dalam tas' }
];

export const MufradatView: React.FC = () => {
  const { userProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  // Custom add vocab modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newArabic, setNewArabic] = useState('');
  const [newTranslit, setNewTranslit] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newCategory, setNewCategory] = useState('Umum');

  const categories = ['Semua', 'Pendidikan', 'Makanan', 'Waktu', 'Transportasi', 'Umum'];

  // Load saved vocab from Firestore
  useEffect(() => {
    if (userProfile) {
      getUserSavedVocabulary(userProfile.id)
        .then((savedList) => {
          const map: Record<string, boolean> = {};
          savedList.forEach((item) => {
            map[item.id] = true;
          });
          setBookmarkedMap(map);
        })
        .catch((err) => console.error('Error fetching bookmarked vocab:', err));
    }
  }, [userProfile]);

  const toggleBookmark = async (vocab: VocabItem) => {
    if (!userProfile) return;
    const isCurrentlySaved = bookmarkedMap[vocab.id];
    const newMap = { ...bookmarkedMap, [vocab.id]: !isCurrentlySaved };
    setBookmarkedMap(newMap);

    try {
      await saveVocabToFirestore(userProfile.id, {
        ...vocab,
        mastered: !isCurrentlySaved
      });
    } catch (err) {
      console.error('Failed to sync bookmark to Firestore:', err);
    }
  };

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddCustomVocab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArabic.trim() || !newMeaning.trim() || !userProfile) return;

    const newItem: VocabItem = {
      id: 'custom-' + Date.now(),
      arabic: newArabic.trim(),
      transliteration: newTranslit.trim() || newArabic.trim(),
      meaning: newMeaning.trim(),
      category: newCategory
    };

    try {
      await saveVocabToFirestore(userProfile.id, newItem);
      DEFAULT_VOCABULARY.unshift(newItem);
      setBookmarkedMap((prev) => ({ ...prev, [newItem.id]: true }));
      setShowAddModal(false);
      setNewArabic('');
      setNewTranslit('');
      setNewMeaning('');
    } catch (err) {
      console.error('Failed to add custom vocab:', err);
    }
  };

  const filteredVocab = DEFAULT_VOCABULARY.filter((item) => {
    const matchesCat = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch =
      item.arabic.includes(searchTerm) ||
      item.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBookmark = !showOnlyBookmarked || bookmarkedMap[item.id];
    return matchesCat && matchesSearch && matchesBookmark;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-800 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-400/20 text-indigo-200 border border-indigo-300/30 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Bank Kartu Kosakata Terpadu</span>
          </div>
          <h1 className="text-2xl font-bold font-tajawal">
            Bank Mufradat & Flashcard Bahasa Arab
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100/90 mt-1 max-w-xl">
            Hafalkan kosakata tematik dengan audio pengucapan instan, uji daya ingat dengan mode balik kartu (Flashcard), dan simpan kata favorit ke profil Firestore Anda.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-center flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs sm:text-sm shadow-md hover:bg-indigo-50 active:scale-[0.99] transition-all shrink-0"
        >
          <Plus className="w-4 h-4 text-indigo-600" />
          <span>Tambah Kosakata Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari arti, arab, atau latin..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Category & Bookmark Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              showOnlyBookmarked
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-500" />
            <span>Tersimpan Saja</span>
          </button>

          <div className="flex gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Flashcards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVocab.map((item) => {
          const isSaved = bookmarkedMap[item.id];
          const isRevealed = revealedIds[item.id];

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-emerald-300 transition-all group relative overflow-hidden"
            >
              {/* Card top */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                  {item.category}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => speakArabic(item.arabic)}
                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                    title="Dengar pengucapan audio"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleBookmark(item)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isSaved
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-400 hover:text-amber-600'
                    }`}
                    title={isSaved ? 'Hapus bookmark' : 'Simpan ke profil Firestore'}
                  >
                    <BookmarkCheck className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Arabic Main */}
              <div className="text-center py-4">
                <p className="font-arabic text-3xl sm:text-4xl font-bold text-slate-900 leading-normal" dir="rtl">
                  {item.arabic}
                </p>

                {/* Hidden / Revealed meaning for active recall */}
                <div className="mt-3 min-h-[50px] flex flex-col items-center justify-center">
                  {isRevealed ? (
                    <div>
                      <p className="text-xs text-slate-500 italic">
                        {item.transliteration}
                      </p>
                      <p className="text-sm font-bold text-emerald-700 mt-0.5">
                        {item.meaning}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleReveal(item.id)}
                      className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Buka Arti & Latin</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Example sentence if available */}
              {item.exampleSentence && isRevealed && (
                <div className="mt-3 pt-3 border-t border-slate-100 text-center">
                  <p className="font-arabic text-sm text-slate-800 font-semibold" dir="rtl">
                    {item.exampleSentence}
                  </p>
                  <p className="text-[11px] text-slate-500 italic mt-0.5">
                    {item.exampleTranslation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredVocab.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
          <p className="text-slate-500 text-sm">Tidak ada kosakata yang cocok dengan filter atau pencarian Anda.</p>
        </div>
      )}

      {/* Modal: Tambah Kosakata Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4 font-tajawal">
              Tambah Kosakata ke Profil Anda
            </h2>
            <form onSubmit={handleAddCustomVocab} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Kata Arab (Berharakat)
                </label>
                <input
                  type="text"
                  required
                  value={newArabic}
                  onChange={(e) => setNewArabic(e.target.value)}
                  placeholder="contoh: حَاسُوبٌ"
                  dir="rtl"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-arabic text-lg text-right"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Transliterasi Latin
                </label>
                <input
                  type="text"
                  value={newTranslit}
                  onChange={(e) => setNewTranslit(e.target.value)}
                  placeholder="contoh: Haasuubun"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Arti Bahasa Indonesia
                </label>
                <input
                  type="text"
                  required
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  placeholder="contoh: Komputer"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Kategori
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Pendidikan">Pendidikan</option>
                  <option value="Makanan">Makanan</option>
                  <option value="Waktu">Waktu</option>
                  <option value="Transportasi">Transportasi</option>
                  <option value="Teknologi">Teknologi</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Simpan ke Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
