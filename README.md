# 🎓 Generator Kalimat Sopan

Aplikasi web yang membantu mahasiswa dan profesional untuk berkomunikasi dengan dosen dan atasan secara profesional dan sopan.

## ✨ Fitur Utama

### 📝 Generator Template
- **Template Izin Sakit**: Membuat kalimat sopan untuk meminta izin tidak masuk kuliah
- **Template Perpanjangan**: Membuat permintaan perpanjangan deadline tugas
- **Template Konsultasi**: Membuat permintaan konsultasi dengan dosen
- **Template Terima Kasih**: Membuat ucapan terima kasih yang formal

### 📄 Generator Surat Formal
- **Surat Izin Sakit**: Surat resmi untuk izin tidak masuk kuliah
- **Surat Perpanjangan Tugas**: Surat permohonan perpanjangan deadline
- **Surat Permohonan Konsultasi**: Surat formal untuk meminta bimbingan
- **Export ke PDF**: Download surat dalam format PDF yang siap print
- **Print Preview**: Pratinjau sebelum mencetak

### 🔍 Analisis Teks
- **Analisis Kesopanan**: Menilai tingkat kesopanan teks (skor 0-100)
- **Deteksi Kata Tidak Sopan**: Mengidentifikasi kata-kata yang tidak pantas
- **Deteksi Bahasa Informal**: Menandai penggunaan bahasa tidak formal
- **Saran Perbaikan**: Memberikan rekomendasi untuk meningkatkan kualitas teks
- **Perbaikan Otomatis**: Mengubah kata informal menjadi formal

## 🚀 Teknologi yang Digunakan

### Frontend
- **React.js** - Framework JavaScript untuk UI
- **CSS3** - Styling dengan gradient dan responsive design
- **jsPDF** - Library untuk generate PDF
- **Axios** - HTTP client untuk komunikasi dengan backend

### Backend
- **Node.js** - Runtime JavaScript server-side
- **Express.js** - Web framework untuk Node.js
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

## 📦 Instalasi

### Prasyarat
- Node.js (versi 14 atau lebih baru)
- npm atau yarn

### Langkah Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/username/generator-kalimat-sopan.git
   cd generator-kalimat-sopan
   ```

2. **Install dependencies untuk backend**
   ```bash
   npm install express cors dotenv
   ```

3. **Install dependencies untuk frontend**
   ```bash
   cd client  # atau sesuai struktur folder Anda
   npm install react axios
   ```

4. **Setup environment variables**
   ```bash
   # Buat file .env di root folder
   PORT=5000
   ```

5. **Jalankan aplikasi**
   
   **Backend:**
   ```bash
   node server.js
   ```
   
   **Frontend:**
   ```bash
   npm start
   ```

6. **Akses aplikasi**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 🎯 Cara Penggunaan

### Generator Template
1. Pilih tab "Generator Template"
2. Pilih template yang sesuai dengan kebutuhan
3. Isi data diri (nama, NIM, kelas, nama dosen, dll.)
4. Klik "Generate Kalimat"
5. Salin hasil generate untuk digunakan

### Generator Surat
1. Pilih tab "Generate Surat"
2. Pilih jenis surat yang diinginkan
3. Lengkapi semua field yang diperlukan
4. Klik "Generate Surat"
5. Download sebagai PDF atau print langsung

### Analisis Teks
1. Pilih tab "Analisis Teks"
2. Masukkan teks yang ingin dianalisis
3. Klik "Analisis Teks"
4. Lihat hasil analisis dan saran perbaikan
5. Gunakan teks yang telah diperbaiki jika tersedia

## 📊 Sistem Penilaian

### Skor Kesopanan (0-100)
- **80-100**: Sangat sopan dan formal ✅
- **60-79**: Cukup sopan, perlu sedikit perbaikan ⚠️
- **0-59**: Perlu perbaikan signifikan ❌

### Kriteria Penilaian
- **Kata Tidak Sopan**: -20 hingga -40 poin per kata
- **Kata Informal**: -3 hingga -10 poin per kata
- **Struktur Formal**: -15 poin jika tidak ada salam/penutup
- **Konteks**: Generated text lebih permisif terhadap input pengguna

## 🛠️ API Endpoints

### GET `/api/templates`
Mendapatkan daftar semua template yang tersedia.

**Response:**
```json
{
  "templates": [
    {
      "id": "izin_sakit",
      "name": "IZIN SAKIT",
      "description": "Template untuk meminta izin karena sakit"
    }
  ]
}
```

### POST `/api/generate`
Generate kalimat berdasarkan template dan data input.

**Request Body:**
```json
{
  "templateId": "izin_sakit",
  "data": {
    "nama": "John Doe",
    "nim": "123456789",
    "kelas": "TI-2021",
    "nama_dosen": "Prof. Smith",
    "waktu": "pagi"
  }
}
```

### POST `/api/generate-letter`
Generate surat formal berdasarkan template.

**Request Body:**
```json
{
  "templateId": "izin_sakit",
  "data": {
    "nama": "John Doe",
    "nim": "123456789",
    "program_studi": "Teknik Informatika",
    // ... data lainnya
  }
}
```

### POST `/api/analyze`
Menganalisis tingkat kesopanan teks input.

**Request Body:**
```json
{
  "text": "Selamat pagi Pak Budi, saya ingin konsultasi..."
}
```

## 🎨 Kustomisasi

### Menambah Template Baru
1. Edit file `server.js`
2. Tambahkan template baru di object `templates`
3. Tambahkan deskripsi di function `getTemplateDescription`

### Menambah Template Surat
1. Edit object `letterTemplates` di `server.js`
2. Gunakan placeholder `{field_name}` untuk data dinamis
3. Update frontend untuk field input yang sesuai

### Mengubah Kriteria Analisis
1. Edit array `unsuitableWords` dan `informalWords`
2. Sesuaikan logic scoring di function `analyzeCustomText`
3. Update `formalReplacements` untuk saran perbaikan

## 🚀 Deployment

### Menggunakan Heroku
1. Buat file `Procfile`:
   ```
   web: node server.js
   ```

2. Setup environment variables di Heroku dashboard

3. Deploy:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Menggunakan Vercel/Netlify
1. Build project untuk production
2. Upload build folder
3. Set environment variables

## 🤝 Kontribusi

Kontribusi sangat diterima! Berikut cara berkontribusi:

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

### Areas untuk Kontribusi
- Menambah template komunikasi baru
- Memperbaiki algoritma analisis kesopanan
- Menambah fitur export (Word, HTML)
- Meningkatkan UI/UX
- Menambah bahasa daerah Indonesia

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Tim Pengembang

- **Frontend Developer**: React.js, CSS3, Responsive Design
- **Backend Developer**: Node.js, Express.js, NLP Logic
- **UI/UX Designer**: User Interface & Experience Design

## 📞 Kontak & Support

- **Email**: support@generator-kalimat-sopan.com
- **Website**: https://generator-kalimat-sopan.com
- **Issues**: [GitHub Issues](https://github.com/username/generator-kalimat-sopan/issues)

## 🙏 Acknowledgments

- Terima kasih kepada komunitas React dan Node.js
- Inspirasi dari kebutuhan komunikasi formal mahasiswa Indonesia
- Feedback dari dosen dan mahasiswa berbagai universitas

---

⭐ **Jika aplikasi ini membantu, jangan lupa berikan star!** ⭐

*Dibuat dengan ❤️ untuk mahasiswa Indonesia*
