import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Sparkles, Upload, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import FileUploadZone from '../reports/FileUploadZone';
import ReportResultView from '../reports/ReportResultView';
import Button from '../ui/Button';
import api from '../../services/api';
import toast from 'react-hot-toast';

const HomeReportAnalyzer = ({ onEmergencyTrigger }) => {
  const { user, isAuthenticated, demoLogin } = useAuth();
  const [analyzedReport, setAnalyzedReport] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeFile = async ({ file, title, reportType }) => {
    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (reportType) formData.append('reportType', reportType);

    try {
      const endpoint = isAuthenticated
        ? '/reports/upload-analyze'
        : '/reports/public-upload-analyze';

      const res = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success('Medical report analyzed successfully!');
        setAnalyzedReport(res.data.report);

        if (res.data.report?.aiAnalysis?.isEmergencyDetected && onEmergencyTrigger) {
          onEmergencyTrigger(res.data.report.aiAnalysis.emergencyNotes);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Report analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeText = async ({ text, title, reportType }) => {
    setIsAnalyzing(true);
    try {
      const endpoint = isAuthenticated
        ? '/reports/analyze-text'
        : '/reports/public-analyze-text';

      const res = await api.post(endpoint, { text, title, reportType });

      if (res.data.success) {
        toast.success('Medical text analyzed successfully!');
        setAnalyzedReport(res.data.report);

        if (res.data.report?.aiAnalysis?.isEmergencyDetected && onEmergencyTrigger) {
          onEmergencyTrigger(res.data.report.aiAnalysis.emergencyNotes);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {analyzedReport ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
            <div className="flex items-center gap-2 text-cyan-400 text-xs sm:text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Report Analysis Complete! Ready for Review & PDF Download</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setAnalyzedReport(null)}
              icon={Upload}
            >
              Analyze Another Document
            </Button>
          </div>

          <ReportResultView report={analyzedReport} user={user} />
        </div>
      ) : (
        <FileUploadZone
          onAnalyzeFile={handleAnalyzeFile}
          onAnalyzeText={handleAnalyzeText}
          isAnalyzing={isAnalyzing}
        />
      )}
    </div>
  );
};

export default HomeReportAnalyzer;
