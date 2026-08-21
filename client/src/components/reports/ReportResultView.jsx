import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileDown,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Stethoscope,
  Send,
  Calendar,
  Layers,
  ArrowRight,
  ShieldAlert,
  Info,
} from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { generateMedicalReportPDF } from '../../utils/pdfGenerator';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ReportResultView = ({ report, user }) => {
  const [qaQuestion, setQaQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [qaHistory, setQaHistory] = useState(report.qaHistory || []);

  const analysis = report.aiAnalysis || {};
  const riskLevel = analysis.riskLevel || 'normal';
  const riskScore = analysis.riskScore || 20;

  const handleDownloadPDF = () => {
    generateMedicalReportPDF(report, user);
    toast.success('Medical Summary PDF generated & downloaded!');
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!qaQuestion.trim() || isAsking) return;

    const currentQuestion = qaQuestion;
    setQaQuestion('');
    setIsAsking(true);

    try {
      const res = await api.post(`/reports/${report._id}/qa`, {
        question: currentQuestion,
      });
      if (res.data.success) {
        setQaHistory(res.data.qaHistory);
        toast.success('AI responded to your report question.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to get answer from AI.');
    } finally {
      setIsAsking(false);
    }
  };

  const riskBadgeVariant = {
    normal: 'normal',
    borderline: 'borderline',
    elevated: 'elevated',
    critical: 'critical',
  }[riskLevel] || 'default';

  return (
    <div className="space-y-8">
      {/* Header & Overview Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant={riskBadgeVariant} size="lg" dot>
                {riskLevel.toUpperCase()} RISK EVALUATION
              </Badge>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(report.dateOfReport || report.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {report.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Category: <span className="capitalize">{report.reportType?.replace('_', ' ')}</span> • Source: {report.fileName || 'Direct Text Input'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={handleDownloadPDF}
              icon={FileDown}
              className="shadow-lg shadow-sky-500/20"
            >
              Download PDF Summary
            </Button>
          </div>
        </div>

        {/* Risk Score Progress Gauge */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-700 dark:text-slate-300">
              Clinical Variance Index
            </span>
            <span className="text-sky-500 font-bold">{riskScore} / 100</span>
          </div>
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                riskScore > 75
                  ? 'bg-gradient-to-r from-orange-500 to-red-500'
                  : riskScore > 40
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                  : 'bg-gradient-to-r from-emerald-400 to-cyan-500'
              }`}
              style={{ width: `${Math.max(8, riskScore)}%` }}
            />
          </div>
        </div>

        {/* Executive Plain-Language Summary */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Plain-Language Executive Summary</span>
          </div>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed bg-sky-50/50 dark:bg-sky-950/20 p-4 sm:p-5 rounded-2xl border border-sky-500/20">
            {analysis.executiveSummary || 'No clinical summary provided.'}
          </p>
        </div>

        {/* Key Findings */}
        {analysis.keyFindings && analysis.keyFindings.length > 0 && (
          <div className="mt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Key Diagnostic Findings
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {analysis.keyFindings.map((finding, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{finding}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Extracted Parameters Table */}
      {analysis.extractedParameters && analysis.extractedParameters.length > 0 && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-sky-500" />
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Extracted Lab Parameters & Biomarkers
              </h3>
            </div>
            <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              {analysis.extractedParameters.length} Biomarkers Analyzed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5 rounded-l-xl">Parameter</th>
                  <th className="px-4 py-3.5">Result</th>
                  <th className="px-4 py-3.5">Reference Range</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 rounded-r-xl">Clinical Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                {analysis.extractedParameters.map((param, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors"
                  >
                    <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-white">
                      {param.parameter}
                      {param.category && (
                        <span className="block text-[10px] font-normal text-slate-400">
                          {param.category}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-800 dark:text-slate-200">
                      {param.value}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 font-mono text-xs">
                      {param.referenceRange || 'N/A'}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant={
                          param.status === 'high'
                            ? 'high'
                            : param.status === 'low'
                            ? 'low'
                            : param.status === 'critical'
                            ? 'critical'
                            : param.status === 'borderline'
                            ? 'borderline'
                            : 'normal'
                        }
                        size="sm"
                        dot
                      >
                        {(param.status || 'normal').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 text-xs leading-relaxed max-w-xs">
                      {param.interpretation || 'Parameter measured within standard laboratory variance.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Medical Term Glossary */}
      {analysis.glossary && analysis.glossary.length > 0 && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-2.5 mb-6">
            <HelpCircle className="w-5 h-5 text-cyan-500" />
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Medical Glossary & Biological Mechanisms
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.glossary.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5"
              >
                <h4 className="text-sm font-bold text-sky-600 dark:text-sky-400">
                  {item.term}
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {item.definition}
                </p>
                {item.clinicalSignificance && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-100 dark:border-slate-800">
                    Clinical Note: {item.clinicalSignificance}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Recommendations */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-2.5">
          <Stethoscope className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Actionable Next Steps & Clinical Recommendations
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dietary */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Dietary Adjustments
            </h4>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2">
              {(analysis.recommendations?.dietary || ['Maintain balanced whole foods diet.']).map((d, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Lifestyle */}
          <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-500/30 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Activity & Lifestyle
            </h4>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2">
              {(analysis.recommendations?.lifestyle || ['Aim for 150 minutes of moderate activity weekly.']).map((l, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-sky-500 font-bold">•</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Diagnostic Follow-ups */}
          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-500/30 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Diagnostic Follow-ups
            </h4>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2">
              {(analysis.recommendations?.followUpTests || ['Schedule regular annual checkup.']).map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* When to see doctor */}
        {analysis.recommendations?.whenToSeeDoctor && (
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
            <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Physician Guidance: </span>
              {analysis.recommendations.whenToSeeDoctor}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Report Q&A Assistant */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Ask MediCare AI About This Report
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ask specific clarifying questions about your lab values, dietary choices, or clinical terms.
              </p>
            </div>
          </div>
        </div>

        {/* Q&A Chat History */}
        {qaHistory.length > 0 && (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {qaHistory.map((item, idx) => (
              <div key={idx} className="space-y-2">
                {/* User Question */}
                <div className="flex justify-end">
                  <div className="bg-sky-500 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-xs sm:text-sm max-w-lg shadow-sm">
                    {item.question}
                  </div>
                </div>
                {/* AI Answer */}
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 max-w-2xl leading-relaxed">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px] mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>MediCare AI</span>
                    </div>
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input bar */}
        <form onSubmit={handleAskQuestion} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g., What does my high LDL mean for cardiovascular risk?"
            value={qaQuestion}
            onChange={(e) => setQaQuestion(e.target.value)}
            disabled={isAsking}
            className="flex-1 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!qaQuestion.trim() || isAsking}
            loading={isAsking}
            icon={Send}
          >
            Ask
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ReportResultView;
