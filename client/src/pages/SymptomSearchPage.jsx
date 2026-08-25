import React, { useState, useEffect } from 'react';
import { Stethoscope, History, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import api from '../services/api';
import SymptomSearchBox from '../components/symptoms/SymptomSearchBox';
import SymptomTriageResult from '../components/symptoms/SymptomTriageResult';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const SymptomSearchPage = ({ onEmergencyTrigger }) => {
  const [currentResult, setCurrentResult] = useState(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentSearchId, setCurrentSearchId] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/search/history');
      if (res.data.success) {
        setHistory(res.data.history);
      }
    } catch (err) {
      console.error('[History Fetch Error]', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSearch = async (queryText) => {
    setIsSearching(true);
    setCurrentQuery(queryText);
    try {
      const res = await api.post('/search/symptoms', { query: queryText });
      if (res.data.success) {
        setCurrentResult(res.data.aiResult);
        setCurrentSearchId(res.data.searchRecord?._id);
        fetchHistory();

        // Check if critical emergency was flagged
        if (res.data.aiResult?.isEmergency && onEmergencyTrigger) {
          onEmergencyTrigger(res.data.aiResult.emergencyGuidance);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Symptom triage failed.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectHistoryItem = (item) => {
    setCurrentQuery(item.query);
    setCurrentResult(item.aiResult);
    setCurrentSearchId(item._id);
  };

  const handleDeleteHistoryItem = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/search/history/${id}`);
      setHistory(history.filter((h) => h._id !== id));
      toast.success('Search removed from history.');
    } catch (err) {
      toast.error('Failed to delete search record.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b5755] dark:text-[#4aa497]">
          Clinical Guidance & Triage
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-[#122b2e] dark:text-white">
          Symptom & Illness Triage
        </h1>
        <p className="text-xs sm:text-sm text-[#425b59] dark:text-[#b4cbc6] mt-0.5">
          Ask questions about health concerns and receive home-care protocols, general OTC medicine classes, and recovery tasks.
        </p>
      </div>

      {/* Main Search Input */}
      <SymptomSearchBox onSearch={handleSearch} isSearching={isSearching} />

      {/* Grid: Search Result & Past Searches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Result Area (2 cols) */}
        <div className="lg:col-span-2">
          {currentResult ? (
            <SymptomTriageResult
              result={currentResult}
              query={currentQuery}
              searchId={currentSearchId}
            />
          ) : (
            <div className="glass-card rounded-3xl p-8 sm:p-12 text-center text-[#6b8582] dark:text-[#7e9d97] space-y-3 shadow-card">
              <div className="w-16 h-16 rounded-2xl bg-[#dcefe9] dark:bg-[#173b3f] text-[#0b5755] dark:text-[#83c4b8] mx-auto flex items-center justify-center">
                <Stethoscope className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold font-serif-heading text-[#122b2e] dark:text-white">
                No Active Search Selected
              </h3>
              <p className="text-xs max-w-sm mx-auto">
                Type symptoms into the search bar above or choose a preset to generate a structured recovery plan.
              </p>
            </div>
          )}
        </div>

        {/* Right 1 col: Past Searches */}
        <div className="space-y-4">
          <div className="glass-card rounded-3xl p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#0b5755] dark:text-[#4aa497]" />
              <h3 className="text-xs font-bold text-[#122b2e] dark:text-white uppercase tracking-wider">
                Recent Triage History
              </h3>
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-[#6b8582] dark:text-[#7e9d97] text-center py-4">
                No past symptom searches found.
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleSelectHistoryItem(item)}
                    className="p-3 rounded-2xl bg-[#f8faf8] dark:bg-[#0c1e20] border border-[#e2ebe7] dark:border-[#1c4246] hover:border-[#b8ded5] cursor-pointer transition-all flex items-center justify-between gap-2 group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#122b2e] dark:text-white truncate group-hover:text-[#0b5755] dark:group-hover:text-[#4aa497]">
                        {item.aiResult?.conditionName || item.query}
                      </p>
                      <p className="text-[10px] text-[#6b8582] dark:text-[#7e9d97] truncate mt-0.5">
                        "{item.query}"
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteHistoryItem(e, item._id)}
                      className="p-1 rounded-lg text-[#6b8582] hover:text-red-500 hover:bg-[#f3f7f5] dark:hover:bg-[#143236] transition-colors"
                      title="Delete search"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomSearchPage;
