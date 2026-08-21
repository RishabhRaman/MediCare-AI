import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateMedicalReportPDF = (report, user) => {
  const doc = new jsPDF();
  const analysis = report.aiAnalysis || {};

  // Header Banner
  doc.setFillColor(14, 165, 233); // Medical Cyan/Sky
  doc.rect(0, 0, 210, 32, 'F');

  // Title & Brand
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('MEDICARE AI - CLINICAL SUMMARY REPORT', 14, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('AI-Assisted Diagnostic Synthesis & Patient Summary', 14, 25);

  const reportDate = new Date(report.dateOfReport || report.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Generated: ${reportDate}`, 155, 25);

  // Patient Info Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 38, 182, 22, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Patient: ${user?.name || 'Alex Mercer'}`, 18, 46);
  doc.setFont('helvetica', 'normal');
  doc.text(`Age/Sex: ${user?.healthProfile?.age || 'N/A'} yrs / ${user?.healthProfile?.gender || 'N/A'}`, 18, 54);
  doc.text(`Report Title: ${report.title}`, 95, 46);
  doc.text(`Risk Evaluation: ${(analysis.riskLevel || 'Normal').toUpperCase()} (Score: ${analysis.riskScore || 20}/100)`, 95, 54);

  // Executive Summary Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(2, 132, 199);
  doc.text('Executive Clinical Summary', 14, 68);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const splitSummary = doc.splitTextToSize(analysis.executiveSummary || 'No summary available.', 182);
  doc.text(splitSummary, 14, 75);

  let currentY = 75 + splitSummary.length * 5 + 6;

  // Extracted Biomarkers Table
  if (analysis.extractedParameters && analysis.extractedParameters.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(2, 132, 199);
    doc.text('Extracted Lab Parameters & Biomarkers', 14, currentY);
    currentY += 4;

    const tableRows = analysis.extractedParameters.map((p) => [
      p.parameter,
      p.value,
      p.referenceRange || 'N/A',
      (p.status || 'normal').toUpperCase(),
      p.interpretation || 'Within normal parameters.',
    ]);

    doc.autoTable({
      startY: currentY,
      head: [['Parameter', 'Result Value', 'Reference Range', 'Status', 'Clinical Interpretation']],
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontSize: 8.5,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [51, 65, 85],
      },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold' },
        1: { cellWidth: 25 },
        2: { cellWidth: 28 },
        3: { cellWidth: 22 },
        4: { cellWidth: 67 },
      },
      didParseCell: (data) => {
        if (data.column.index === 3 && data.section === 'body') {
          const val = data.cell.raw;
          if (val === 'HIGH' || val === 'CRITICAL') {
            data.cell.styles.textColor = [220, 38, 38];
            data.cell.styles.fontStyle = 'bold';
          } else if (val === 'LOW') {
            data.cell.styles.textColor = [217, 119, 6];
            data.cell.styles.fontStyle = 'bold';
          } else if (val === 'NORMAL') {
            data.cell.styles.textColor = [16, 185, 129];
          }
        }
      },
    });

    currentY = doc.lastAutoTable.finalY + 10;
  }

  // Recommendations Section
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(2, 132, 199);
  doc.text('Key Actionable Recommendations', 14, currentY);
  currentY += 6;

  const dietary = analysis.recommendations?.dietary || [];
  const lifestyle = analysis.recommendations?.lifestyle || [];
  const followUp = analysis.recommendations?.followUpTests || [];

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  const allRecs = [
    ...dietary.map((d) => `• [Diet] ${d}`),
    ...lifestyle.map((l) => `• [Lifestyle] ${l}`),
    ...followUp.map((f) => `• [Follow-up] ${f}`),
  ];

  for (const rec of allRecs.slice(0, 5)) {
    const splitRec = doc.splitTextToSize(rec, 182);
    doc.text(splitRec, 14, currentY);
    currentY += splitRec.length * 4.5 + 2;
  }

  // Disclaimer Footer Box
  currentY = Math.max(currentY + 6, 260);
  if (currentY > 265) {
    doc.addPage();
    currentY = 250;
  }

  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(14, currentY, 182, 18, 2, 2, 'FD');

  doc.setTextColor(185, 28, 28);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('CLINICAL DISCLAIMER & SAFETY NOTICE', 18, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'This report is generated by MediCare AI for informational & educational synthesis only. It is NOT a medical diagnosis,',
    18,
    currentY + 10
  );
  doc.text(
    'prescription, or substitute for a licensed physician. Consult a licensed doctor for diagnostic evaluation and medication dosing.',
    18,
    currentY + 14
  );

  // Save PDF
  const safeFilename = `MediCare_Report_${report.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(safeFilename);
};
