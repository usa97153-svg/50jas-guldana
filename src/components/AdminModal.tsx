import React, { useState } from 'react';
import { Shield, X, Save, Trash2, Edit2, Plus, Download, KeyRound, AlertTriangle, Check } from 'lucide-react';
import { KazakhDivider } from './KazakhOrnament.tsx';
import { Guest, EventSettings } from '../types.ts';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EventSettings;
  guests: Guest[];
  totalCount: number;
  onSettingsUpdated: (newSettings: EventSettings) => void;
  onGuestsReload: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  settings,
  guests,
  totalCount,
  onSettingsUpdated,
  onGuestsReload
}) => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Editable settings
  const [motherName, setMotherName] = useState(settings.motherName);
  const [venueName, setVenueName] = useState(settings.venueName);
  const [startTime, setStartTime] = useState(settings.startTime);
  const [mapUrl, setMapUrl] = useState(settings.mapUrl);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  // Manual guest add
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestCount, setNewGuestCount] = useState<number>(1);
  const [newGuestSide, setNewGuestSide] = useState<string>('mother');
  const [addingGuest, setAddingGuest] = useState(false);

  // Guest edit state
  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCount, setEditCount] = useState<number>(1);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setAuthError(data.message || 'Құпиясөз қате! Қайталап көріңіз.');
      }
    } catch {
      setAuthError('Қосылу қатесі');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSavedSuccess(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin,
          settings: {
            motherName,
            venueName,
            startTime,
            mapUrl
          }
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSettingsUpdated(data.settings);
        setSettingsSavedSuccess(true);
        setTimeout(() => setSettingsSavedSuccess(false), 3000);
      } else {
        alert('Сақтау кезінде қате орын алды: ' + (data.error || ''));
      }
    } catch {
      alert('Желіде қате орын алды');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeleteGuest = async (id: string, name: string) => {
    if (!window.confirm(`«${name}» есімді қонақты тізімнен өшіруді растайсыз ба?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/guests/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-pin': pin }
      });
      if (res.ok) {
        onGuestsReload();
      } else {
        alert('Өшіру кезінде қате орын алды');
      }
    } catch {
      alert('Желіде қате орын алды');
    }
  };

  const handleManualAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    setAddingGuest(true);

    try {
      const res = await fetch('/api/guests/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: newGuestName.trim(),
          guestCount: newGuestCount,
          side: newGuestSide,
          wish: 'Ұйымдастырушы арқылы тіркелген',
          forceUpdate: true
        })
      });

      if (res.ok) {
        setNewGuestName('');
        setNewGuestCount(1);
        onGuestsReload();
      } else {
        alert('Қосу кезінде қате орын алды');
      }
    } catch {
      alert('Желіде қате орын алды');
    } finally {
      setAddingGuest(false);
    }
  };

  const startEditGuest = (g: Guest) => {
    setEditingGuestId(g.id);
    setEditName(g.fullName);
    setEditCount(g.guestCount);
  };

  const saveEditGuest = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/guests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pin
        },
        body: JSON.stringify({
          pin,
          fullName: editName,
          guestCount: editCount
        })
      });

      if (res.ok) {
        setEditingGuestId(null);
        onGuestsReload();
      } else {
        alert('Жаңарту кезінде қате орын алды');
      }
    } catch {
      alert('Желіде қате орын алды');
    }
  };

  // Export list to CSV
  const handleExportCsv = () => {
    const headers = ['№,Аты-жөні,Адам саны,Жағы,Ақ тілек,Тіркелген уақыты'];
    const rows = guests.map((g, idx) => {
      const safeWish = (g.wish || '').replace(/"/g, '""');
      const safeName = g.fullName.replace(/"/g, '""');
      return `${idx + 1},"${safeName}",${g.guestCount},"${g.side || ''}","${safeWish}","${g.createdAt}"`;
    });
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `50_zhas_mereytoi_konaktar_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 p-6 sm:p-8 wine-card rounded-3xl border border-[#d4af37]/60 shadow-2xl max-h-[90vh] overflow-y-auto text-[#fff7ed]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#2a0812] text-[#d4af37] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isAuthenticated ? (
          /* Login PIN Prompt */
          <div className="max-w-sm mx-auto text-center py-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#3d0b17] border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37]">
              <KeyRound className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-serif font-bold text-[#fef08a] gold-text-gradient">
              Ұйымдастырушы Басқару Панелі
            </h3>
            <p className="mt-2 text-xs text-[#faebd7]/75">
              Мәліметтерді өзгерту және қонақтар тізімін басқару үшін PIN-кодты енгізіңіз (әдепкі: 2026)
            </p>

            {authError && (
              <div className="mt-4 p-3 rounded-xl bg-[#4a121d] border border-[#f87171] text-[#fee2e2] text-xs">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="PIN-кодты енгізіңіз"
                maxLength={10}
                className="w-full text-center tracking-widest text-lg font-mono px-4 py-3 rounded-xl bg-[#1a060b] border border-[#d4af37]/40 focus:border-[#d4af37] focus:outline-none text-[#fef08a]"
                autoFocus
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#d4af37] text-[#1c080d] font-bold text-sm tracking-wide hover:brightness-110 transition-colors"
              >
                КІРУ
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-4">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-[#d4af37]" />
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#fef08a]">
                    Басқару Панелі
                  </h3>
                  <p className="text-xs text-[#d4af37]/80">
                    Мерейтой деректері мен қонақтар тізімін басқару
                  </p>
                </div>
              </div>

              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2b0c16] hover:bg-[#3d0f1f] text-[#fef08a] border border-[#d4af37]/40 text-xs font-medium transition-colors"
              >
                <Download className="w-4 h-4 text-[#d4af37]" />
                <span>Excel/CSV жүктеу</span>
              </button>
            </div>

            {/* Event Settings Form */}
            <form onSubmit={handleSaveSettings} className="p-5 rounded-2xl bg-[#1c060d]/70 border border-[#d4af37]/30 space-y-4">
              <h4 className="text-base font-serif font-semibold text-[#fef08a] flex items-center gap-2">
                <span>Мерейтой Мәліметтерін Өзгерту</span>
              </h4>

              {settingsSavedSuccess && (
                <div className="p-3 rounded-xl bg-[#143d22] text-[#86efac] text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Мерейтой параметрлері сәтті сақталды!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#d4af37] mb-1">
                    Анамыздың есімі (Сайтта көрсетіледі):
                  </label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="ГҮЛДАНА"
                    className="w-full px-3 py-2 rounded-lg bg-[#280913] border border-[#d4af37]/30 text-[#fff]"
                  />
                </div>

                <div>
                  <label className="block text-[#d4af37] mb-1">
                    Басталу уақыты:
                  </label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="19:00"
                    className="w-full px-3 py-2 rounded-lg bg-[#280913] border border-[#d4af37]/30 text-[#fff]"
                  />
                </div>

                <div>
                  <label className="block text-[#d4af37] mb-1">
                    Мейрамхана атауы:
                  </label>
                  <input
                    type="text"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#280913] border border-[#d4af37]/30 text-[#fff]"
                  />
                </div>

                <div>
                  <label className="block text-[#d4af37] mb-1">
                    Онлайн карта сілтемесі (2GIS / Google):
                  </label>
                  <input
                    type="text"
                    value={mapUrl}
                    onChange={(e) => setMapUrl(e.target.value)}
                    placeholder="https://go.2gis.com/x9mOa"
                    className="w-full px-3 py-2 rounded-lg bg-[#280913] border border-[#d4af37]/30 text-[#fff]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#d4af37] text-[#1c080d] font-bold text-xs tracking-wider uppercase hover:brightness-110 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSettings ? 'Сақталуда...' : 'ПАРАМЕТРЛЕРДІ САҚТАУ'}</span>
                </button>
              </div>
            </form>

            {/* Quick Manual Add Guest */}
            <form onSubmit={handleManualAddGuest} className="p-4 rounded-2xl bg-[#1c060d]/70 border border-[#d4af37]/30">
              <h4 className="text-xs font-semibold text-[#fef08a] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#d4af37]" />
                <span>Қолмен қонақ қосу (Телефонмен растаған үлкендер үшін)</span>
              </h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  required
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  placeholder="Қонақтың аты-жөні"
                  className="flex-1 px-3 py-2 rounded-lg bg-[#280913] border border-[#d4af37]/30 text-xs text-[#fff]"
                />
                <select
                  value={newGuestCount}
                  onChange={(e) => setNewGuestCount(Number(e.target.value))}
                  className="px-3 py-2 rounded-lg bg-[#280913] border border-[#d4af37]/30 text-xs text-[#fff]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                    <option key={n} value={n}>{n} адам</option>
                  ))}
                </select>
                <select
                  value={newGuestSide}
                  onChange={(e) => setNewGuestSide(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-[#280913] border border-[#d4af37]/30 text-xs text-[#fff]"
                >
                  <option value="mother">Ана жағы</option>
                  <option value="father">Әке жағы</option>
                  <option value="quda">Құдалар</option>
                  <option value="friends">Достар</option>
                  <option value="neighbors">Көршілер</option>
                </select>
                <button
                  type="submit"
                  disabled={addingGuest}
                  className="px-4 py-2 rounded-lg bg-[#3d0b17] border border-[#d4af37]/50 text-[#fef08a] font-medium text-xs hover:bg-[#4d0e1e] transition-colors shrink-0"
                >
                  Қосу
                </button>
              </div>
            </form>

            {/* Guests Management Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm sm:text-base font-serif font-bold text-[#fef08a]">
                  Тіркелген Қонақтар Тізімі ({guests.length} жазба / Жалпы: {totalCount} адам)
                </h4>
              </div>

              {guests.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#d4af37]/60">
                  Әзірге қонақтар жоқ
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto rounded-xl border border-[#d4af37]/20">
                  <table className="w-full text-left text-xs text-[#faebd7]">
                    <thead className="bg-[#2a0812] text-[#d4af37] uppercase text-[10px] tracking-wider sticky top-0">
                      <tr>
                        <th className="py-2.5 px-3">№</th>
                        <th className="py-2.5 px-3">Аты-жөні</th>
                        <th className="py-2.5 px-3">Адам саны</th>
                        <th className="py-2.5 px-3">Тілек</th>
                        <th className="py-2.5 px-3 text-right">Әрекеттер</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d4af37]/15">
                      {guests.map((g, idx) => (
                        <tr key={g.id} className="hover:bg-[#2b0812]/50">
                          <td className="py-2.5 px-3 text-[#d4af37]/80">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-medium">
                            {editingGuestId === g.id ? (
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="px-2 py-1 rounded bg-[#1c060d] border border-[#d4af37] text-xs text-white"
                              />
                            ) : (
                              g.fullName
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            {editingGuestId === g.id ? (
                              <input
                                type="number"
                                min={1}
                                max={20}
                                value={editCount}
                                onChange={(e) => setEditCount(Number(e.target.value))}
                                className="w-16 px-2 py-1 rounded bg-[#1c060d] border border-[#d4af37] text-xs text-white"
                              />
                            ) : (
                              <span className="font-semibold text-[#fef08a]">{g.guestCount} адам</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-[#faebd7]/70 truncate max-w-[140px]">
                            {g.wish || '—'}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {editingGuestId === g.id ? (
                                <button
                                  onClick={() => saveEditGuest(g.id)}
                                  className="p-1.5 rounded bg-[#4ade80]/20 text-[#4ade80] hover:bg-[#4ade80]/40"
                                  title="Сақтау"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => startEditGuest(g)}
                                  className="p-1.5 rounded bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37]/40"
                                  title="Өңдеу"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteGuest(g.id, g.fullName)}
                                className="p-1.5 rounded bg-[#f87171]/20 text-[#f87171] hover:bg-[#f87171]/40"
                                title="Өшіру"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
