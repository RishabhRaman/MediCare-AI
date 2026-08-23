import React, { useState } from 'react';
import {
  UserCog,
  Shield,
  Heart,
  AlertTriangle,
  Download,
  Trash2,
  Plus,
  X,
  PhoneCall,
  Save,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [profile, setProfile] = useState({
    age: user?.healthProfile?.age || '',
    gender: user?.healthProfile?.gender || 'Select',
    bloodType: user?.healthProfile?.bloodType || 'Select',
    height: user?.healthProfile?.height || '',
    weight: user?.healthProfile?.weight || '',
    allergies: user?.healthProfile?.allergies || [],
    chronicConditions: user?.healthProfile?.chronicConditions || [],
    currentMedications: user?.healthProfile?.currentMedications || [],
    emergencyContact: {
      name: user?.healthProfile?.emergencyContact?.name || '',
      relation: user?.healthProfile?.emergencyContact?.relation || '',
      phone: user?.healthProfile?.emergencyContact?.phone || '',
    },
  });

  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Dynamic BMI Calculation
  const calculateBMI = () => {
    if (profile.height && profile.weight) {
      const hM = profile.height / 100;
      const bmiVal = profile.weight / (hM * hM);
      return parseFloat(bmiVal.toFixed(1));
    }
    return null;
  };

  const bmi = calculateBMI();

  const getBmiCategory = (val) => {
    if (!val) return null;
    if (val < 18.5) return { label: 'Underweight', variant: 'low' };
    if (val < 25) return { label: 'Normal Weight', variant: 'normal' };
    if (val < 30) return { label: 'Overweight', variant: 'borderline' };
    return { label: 'Obese Range', variant: 'critical' };
  };

  const bmiCategory = getBmiCategory(bmi);

  const handleAddChip = (field, value, setter) => {
    if (!value.trim()) return;
    if (!profile[field].includes(value.trim())) {
      setProfile({ ...profile, [field]: [...profile[field], value.trim()] });
    }
    setter('');
  };

  const handleRemoveChip = (field, itemToRemove) => {
    setProfile({
      ...profile,
      [field]: profile[field].filter((item) => item !== itemToRemove),
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await api.put('/auth/profile', {
        name,
        healthProfile: {
          ...profile,
          age: profile.age ? parseInt(profile.age) : null,
          height: profile.height ? parseFloat(profile.height) : null,
          weight: profile.weight ? parseFloat(profile.weight) : null,
        },
      });

      if (res.data.success) {
        updateUser(res.data.user);
        toast.success('Health profile saved successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const res = await api.get('/auth/export');
      if (res.data.success) {
        const dataStr =
          'data:text/json;charset=utf-8,' +
          encodeURIComponent(JSON.stringify(res.data.userData, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `MediCare_Patient_Data_Export.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        toast.success('Patient health records exported (JSON)!');
      }
    } catch (err) {
      toast.error('Failed to export data.');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.prompt(
      'Are you sure you want to permanently delete your account and all associated lab records? Type "DELETE" to confirm:'
    );
    if (confirmation === 'DELETE') {
      try {
        await api.delete('/auth/account');
        toast.success('Account permanently deleted.');
        logout();
      } catch (err) {
        toast.error('Failed to delete account.');
      }
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-sky-500">
          Patient Health Profile
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Profile & Clinical Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Configure allergies, medications, emergency contacts, and personal health metrics.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Basic Demographics & BMI */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
            Personal & Biometric Demographics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Biological Sex / Gender
              </label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                className="w-full rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-slate-900 dark:text-slate-100"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <Input
              label="Age (Years)"
              type="number"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Blood Group
              </label>
              <select
                value={profile.bloodType}
                onChange={(e) => setProfile({ ...profile, bloodType: e.target.value })}
                className="w-full rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-slate-900 dark:text-slate-100"
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            <Input
              label="Height (cm)"
              type="number"
              placeholder="e.g. 178"
              value={profile.height}
              onChange={(e) => setProfile({ ...profile, height: e.target.value })}
            />

            <Input
              label="Weight (kg)"
              type="number"
              step="any"
              placeholder="e.g. 76.5"
              value={profile.weight}
              onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
            />
          </div>

          {/* BMI Live Indicator */}
          {bmi && (
            <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-500/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-sky-600 dark:text-sky-400">
                  Calculated Body Mass Index (BMI)
                </p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {bmi} kg/m²
                </p>
              </div>
              {bmiCategory && (
                <Badge variant={bmiCategory.variant} size="md">
                  {bmiCategory.label}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Clinical History & Chips (Allergies, Medications, Conditions) */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
            Known Allergies, Medications & Chronic Conditions
          </h3>

          {/* Allergies */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Drug & Food Allergies
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {profile.allergies.map((allergy, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold"
                >
                  {allergy}
                  <button
                    type="button"
                    onClick={() => handleRemoveChip('allergies', allergy)}
                    className="hover:text-rose-900"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Penicillin, Sulfa drugs, Peanuts..."
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  (e.preventDefault(), handleAddChip('allergies', newAllergy, setNewAllergy))
                }
                className="flex-1 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-slate-900 dark:text-slate-100"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleAddChip('allergies', newAllergy, setNewAllergy)}
                icon={Plus}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Chronic Conditions */}
          <div className="space-y-2 pt-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Pre-existing / Chronic Conditions
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {profile.chronicConditions.map((cond, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold"
                >
                  {cond}
                  <button
                    type="button"
                    onClick={() => handleRemoveChip('chronicConditions', cond)}
                    className="hover:text-amber-900"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Hypertension, Type 2 Diabetes, Asthma..."
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  (e.preventDefault(),
                  handleAddChip('chronicConditions', newCondition, setNewCondition))
                }
                className="flex-1 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-slate-900 dark:text-slate-100"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleAddChip('chronicConditions', newCondition, setNewCondition)}
                icon={Plus}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Ongoing Medications */}
          <div className="space-y-2 pt-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Current Medications & Supplements
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {profile.currentMedications.map((med, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-semibold"
                >
                  {med}
                  <button
                    type="button"
                    onClick={() => handleRemoveChip('currentMedications', med)}
                    className="hover:text-sky-900"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Vitamin D3 2000IU, Omega-3 Fish Oil..."
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  (e.preventDefault(),
                  handleAddChip('currentMedications', newMedication, setNewMedication))
                }
                className="flex-1 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-slate-900 dark:text-slate-100"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleAddChip('currentMedications', newMedication, setNewMedication)}
                icon={Plus}
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <PhoneCall className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Emergency Contact Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Contact Name"
              type="text"
              placeholder="e.g. Sarah Mercer"
              value={profile.emergencyContact.name}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  emergencyContact: { ...profile.emergencyContact, name: e.target.value },
                })
              }
            />

            <Input
              label="Relationship"
              type="text"
              placeholder="e.g. Spouse / Parent"
              value={profile.emergencyContact.relation}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  emergencyContact: { ...profile.emergencyContact, relation: e.target.value },
                })
              }
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="e.g. +1 (555) 234-5678"
              value={profile.emergencyContact.phone}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  emergencyContact: { ...profile.emergencyContact, phone: e.target.value },
                })
              }
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSaving}
            icon={Save}
            className="shadow-lg shadow-sky-500/20 px-8"
          >
            Save Health Profile
          </Button>
        </div>
      </form>

      {/* Privacy, Data Export & Account Settings */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
          Data Privacy & Account Controls
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Export Medical Data (JSON)
            </p>
            <p className="text-xs text-slate-500">
              Download your complete clinical history, analyzed reports, and biomarker records.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={handleExportData} icon={Download}>
            Export My Data
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-500/30">
          <div>
            <p className="text-sm font-bold text-rose-600 dark:text-rose-400">
              Delete Account & Records
            </p>
            <p className="text-xs text-rose-900/70 dark:text-rose-300/70">
              Permanently purge all patient profile data, uploaded lab documents, and search history.
            </p>
          </div>
          <Button variant="danger" size="sm" onClick={handleDeleteAccount} icon={Trash2}>
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
