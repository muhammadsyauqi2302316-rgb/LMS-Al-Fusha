import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json({ limit: '1mb' }));

// Helper to get Gemini client server-side
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not defined in environment variables');
  }
  return new GoogleGenAI({ apiKey });
}

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Al-Fusha Arabic LMS API Server is running',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// Admin credentials verification as requested: username "admin123" and password "12345"
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username === 'admin123' && password === '12345') {
    return res.json({
      success: true,
      message: 'Login admin berhasil',
      adminUser: {
        id: 'admin_sys_123',
        username: 'admin123',
        displayName: 'Administrator Al-Fusha',
        email: 'admin123@alfusha-lms.internal',
        role: 'admin',
        permissions: ['all']
      },
      token: 'admin_session_' + Buffer.from('admin123:' + Date.now()).toString('base64')
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Username atau password admin salah. Gunakan admin123 / 12345'
  });
});

// Gemini: Arabic Tashkeel & I'rab Analysis (Grammar & Parsing)
app.post('/api/gemini/tashkeel', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Teks bahasa Arab diperlukan' });
    }

    const ai = getGeminiClient();
    const prompt = `Anda adalah pakar bahasa Arab dan ilmu Nahwu & Shorof (Gramatika & Morfologi Arab).
Analisis teks/kalimat bahasa Arab berikut:
"${text}"

Tolong kembalikan respons HANYA dalam format JSON valid (tanpa markdown blok tambahan) dengan struktur:
{
  "original": "${text}",
  "vocalized": "Teks Arab dengan harakat lengkap (harakat, sukun, tanwin, syaddah)",
  "transliteration": "Transliterasi latin",
  "translation": "Terjemahan bahasa Indonesia yang tepat dan alami",
  "summary": "Penjelasan ringkas makna dan kaidah utama dalam kalimat",
  "words": [
    {
      "word": "kata",
      "type": "Isim / Fi'il / Huruf",
      "root": "akar kata (jika ada)",
      "irab": "analisis kedudukan i'rab (misal: Fa'il marfu' bil dhammah / Maf'ul bih manshub / Mubtada' / dll)",
      "meaning": "arti kata"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const outputText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(outputText);
    } catch {
      // Clean potential backticks
      const cleanJson = outputText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      parsedData = JSON.parse(cleanJson);
    }

    return res.json(parsedData);
  } catch (err: unknown) {
    console.error('Error in /api/gemini/tashkeel:', err);
    return res.status(500).json({
      error: 'Gagal menganalisis teks Arab',
      details: err instanceof Error ? err.message : String(err)
    });
  }
});

// Gemini: Tanya Ustadz AI (Arabic Grammar & Learning Assistant)
app.post('/api/gemini/explain', async (req: Request, res: Response) => {
  try {
    const { question, context } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Pertanyaan diperlukan' });
    }

    const ai = getGeminiClient();
    const prompt = `Anda adalah seorang Ustadz dan Dosen Bahasa Arab profesional yang ramah, jelas, dan pedagogis di platform LMS Al-Fusha.
Bantu pelajar memahami pertanyaan seputar bahasa Arab, Nahwu, Shorof, Balaghah, Mufradat, atau konteks percakapan.

Konteks materi saat ini: ${context || 'Umum'}
Pertanyaan Pelajar: "${question}"

Berikan penjelasan yang:
1. Menjelaskan konsep dengan bahasa Indonesia yang mudah dipahami.
2. Memberikan contoh kalimat bahasa Arab berharakat lengkap beserta artinya.
3. Menjelaskan rumus atau pola (wazan) jika berkaitan dengan shorof atau nahwu.
4. Memberi tips mengingat praktis.

Jawab dengan rapi berstruktur format Markdown ramah pemula.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt
    });

    return res.json({
      reply: response.text || 'Maaf, tidak ada jawaban dari sistem AI.'
    });
  } catch (err: unknown) {
    console.error('Error in /api/gemini/explain:', err);
    return res.status(500).json({
      error: 'Gagal mendapatkan penjelasan AI',
      details: err instanceof Error ? err.message : String(err)
    });
  }
});

// Gemini: Interactive Arabic Muhadatsah (Conversation Practice Partner)
app.post('/api/gemini/conversation', async (req: Request, res: Response) => {
  try {
    const { message, topic = 'Al-Hiwar Al-Yaumi (Percakapan Sehari-hari)', history = [] } = req.body;

    const ai = getGeminiClient();
    
    // Format history
    const historyText = Array.isArray(history) 
      ? history.map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'Pelajar' : 'Ustadz AI'}: ${h.text}`).join('\n')
      : '';

    const prompt = `Anda adalah Ustadz Ahmad, lawan bicara latihan percakapan bahasa Arab (Muhadatsah) di LMS Al-Fusha.
Topik saat ini: "${topic}".
Riwayat percakapan:
${historyText}

Pesan terbaru dari Pelajar: "${message}"

Tolong berikan respons dalam JSON valid persis format:
{
  "arabicResponse": "Jawaban Anda dalam bahasa Arab Fusha berharakat lengkap (1-2 kalimat alami)",
  "transliteration": "Transliterasi latin untuk respons Arab",
  "indonesianTranslation": "Arti respons dalam bahasa Indonesia",
  "correctionFeedback": "Koreksi ramah jika ada kesalahan nahwu/kata pada kalimat pelajar, atau kata pujian 'Mumtaz!' jika sudah tepat",
  "suggestedNextReplies": [
    "Pilihan kalimat balasan yang bisa diucapkan pelajar dalam bahasa Arab (beserta arti)"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const outputText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(outputText);
    } catch {
      const cleanJson = outputText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      parsedData = JSON.parse(cleanJson);
    }

    return res.json(parsedData);
  } catch (err: unknown) {
    console.error('Error in /api/gemini/conversation:', err);
    return res.status(500).json({
      error: 'Gagal memproses percakapan AI',
      details: err instanceof Error ? err.message : String(err)
    });
  }
});

// Gemini: Custom Quiz Generator
app.post('/api/gemini/generate-quiz', async (req: Request, res: Response) => {
  try {
    const { topic, level = 'Pemula' } = req.body;

    const ai = getGeminiClient();
    const prompt = `Buat 3 soal kuis interaktif bahasa Arab untuk topik "${topic || 'Nahwu Dasar'}" tingkat "${level}".
Format output HARUS JSON murni:
{
  "topic": "${topic}",
  "questions": [
    {
      "id": "q1",
      "question": "Pertanyaan kuis dalam bahasa Indonesia atau Arab",
      "arabicPhrase": "Frasa/kalimat arab terkait dengan harakat (jika ada)",
      "options": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
      "correctIndex": 0,
      "explanation": "Penjelasan kaidah mengapa jawaban tersebut benar"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const cleanJson = (response.text || '{}').replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    return res.json(JSON.parse(cleanJson));
  } catch (err: unknown) {
    console.error('Error generating quiz:', err);
    return res.status(500).json({
      error: 'Gagal membuat kuis AI',
      details: err instanceof Error ? err.message : String(err)
    });
  }
});

// IMPORTANT: Export default app WITHOUT app.listen as instructed for Vercel
export default app;
