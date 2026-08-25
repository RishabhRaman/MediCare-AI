import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Image as ImageIcon, Sparkles, Clipboard } from 'lucide-react';
import Button from '../ui/Button';

const FileUploadZone = ({ onAnalyzeFile, onAnalyzeText, isAnalyzing }) => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'text'
  const [file, setFile] = useState(null);
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState('general_lab');
  const [pastedText, setPastedText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const sampleReportText = `METABOLIC & CARDIOVASCULAR LAB REPORT
Patient: Alex Mercer | Age: 38 | Gender: Male
-----------------------------------------------------------
Test Name                 Result      Units       Reference Range
Total Cholesterol         235         mg/dL       < 200 (HIGH)
HDL Cholesterol           41          mg/dL       > 50 (LOW)
LDL Cholesterol           152         mg/dL       < 100 (HIGH)
Triglycerides             198         mg/dL       < 150 (HIGH)
Fasting Blood Glucose     112         mg/dL       70 - 99 (HIGH)
HbA1c                     5.9         %           < 5.7 (HIGH)
Serum Creatinine          0.94        mg/dL       0.7 - 1.3 (NORMAL)`;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectedFile = (selectedFile) => {
    setFile(selectedFile);
    if (!reportTitle) {
      setReportTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSubmitFile = (e) => {
    e.preventDefault();
    if (!file) return;
    onAnalyzeFile({ file, title: reportTitle, reportType });
  };

  const handleSubmitText = (e) => {
    e.preventDefault();
    if (!pastedText.trim()) return;
    onAnalyzeText({ text: pastedText, title: reportTitle || 'Pasted Medical Lab Summary', reportType });
  };

  const loadSampleText = () => {
    setPastedText(sampleReportText);
    setReportTitle('Sample Lipid & Metabolic Panel');
    setReportType('lipid_panel');
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-elevation">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-[#e2ebe7] dark:border-[#1c4246] pb-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-[#0b5755] dark:bg-[#4aa497] text-white dark:text-[#091617] shadow-card'
                : 'text-[#425b59] dark:text-[#b4cbc6] hover:bg-[#f3f7f5] dark:hover:bg-[#143236]'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload PDF / Image
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'bg-[#0b5755] dark:bg-[#4aa497] text-white dark:text-[#091617] shadow-card'
                : 'text-[#425b59] dark:text-[#b4cbc6] hover:bg-[#f3f7f5] dark:hover:bg-[#143236]'
            }`}
          >
            <Clipboard className="w-4 h-4" />
            Paste Lab Text
          </button>
        </div>

        {activeTab === 'text' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={loadSampleText}
            icon={Sparkles}
            className="text-xs text-[#0b5755] dark:text-[#4aa497]"
          >
            Load Sample Report
          </Button>
        )}
      </div>

      {/* Meta Options (Title & Category) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#425b59] dark:text-[#b4cbc6] mb-1.5">
            Report Title (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Annual Blood Work - May 2026"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            className="w-full rounded-xl text-xs sm:text-sm border border-[#d6e4df] dark:border-[#1c4246] bg-[#f8faf8] dark:bg-[#0c1e20] px-3.5 py-2.5 text-[#122b2e] dark:text-[#edf7f3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5755]/30"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#425b59] dark:text-[#b4cbc6] mb-1.5">
            Report Category
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full rounded-xl text-xs sm:text-sm border border-[#d6e4df] dark:border-[#1c4246] bg-[#f8faf8] dark:bg-[#0c1e20] px-3.5 py-2.5 text-[#122b2e] dark:text-[#edf7f3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5755]/30"
          >
            <option value="general_lab">General Laboratory Report</option>
            <option value="lipid_panel">Lipid Profile & Cholesterol</option>
            <option value="blood_test">Complete Blood Count (CBC)</option>
            <option value="metabolic_panel">Comprehensive Metabolic Panel (CMP)</option>
            <option value="prescription">Prescription Summary</option>
            <option value="urinalysis">Urinalysis Panel</option>
            <option value="xray_scan_summary">Imaging / Radiology Summary</option>
          </select>
        </div>
      </div>

      {/* Tab 1: Upload File */}
      {activeTab === 'upload' ? (
        <form onSubmit={handleSubmitFile} className="space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
              dragActive
                ? 'border-[#0b5755] bg-[#dcefe9]/60 scale-[1.01]'
                : file
                ? 'border-[#3d8b72] bg-[#eaf5f0]/60 dark:bg-[#13382c]/40'
                : 'border-[#c8d8d2] dark:border-[#1c4246] hover:border-[#0b5755] dark:hover:border-[#4aa497] bg-[#f8faf8] dark:bg-[#0c1e20]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/png,image/jpeg,image/webp,image/jpg"
              onChange={(e) => e.target.files?.[0] && handleSelectedFile(e.target.files[0])}
              className="hidden"
            />

            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-[#eaf5f0] dark:bg-[#13382c] text-[#1c644d] dark:text-[#86e2bf] flex items-center justify-center shadow-card">
                  {file.type.includes('pdf') ? (
                    <FileText className="w-8 h-8" />
                  ) : (
                    <ImageIcon className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <p className="text-base font-bold text-[#122b2e] dark:text-white">
                    {file.name}
                  </p>
                  <p className="text-xs text-[#6b8582] dark:text-[#7e9d97] mt-0.5">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for OCR extraction & clinical AI synthesis
                  </p>
                </div>
                <span className="text-xs text-[#0b5755] dark:text-[#4aa497] underline font-medium">
                  Click or drag to change file
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-[#dcefe9] dark:bg-[#173b3f] text-[#0b5755] dark:text-[#83c4b8] flex items-center justify-center border border-[#b8ded5] dark:border-[#2c5f64]">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-base font-semibold text-[#122b2e] dark:text-white">
                    Drag & drop your medical document here, or <span className="text-[#0b5755] dark:text-[#4aa497] font-bold">browse</span>
                  </p>
                  <p className="text-xs text-[#6b8582] dark:text-[#7e9d97] mt-1">
                    Supports PDF, PNG, JPG, and WEBP lab reports (up to 15MB)
                  </p>
                </div>
              </div>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            variant="primary"
            disabled={!file}
            loading={isAnalyzing}
            icon={Sparkles}
            className="w-full py-3.5 text-sm"
          >
            {isAnalyzing ? 'Extracting Text & Analyzing with AI...' : 'Analyze Medical Report with AI'}
          </Button>
        </form>
      ) : (
        /* Tab 2: Paste Raw Text */
        <form onSubmit={handleSubmitText} className="space-y-6">
          <div>
            <textarea
              rows={8}
              placeholder="Paste raw lab values, doctor prescriptions, or diagnostic text here..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="w-full rounded-2xl text-xs sm:text-sm font-mono border border-[#d6e4df] dark:border-[#1c4246] bg-[#f8faf8] dark:bg-[#0c1e20] p-4 text-[#122b2e] dark:text-[#edf7f3] placeholder-[#7e9d97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5755]/30 leading-relaxed"
            />
            <p className="text-xs text-[#6b8582] dark:text-[#7e9d97] mt-1.5">
              Characters: {pastedText.length} • Minimum 10 characters required.
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            variant="primary"
            disabled={pastedText.trim().length < 10}
            loading={isAnalyzing}
            icon={Sparkles}
            className="w-full py-3.5 text-sm"
          >
            {isAnalyzing ? 'Analyzing Text with AI...' : 'Analyze Medical Text'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default FileUploadZone;
