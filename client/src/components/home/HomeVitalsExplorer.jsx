import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Heart,
  Droplets,
  Scale,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Info,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const HomeVitalsExplorer = () => {
  const { isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();

  // Active vital tab: 'bp' | 'glucose' | 'lipids' | 'bmi'
  const [activeVital, setActiveVital] = useState('bp');

  // Blood pressure state
  const [systolic, setSystolic] = useState(124);
  const [diastolic, setDiastolic] = useState(82);

  // Fasting glucose state
  const [glucose, setGlucose] = useState(108);

  // Cholesterol state
  const [cholesterol, setCholesterol] = useState(195);
  const [ldl, setLdl] = useState(115);

  // BMI state
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(72);

  // Calculate BP category
  const getBPCategory = () => {
    if (systolic >= 180 || diastolic >= 120) {
      return { label: 'Hypertensive Crisis', variant: 'critical', desc: 'Requires immediate clinical attention.' };
    }
    if (systolic >= 140 || diastolic >= 90) {
      return { label: 'Stage 2 Hypertension', variant: 'critical', desc: 'High blood pressure requiring medical management.' };
    }
    if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
      return { label: 'Stage 1 Hypertension', variant: 'borderline', desc: 'Mildly elevated; lifestyle modifications advised.' };
    }
    if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
      return { label: 'Elevated BP', variant: 'elevated', desc: 'Slightly above optimal; monitor dietary sodium.' };
    }
    return { label: 'Normal / Optimal', variant: 'normal', desc: 'Within ideal cardiovascular reference range.' };
  };

  // Calculate Glucose category
  const getGlucoseCategory = () => {
    if (glucose >= 126) {
      return { label: 'Diabetic Range', variant: 'critical', desc: 'Fasting levels consistent with clinical diabetes; consult physician.' };
    }
    if (glucose >= 100 && glucose <= 125) {
      return { label: 'Pre-Diabetes (Impaired Fasting)', variant: 'borderline', desc: 'Elevated metabolic risk; dietary & physical activity interventions advised.' };
    }
    if (glucose < 70) {
      return { label: 'Hypoglycemia Range', variant: 'low', desc: 'Low blood sugar; watch for dizziness, shakiness, or weakness.' };
    }
    return { label: 'Normal Fasting Glucose', variant: 'normal', desc: 'Healthy metabolic glycemic regulation (<100 mg/dL).' };
  };

  // Calculate Lipids category
  const getLipidsCategory = () => {
    if (cholesterol >= 240 || ldl >= 160) {
      return { label: 'High Cardiovascular Risk', variant: 'critical', desc: 'Significantly elevated lipid markers; medical evaluation recommended.' };
    }
    if ((cholesterol >= 200 && cholesterol <= 239) || (ldl >= 130 && ldl <= 159)) {
      return { label: 'Borderline High Lipids', variant: 'borderline', desc: 'Mild hyperlipidemia; increase soluble fiber and aerobic activity.' };
    }
    return { label: 'Desirable / Optimal Lipid Profile', variant: 'normal', desc: 'Healthy lipid balance with low atherosclerotic risk.' };
  };

  // Calculate BMI
  const calculateBMI = () => {
    const hM = height / 100;
    const bmiVal = weight / (hM * hM);
    return parseFloat(bmiVal.toFixed(1));
  };

  const bmi = calculateBMI();
  const getBmiCategory = () => {
    if (bmi < 18.5) return { label: 'Underweight', variant: 'low', desc: 'Below standard body mass index range.' };
    if (bmi < 25) return { label: 'Normal Weight', variant: 'normal', desc: 'Optimal BMI associated with lowest chronic risk.' };
    if (bmi < 30) return { label: 'Overweight Range', variant: 'borderline', desc: 'Mildly elevated BMI; focus on sustainable habits.' };
    return { label: 'Obesity Range', variant: 'critical', desc: 'Higher metabolic and joint strain risk profile.' };
  };

  const handleGoToPortal = async () => {
    if (isAuthenticated) {
      navigate('/metrics');
    } else {
      const res = await demoLogin();
      if (res.success) {
        navigate('/metrics');
      }
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-elevation border border-[#e2ebe7] dark:border-[#1c4246] space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e2ebe7] dark:border-[#1c4246]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#dcefe9] dark:bg-[#173b3f] text-[#0b5755] dark:text-[#83c4b8] flex items-center justify-center shrink-0 shadow-subtle">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif-heading text-[#122b2e] dark:text-white">
              Interactive Biometric Range Explorer
            </h3>
            <p className="text-xs text-[#425b59] dark:text-[#b4cbc6]">
              Test vital ranges against standard clinical reference thresholds.
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleGoToPortal}
          icon={TrendingUp}
        >
          {isAuthenticated ? 'Open Metrics Dashboard' : '1-Click Vitals Tour'}
        </Button>
      </div>

      {/* Vital Metric Sub-Tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        {[
          { id: 'bp', label: 'Blood Pressure', icon: Heart },
          { id: 'glucose', label: 'Fasting Glucose', icon: Droplets },
          { id: 'lipids', label: 'Cholesterol & LDL', icon: Activity },
          { id: 'bmi', label: 'Body Mass Index', icon: Scale },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveVital(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeVital === item.id
                  ? 'bg-[#0b5755] dark:bg-[#4aa497] text-white dark:text-[#091617] shadow-card'
                  : 'bg-[#f3f7f5] dark:bg-[#143236] text-[#425b59] dark:text-[#b4cbc6] hover:bg-[#eaf2ee]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Blood Pressure */}
      {activeVital === 'bp' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5 text-[#122b2e] dark:text-white">
                  <span>Systolic Pressure (mmHg)</span>
                  <span className="text-[#0b5755] dark:text-[#4aa497] font-mono">{systolic} mmHg</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="200"
                  value={systolic}
                  onChange={(e) => setSystolic(Number(e.target.value))}
                  className="w-full accent-[#0b5755] dark:accent-[#4aa497] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#6b8582]">
                  <span>90 (Low)</span>
                  <span>120 (Optimal)</span>
                  <span>200 (Severe)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5 text-[#122b2e] dark:text-white">
                  <span>Diastolic Pressure (mmHg)</span>
                  <span className="text-[#0b5755] dark:text-[#4aa497] font-mono">{diastolic} mmHg</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="130"
                  value={diastolic}
                  onChange={(e) => setDiastolic(Number(e.target.value))}
                  className="w-full accent-[#0b5755] dark:accent-[#4aa497] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#6b8582]">
                  <span>60 (Low)</span>
                  <span>80 (Optimal)</span>
                  <span>130 (Severe)</span>
                </div>
              </div>
            </div>

            {/* Live Result Card */}
            <div className="p-6 rounded-2xl bg-[#f8faf8] dark:bg-[#0c1e20] border border-[#e2ebe7] dark:border-[#1c4246] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6b8582] dark:text-[#7e9d97]">Current Reading</span>
                  <Badge variant={getBPCategory().variant} size="md">
                    {getBPCategory().label}
                  </Badge>
                </div>
                <p className="text-3xl font-bold font-mono text-[#122b2e] dark:text-white mt-2">
                  {systolic} / {diastolic} <span className="text-sm font-sans font-normal text-[#6b8582]">mmHg</span>
                </p>
                <p className="text-xs text-[#425b59] dark:text-[#b4cbc6] mt-2 leading-relaxed">
                  {getBPCategory().desc}
                </p>
              </div>

              <div className="text-[11px] text-[#6b8582] pt-3 border-t border-[#e2ebe7] dark:border-[#1c4246] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0 text-[#0b5755] dark:text-[#4aa497]" />
                <span>Reference: AHA / ACC Clinical Hypertension Guidelines</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 2: Fasting Glucose */}
      {activeVital === 'glucose' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5 text-[#122b2e] dark:text-white">
                  <span>Fasting Blood Glucose</span>
                  <span className="text-[#0b5755] dark:text-[#4aa497] font-mono">{glucose} mg/dL</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="250"
                  value={glucose}
                  onChange={(e) => setGlucose(Number(e.target.value))}
                  className="w-full accent-[#0b5755] dark:accent-[#4aa497] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#6b8582]">
                  <span>60 (Low)</span>
                  <span>100 (Optimal)</span>
                  <span>126 (Diabetic)</span>
                  <span>250</span>
                </div>
              </div>
            </div>

            {/* Live Result Card */}
            <div className="p-6 rounded-2xl bg-[#f8faf8] dark:bg-[#0c1e20] border border-[#e2ebe7] dark:border-[#1c4246] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6b8582] dark:text-[#7e9d97]">Glycemic Status</span>
                  <Badge variant={getGlucoseCategory().variant} size="md">
                    {getGlucoseCategory().label}
                  </Badge>
                </div>
                <p className="text-3xl font-bold font-mono text-[#122b2e] dark:text-white mt-2">
                  {glucose} <span className="text-sm font-sans font-normal text-[#6b8582]">mg/dL</span>
                </p>
                <p className="text-xs text-[#425b59] dark:text-[#b4cbc6] mt-2 leading-relaxed">
                  {getGlucoseCategory().desc}
                </p>
              </div>

              <div className="text-[11px] text-[#6b8582] pt-3 border-t border-[#e2ebe7] dark:border-[#1c4246] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0 text-[#0b5755] dark:text-[#4aa497]" />
                <span>Reference: American Diabetes Association (ADA) Clinical Criteria</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 3: Lipids & Cholesterol */}
      {activeVital === 'lipids' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5 text-[#122b2e] dark:text-white">
                  <span>Total Cholesterol (mg/dL)</span>
                  <span className="text-[#0b5755] dark:text-[#4aa497] font-mono">{cholesterol} mg/dL</span>
                </div>
                <input
                  type="range"
                  min="120"
                  max="320"
                  value={cholesterol}
                  onChange={(e) => setCholesterol(Number(e.target.value))}
                  className="w-full accent-[#0b5755] dark:accent-[#4aa497] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5 text-[#122b2e] dark:text-white">
                  <span>LDL Direct ("Bad" Cholesterol)</span>
                  <span className="text-[#0b5755] dark:text-[#4aa497] font-mono">{ldl} mg/dL</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="220"
                  value={ldl}
                  onChange={(e) => setLdl(Number(e.target.value))}
                  className="w-full accent-[#0b5755] dark:accent-[#4aa497] cursor-pointer"
                />
              </div>
            </div>

            {/* Live Result Card */}
            <div className="p-6 rounded-2xl bg-[#f8faf8] dark:bg-[#0c1e20] border border-[#e2ebe7] dark:border-[#1c4246] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6b8582] dark:text-[#7e9d97]">Lipid Evaluation</span>
                  <Badge variant={getLipidsCategory().variant} size="md">
                    {getLipidsCategory().label}
                  </Badge>
                </div>
                <p className="text-2xl font-bold font-mono text-[#122b2e] dark:text-white mt-2">
                  Total: {cholesterol} · LDL: {ldl} <span className="text-xs font-sans font-normal text-[#6b8582]">mg/dL</span>
                </p>
                <p className="text-xs text-[#425b59] dark:text-[#b4cbc6] mt-2 leading-relaxed">
                  {getLipidsCategory().desc}
                </p>
              </div>

              <div className="text-[11px] text-[#6b8582] pt-3 border-t border-[#e2ebe7] dark:border-[#1c4246] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0 text-[#0b5755] dark:text-[#4aa497]" />
                <span>Reference: NCEP ATP III Lipid Consensus Guidelines</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 4: Body Mass Index (BMI) */}
      {activeVital === 'bmi' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5 text-[#122b2e] dark:text-white">
                  <span>Height (cm)</span>
                  <span className="text-[#0b5755] dark:text-[#4aa497] font-mono">{height} cm</span>
                </div>
                <input
                  type="range"
                  min="130"
                  max="220"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-[#0b5755] dark:accent-[#4aa497] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5 text-[#122b2e] dark:text-white">
                  <span>Weight (kg)</span>
                  <span className="text-[#0b5755] dark:text-[#4aa497] font-mono">{weight} kg</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="160"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full accent-[#0b5755] dark:accent-[#4aa497] cursor-pointer"
                />
              </div>
            </div>

            {/* Live Result Card */}
            <div className="p-6 rounded-2xl bg-[#f8faf8] dark:bg-[#0c1e20] border border-[#e2ebe7] dark:border-[#1c4246] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6b8582] dark:text-[#7e9d97]">Calculated Index</span>
                  <Badge variant={getBmiCategory().variant} size="md">
                    {getBmiCategory().label}
                  </Badge>
                </div>
                <p className="text-3xl font-bold font-mono text-[#122b2e] dark:text-white mt-2">
                  {bmi} <span className="text-sm font-sans font-normal text-[#6b8582]">kg/m²</span>
                </p>
                <p className="text-xs text-[#425b59] dark:text-[#b4cbc6] mt-2 leading-relaxed">
                  {getBmiCategory().desc}
                </p>
              </div>

              <div className="text-[11px] text-[#6b8582] pt-3 border-t border-[#e2ebe7] dark:border-[#1c4246] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0 text-[#0b5755] dark:text-[#4aa497]" />
                <span>Reference: World Health Organization (WHO) BMI Classifications</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HomeVitalsExplorer;
