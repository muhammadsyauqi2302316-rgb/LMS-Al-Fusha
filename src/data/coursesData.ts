import { Course } from '../types/lms';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-nahwu-1',
    title: 'Nahwu Dasar: Al-Ajurrumiyyah',
    titleArabic: 'الْمُقَدِّمَةُ الْآجُرُّومِيَّةُ فِي عِلْمِ النَّحْوِ',
    level: 'Mubtadi\' (Pemula)',
    category: 'Nahwu',
    iconName: 'BookOpen',
    description: 'Pelajari pondasi utama tata bahasa Arab: pembagian kata, tanda-tanda isim dan fi\'il, serta 4 keadaan I\'rab.',
    lessons: [
      {
        id: 'nahwu-lesson-1',
        courseId: 'course-nahwu-1',
        title: 'Mengenal Al-Kalam & Pembagian Kata',
        titleArabic: 'أَقْسَامُ الْكَلَامِ: الاِسْمُ وَالْفِعْلُ وَالْحَرْفُ',
        order: 1,
        durationMinutes: 15,
        summary: 'Memahami definisi Kalam menurut ulama nahwu dan pembagian kata bahasa Arab menjadi 3: Isim, Fi\'il, dan Huruf.',
        sections: [
          {
            title: 'Definisi Al-Kalam',
            type: 'theory',
            arabicText: 'الْكَلَامُ هُوَ اللَّفْظُ الْمُرَكَّبُ الْمُفِيدُ بِالْوَضْعِ',
            transliteration: "Al-Kalaamu huwal lafdzul murakkabul mufiidu bil wadh'i",
            indonesian: 'Kalam adalah lafazh yang tersusun, memberi faedah pemahaman yang sempurna, dengan menggunakan bahasa Arab.',
            explanation: 'Dalam gramatika bahasa Arab, suatu tuturan disebut "Kalam" jika memenuhi 4 syarat: bersuara/berhuruf (Lafadz), terdiri minimal 2 kata (Murakkab), bisa dipahami tanpa pertanyaan lagi (Mufid), dan menggunakan kaidah bahasa Arab (Bil Wadh\'i).'
          },
          {
            title: 'Tiga Pembagian Kata (Aqsamul Kalam)',
            type: 'table',
            explanation: 'Seluruh perbendaharaan kata dalam bahasa Arab hanya terbagi ke dalam 3 jenis:',
            tableData: {
              headers: ['Jenis Kata', 'Bahasa Arab', 'Ciri & Definisi', 'Contoh'],
              rows: [
                ['Isim (Kata Benda/Sifat)', 'الاِسْمُ', 'Kata yang memiliki makna mandiri dan TIDAK terikat waktu.', 'كِتَابٌ (Buku), مُحَمَّدٌ (Muhammad), جَمِيلٌ (Indah)'],
                ['Fi\'il (Kata Kerja)', 'الْفِعْلُ', 'Kata yang memiliki makna mandiri dan TERIKAT dengan waktu.', 'كَتَبَ (Telah menulis), يَكْتُبُ (Sedang menulis), اُكْتُبْ (Tulislah!)'],
                ['Huruf (Kata Tugas)', 'الْحَرْفُ', 'Kata yang maknanya baru sempurna jika bersambung dengan kata lain.', 'فِي (Di dalam), مِنْ (Dari), عَلَى (Di atas), إِلَى (Ke)']
              ]
            }
          },
          {
            title: 'Contoh Penggabungan Menjadi Jumlah Mufidah',
            type: 'examples',
            arabicText: 'يَقْرَأُ الطَّالِبُ الْكِتَابَ فِي الْمَكْتَبَةِ',
            transliteration: "Yaqra'ut thalibul kitaaba fil maktabah",
            indonesian: 'Siswa itu sedang membaca buku di perpustakaan.',
            explanation: 'Kalimat ini menggabungkan: Fi\'il (يَقْرَأُ), Isim (الطَّالِبُ, الْكِتَابَ, الْمَكْتَبَةِ), dan Huruf (فِي).'
          }
        ],
        vocabulary: [
          { id: 'v-1', arabic: 'كَلَامٌ', transliteration: 'Kalaamun', meaning: 'Ucapan / Kalimat', category: 'Nahwu' },
          { id: 'v-2', arabic: 'اِسْمٌ', transliteration: 'Ismun', meaning: 'Kata benda / nama', category: 'Nahwu' },
          { id: 'v-3', arabic: 'فِعْلٌ', transliteration: "Fi'lun", meaning: 'Kata kerja', category: 'Nahwu' },
          { id: 'v-4', arabic: 'حَرْفٌ', transliteration: 'Harfun', meaning: 'Kata depan / tugas', category: 'Nahwu' },
          { id: 'v-5', arabic: 'مَكْتَبَةٌ', transliteration: 'Maktabatun', meaning: 'Perpustakaan', category: 'Mufradat' }
        ],
        quiz: [
          {
            id: 'q-n1-1',
            question: 'Manakah dari berikut ini yang merupakan definisi Isim?',
            options: [
              'Kata yang menunjukkan pekerjaan terikat waktu lampau',
              'Kata yang menunjukkan makna mandiri tanpa terikat waktu',
              'Kata yang tidak memiliki arti sama sekali',
              'Huruf sambung yang selalu berada di akhir'
            ],
            correctIndex: 1,
            explanation: 'Isim adalah kata yang memiliki makna pada dirinya sendiri dan tidak terikat dengan salah satu dari tiga dimensi waktu (lampau, sekarang, mendatang).'
          },
          {
            id: 'q-n1-2',
            arabicPhrase: 'ذَهَبَ عَلِيٌّ إِلَى الْمَسْجِدِ',
            question: 'Pada kalimat di atas, manakah kata yang berkedudukan sebagai HURUF?',
            options: ['ذَهَبَ', 'عَلِيٌّ', 'إِلَى', 'الْمَسْجِدِ'],
            correctIndex: 2,
            explanation: 'إِلَى adalah Huruf Jar yang bermakna "ke / menuju".'
          },
          {
            id: 'q-n1-3',
            question: 'Berapakah pembagian kata dalam bahasa Arab menurut kitab Al-Ajurrumiyyah?',
            options: ['2 (Isim dan Fi\'il)', '3 (Isim, Fi\'il, dan Huruf)', '5 jenis', '8 jenis'],
            correctIndex: 1,
            explanation: 'Kitab Al-Ajurrumiyyah menyatakan: "Wa aqsamuhu tsalatsatun: ismun, wa fi\'lun, wa harfun jaa-a lima\'na".'
          }
        ]
      },
      {
        id: 'nahwu-lesson-2',
        courseId: 'course-nahwu-1',
        title: 'Tanda-tanda Isim & Huruf Jar',
        titleArabic: 'عَلَامَاتُ الاِسْمِ وَحُرُوفُ الْخَفْضِ',
        order: 2,
        durationMinutes: 18,
        summary: 'Mengenal ciri-ciri khusus Isim: Tanwin, Alif-Lam (Al-), Khafadh/Kasrah, serta kemasukan Huruf Jar.',
        sections: [
          {
            title: '4 Tanda Pengenal Isim',
            type: 'theory',
            arabicText: 'فَالِاسْمُ يُعْرَفُ: بِالْخَفْضِ، وَالتَّنْوِينِ، وَدُخُولِ الْأَلِفِ وَاللَّامِ، وَحُرُوفِ الْخَفْضِ',
            transliteration: 'Fal ismu yu\'rafu: bil khafdhi, wat tanwiini, wa dukhuulil alifi wal laami, wa hurufil khafdh.',
            indonesian: 'Maka Isim dikenali dengan: baris kasrah, tanwin, kemasukan Alif-Lam (الـ), dan kemasukan huruf-huruf Jar.',
            explanation: 'Jika Anda menemukan suatu kata dalam teks Arab yang ber-tanwin atau diawali alif lam (الـ), maka kata tersebut 100% adalah Isim!'
          },
          {
            title: 'Huruf-Huruf Jar yang Sering Digunakan',
            type: 'table',
            explanation: 'Setiap Isim yang didahului huruf jar akan berharakat kasrah (majrur):',
            tableData: {
              headers: ['Huruf Jar', 'Arti', 'Contoh Kalimat', 'Terjemah'],
              rows: [
                ['مِنْ (Min)', 'Dari', 'خَرَجْتُ مِنَ الْبَيْتِ', 'Saya keluar dari rumah'],
                ['إِلَى (Ila)', 'Ke / Menuju', 'سَافَرَ إِلَى مَكَّةَ', 'Dia bepergian ke Makkah'],
                ['عَنْ (\'An)', 'Dari / Tentang', 'حَدَّثَنِي عَنِ الْعِلْمِ', 'Ceritakan padaku tentang ilmu'],
                ['عَلَى (\'Ala)', 'Di atas', 'الْقَلَمُ عَلَى الْمَكْتَبِ', 'Pena itu di atas meja'],
                ['فِي (Fi)', 'Di dalam', 'الْمَاءُ فِي الْكُوبِ', 'Air itu di dalam gelas'],
                ['الْبَاءُ (Bi)', 'Dengan / Menggunakan', 'كَتَبْتُ بِالْقَلَمِ', 'Saya menulis dengan pena'],
                ['اللَّامُ (Li)', 'Milik / Untuk', 'الْحَمْدُ لِلَّهِ', 'Segala puji bagi Allah']
              ]
            }
          }
        ],
        vocabulary: [
          { id: 'v-6', arabic: 'تَنْوِينٌ', transliteration: 'Tanwiinun', meaning: 'Harakat ganda (an, in, un)', category: 'Nahwu' },
          { id: 'v-7', arabic: 'قَلَمٌ', transliteration: 'Qalamun', meaning: 'Pena', category: 'Mufradat' },
          { id: 'v-8', arabic: 'مَكْتَبٌ', transliteration: 'Maktabun', meaning: 'Meja kerja', category: 'Mufradat' },
          { id: 'v-9', arabic: 'بَيْتٌ', transliteration: 'Baytun', meaning: 'Rumah', category: 'Mufradat' }
        ],
        quiz: [
          {
            id: 'q-n2-1',
            question: 'Apakah Isim bisa digabungkan antara "Alif Lam (الـ)" dan "Tanwin" pada satu kata yang sama?',
            options: [
              'Bisa, keduanya boleh bersamaan',
              'Tidak bisa, Alif Lam dan Tanwin bermusuhan (tidak pernah bertemu)',
              'Hanya bisa pada kalimat tanya',
              'Boleh khusus untuk nama kota'
            ],
            correctIndex: 1,
            explanation: 'Al- dan Tanwin adalah dua tanda yang saling meniadakan. Kata berkategori isim hanya boleh memilih salah satu: الْكِتَابُ (al-kitabu) atau كِتَابٌ (kitabun), tidak pernah *الْكِتَابٌ.'
          },
          {
            id: 'q-n2-2',
            arabicPhrase: 'جَلَسَ الطَّالِبُ عَلَى الْكُرْسِيِّ',
            question: 'Mengapa kata الْكُرْسِيِّ berharakat kasrah di akhirnya?',
            options: [
              'Karena didahului huruf jar عَلَى',
              'Karena merupakan kata kerja lampau',
              'Karena merupakan mubtada\'',
              'Karena subjek jamak'
            ],
            correctIndex: 0,
            explanation: 'عَلَى adalah huruf jar yang membuat isim sesudahnya menjadi majrur dengan tanda kasrah.'
          }
        ]
      },
      {
        id: 'nahwu-lesson-3',
        courseId: 'course-nahwu-1',
        title: 'Mengenal I\'rab & 4 Keadaannya',
        titleArabic: 'بَابُ مَعْرِفَةِ عَلَامَاتِ الْإِعْرَابِ',
        order: 3,
        durationMinutes: 20,
        summary: 'I\'rab adalah perubahan harakat akhir kata karena perbedaan amil: Rafa\' (Dhammah), Nashab (Fathah), Khafadh (Kasrah), dan Jazm (Sukun).',
        sections: [
          {
            title: 'Pengertian I\'rab',
            type: 'theory',
            arabicText: 'الْإِعْرَابُ هُوَ تَغْيِيرُ أَوَاخِرِ الْكَلِمِ لِاخْتِلَافِ الْعَوَامِلِ الدَّاخِلَةِ عَلَيْهَا لَفْظًا أَوْ تَقْدِيرًا',
            transliteration: "Al-I'raabu huwa taghyiiru awaakhiril kalimi likhtilaafil 'awaamilid daakhilati 'alayhaa lafdzan aw taqdiiraa.",
            indonesian: 'I\'rab adalah perubahan akhir kata karena berbedanya amil (faktor penyebab) yang masuk padanya, baik secara lafazh maupun perkiraan.',
            explanation: 'Perhatikan kata "Zaid" (زَيْدٌ) yang berubah harakat akhirnya tergantung jabatannya dalam kalimat:'
          },
          {
            title: '4 Pembagian I\'rab',
            type: 'table',
            tableData: {
              headers: ['Keadaan I\'rab', 'Tanda Pokok', 'Berlaku Pada', 'Contoh Kalimat'],
              rows: [
                ['الرَّفْعُ (Rafa\')', 'الضَّمَّةُ (Dhammah)', 'Isim & Fi\'il Mudhari\'', 'جَاءَ زَيْدٌ (Zaid telah datang)'],
                ['النَّصْبُ (Nashab)', 'الْفَتْحَةُ (Fathah)', 'Isim & Fi\'il Mudhari\'', 'رَأَيْتُ زَيْدًا (Saya melihat Zaid)'],
                ['الْخَفْضُ / الْجَرُّ (Khafadh/Jar)', 'الْكَسْرَةُ (Kasrah)', 'KHUSUS ISIM (Fi\'il tidak bisa Jar)', 'مَرَرْتُ بِزَيْدٍ (Saya berpapasan dengan Zaid)'],
                ['الْجَزْمُ (Jazm)', 'السُّكُونُ (Sukun)', 'KHUSUS FI\'IL MUDHARI\' (Isim tidak bisa Jazm)', 'لَمْ يَذْهَبْ (Dia belum pergi)']
              ]
            }
          }
        ],
        vocabulary: [
          { id: 'v-10', arabic: 'إِعْرَابٌ', transliteration: "I'raabun", meaning: 'Perubahan harakat akhir kata', category: 'Nahwu' },
          { id: 'v-11', arabic: 'رَفْعٌ', transliteration: "Raf'un", meaning: 'Kondisi rafa\' (umumnya dhammah)', category: 'Nahwu' },
          { id: 'v-12', arabic: 'نَصْبٌ', transliteration: 'Nashbun', meaning: 'Kondisi nashab (umumnya fathah)', category: 'Nahwu' },
          { id: 'v-13', arabic: 'جَزْمٌ', transliteration: 'Jazmun', meaning: 'Kondisi jazm (sukun)', category: 'Nahwu' }
        ],
        quiz: [
          {
            id: 'q-n3-1',
            question: 'Keadaan I\'rab manakah yang KHUSUS berlaku untuk Isim dan tidak mungkin dialami oleh Fi\'il?',
            options: ['Rafa\'', 'Nashab', 'Khafadh (Jar)', 'Jazm'],
            correctIndex: 2,
            explanation: 'Isim dikhususkan dengan I\'rab Khafadh (Jar) dan tidak ada Jazm padanya.'
          },
          {
            id: 'q-n3-2',
            question: 'Keadaan I\'rab manakah yang KHUSUS berlaku untuk Fi\'il Mudhari\' dan tidak mungkin dialami oleh Isim?',
            options: ['Jazm (Sukun)', 'Rafa\'', 'Nashab', 'Khafadh'],
            correctIndex: 0,
            explanation: 'Fi\'il dikhususkan dengan Jazm dan tidak ada Khafadh/Jar padanya.'
          }
        ]
      }
    ]
  },
  {
    id: 'course-shorof-1',
    title: 'Ilmu Shorof: Wazan & Tashrif',
    titleArabic: 'عِلْمُ الصَّرْفِ وَالْمِيزَانُ الصَّرْفِيُّ',
    level: 'Mubtadi\' (Pemula)',
    category: 'Shorof',
    iconName: 'Layers',
    description: 'Kuasai rumus perubahan kata kerja dan kata bentukan dari pola akar 3 huruf (Tsulatsi Mujarrad).',
    lessons: [
      {
        id: 'shorof-lesson-1',
        courseId: 'course-shorof-1',
        title: 'Mengenal Timbangan Kata (Al-Mizan Ash-Shorfi)',
        titleArabic: 'الْمِيزَانُ الصَّرْفِيُّ (ف - ع - ل)',
        order: 1,
        durationMinutes: 15,
        summary: 'Mayoritas kosakata bahasa Arab berakar dari 3 huruf dasar yang dianalogikan dengan timbangan Fa-Ain-Lam (فعل).',
        sections: [
          {
            title: 'Konsep Neraca Shorof',
            type: 'theory',
            arabicText: 'أَصْلُ الْكَلِمَاتِ فِي اللُّغَةِ الْعَرَبِيَّةِ ثُلَاثِيٌّ عَلَى وَزْنِ: فَعَلَ',
            transliteration: "Ashlul kalimaati fil lughatil 'arabiyyati tsulaatsiyyun 'ala wazni: FA-'A-LA",
            indonesian: 'Asal mayoritas kata dalam bahasa Arab adalah terdiri dari 3 huruf konsonan dengan pola timbangan: Fa\' - \'Ain - Lam.',
            explanation: 'Huruf pertama disebut Fa\' Fi\'il, huruf kedua disebut \'Ain Fi\'il, dan huruf ketiga disebut Lam Fi\'il. Contoh: kata كَتَبَ (Ka-Ta-Ba) mengikuti wazan فَعَلَ (Fa-\'A-La).'
          },
          {
            title: 'Tabel Contoh Pembentukan Kata dari Akar K-T-B (ك-ت-ب)',
            type: 'table',
            tableData: {
              headers: ['Bentuk Kata', 'Wazan (Pola)', 'Bahasa Arab', 'Arti'],
              rows: [
                ['Fi\'il Madhi (Lampau)', 'فَعَلَ', 'كَتَبَ (Kataba)', 'Telah menulis'],
                ['Fi\'il Mudhari\' (Sekarang)', 'يَفْعُلُ', 'يَكْتُبُ (Yaktubu)', 'Sedang menulis'],
                ['Masdar (Kata Benda Perbuatan)', 'فِعَالَةٌ / فَعْلٌ', 'كِتَابَةٌ (Kitaabatun)', 'Penulisan / Aktivitas menulis'],
                ['Isim Fa\'il (Pelaku/Penulis)', 'فَاعِلٌ', 'كَاتِبٌ (Kaatibun)', 'Penulis (Author)'],
                ['Isim Maf\'ul (Yang ditulis)', 'مَفْعُولٌ', 'مَكْتُوبٌ (Maktuubun)', 'Tertulis / Surat'],
                ['Isim Makan (Tempat Menulis)', 'مَفْعَلٌ', 'مَكْتَبٌ (Maktabun)', 'Meja / Kantor']
              ]
            }
          }
        ],
        vocabulary: [
          { id: 'v-14', arabic: 'وَزْنٌ', transliteration: 'Waznun', meaning: 'Timbangan / Rumus pola kata', category: 'Shorof' },
          { id: 'v-15', arabic: 'كَاتِبٌ', transliteration: 'Kaatibun', meaning: 'Penulis', category: 'Shorof' },
          { id: 'v-16', arabic: 'مَكْتُوبٌ', transliteration: 'Maktuubun', meaning: 'Tertulis / Takdir', category: 'Shorof' },
          { id: 'v-17', arabic: 'دَرَسَ', transliteration: 'Darasa', meaning: 'Telah belajar', category: 'Shorof' },
          { id: 'v-18', arabic: 'مُدَرِّسٌ', transliteration: 'Mudarrisun', meaning: 'Pengajar / Guru', category: 'Shorof' }
        ],
        quiz: [
          {
            id: 'q-s1-1',
            question: 'Apakah wazan untuk kata "كَاتِبٌ" (Kaatib)?',
            options: ['مَفْعُولٌ', 'فَاعِلٌ', 'فَعِيلٌ', 'مَفْعَلٌ'],
            correctIndex: 1,
            explanation: 'كَاتِبٌ berwazan فَاعِلٌ (Isim Fa\'il yang bermakna orang yang melakukan perbuatan).'
          },
          {
            id: 'q-s1-2',
            arabicPhrase: 'مَسْجِدٌ',
            question: 'Kata "مَسْجِدٌ" (Masjid) diambil dari akar kata سَجَدَ (bersujud). Apakah jenis isim tersebut?',
            options: ['Isim Makan (Tempat bersujud)', 'Isim Fa\'il (Orang yang sujud)', 'Fi\'il Amar (Perintah sujud)', 'Huruf Nafi'],
            correctIndex: 0,
            explanation: 'مَسْجِدٌ berwazan مَفْعِلٌ yang merupakan Isim Makan (kata benda penunjuk tempat).'
          }
        ]
      }
    ]
  },
  {
    id: 'course-hiwar-1',
    title: 'Muhadatsah: Percakapan Praktis',
    titleArabic: 'الْمُحَادَثَةُ وَالْحِوَارُ الْيَوْمِيُّ',
    level: 'Mubtadi\' (Pemula)',
    category: 'Muhadatsah',
    iconName: 'MessageSquare',
    description: 'Dialog interaktif sehari-hari: salam, perkenalan diri, memesan makanan, dan percakapan di kampus.',
    lessons: [
      {
        id: 'hiwar-lesson-1',
        courseId: 'course-hiwar-1',
        title: 'At-Tahiyyah wat Ta\'aruf (Salam & Perkenalan)',
        titleArabic: 'التَّحِيَّةُ وَالتَّعَارُفُ بَيْنَ شَخْصَيْنِ',
        order: 1,
        durationMinutes: 12,
        summary: 'Pelajari ungkapan dasar sapaan ramah, menanyakan nama, asal daerah, dan kabar dalam bahasa Arab fusha.',
        sections: [
          {
            title: 'Teks Dialog (Al-Hiwar)',
            type: 'dialogue',
            dialogueLines: [
              {
                speaker: 'Ahmad',
                speakerArabic: 'أَحْمَد',
                arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ',
                transliteration: "Assalamu 'alaikum warahmatullaahi wabarakaatuh",
                translation: 'Semoga keselamatan, rahmat Allah, dan berkah-Nya tercurah kepadamu.'
              },
              {
                speaker: 'Faisal',
                speakerArabic: 'فَيْصَل',
                arabic: 'وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ',
                transliteration: "Wa'alaikumussalam warahmatullaahi wabarakaatuh",
                translation: 'Dan kepadamu juga keselamatan, rahmat Allah, dan berkah-Nya.'
              },
              {
                speaker: 'Ahmad',
                speakerArabic: 'أَحْمَد',
                arabic: 'اِسْمِي أَحْمَدُ، مَا اسْمُكَ يَا أَخِي؟',
                transliteration: 'Ismii Ahmad, masmuka yaa akhii?',
                translation: 'Nama saya Ahmad, siapa namamu wahai saudaraku?'
              },
              {
                speaker: 'Faisal',
                speakerArabic: 'فَيْصَل',
                arabic: 'اِسْمِي فَيْصَلُ. كَيْفَ حَالُكَ الْيَوْمَ؟',
                transliteration: 'Ismii Faisal. Kayfa haalukal yawm?',
                translation: 'Nama saya Faisal. Bagaimana kabarmu hari ini?'
              },
              {
                speaker: 'Ahmad',
                speakerArabic: 'أَحْمَد',
                arabic: 'بِخَيْرٍ وَالْحَمْدُ لِلَّهِ. مِنْ أَيْنَ أَنْتَ؟',
                transliteration: "Bikhayrin wal hamdulillaah. Min ayna anta?",
                translation: 'Baik, segala puji bagi Allah. Dari mana asalmu?'
              },
              {
                speaker: 'Faisal',
                speakerArabic: 'فَيْصَل',
                arabic: 'أَنَا مِنْ إِنْدُونِيسِيَا، وَأَنَا طَالِبٌ هُنَا. أَهْلًا وَسَهْلًا بِكَ!',
                transliteration: 'Anaa min Induuniisiyaa, wa anaa thaalibun hunaa. Ahlan wa sahlan bika!',
                translation: 'Saya dari Indonesia, dan saya seorang mahasiswa di sini. Selamat datang!'
              },
              {
                speaker: 'Ahmad',
                speakerArabic: 'أَحْمَد',
                arabic: 'أَهْلًا بِكَ! فُرْصَةٌ سَعِيدَةٌ يَا فَيْصَلُ.',
                transliteration: "Ahlan bik! Fursatun sa'iydatun yaa Faisal.",
                translation: 'Terima kasih kembali! Senang berkenalan denganmu, Faisal.'
              }
            ]
          }
        ],
        vocabulary: [
          { id: 'v-19', arabic: 'مَا اسْمُكَ؟', transliteration: 'Mas-muka?', meaning: 'Siapa namamu? (laki-laki)', category: 'Muhadatsah' },
          { id: 'v-20', arabic: 'كَيْفَ حَالُكَ؟', transliteration: 'Kayfa haaluka?', meaning: 'Bagaimana kabarmu?', category: 'Muhadatsah' },
          { id: 'v-21', arabic: 'بِخَيْرٍ وَالْحَمْدُ لِلَّهِ', transliteration: 'Bikhayrin walhamdulillah', meaning: 'Baik, alhamdulillah', category: 'Muhadatsah' },
          { id: 'v-22', arabic: 'أَهْلًا وَسَهْلًا', transliteration: 'Ahlan wa sahlan', meaning: 'Selamat datang', category: 'Muhadatsah' },
          { id: 'v-23', arabic: 'فُرْصَةٌ سَعِيدَةٌ', transliteration: "Fursatun sa'iidah", meaning: 'Senang berkenalan / Kesempatan bahagia', category: 'Muhadatsah' }
        ],
        quiz: [
          {
            id: 'q-h1-1',
            arabicPhrase: 'مَا اسْمُكِ؟',
            question: 'Pertanyaan "مَا اسْمُكِ؟" (Masmuki) dengan harakat kasrah pada huruf kaf ditujukan kepada siapa?',
            options: ['Lawan bicara perempuan tunggal', 'Lawan bicara laki-laki tunggal', 'Sekelompok orang', 'Diri sendiri'],
            correctIndex: 0,
            explanation: 'Dhamir kaftaab (كِ) berharakat kasrah digunakan untuk menyapa perempuan (muannats).'
          },
          {
            id: 'q-h1-2',
            question: 'Apa arti dari ungkapan "كَيْفَ حَالُكَ؟"?',
            options: ['Di mana rumahmu?', 'Bagaimana kabarmu?', 'Berapa usiamu?', 'Apa pekerjaanmu?'],
            correctIndex: 1,
            explanation: 'كَيْفَ حَالُكَ bermakna "Bagaimana kabarmu?".'
          }
        ]
      }
    ]
  },
  {
    id: 'course-mufradat-1',
    title: 'Bank Mufradat & Kosakata Tematik',
    titleArabic: 'بَنْكُ الْمُفْرَدَاتِ وَالْكَلِمَاتِ الشَّائِعَةِ',
    level: 'Mubtadi\' (Pemula)',
    category: 'Mufradat',
    iconName: 'Sparkles',
    description: 'Kumpulan kartu kosakata lengkap dengan audio pengucapan, transliterasi, dan contoh kalimat aplikatif.',
    lessons: [
      {
        id: 'mufradat-lesson-1',
        courseId: 'course-mufradat-1',
        title: 'Kosakata Tempat & Fasilitas Pendidikan',
        titleArabic: 'مُفْرَدَاتُ الْمَبَانِي وَالْمَرَافِقِ التَّعْلِيمِيَّةِ',
        order: 1,
        durationMinutes: 10,
        summary: 'Kumpulan kosakata seputar sekolah, kampus, ruang kelas, dan peralatan belajar.',
        sections: [
          {
            title: 'Daftar Kosakata Fasilitas',
            type: 'table',
            tableData: {
              headers: ['Kata Arab', 'Transliterasi', 'Arti', 'Contoh Kalimat'],
              rows: [
                ['مَدْرَسَةٌ', 'Madrasatun', 'Sekolah', 'الْمَدْرَسَةُ كَبِيرَةٌ (Sekolah itu besar)'],
                ['جَامِعَةٌ', "Jaami'atun", 'Universitas', 'أَدْرُسُ فِي الْجَامِعَةِ (Saya belajar di kampus)'],
                ['فَصْلٌ', 'Fashlun', 'Ruang Kelas', 'الطُّلَّابُ فِي الْفَصْلِ (Para siswa di kelas)'],
                ['مَكْتَبَةٌ', 'Maktabatun', 'Perpustakaan', 'أَقْرَأُ الْكُتُبَ فِي الْمَكْتَبَةِ (Saya membaca buku di perpus)'],
                ['مُخْتَبَرٌ', 'Mukhtabarun', 'Laboratorium', 'مُخْتَبَرُ اللُّغَةِ مُجَهَّزٌ (Lab bahasa lengkap)'],
                ['سَبُّورَةٌ', 'Sabbuuratun', 'Papan Tulis', 'الْمُعَلِّمُ يَكْتُبُ عَلَى السَّبُّورَةِ (Guru menulis di papan tulis)']
              ]
            }
          }
        ],
        vocabulary: [
          { id: 'v-24', arabic: 'مَدْرَسَةٌ', transliteration: 'Madrasatun', meaning: 'Sekolah', category: 'Pendidikan' },
          { id: 'v-25', arabic: 'جَامِعَةٌ', transliteration: "Jaami'atun", meaning: 'Universitas', category: 'Pendidikan' },
          { id: 'v-26', arabic: 'فَصْلٌ', transliteration: 'Fashlun', meaning: 'Ruang Kelas', category: 'Pendidikan' },
          { id: 'v-27', arabic: 'سَبُّورَةٌ', transliteration: 'Sabbuuratun', meaning: 'Papan Tulis', category: 'Pendidikan' }
        ],
        quiz: [
          {
            id: 'q-m1-1',
            question: 'Apakah arti dari kata "سَبُّورَةٌ" (Sabbuurah)?',
            options: ['Meja belajar', 'Papan tulis', 'Penghapus', 'Tas sekolah'],
            correctIndex: 1,
            explanation: 'Sabbuurah adalah papan tulis.'
          }
        ]
      }
    ]
  }
];
