import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FileSearch, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import FileUploadZone from '../components/reports/FileUploadZone';
import ReportResultView from '../components/reports/ReportResultView';
import Button from '../components/ui/Button';
import { SkeletonBox } from '../components/ui/SkeletonLoader';
import toast from 'react-hot-toast';

const ReportAnalyzerPage = ({ onEmergencyTrigger }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeReport, setActiveReport] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(false);

  const reportId = searchParams.get('id');

  useEffect(() => {
    if (reportId) {
      const fetchReport = async () => {
        setLoadingInitial(true);
        try {
          const res = await api.get(`/reports/${reportId}`);
          if (res.data.success) {
            setActiveReport(res.data.report);
          }
        } catch (err) {
          toast.error('Failed to load requested report.');
        } finally {
          setLoadingInitial(false);
        }
      };
      fetchReport();
    } else {
      setActiveReport(null);
    }
  }, [reportId]);

  const handleAnalyzeFile = async ({ file, title, reportType }) => {
    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (reportType) formData.append('reportType', reportType);

    try {
      const res = await api.post('/reports/upload-analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success('Report analyzed successfully with AI!');
        setActiveReport(res.data.report);

        // Check if emergency was flagged
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
      const res = await api.post('/reports/analyze-text', { text, title, reportType });
      if (res.data.success) {
        toast.success('Medical text analyzed successfully!');
        setActiveReport(res.data.report);

        if (res.data.report?.aiAnalysis?.isEmergencyDetected && onEmergencyTrigger) {
          onEmergencyTrigger(res.data.report.aiAnalysis.emergencyNotes);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Text analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartNewAnalysis = () => {
    setActiveReport(null);
    navigate('/reports/analyze');
  };

  if (loadingInitial) {
    return (
      <div className="space-y-6">
        <SkeletonBox className="h-10 w-1/3" />
        <SkeletonBox className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b5755] dark:text-[#4aa497]">
            Diagnostic AI Vision
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-[#122b2e] dark:text-white">
            Medical Report Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-[#425b59] dark:text-[#b4cbc6] mt-0.5">
            Extract parameters, evaluate normal vs abnormal ranges, and translate jargon into plain English.
          </p>
        </div>

        {activeReport && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleStartNewAnalysis}
            icon={ArrowLeft}
          >
            Upload Another Report
          </Button>
        )}
      </div>

      {/* Analyzer Content Body */}
      {activeReport ? (
        <ReportResultView report={activeReport} user={user} />
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

export default ReportAnalyzerPage;
