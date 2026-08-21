import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Image as ImageIcon, AlertCircle, Sparkles, Clipboard } from 'lucide-react';
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
    <div className="glass-card rounded-lg p-6 sm:p-8">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'upload'
                ? 'bg-[#0f6b68] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload PDF / Image
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'text'
                ? 'bg-[#0f6b68] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
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
            className="text-xs text-cyan-400 hover:text-cyan-300"
          >
            Load Sample Report
          </Button>
        )}
      </div>

      {/* Meta Options (Title & Category) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Report Title / Label (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Annual Blood Work - May 2026"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            className="w-full rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Report Category
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
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
                ? 'border-[#0f6b68] bg-[#dcefe9] scale-[1.01]'
                : file
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-[#b8c9c5] dark:border-slate-700/80 hover:border-[#0f6b68] dark:hover:border-[#4aa497]/60 bg-[#f6f8f7] dark:bg-slate-900/40'
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
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg">
                  {file.type.includes('pdf') ? (
                    <FileText className="w-8 h-8" />
                  ) : (
                    <ImageIcon className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for OCR extraction & AI synthesis
                  </p>
                </div>
                <span className="text-xs text-sky-500 underline font-medium">
                  Click or drag to change file
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-[#dcefe9] text-[#0f6b68] flex items-center justify-center border border-[#b8ded5]">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                    Drag & drop your medical document here, or <span className="text-[#0f6b68]">browse</span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
            className="w-full shadow-lg shadow-sky-500/20 text-base py-3.5"
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
              className="w-full rounded-2xl text-sm font-mono border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
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
            className="w-full shadow-lg shadow-sky-500/20 text-base py-3.5"
          >
            {isAnalyzing ? 'Analyzing Text with AI...' : 'Analyze Medical Text'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default FileUploadZone;
