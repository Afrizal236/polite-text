const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Template surat formal untuk berbagai situasi
const letterTemplates = {
  izin_sakit: {
    title: "SURAT PERMOHONAN IZIN TIDAK MASUK KULIAH",
    content: `{kota}, {tanggal}


                            SURAT PERMOHONAN IZIN TIDAK MASUK KULIAH



Kepada Yth.
{sapaan} {nama_dosen}
Dosen Pengampu Mata Kuliah
{nama_matkul}
Di tempat

Dengan hormat,

Yang bertanda tangan di bawah ini:

Nama               : {nama}
NIM                : {nim}
Kelas              : {kelas}
Program Studi      : {program_studi}

Dengan ini saya bermaksud mengajukan permohonan izin untuk tidak dapat mengikuti perkuliahan pada:

Hari/Tanggal       : {tanggal_tidak_masuk}
Mata Kuliah        : {nama_matkul}
Waktu              : {waktu_kuliah}

Hal tersebut dikarenakan saya sedang dalam kondisi kurang sehat dan tidak memungkinkan untuk mengikuti kegiatan perkuliahan.

Sebagai pertanggungjawaban, saya berkomitmen untuk:
1. Mengejar materi perkuliahan yang tertinggal
2. Mengerjakan tugas yang diberikan selama ketidakhadiran
3. Berkonsultasi dengan teman sekelas mengenai materi yang disampaikan

Demikian surat permohonan ini saya buat dengan sebenar-benarnya. Atas perhatian dan pengertian {sapaan}, saya ucapkan terima kasih.


                                                                                                    Hormat saya,



                                                                                                    {nama}
                                                                                                    NIM: {nim}`
  },
  
  minta_perpanjangan: {
    title: "SURAT PERMOHONAN PERPANJANGAN WAKTU PENGUMPULAN TUGAS",
    content: `{kota}, {tanggal}


                    SURAT PERMOHONAN PERPANJANGAN WAKTU PENGUMPULAN TUGAS



Kepada Yth.
{sapaan} {nama_dosen}
Dosen Pengampu Mata Kuliah
{nama_matkul}
Di tempat

Dengan hormat,

Yang bertanda tangan di bawah ini:

Nama               : {nama}
NIM                : {nim}
Kelas              : {kelas}
Program Studi      : {program_studi}

Dengan ini saya bermaksud mengajukan permohonan perpanjangan waktu pengumpulan tugas dengan detail sebagai berikut:

Mata Kuliah        : {nama_matkul}
Jenis Tugas        : {nama_tugas}
Deadline Awal      : {deadline_awal}
Perpanjangan yang Dimohon : {perpanjangan_waktu}

Alasan permohonan perpanjangan:
{alasan}

Saya menyadari bahwa keterlambatan pengumpulan tugas dapat mengganggu jadwal penilaian. Oleh karena itu, saya berkomitmen untuk:
1. Menyelesaikan tugas dengan kualitas terbaik
2. Tidak mengulangi keterlambatan serupa
3. Lebih memperhatikan manajemen waktu ke depannya

Demikian surat permohonan ini saya sampaikan. Atas kebijaksanaan dan pengertian {sapaan}, saya ucapkan terima kasih.


                                                                                                    Hormat saya,



                                                                                                    {nama}
                                                                                                    NIM: {nim}`
  },
  
  konsultasi: {
    title: "SURAT PERMOHONAN KONSULTASI",
    content: `{kota}, {tanggal}


                                    SURAT PERMOHONAN KONSULTASI



Kepada Yth.
{sapaan} {nama_dosen}
{jabatan}
{nama_institusi}
Di tempat

Dengan hormat,

Yang bertanda tangan di bawah ini:

Nama               : {nama}
NIM                : {nim}
Kelas              : {kelas}
Program Studi      : {program_studi}

Dengan ini saya bermaksud mengajukan permohonan konsultasi mengenai:

Topik Konsultasi   : {topik}
Mata Kuliah/Bidang : {nama_matkul}
Waktu yang Diharapkan : {waktu_konsultasi}

Hal-hal yang ingin dikonsultasikan:
{detail_konsultasi}

Saya sangat mengharapkan arahan dan bimbingan dari {sapaan} untuk dapat menyelesaikan permasalahan akademik yang saya hadapi. Konsultasi ini sangat penting bagi kelancaran studi saya.

Demikian surat permohonan ini saya sampaikan. Atas waktu dan kesediaan {sapaan} untuk memberikan konsultasi, saya ucapkan terima kasih.


                                                                                                    Hormat saya,



                                                                                                    {nama}
                                                                                                    NIM: {nim}`
  }
};

const templates = {
  izin_sakit: [
    "Selamat {waktu} {sapaan} {nama_dosen}, saya {nama} dari {kelas} dengan NIM {nim}. Saya bermaksud untuk meminta izin tidak dapat mengikuti perkuliahan pada hari ini dikarenakan sedang dalam kondisi kurang sehat. Saya akan mengejar materi yang tertinggal. Terima kasih atas pengertiannya.",
    "Dengan hormat, {sapaan} {nama_dosen}. Perkenalkan saya {nama} mahasiswa {kelas} dengan NIM {nim}. Pada hari ini saya tidak dapat hadir dalam perkuliahan karena sedang dalam kondisi sakit. Mohon izin dan pengertiannya. Terima kasih."
  ],
  minta_perpanjangan: [
    "Selamat {waktu} {sapaan} {nama_dosen}, saya {nama} dari {kelas} dengan NIM {nim}. Saya ingin meminta perpanjangan waktu untuk pengumpulan tugas {nama_tugas} karena {alasan}. Saya mohon kebijaksanaan {sapaan}. Terima kasih atas perhatiannya.",
    "Dengan hormat, {sapaan} {nama_dosen}. Saya {nama} dari {kelas} dengan NIM {nim} bermaksud memohon perpanjangan deadline untuk {nama_tugas}. Hal ini disebabkan oleh {alasan}. Saya sangat mengharapkan pengertian dari {sapaan}."
  ],
  konsultasi: [
    "Selamat {waktu} {sapaan} {nama_dosen}, saya {nama} dari {kelas} dengan NIM {nim}. Saya ingin berkonsultasi mengenai {topik}. Apakah {sapaan} ada waktu luang untuk berdiskusi? Terima kasih atas kesediaannya.",
    "Dengan hormat, {sapaan} {nama_dosen}. Perkenalkan saya {nama} mahasiswa {kelas} dengan NIM {nim}. Saya bermaksud untuk berkonsultasi terkait {topik}. Mohon bimbingannya. Terima kasih."
  ],
  terima_kasih: [
    "Selamat {waktu} {sapaan} {nama_dosen}, saya {nama} dari {kelas} dengan NIM {nim}. Saya ingin mengucapkan terima kasih atas {hal} yang telah {sapaan} berikan. Saya sangat menghargai bantuan tersebut.",
    "Dengan hormat, {sapaan} {nama_dosen}. Saya {nama} dari {kelas} dengan NIM {nim} ingin menyampaikan rasa terima kasih yang sebesar-besarnya atas {hal}. Semoga kebaikan {sapaan} mendapat balasan yang setimpal."
  ]
};

// Kata-kata tidak sopan yang perlu dihindari (diperluas)
const unsuitableWords = [
  // Kata kasar umum - menggunakan word boundary untuk deteksi yang tepat
  'gue', 'loe', 'gw', 'anjing', 'bangsat', 'tai', 'sial',
  'bego', 'tolol', 'bodoh', 'goblok', 'kampret', 'bajingan',
  
  // Kata kasar Jawa/daerah
  'cok', 'jancok', 'jancuk', 'cuk', 'ancok', 'ancuk',
  'kontol', 'tempek', 'memek', 'kimak', 'kimo',
  
  // Kata kasar lainnya
  'brengsek', 'sialan', 'keparat', 'monyet', 'asu',
  'perek', 'pelacur', 'sundal', 'jalang', 'lonte',
  'geblek', 'edan', 'sinting', 'gila', 'pantek',
  'bangke', 'mampus', 'setan', 'iblis', 'laknat',
  
  // Variasi ejaan
  'g0bl0k', 't0l0l', 'b3g0', 'k0nt0l', 't3mp3k',
  'anying', 'anjay', 'ajg', 'bgst', 'kntl'
];

// Kata "lu" ditangani terpisah karena bisa jadi bagian dari kata lain
const specialUnsuitableWords = ['lu'];

// Kata-kata informal untuk pengganti kata formal
const informalWords = [
  'gimana', 'kenapa', 'udah', 'udahan', 'ngga', 'ga', 'nggak', 
  'emang', 'bgt', 'banget', 'cape', 'capek', 'males', 'kesel', 
  'bete', 'nyebelin', 'ribet', 'susah', 'kayak', 'kek', 'aja',
  'doang', 'nih', 'tuh', 'deh', 'sih', 'dong', 'yuk', 'wkwk',
  'hehe', 'hihi', 'wah', 'aduh', 'duh', 'eh', 'lah', 'kan'
];

// Kata-kata formal untuk pengganti kata informal
const formalReplacements = {
  'gimana': 'bagaimana',
  'kenapa': 'mengapa',
  'udah': 'sudah',
  'udahan': 'selesai',
  'ngga': 'tidak',
  'ga': 'tidak',
  'nggak': 'tidak',
  'emang': 'memang',
  'bgt': 'sekali',
  'banget': 'sekali',
  'cape': 'lelah',
  'capek': 'lelah',
  'males': 'malas',
  'kesel': 'kesal',
  'bete': 'jengkel',
  'nyebelin': 'menjengkelkan',
  'ribet': 'rumit',
  'susah': 'sulit',
  'kayak': 'seperti',
  'kek': 'seperti',
  'aja': 'saja',
  'doang': 'saja',
  'yuk': 'mari'
};

// Route untuk mendapatkan semua template
app.get('/api/templates', (req, res) => {
  const templateList = Object.keys(templates).map(key => ({
    id: key,
    name: key.replace(/_/g, ' ').toUpperCase(),
    description: getTemplateDescription(key)
  }));
  
  res.json({ templates: templateList });
});

// Route untuk generate kalimat berdasarkan template
app.post('/api/generate', (req, res) => {
  const { templateId, data } = req.body;
  
  if (!templates[templateId]) {
    return res.status(400).json({ error: 'Template tidak ditemukan' });
  }
  
  // Pilih template random dari array
  const selectedTemplate = templates[templateId][Math.floor(Math.random() * templates[templateId].length)];
  
  // Replace placeholder dengan data yang diberikan
  let generatedText = selectedTemplate;
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{${key}}`, 'g');
    generatedText = generatedText.replace(regex, data[key] || `{${key}}`);
  });
  
  // Analisis khusus untuk generated text (lebih permisif untuk data pengguna)
  const analysis = analyzeGeneratedText(generatedText, data);
  
  res.json({ 
    generatedText,
    template: selectedTemplate,
    analysis
  });
});

// Route untuk generate surat formal - DIPERBAIKI
app.post('/api/generate-letter', (req, res) => {
  const { templateId, data } = req.body;
  
  if (!letterTemplates[templateId]) {
    return res.status(400).json({ error: 'Template surat tidak ditemukan' });
  }
  
  const selectedTemplate = letterTemplates[templateId];
  
  // Replace placeholder dengan data yang diberikan
  let generatedLetter = selectedTemplate.content;
  let letterTitle = selectedTemplate.title;
  
  // Tambahkan tanggal hari ini
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long', 
    year: 'numeric'
  });
  
  // PERBAIKAN: Ensure semua field ada default value
  const processedData = {
    tanggal: today,
    kota: data.kota || 'Malang',
    nama: data.nama || '[Nama tidak diisi]',
    nim: data.nim || '[NIM tidak diisi]',
    kelas: data.kelas || '[Kelas tidak diisi]',
    program_studi: data.program_studi || '[Program Studi tidak diisi]',
    nama_dosen: data.nama_dosen || '[Nama Dosen tidak diisi]',
    sapaan: data.sapaan || 'Bapak/Ibu', // PERBAIKAN: Pastikan sapaan ada
    nama_matkul: data.nama_matkul || '[Mata Kuliah tidak diisi]',
    tanggal_tidak_masuk: data.tanggal_tidak_masuk || '[Tanggal tidak diisi]',
    waktu_kuliah: data.waktu_kuliah || '[Waktu tidak diisi]',
    nama_tugas: data.nama_tugas || '[Nama Tugas tidak diisi]',
    deadline_awal: data.deadline_awal || '[Deadline tidak diisi]',
    perpanjangan_waktu: data.perpanjangan_waktu || '[Perpanjangan tidak diisi]',
    alasan: data.alasan || '[Alasan tidak diisi]',
    jabatan: data.jabatan || 'Dosen',
    nama_institusi: data.nama_institusi || '[Institusi tidak diisi]',
    topik: data.topik || '[Topik tidak diisi]',
    waktu_konsultasi: data.waktu_konsultasi || '[Waktu tidak diisi]',
    detail_konsultasi: data.detail_konsultasi || '[Detail tidak diisi]',
    ...data // Override dengan data yang diberikan user
  };
  
  // Replace placeholder dengan data yang telah diproses
  Object.keys(processedData).forEach(key => {
    const regex = new RegExp(`{${key}}`, 'g');
    generatedLetter = generatedLetter.replace(regex, processedData[key]);
  });
  
  // PERBAIKAN: Debug log untuk memastikan sapaan ter-replace
  console.log('Sapaan yang dipilih:', processedData.sapaan);
  console.log('Letter setelah replace:', generatedLetter.substring(0, 200));
  
  const formattedLetter = generatedLetter.trim();
  
  res.json({ 
    generatedLetter: formattedLetter,
    title: letterTitle,
    template: selectedTemplate.content
  });
});

app.post('/api/analyze', (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Teks tidak boleh kosong' });
  }
  
  const analysis = analyzeCustomText(text);
  const suggestions = getSuggestions(text, analysis);
  
  res.json({ 
    analysis,
    suggestions,
    improvedText: improveText(text)
  });
});

// Fungsi untuk menganalisis generated text (lebih permisif)
function analyzeGeneratedText(text, userData) {
  const lowerText = text.toLowerCase();
  
  // Buat daftar kata yang dikecualikan (data pengguna)
  const excludedWords = [];
  if (userData) {
    Object.values(userData).forEach(value => {
      if (typeof value === 'string' && value.trim()) {
        excludedWords.push(...value.toLowerCase().split(/\s+/));
      }
    });
  }
  
  // Cek kata tidak sopan dengan word boundary (kecuali data pengguna)
  const foundUnsuitableWords = [];
  
  // Cek kata tidak sopan biasa
  unsuitableWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    const isFound = regex.test(lowerText);
    const isUserData = excludedWords.some(userData => userData.toLowerCase() === word);
    if (isFound && !isUserData) {
      foundUnsuitableWords.push(word);
    }
  });
  
  // Cek kata "lu" secara khusus (hanya jika berdiri sendiri)
  specialUnsuitableWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b(?!\\w)`, 'i'); // tidak diikuti huruf
    const isFound = regex.test(lowerText);
    const isUserData = excludedWords.some(userData => userData.toLowerCase() === word);
    if (isFound && !isUserData) {
      foundUnsuitableWords.push(word);
    }
  });
  
  // Cek tingkat formalitas (kecuali data pengguna)
  const foundInformalWords = informalWords.filter(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    const isFound = regex.test(lowerText);
    const isUserData = excludedWords.some(userData => userData.toLowerCase().includes(word));
    return isFound && !isUserData;
  });
  
  // Hitung skor kesopanan (0-100) - Template yang di-generate mulai dari skor sempurna
  let politenessScore = 100;
  
  // Kurangi skor untuk kata tidak sopan
  politenessScore -= foundUnsuitableWords.length * 20;
  
  // Kurangi skor untuk kata informal (penalty lebih kecil untuk generated text)
  politenessScore -= foundInformalWords.length * 3;
  
  // Cek struktur kalimat formal
  const hasFormalGreeting = /selamat|dengan hormat/i.test(text);
  const hasFormalClosing = /terima kasih|hormat saya|wassalam/i.test(text);
  
  // Template sudah pasti memiliki struktur formal, jadi tidak perlu penalty
  // if (!hasFormalGreeting) politenessScore -= 2;
  // if (!hasFormalClosing) politenessScore -= 2;
  
  politenessScore = Math.max(0, Math.min(100, politenessScore));
  
  return {
    politenessScore,
    isPolite: politenessScore >= 80,
    isFormal: foundInformalWords.length === 0 && foundUnsuitableWords.length === 0,
    unsuitableWords: foundUnsuitableWords,
    informalWords: foundInformalWords,
    hasFormalStructure: hasFormalGreeting && hasFormalClosing,
    isGenerated: true
  };
}

// Fungsi untuk menganalisis teks custom (lebih ketat)
function analyzeCustomText(text) {
  const lowerText = text.toLowerCase();
  
  // Cek kata tidak sopan dengan word boundary
  const foundUnsuitableWords = [];
  
  // Cek kata tidak sopan biasa
  unsuitableWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(lowerText)) {
      foundUnsuitableWords.push(word);
    }
  });
  
  // Cek kata "lu" secara khusus
  specialUnsuitableWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b(?!\\w)`, 'i'); // tidak diikuti huruf
    if (regex.test(lowerText)) {
      foundUnsuitableWords.push(word);
    }
  });
  
  // Cek tingkat formalitas
  const foundInformalWords = informalWords.filter(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerText);
  });
  
  // Hitung skor kesopanan (0-100)
  let politenessScore = 100;
  
  // Kurangi skor untuk kata tidak sopan (lebih berat penaltinya)
  politenessScore -= foundUnsuitableWords.length * 40;
  
  // Kurangi skor untuk kata informal
  politenessScore -= foundInformalWords.length * 10;
  
  // Cek struktur kalimat formal
  const hasFormalGreeting = /selamat|dengan hormat|terima kasih/i.test(text);
  const hasFormalClosing = /terima kasih|hormat saya|wassalam/i.test(text);
  
  if (!hasFormalGreeting) politenessScore -= 15;
  if (!hasFormalClosing) politenessScore -= 15;
  
  politenessScore = Math.max(0, politenessScore);
  
  return {
    politenessScore,
    isPolite: politenessScore >= 70,
    isFormal: foundInformalWords.length === 0 && foundUnsuitableWords.length === 0,
    unsuitableWords: foundUnsuitableWords,
    informalWords: foundInformalWords,
    hasFormalStructure: hasFormalGreeting && hasFormalClosing,
    isGenerated: false
  };
}

// Fungsi untuk memberikan saran perbaikan
function getSuggestions(text, analysis) {
  const suggestions = [];
  
  if (analysis.unsuitableWords.length > 0) {
    suggestions.push({
      type: 'warning',
      message: `Ditemukan kata tidak sopan yang harus dihindari: ${analysis.unsuitableWords.length} kata`
    });
    suggestions.push({
      type: 'error',
      message: 'Gunakan bahasa yang lebih sopan dan profesional dalam komunikasi formal'
    });
  }
  
  if (analysis.informalWords.length > 0) {
    suggestions.push({
      type: 'info', 
      message: `Gunakan kata formal: ${analysis.informalWords.map(word => 
        `"${word}" → "${formalReplacements[word] || 'kata formal'}"`
      ).join(', ')}`
    });
  }
  
  if (!analysis.hasFormalStructure) {
    suggestions.push({
      type: 'tip',
      message: 'Tambahkan salam pembuka formal (Selamat pagi/siang/sore) dan penutup yang sopan (Terima kasih)'
    });
  }
  
  if (analysis.politenessScore < 70) {
    suggestions.push({
      type: 'warning',
      message: 'Teks perlu diperbaiki agar lebih sopan dan sesuai untuk komunikasi akademik/profesional'
    });
  }
  
  if (analysis.politenessScore >= 80) {
    suggestions.push({
      type: 'success',
      message: 'Teks sudah cukup sopan dan formal. Bagus!'
    });
  }
  
  return suggestions;
}

// Fungsi untuk memperbaiki teks otomatis
function improveText(text) {
  let improvedText = text;
  
  // Replace kata informal dengan formal
  Object.keys(formalReplacements).forEach(informal => {
    const regex = new RegExp(`\\b${informal}\\b`, 'gi');
    improvedText = improvedText.replace(regex, formalReplacements[informal]);
  });
  
  // Hapus/ganti kata tidak sopan dengan placeholder
  unsuitableWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    improvedText = improvedText.replace(regex, '[kata tidak pantas dihapus]');
  });
  
  return improvedText;
}

// Fungsi helper untuk deskripsi template
function getTemplateDescription(templateId) {
  const descriptions = {
    izin_sakit: 'Template untuk meminta izin karena sakit',
    minta_perpanjangan: 'Template untuk meminta perpanjangan deadline',
    konsultasi: 'Template untuk meminta konsultasi',
    terima_kasih: 'Template untuk mengucapkan terima kasih'
  };
  return descriptions[templateId] || 'Template kalimat sopan';
}

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});