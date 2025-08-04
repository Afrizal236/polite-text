import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [librariesLoaded, setLibrariesLoaded] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    nim: '',
    kelas: '',
    nama_dosen: '',
    sapaan: 'Pak/Bu',
    waktu: 'pagi',
    alasan: '',
    nama_tugas: '',
    topik: '',
    hal: '',
    // Data tambahan untuk surat
    program_studi: '',
    nama_matkul: '',
    tanggal: '',
    waktu_kuliah: '',
    deadline_awal: '',
    perpanjangan_waktu: '',
    jabatan: '',
    nama_institusi: '',
    waktu_konsultasi: '',
    detail_konsultasi: '',
    kota: 'Malang'
  });
  const [generatedText, setGeneratedText] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [letterTitle, setLetterTitle] = useState('');
  const [customText, setCustomText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [improvedText, setImprovedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('template');
  const [pdfStatus, setPdfStatus] = useState('loading'); // loading, ready, error

  // Load PDF libraries saat component mount
  useEffect(() => {
    fetchTemplates();
    loadPDFLibraries();
  }, []);

  const loadPDFLibraries = async () => {
    try {
      setPdfStatus('loading');
      
      // Gunakan versi yang lebih stabil dan coba multiple CDN
      const jsPDFSources = [
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
        'https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js',
        'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js'
      ];

      let jsPDFLoaded = false;
      
      // Cek jika sudah ada di window
      if (window.jsPDF) {
        jsPDFLoaded = true;
      } else {
        // Coba load dari multiple sources
        for (const src of jsPDFSources) {
          try {
            await loadScript(src);
            if (window.jsPDF) {
              jsPDFLoaded = true;
              break;
            }
          } catch (error) {
            console.warn(`Failed to load jsPDF from ${src}:`, error);
          }
        }
      }

      if (jsPDFLoaded) {
        setLibrariesLoaded(true);
        setPdfStatus('ready');
        console.log('jsPDF loaded successfully');
      } else {
        throw new Error('Failed to load jsPDF from all sources');
      }
      
    } catch (error) {
      console.error('Error loading PDF libraries:', error);
      setPdfStatus('error');
      setLibrariesLoaded(false);
    }
  };

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      // Check if script already exists
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        // Wait a bit for it to load if it exists
        setTimeout(() => {
          if (window.jsPDF) {
            resolve();
          } else {
            reject(new Error('Script exists but library not available'));
          }
        }, 1000);
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.crossOrigin = 'anonymous';
      
      const timeout = setTimeout(() => {
        reject(new Error(`Script load timeout: ${src}`));
      }, 10000); // 10 second timeout

      script.onload = () => {
        clearTimeout(timeout);
        // Wait a bit for the library to be available
        setTimeout(() => {
          if (window.jsPDF) {
            resolve();
          } else {
            reject(new Error('Script loaded but library not available'));
          }
        }, 500);
      };
      
      script.onerror = () => {
        clearTimeout(timeout);
        reject(new Error(`Failed to load script: ${src}`));
      };
      
      document.head.appendChild(script);
    });
  };

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('/api/templates');
      setTemplates(response.data.templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateText = async () => {
    if (!selectedTemplate) {
      alert('Pilih template terlebih dahulu');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/generate', {
        templateId: selectedTemplate,
        data: formData
      });
      
      setGeneratedText(response.data.generatedText);
      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error('Error generating text:', error);
      alert('Terjadi kesalahan saat generate teks');
    }
    setLoading(false);
  };

  const generateLetter = async () => {
    if (!selectedTemplate) {
      alert('Pilih template terlebih dahulu');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/generate-letter', {
        templateId: selectedTemplate,
        data: formData
      });
      
      setGeneratedLetter(response.data.generatedLetter);
      setLetterTitle(response.data.title);
    } catch (error) {
      console.error('Error generating letter:', error);
      alert('Terjadi kesalahan saat generate surat');
    }
    setLoading(false);
  };

  const analyzeCustomText = async () => {
    if (!customText.trim()) {
      alert('Masukkan teks yang ingin dianalisis');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/analyze', {
        text: customText
      });
      
      setAnalysis(response.data.analysis);
      setSuggestions(response.data.suggestions);
      setImprovedText(response.data.improvedText);
    } catch (error) {
      console.error('Error analyzing text:', error);
      alert('Terjadi kesalahan saat menganalisis teks');
    }
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Teks berhasil disalin!');
  };

  // Fungsi fallback untuk download sebagai text file
  const downloadAsText = () => {
    try {
      const element = document.createElement('a');
      const file = new Blob([generatedLetter], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${letterTitle.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error('Error downloading as text:', error);
      alert('Gagal mendownload file. Silakan copy text secara manual.');
    }
  };

  // Fungsi untuk print (sebagai alternatif PDF)
  const printLetter = () => {
    try {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${letterTitle}</title>
          <style>
            body {
              font-family: 'Times New Roman', serif;
              font-size: 12pt;
              line-height: 1.6;
              color: black;
              background: white;
              padding: 20mm;
              margin: 0;
            }
            pre {
              font-family: inherit;
              white-space: pre-wrap;
              margin: 0;
            }
            @media print {
              body { padding: 15mm; }
            }
          </style>
        </head>
        <body>
          <pre>${generatedLetter}</pre>
        </body>
        </html>
      `);
      printWindow.document.close();
      
      // Wait for content to load then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    } catch (error) {
      console.error('Error opening print window:', error);
      alert('Gagal membuka jendela print. Silakan copy text secara manual.');
    }
  };

  const downloadLetter = async () => {
    if (pdfStatus === 'loading') {
      alert('PDF library sedang loading, silakan tunggu sebentar...');
      return;
    }

    if (pdfStatus === 'error' || !librariesLoaded) {
      // Tawarkan alternatif download tanpa confirm
      alert('PDF library tidak tersedia. Akan download sebagai file teks (.txt)');
      downloadAsText();
      return;
    }

    try {
      setLoading(true);
      
      // Verifikasi jsPDF tersedia
      if (!window.jsPDF) {
        throw new Error('jsPDF not available');
      }

      const { jsPDF } = window.jsPDF;
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Set margin dan ukuran halaman
      const pageWidth = 210;
      const pageHeight = 297;
      const leftMargin = 20;
      const rightMargin = 20;
      const topMargin = 20;
      const bottomMargin = 20;
      const lineHeight = 6;
      const maxWidth = pageWidth - leftMargin - rightMargin;
      
      let currentY = topMargin;
      
      // Split content into lines
      const lines = generatedLetter.split('\n');
      
      // Set default font
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        
        // Check if we need a new page
        if (currentY > pageHeight - bottomMargin) {
          doc.addPage();
          currentY = topMargin;
        }
        
        if (trimmedLine === '') {
          // Empty line - just add space
          currentY += lineHeight / 2;
          continue;
        }
        
        // Handle different types of content
        if (trimmedLine.includes('SURAT PERMOHONAN') || trimmedLine.includes('SURAT IZIN')) {
          // Title - center and bold
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(14);
          
          const textWidth = doc.getTextWidth(trimmedLine);
          const centerX = (pageWidth - textWidth) / 2;
          
          doc.text(trimmedLine, centerX, currentY);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(12);
          currentY += lineHeight + 3;
          
        } else if (trimmedLine.includes('Hormat saya') || 
                   (trimmedLine.includes(formData.nama) && trimmedLine.length < 50) || 
                   trimmedLine.includes('NIM:') ||
                   (trimmedLine.length < 50 && trimmedLine.includes(',') && i > lines.length / 2)) {
          // Signature area - right align
          const textWidth = doc.getTextWidth(trimmedLine);
          const rightX = pageWidth - rightMargin - textWidth;
          
          doc.text(trimmedLine, Math.max(leftMargin, rightX), currentY);
          currentY += lineHeight;
          
        } else {
          // Regular content - left align with word wrapping
          if (trimmedLine.length > 0) {
            try {
              const splitLines = doc.splitTextToSize(trimmedLine, maxWidth);
              
              for (const splitLine of splitLines) {
                // Check for new page again
                if (currentY > pageHeight - bottomMargin) {
                  doc.addPage();
                  currentY = topMargin;
                }
                
                doc.text(splitLine, leftMargin, currentY);
                currentY += lineHeight;
              }
            } catch (error) {
              // Fallback: just add the line without splitting
              console.warn('Error splitting text, using fallback:', error);
              doc.text(trimmedLine.substring(0, 80), leftMargin, currentY);
              currentY += lineHeight;
            }
          } else {
            currentY += lineHeight;
          }
        }
      }
      
      // Generate filename
      const fileName = `${letterTitle.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}_${Date.now()}.pdf`;
      
      // Save the PDF
      doc.save(fileName);
      
      alert('PDF berhasil didownload!');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Fallback: download sebagai text file
      alert('Gagal membuat PDF. Akan download sebagai file teks (.txt)');
      downloadAsText();
    } finally {
      setLoading(false);
    }
  };

  // Retry loading PDF libraries
  const retryLoadPDF = async () => {
    setPdfStatus('loading');
    setLibrariesLoaded(false);
    await loadPDFLibraries();
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50'; // Hijau
    if (score >= 60) return '#FF9800'; // Orange
    return '#F44336'; // Merah
  };

  const getPDFButtonText = () => {
    switch (pdfStatus) {
      case 'loading':
        return '⏳ Loading PDF...';
      case 'ready':
        return '📥 Download PDF';
      case 'error':
        return '📄 Download/Print';
      default:
        return '📥 Download';
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎓 Generator Kalimat Sopan</h1>
        <p>Bantu Anda berkomunikasi dengan dosen dan atasan secara profesional</p>
      </header>

      <div className="container">
        {/* Tab Navigation */}
        <div className="tabs">
          <button 
            className={activeTab === 'template' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('template')}
          >
            📝 Generator Template
          </button>
          <button 
            className={activeTab === 'letter' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('letter')}
          >
            📄 Generate Surat
          </button>
          <button 
            className={activeTab === 'analyzer' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('analyzer')}
          >
            🔍 Analisis Teks
          </button>
        </div>

        {/* Template Generator Tab */}
        {activeTab === 'template' && (
          <div className="tab-content">
            <div className="form-section">
              <h3>Pilih Template</h3>
              <select 
                value={selectedTemplate} 
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="select-input"
              >
                <option value="">-- Pilih Template --</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} - {template.description}
                  </option>
                ))}
              </select>

              <h3>Isi Data</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nama Anda:</label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama Anda"
                  />
                </div>

                <div className="form-group">
                  <label>NIM:</label>
                  <input
                    type="text"
                    name="nim"
                    value={formData.nim}
                    onChange={handleInputChange}
                    placeholder="Contoh: 23081204308"
                  />
                </div>

                <div className="form-group">
                  <label>Kelas:</label>
                  <input
                    type="text"
                    name="kelas"
                    value={formData.kelas}
                    onChange={handleInputChange}
                    placeholder="Contoh: TI-2021"
                  />
                </div>

                <div className="form-group">
                  <label>Nama Dosen/Atasan:</label>
                  <input
                    type="text"
                    name="nama_dosen"
                    value={formData.nama_dosen}
                    onChange={handleInputChange}
                    placeholder="Contoh: Reka (tanpa gelar)"
                  />
                </div>

                <div className="form-group">
                  <label>Sapaan:</label>
                  <select
                    name="sapaan"
                    value={formData.sapaan}
                    onChange={handleInputChange}
                  >
                    <option value="Pak/Bu">Pak/Bu</option>
                    <option value="Bapak">Bapak</option>
                    <option value="Ibu">Ibu</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Waktu:</label>
                  <select
                    name="waktu"
                    value={formData.waktu}
                    onChange={handleInputChange}
                  >
                    <option value="pagi">pagi</option>
                    <option value="siang">siang</option>
                    <option value="sore">sore</option>
                    <option value="malam">malam</option>
                  </select>
                </div>

                {/* Field kondisional berdasarkan template */}
                {(selectedTemplate === 'minta_perpanjangan') && (
                  <>
                    <div className="form-group">
                      <label>Nama Tugas:</label>
                      <input
                        type="text"
                        name="nama_tugas"
                        value={formData.nama_tugas}
                        onChange={handleInputChange}
                        placeholder="Contoh: Tugas Akhir Semester"
                      />
                    </div>
                    <div className="form-group">
                      <label>Alasan:</label>
                      <input
                        type="text"
                        name="alasan"
                        value={formData.alasan}
                        onChange={handleInputChange}
                        placeholder="Contoh: kendala teknis"
                      />
                    </div>
                  </>
                )}

                {selectedTemplate === 'konsultasi' && (
                  <div className="form-group">
                    <label>Topik Konsultasi:</label>
                    <input
                      type="text"
                      name="topik"
                      value={formData.topik}
                      onChange={handleInputChange}
                      placeholder="Contoh: proposal skripsi"
                    />
                  </div>
                )}

                {selectedTemplate === 'terima_kasih' && (
                  <div className="form-group">
                    <label>Hal yang Diterima:</label>
                    <input
                      type="text"
                      name="hal"
                      value={formData.hal}
                      onChange={handleInputChange}
                      placeholder="Contoh: bimbingan skripsi"
                    />
                  </div>
                )}
              </div>

              <button 
                onClick={generateText} 
                disabled={loading}
                className="generate-btn"
              >
                {loading ? 'Generating...' : '✨ Generate Kalimat'}
              </button>
            </div>

            {/* Generated Text Display */}
            {generatedText && (
              <div className="result-section">
                <h3>Hasil Generate</h3>
                <div className="text-output">
                  <p>{generatedText}</p>
                  <button onClick={() => copyToClipboard(generatedText)} className="copy-btn">
                    📋 Salin Teks
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Letter Generator Tab */}
        {activeTab === 'letter' && (
          <div className="tab-content">
            <div className="form-section">
              <h3>Pilih Template Surat</h3>
              <select 
                value={selectedTemplate} 
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="select-input"
              >
                <option value="">-- Pilih Template Surat --</option>
                <option value="izin_sakit">Surat Izin Sakit</option>
                <option value="minta_perpanjangan">Surat Perpanjangan Tugas</option>
                <option value="konsultasi">Surat Permohonan Konsultasi</option>
              </select>

              <h3>Isi Data Surat</h3>
              <div className="form-grid">
                {/* Data Dasar */}
                <div className="form-group">
                  <label>Nama Lengkap:</label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    placeholder="Nama lengkap Anda"
                  />
                </div>

                <div className="form-group">
                  <label>NIM:</label>
                  <input
                    type="text"
                    name="nim"
                    value={formData.nim}
                    onChange={handleInputChange}
                    placeholder="Nomor Induk Mahasiswa"
                  />
                </div>

                <div className="form-group">
                  <label>Kelas:</label>
                  <input
                    type="text"
                    name="kelas"
                    value={formData.kelas}
                    onChange={handleInputChange}
                    placeholder="Contoh: TI-2021"
                  />
                </div>

                <div className="form-group">
                  <label>Program Studi:</label>
                  <input
                    type="text"
                    name="program_studi"
                    value={formData.program_studi}
                    onChange={handleInputChange}
                    placeholder="Contoh: Teknik Informatika"
                  />
                </div>

                <div className="form-group">
                  <label>Nama Dosen:</label>
                  <input
                    type="text"
                    name="nama_dosen"
                    value={formData.nama_dosen}
                    onChange={handleInputChange}
                    placeholder="Nama dosen (tanpa gelar)"
                  />
                </div>

                <div className="form-group">
                  <label>Sapaan:</label>
                  <select
                    name="sapaan"
                    value={formData.sapaan}
                    onChange={handleInputChange}
                  >
                    <option value="Bapak">Bapak</option>
                    <option value="Ibu">Ibu</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Mata Kuliah:</label>
                  <input
                    type="text"
                    name="nama_matkul"
                    value={formData.nama_matkul}
                    onChange={handleInputChange}
                    placeholder="Nama mata kuliah"
                  />
                </div>

                <div className="form-group">
                  <label>Kota:</label>
                  <input
                    type="text"
                    name="kota"
                    value={formData.kota}
                    onChange={handleInputChange}
                    placeholder="Kota tempat kuliah"
                  />
                </div>

                {/* Field khusus untuk surat izin sakit */}
                {selectedTemplate === 'izin_sakit' && (
                  <>
                    <div className="form-group">
                      <label>Tanggal Tidak Masuk:</label>
                      <input
                        type="text"
                        name="tanggal_tidak_masuk"
                        value={formData.tanggal_tidak_masuk || ''}
                        onChange={handleInputChange}
                        placeholder="Contoh: Senin, 25 Juli 2025"
                      />
                    </div>
                    <div className="form-group">
                      <label>Waktu Kuliah:</label>
                      <input
                        type="text"
                        name="waktu_kuliah"
                        value={formData.waktu_kuliah}
                        onChange={handleInputChange}
                        placeholder="Contoh: 08.00 - 10.00 WIB"
                      />
                    </div>
                  </>
                )}

                {/* Field khusus untuk surat perpanjangan */}
                {selectedTemplate === 'minta_perpanjangan' && (
                  <>
                    <div className="form-group">
                      <label>Nama Tugas:</label>
                      <input
                        type="text"
                        name="nama_tugas"
                        value={formData.nama_tugas}
                        onChange={handleInputChange}
                        placeholder="Jenis tugas yang diminta perpanjangan"
                      />
                    </div>
                    <div className="form-group">
                      <label>Deadline Awal:</label>
                      <input
                        type="text"
                        name="deadline_awal"
                        value={formData.deadline_awal}
                        onChange={handleInputChange}
                        placeholder="Tanggal deadline semula"
                      />
                    </div>
                    <div className="form-group">
                      <label>Perpanjangan yang Dimohon:</label>
                      <input
                        type="text"
                        name="perpanjangan_waktu"
                        value={formData.perpanjangan_waktu}
                        onChange={handleInputChange}
                        placeholder="Contoh: 3 hari / 1 minggu"
                      />
                    </div>
                    <div className="form-group">
                      <label>Alasan Detail:</label>
                      <textarea
                        name="alasan"
                        value={formData.alasan}
                        onChange={handleInputChange}
                        placeholder="Jelaskan alasan memerlukan perpanjangan waktu"
                        rows="3"
                      />
                    </div>
                  </>
                )}

                {/* Field khusus untuk surat konsultasi */}
                {selectedTemplate === 'konsultasi' && (
                  <>
                    <div className="form-group">
                      <label>Jabatan Dosen:</label>
                      <input
                        type="text"
                        name="jabatan"
                        value={formData.jabatan}
                        onChange={handleInputChange}
                        placeholder="Contoh: Dosen Pembimbing / Ketua Program Studi"
                      />
                    </div>
                    <div className="form-group">
                      <label>Nama Institusi:</label>
                      <input
                        type="text"
                        name="nama_institusi"
                        value={formData.nama_institusi}
                        onChange={handleInputChange}
                        placeholder="Nama universitas/institut"
                      />
                    </div>
                    <div className="form-group">
                      <label>Topik Konsultasi:</label>
                      <input
                        type="text"
                        name="topik"
                        value={formData.topik}
                        onChange={handleInputChange}
                        placeholder="Topik yang ingin dikonsultasikan"
                      />
                    </div>
                    <div className="form-group">
                      <label>Waktu yang Diharapkan:</label>
                      <input
                        type="text"
                        name="waktu_konsultasi"
                        value={formData.waktu_konsultasi}
                        onChange={handleInputChange}
                        placeholder="Contoh: Senin-Jumat, 08.00-16.00"
                      />
                    </div>
                    <div className="form-group">
                      <label>Detail Konsultasi:</label>
                      <textarea
                        name="detail_konsultasi"
                        value={formData.detail_konsultasi}
                        onChange={handleInputChange}
                        placeholder="Jelaskan hal-hal yang ingin dikonsultasikan"
                        rows="3"
                      />
                    </div>
                  </>
                )}
              </div>

              <button 
                onClick={generateLetter} 
                disabled={loading}
                className="generate-btn"
              >
                {loading ? 'Generating...' : '📄 Generate Surat'}
              </button>
            </div>

            {/* Generated Letter Display */}
            {generatedLetter && (
              <div className="result-section">
                <h3>Hasil Generate Surat</h3>
                <div className="letter-output">
                  <pre>{generatedLetter}</pre>
                  <div className="letter-actions">
                    <button onClick={() => copyToClipboard(generatedLetter)} className="copy-btn">
                      📋 Salin Surat
                    </button>
                    <button 
                      onClick={downloadLetter} 
                      className="download-btn"
                      disabled={loading}
                    >
                      {loading ? '⏳ Processing...' : getPDFButtonText()}
                    </button>
                    {pdfStatus === 'error' && (
                      <>
                        <button 
                          onClick={retryLoadPDF} 
                          className="download-btn"
                          style={{ background: '#6c757d' }}
                        >
                          🔄 Retry PDF
                        </button>
                        <button 
                          onClick={downloadAsText} 
                          className="download-btn"
                          style={{ background: '#28a745' }}
                        >
                          📄 Download TXT
                        </button>
                      </>
                    )}
                    <button onClick={printLetter} className="download-btn" style={{ background: '#17a2b8' }}>
                      🖨️ Print
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Text Analyzer Tab */}
        {activeTab === 'analyzer' && (
          <div className="tab-content">
            <div className="form-section">
              <h3>Analisis Teks</h3>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Masukkan teks yang ingin dianalisis tingkat kesopanannya..."
                rows="6"
                className="text-input"
              />
              
              <button 
                onClick={analyzeCustomText} 
                disabled={loading}
                className="analyze-btn"
              >
                {loading ? 'Menganalisis...' : '🔍 Analisis Teks'}
              </button>
            </div>

            {/* Improved Text Display */}
            {improvedText && improvedText !== customText && (
              <div className="result-section">
                <h3>Teks yang Diperbaiki</h3>
                <div className="text-output improved">
                  <p>{improvedText}</p>
                  <button onClick={() => copyToClipboard(improvedText)} className="copy-btn">
                    📋 Salin Teks Perbaikan
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="analysis-section">
            <h3>Hasil Analisis</h3>
            
            <div className="score-display">
              <div className="score-circle" style={{ borderColor: getScoreColor(analysis.politenessScore) }}>
                <span className="score-number">{analysis.politenessScore}</span>
                <span className="score-label">Skor Kesopanan</span>
              </div>
              
              <div className="score-indicators">
                <div className={`indicator ${analysis.isPolite ? 'good' : 'bad'}`}>
                  {analysis.isPolite ? '✅' : '❌'} Tingkat Kesopanan
                </div>
                <div className={`indicator ${analysis.isFormal ? 'good' : 'bad'}`}>
                  {analysis.isFormal ? '✅' : '❌'} Bahasa Formal
                </div>
                <div className={`indicator ${analysis.hasFormalStructure ? 'good' : 'bad'}`}>
                  {analysis.hasFormalStructure ? '✅' : '❌'} Struktur Formal
                </div>
              </div>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="suggestions">
                <h4>💡 Saran Perbaikan</h4>
                {suggestions.map((suggestion, index) => (
                  <div key={index} className={`suggestion ${suggestion.type}`}>
                    {suggestion.message}
                  </div>
                ))}
              </div>
            )}

            {/* Issues Found */}
            {(analysis.unsuitableWords.length > 0 || analysis.informalWords.length > 0) && (
              <div className="issues">
                {analysis.unsuitableWords.length > 0 && (
                  <div className="issue-group">
                    <h4>⚠️ Kata Tidak Sopan Ditemukan</h4>
                    <div className="word-list">
                      {analysis.unsuitableWords.map((word, index) => (
                        <span key={index} className="word-tag unsuitable">{word}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {analysis.informalWords.length > 0 && (
                  <div className="issue-group">
                    <h4>📝 Kata Informal Ditemukan</h4>
                    <div className="word-list">
                      {analysis.informalWords.map((word, index) => (
                        <span key={index} className="word-tag informal">{word}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;