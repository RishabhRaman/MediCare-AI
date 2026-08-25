import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileDown,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Stethoscope,
  Send,
  Calendar,
  Layers,
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
        toast.success('Clinical AI responded to your report question.');
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
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-elevation border border-[#e2ebe7] dark:border-[#1c4246]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#e2ebe7] dark:border-[#1c4246]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant={riskBadgeVariant} size="lg" dot>
                {riskLevel.toUpperCase()} RISK EVALUATION
              </Badge>
              <span className="text-xs text-[#6b8582] dark:text-[#7e9d97] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(report.dateOfReport || report.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-heading text-[#122b2e] dark:text-white">
              {report.title}
            </h2>
            <p className="text-xs text-[#6b8582] dark:text-[#7e9d97] mt-1">
              Category: <span className="capitalize">{report.reportType?.replace('_', ' ')}</span> • Source: {report.fileName || 'Direct Clinical Input'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={handleDownloadPDF}
              icon={FileDown}
            >
              Download PDF Summary
            </Button>
          </div>
        </div>

        {/* Risk Score Progress Gauge */}
        <div className="mt-6 p-4 rounded-2xl bg-[#f8faf8] dark:bg-[#0c1e20] border border-[#e2ebe7] dark:border-[#1c4246]">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-[#425b59] dark:text-[#b4cbc6]">
              Clinical Variance Index
            </span>
            <span className="text-[#0b5755] dark:text-[#4aa497] font-bold">{riskScore} / 100</span>
          </div>
          <div className="w-full h-2.5 bg-[#e2ebe7] dark:bg-[#1c4246] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                riskScore > 75
                  ? 'bg-gradient-to-r from-orange-500 to-red-500'
                  : riskScore > 40
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                  : 'bg-gradient-to-r from-[#0b5755] to-[#3d8b72]'
              }`}
              style={{ width: `${Math.max(8, riskScore)}%` }}
            />
          </div>
        </div>

        {/* Executive Plain-Language Summary */}
        <div className="mt-6 space-y-2.5">
          <div className="flex items-center gap-2 text-[#0b5755] dark:text-[#4aa497] font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Plain-Language Executive Summary</span>
          </div>
          <p className="text-sm sm:text-base text-[#122b2e] dark:text-[#edf7f3] leading-relaxed bg-[#f8faf8] dark:bg-[#0c1e20] p-4 sm:p-5 rounded-2xl border border-[#e2ebe7] dark:border-[#1c4246]">
            {analysis.executiveSummary || 'No clinical summary provided.'}
          </p>
        </div>

        {/* Key Findings */}
        {analysis.keyFindings && analysis.keyFindings.length > 0 && (
          <div className="mt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6b8582] dark:text-[#7e9d97] mb-3">
              Key Diagnostic Findings
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {analysis.keyFindings.map((finding, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-[#102629] border border-[#e2ebe7] dark:border-[#1c4246] text-xs text-[#122b2e] dark:text-[#edf7f3]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#3d8b72] shrink-0 mt-0.5" />
                  <span>{finding}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Extracted Parameters Table */}
      {analysis.extractedParameters && analysis.extractedParameters.length > 0 && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-elevation border border-[#e2ebe7] dark:border-[#1c4246]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-[#0b5755] dark:text-[#4aa497]" />
              <h3 className="text-lg sm:text-xl font-bold font-serif-heading text-[#122b2e] dark:text-white">
                Extracted Lab Parameters & Biomarkers
              </h3>
            </div>
            <span className="text-xs text-[#6b8582] dark:text-[#7e9d97] bg-[#f3f7f5] dark:bg-[#143236] px-3 py-1 rounded-full border border-[#d7e4e0] dark:border-[#1c4246]">
              {analysis.extractedParameters.length} Biomarkers Analyzed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#f8faf8] dark:bg-[#0c1e20] text-[#425b59] dark:text-[#b4cbc6] text-[11px] uppercase tracking-wider font-semibold border-b border-[#e2ebe7] dark:border-[#1c4246]">
                <tr>
                  <th className="px-4 py-3.5 rounded-l-xl">Parameter</th>
                  <th className="px-4 py-3.5">Result</th>
                  <th className="px-4 py-3.5">Reference Range</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 rounded-r-xl">Clinical Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2ebe7] dark:divide-[#1c4246]">
                {analysis.extractedParameters.map((param, index) => (
                  <tr
                    key={index}
                    className="hover:bg-[#f8faf8] dark:hover:bg-[#143236]/40 transition-colors"
                  >
                    <td className="px-4 py-3.5 font-semibold text-[#122b2e] dark:text-white">
                      {param.parameter}
                      {param.category && (
                        <span className="block text-[10px] font-normal text-[#6b8582] dark:text-[#7e9d97]">
                          {param.category}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-[#122b2e] dark:text-[#edf7f3]">
                      {param.value}
                    </td>
                    <td className="px-4 py-3.5 text-[#6b8582] dark:text-[#7e9d97] font-mono text-xs">
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
                    <td className="px-4 py-3.5 text-[#425b59] dark:text-[#b4cbc6] text-xs leading-relaxed max-w-xs">
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
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-elevation border border-[#e2ebe7] dark:border-[#1c4246]">
          <div className="flex items-center gap-2.5 mb-6">
            <HelpCircle className="w-5 h-5 text-[#0b5755] dark:text-[#4aa497]" />
            <h3 className="text-lg sm:text-xl font-bold font-serif-heading text-[#122b2e] dark:text-white">
              Medical Glossary & Biological Mechanisms
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.glossary.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#f8faf8] dark:bg-[#0c1e20] border border-[#e2ebe7] dark:border-[#1c4246] space-y-1.5"
              >
                <h4 className="text-sm font-bold text-[#0b5755] dark:text-[#83c4b8]">
                  {item.term}
                </h4>
                <p className="text-xs text-[#425b59] dark:text-[#b4cbc6] leading-relaxed">
                  {item.definition}
                </p>
                {item.clinicalSignificance && (
                  <p className="text-[11px] text-[#6b8582] dark:text-[#7e9d97] italic pt-1 border-t border-[#e2ebe7] dark:border-[#1c4246]">
                    Clinical Significance: {item.clinicalSignificance}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Recommendations */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-elevation border border-[#e2ebe7] dark:border-[#1c4246] space-y-6">
        <div className="flex items-center gap-2.5">
          <Stethoscope className="w-5 h-5 text-[#3d8b72]" />
          <h3 className="text-lg sm:text-xl font-bold font-serif-heading text-[#122b2e] dark:text-white">
            Actionable Next Steps & Clinical Recommendations
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dietary */}
          <div className="p-4 rounded-2xl bg-[#eaf5f0]/70 dark:bg-[#13382c]/40 border border-[#c0e6d6] dark:border-[#1f5c49] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c644d] dark:text-[#86e2bf]">
              Dietary Adjustments
            </h4>
            <ul className="text-xs text-[#122b2e] dark:text-[#edf7f3] space-y-2">
              {(analysis.recommendations?.dietary || ['Maintain balanced whole foods nutrition.']).map((d, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#3d8b72] font-bold">•</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Lifestyle */}
          <div className="p-4 rounded-2xl bg-[#dcefe9]/50 dark:bg-[#173b3f]/40 border border-[#b8ded5] dark:border-[#2c5f64] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#084744] dark:text-[#83c4b8]">
              Activity & Lifestyle
            </h4>
            <ul className="text-xs text-[#122b2e] dark:text-[#edf7f3] space-y-2">
              {(analysis.recommendations?.lifestyle || ['Aim for 150 minutes of moderate activity weekly.']).map((l, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#0b5755] font-bold">•</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Diagnostic Follow-ups */}
          <div className="p-4 rounded-2xl bg-[#fffbeb] dark:bg-[#45280b]/30 border border-[#fde68a] dark:border-[#78350f] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#92400e] dark:text-[#fde047]">
              Diagnostic Follow-ups
            </h4>
            <ul className="text-xs text-[#122b2e] dark:text-[#edf7f3] space-y-2">
              {(analysis.recommendations?.followUpTests || ['Schedule regular physician follow-up.']).map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#f59e0b] font-bold">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* When to see doctor */}
        {analysis.recommendations?.whenToSeeDoctor && (
          <div className="p-4 rounded-2xl bg-[#f8faf8] dark:bg-[#0c1e20] border border-[#e2ebe7] dark:border-[#1c4246] text-xs text-[#425b59] dark:text-[#b4cbc6] flex items-start gap-3">
            <Info className="w-4 h-4 text-[#0b5755] dark:text-[#4aa497] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#122b2e] dark:text-white">Physician Guidance: </span>
              {analysis.recommendations.whenToSeeDoctor}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Report Q&A Assistant */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-elevation border border-[#e2ebe7] dark:border-[#1c4246] space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#0b5755] dark:text-[#4aa497]" />
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-serif-heading text-[#122b2e] dark:text-white">
                Ask MediCare AI About This Report
              </h3>
              <p className="text-xs text-[#6b8582] dark:text-[#7e9d97]">
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
                  <div className="bg-[#0b5755] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-xs sm:text-sm max-w-lg shadow-subtle">
                    {item.question}
                  </div>
                </div>
                {/* AI Answer */}
                <div className="flex justify-start">
                  <div className="bg-[#f8faf8] dark:bg-[#0c1e20] border border-[#e2ebe7] dark:border-[#1c4246] rounded-2xl rounded-tl-sm px-4 py-3 text-xs sm:text-sm text-[#122b2e] dark:text-[#edf7f3] max-w-2xl leading-relaxed">
                    <div className="flex items-center gap-1.5 text-[#0b5755] dark:text-[#83c4b8] font-bold text-[11px] mb-1">
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
            className="flex-1 rounded-xl text-xs sm:text-sm border border-[#d6e4df] dark:border-[#1c4246] bg-white dark:bg-[#091617] px-4 py-2.5 text-[#122b2e] dark:text-[#edf7f3] placeholder-[#7e9d97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5755]/30"
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
