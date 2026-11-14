import React, { useState, useEffect } from 'react';
import { ANDROID_FILES } from './data/androidFiles';
import {
  Download,
  FileCode,
  Smartphone,
  Phone,
  PhoneOff,
  Trash2,
  StopCircle,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Search,
  ArrowLeft,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  HardDrive,
  Wifi,
  BatteryCharging,
  Bell,
  KeyRound,
  Maximize2,
  Minimize2
} from 'lucide-react';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';

interface AppItem {
  id: string;
  name: string;
  pkg: string;
  iconLetter: string;
  iconBg: string;
  timeUsed: number;
  size: string;
  dataUsage: string;
  battery: string;
  isSuspicious?: boolean;
}

const INITIAL_APPS: AppItem[] = [
  {
    id: 'tiktok',
    name: 'TikTok',
    pkg: 'com.zhiliaoapp.musically',
    iconLetter: '🎵',
    iconBg: 'bg-black border border-slate-700',
    timeUsed: Date.now() - 1000 * 60 * 3, // 3 min ago
    size: '1.24 Go',
    dataUsage: '840 Mo',
    battery: '12%',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    pkg: 'com.instagram.android',
    iconLetter: '📸',
    iconBg: 'bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-700',
    timeUsed: Date.now() - 1000 * 60 * 14,
    size: '890 Mo',
    dataUsage: '450 Mo',
    battery: '8%',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    pkg: 'com.whatsapp',
    iconLetter: '💬',
    iconBg: 'bg-emerald-600',
    timeUsed: Date.now() - 1000 * 60 * 38,
    size: '620 Mo',
    dataUsage: '1.2 Go',
    battery: '5%',
  },
  {
    id: 'fastcleaner',
    name: 'Fast Cleaner Super',
    pkg: 'com.optimizer.cleaner.speedup',
    iconLetter: '⚠️',
    iconBg: 'bg-amber-600',
    timeUsed: Date.now() - 1000 * 60 * 55,
    size: '142 Mo',
    dataUsage: '68 Mo',
    battery: '15%',
    isSuspicious: true,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    pkg: 'com.google.android.youtube',
    iconLetter: '▶',
    iconBg: 'bg-red-600',
    timeUsed: Date.now() - 1000 * 60 * 110,
    size: '1.8 Go',
    dataUsage: '2.4 Go',
    battery: '18%',
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    pkg: 'com.snapchat.android',
    iconLetter: '👻',
    iconBg: 'bg-yellow-400 text-black',
    timeUsed: Date.now() - 1000 * 60 * 240,
    size: '780 Mo',
    dataUsage: '310 Mo',
    battery: '7%',
  },
];

export default function App() {
  const [apps, setApps] = useState<AppItem[]>(INITIAL_APPS);
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [activeScreen, setActiveScreen] = useState<'appwatch' | 'settings' | 'call' | 'code'>('appwatch');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'suspicious' | 'recent'>('all');
  const [isScanning, setIsScanning] = useState(false);
  const [showDiagnoseModal, setShowDiagnoseModal] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isServiceActive, setIsServiceActive] = useState(true);
  const [isZipping, setIsZipping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUninstallDialog, setIsUninstallDialog] = useState(false);
  const [isForceStopDialog, setIsForceStopDialog] = useState(false);
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);

  // Call duration counter when in call screen
  useEffect(() => {
    let interval: any;
    if (activeScreen === 'call') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [activeScreen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAppSettings = (app: AppItem) => {
    setSelectedApp(app);
    setActiveScreen('settings');
  };

  const handleStartCall = () => {
    setActiveScreen('call');
  };

  const handleEndCall = () => {
    setActiveScreen('appwatch');
    showToast('Appel terminé avec ExtraTechPhone (0661460899)');
  };

  const handleSimulateOpenApp = () => {
    const pool = [
      { name: 'Netflix', pkg: 'com.netflix.mediaclient', letter: '🎬', bg: 'bg-red-800', size: '420 Mo', data: '1.8 Go', bat: '14%' },
      { name: 'Spotify Music', pkg: 'com.spotify.music', letter: '🎧', bg: 'bg-green-600', size: '320 Mo', data: '410 Mo', bat: '6%' },
      { name: 'Adware Booster 2026', pkg: 'com.ads.booster.system', letter: '🚨', bg: 'bg-red-700', size: '98 Mo', data: '180 Mo', bat: '22%', isSuspicious: true },
      { name: 'Google Chrome', pkg: 'com.android.chrome', letter: '🌐', bg: 'bg-blue-600', size: '910 Mo', data: '650 Mo', bat: '9%' },
    ];
    const item = pool[Math.floor(Math.random() * pool.length)];
    const newApp: AppItem = {
      id: 'app_' + Date.now(),
      name: item.name,
      pkg: item.pkg,
      iconLetter: item.letter,
      iconBg: item.bg,
      timeUsed: Date.now(),
      size: item.size,
      dataUsage: item.data,
      battery: item.bat,
      isSuspicious: item.isSuspicious,
    };

    setApps([newApp, ...apps]);
    showToast(`⚡ Nouvelle application détectée en arrière-plan : ${item.name}`);
  };

  const handleUninstall = () => {
    if (!selectedApp) return;
    const deletedName = selectedApp.name;
    setApps(apps.filter((a) => a.id !== selectedApp.id));
    setIsUninstallDialog(false);
    setActiveScreen('appwatch');
    setSelectedApp(null);
    showToast(`✅ "${deletedName}" a été désinstallé avec succès !`);
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
  };

  const handleForceStop = () => {
    if (!selectedApp) return;
    setIsForceStopDialog(false);
    showToast(`🛑 Arrêt forcé appliqué à ${selectedApp.name}`);
  };

  const handleAssistantDiagnose = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setShowDiagnoseModal(true);
    }, 1200);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();
      ANDROID_FILES.forEach((file) => zip.file(file.path, file.content));
      zip.file(
        'README.md',
        `# AppWatch Ultra (ExtraTechPhone 0661460899)\nProjet 100% natif Kotlin SDK 34 avec UsageStatsManager et redirection directe vers paramètres.`
      );
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AppWatch-Ultra-ExtraTechPhone.zip';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert('Erreur lors du téléchargement');
    } finally {
      setIsZipping(false);
    }
  };

  const filteredApps = apps.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.pkg.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedFilter === 'suspicious') return a.isSuspicious;
    if (selectedFilter === 'recent') return Date.now() - a.timeUsed < 1000 * 60 * 30; // 30 min
    return true;
  });

  const formatTime = (time: number) => {
    const diff = Math.floor((Date.now() - time) / 1000);
    if (diff < 60) return `À l'instant (${diff}s)`;
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `Il y a ${mins} min`;
    const hours = Math.floor(mins / 60);
    return `Il y a ${hours}h`;
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-sky-500/30">
      {/* Top Banner Control Bar */}
      <header className="border-b border-slate-800/80 bg-[#090D1A]/90 px-4 py-2.5 flex items-center justify-between gap-3 text-xs z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-sky-500/20">
            ⚡
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>AppWatch Ultra</span>
              <span className="bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[10px] px-2 py-0.2 rounded-full font-semibold">
                Simulation Vraie App
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              ExtraTechPhone (0661460899) • Redirection Paramètres Système Native
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeScreen !== 'code' ? (
            <button
              onClick={() => setActiveScreen('code')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-all cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Voir Code Kotlin</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveScreen('appwatch')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-all cursor-pointer shadow-sm"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Retour à l'Application</span>
            </button>
          )}

          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isZipping ? 'ZIP...' : 'Télécharger Projet (.ZIP)'}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        {activeScreen === 'code' ? (
          /* Source Code Viewer View */
          <div className="w-full max-w-5xl h-[82vh] bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row overflow-hidden shadow-2xl">
            {/* Sidebar list */}
            <div className="w-full md:w-72 border-r border-slate-800 bg-slate-950 p-3 overflow-y-auto space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                Fichiers Android Studio
              </div>
              {ANDROID_FILES.map((f, i) => (
                <button
                  key={f.path}
                  onClick={() => setSelectedFileIdx(i)}
                  className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-center gap-2 ${
                    selectedFileIdx === i
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold'
                      : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{f.path.split('/').pop()}</span>
                </button>
              ))}
            </div>
            {/* Editor code block */}
            <div className="flex-1 flex flex-col bg-[#060913] overflow-hidden">
              <div className="p-3 border-b border-slate-800 text-xs font-mono text-slate-300 flex justify-between items-center bg-slate-900/40">
                <span>{ANDROID_FILES[selectedFileIdx]?.path}</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                  {ANDROID_FILES[selectedFileIdx]?.language}
                </span>
              </div>
              <pre className="flex-1 overflow-auto p-4 text-xs font-mono text-slate-300 leading-relaxed">
                {ANDROID_FILES[selectedFileIdx]?.content}
              </pre>
            </div>
          </div>
        ) : (
          /* 100% REAL NATIVE ANDROID PHONE SIMULATION (NO HTML / NO BROWSER PAGE LOOK) */
          <div className="relative w-full max-w-[410px] h-[780px] bg-black rounded-[46px] p-3 shadow-2xl shadow-sky-500/10 border-4 border-slate-800 ring-1 ring-slate-700 flex flex-col overflow-hidden">
            {/* Dynamic Island / Speaker notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-black rounded-full flex items-center justify-center gap-2 z-50">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800"></div>
              <div className="w-8 h-1 rounded-full bg-slate-900"></div>
            </div>

            {/* Inner Phone Screen */}
            <div className="flex-1 rounded-[36px] overflow-hidden flex flex-col relative select-none bg-gradient-to-b from-[#060913] via-[#0B1329] to-[#050811] text-slate-100 font-sans shadow-inner">
              
              {/* Android Native Status Bar */}
              <div className="px-6 pt-3 pb-1 flex justify-between items-center text-[11px] font-medium text-slate-300 z-40">
                <span>14:32</span>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span>5G</span>
                  <Wifi className="w-3 h-3" />
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              {/* SCREEN 1: APPWATCH ULTRA (MAIN APPLICATION) */}
              {activeScreen === 'appwatch' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Top Native Action Bar */}
                  <div className="px-4 py-2.5 flex items-center justify-between border-b border-sky-950/60 bg-[#0A0F1D]/80 backdrop-blur">
                    <div>
                      <div className="font-bold text-sm tracking-wide flex items-center gap-1.5 text-sky-400">
                        <span>⚡ APPWATCH ULTRA</span>
                        {isServiceActive && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        ExtraTechPhone • Surveillance Native
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartCall()}
                      className="bg-indigo-600/90 hover:bg-indigo-500 active:scale-95 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Phone className="w-3 h-3" />
                      <span>0661460899</span>
                    </button>
                  </div>

                  {/* Body Content with Ultra Wallpaper */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                    {/* ASSISTANT EXTRATECH IA CARD */}
                    <div className="bg-[#121A2D] border border-indigo-500/60 rounded-2xl p-3 shadow-xl shadow-indigo-950/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🤖</span>
                          <div>
                            <div className="text-xs font-bold text-indigo-300">Assistant ExtraTech IA</div>
                            <div className="text-[10px] text-slate-300">
                              {apps.some((a) => a.isSuspicious)
                                ? '⚠️ 1 application suspecte détectée'
                                : '✅ Système sécurisé et optimisé'}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleAssistantDiagnose}
                          className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{isScanning ? 'Scan...' : 'Diagnostic'}</span>
                        </button>
                      </div>

                      {/* Assistant quick stats pills */}
                      <div className="grid grid-cols-2 gap-1.5 mt-2.5 pt-2 border-t border-indigo-900/40 text-[10px]">
                        <button
                          onClick={() => {
                            setSelectedFilter('suspicious');
                            showToast('Filtre : Applications suspectes');
                          }}
                          className={`p-1.5 rounded-lg border text-center transition-all ${
                            selectedFilter === 'suspicious'
                              ? 'bg-red-500/20 border-red-400 text-red-300 font-bold'
                              : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          ⚠️ Apps suspectes ({apps.filter((a) => a.isSuspicious).length})
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFilter('all');
                            showToast('Historique rafraîchi');
                          }}
                          className="bg-slate-900/50 border border-slate-800 text-slate-300 hover:border-slate-700 p-1.5 rounded-lg text-center font-medium"
                        >
                          🔄 Total ({apps.length} apps)
                        </button>
                      </div>
                    </div>

                    {/* Filter Period Tabs */}
                    <div className="flex items-center gap-1.5 p-1 bg-slate-900/70 border border-slate-800 rounded-xl text-[11px]">
                      <button
                        onClick={() => setSelectedFilter('all')}
                        className={`flex-1 py-1 rounded-lg font-bold transition-all ${
                          selectedFilter === 'all'
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Toutes ({apps.length})
                      </button>
                      <button
                        onClick={() => setSelectedFilter('recent')}
                        className={`flex-1 py-1 rounded-lg font-bold transition-all ${
                          selectedFilter === 'recent'
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Récents
                      </button>
                      <button
                        onClick={() => setSelectedFilter('suspicious')}
                        className={`flex-1 py-1 rounded-lg font-bold transition-all ${
                          selectedFilter === 'suspicious'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Suspectes
                      </button>
                    </div>

                    {/* Hint text */}
                    <div className="text-[10px] text-slate-400 px-1 flex items-center justify-between">
                      <span>👉 Touchez une app pour ouvrir ses Paramètres système</span>
                      <span className="text-sky-400 font-bold">{filteredApps.length} apps</span>
                    </div>

                    {/* List of Applications with Neon Photo Frames */}
                    <div className="space-y-2">
                      {filteredApps.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                          <div className="text-3xl mb-2">🛸</div>
                          <div className="text-xs font-bold text-slate-300">Aucune application trouvée</div>
                        </div>
                      ) : (
                        filteredApps.map((app) => (
                          <div
                            key={app.id}
                            onClick={() => handleOpenAppSettings(app)}
                            className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all shadow-md active:scale-[0.99] border ${
                              app.isSuspicious
                                ? 'bg-red-950/40 border-red-500/50 hover:border-red-400'
                                : 'bg-[#151F33]/90 border-slate-800 hover:border-sky-500/80'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              {/* Photo / Icon Container with Neon Ring Frame */}
                              <div
                                className={`w-12 h-12 rounded-2xl p-1 flex items-center justify-center shrink-0 border-2 shadow-md ${
                                  app.isSuspicious
                                    ? 'bg-red-950 border-red-500 shadow-red-500/30'
                                    : 'bg-slate-900 border-sky-400 shadow-sky-500/20'
                                }`}
                              >
                                <div
                                  className={`w-full h-full rounded-xl ${app.iconBg} flex items-center justify-center font-bold text-sm shadow-xs`}
                                >
                                  {app.iconLetter}
                                </div>
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                                  <span>{app.name}</span>
                                  {app.isSuspicious && (
                                    <span className="text-[9px] bg-red-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                                      SUSPECT
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono truncate">
                                  {app.pkg}
                                </div>
                                <div className="text-[10px] text-emerald-400 font-semibold mt-0.5 flex items-center gap-2">
                                  <span>🕒 {formatTime(app.timeUsed)}</span>
                                  <span className="text-slate-500">•</span>
                                  <span className="text-slate-400">{app.size}</span>
                                </div>
                              </div>
                            </div>

                            {/* Direct Action Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenAppSettings(app);
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-sky-950/60 hover:bg-sky-900/60 border border-sky-500/40 text-sky-400 text-[10px] font-bold whitespace-nowrap cursor-pointer transition-colors"
                            >
                              Paramètres ⚙️
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Bottom Native Android Action Bar */}
                  <div className="p-3 bg-[#080D1A] border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={handleSimulateOpenApp}
                      className="flex-1 mr-2 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/30 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Simuler Ouverture d'une App</span>
                    </button>

                    <button
                      onClick={() => handleStartCall()}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-sky-400" />
                      <span>Support</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SCREEN 2: REAL ANDROID SYSTEM SETTINGS (INFOS SUR L'APPLICATION) */}
              {activeScreen === 'settings' && selectedApp && (
                <div className="flex-1 flex flex-col bg-[#0B0F19] text-slate-100 overflow-y-auto">
                  {/* Android Settings Header Bar */}
                  <div className="px-4 py-3 bg-[#111827] border-b border-slate-800 flex items-center justify-between sticky top-0 z-30">
                    <button
                      onClick={() => setActiveScreen('appwatch')}
                      className="p-1 rounded-full hover:bg-slate-800 text-slate-300 cursor-pointer"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-xs tracking-wide">
                      Informations sur l'application
                    </span>
                    <button className="p-1 text-slate-400">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* App Header Presentation */}
                  <div className="p-5 flex flex-col items-center text-center border-b border-slate-800/80 bg-gradient-to-b from-[#111827] to-[#0B0F19]">
                    <div
                      className={`w-20 h-20 rounded-3xl ${selectedApp.iconBg} flex items-center justify-center text-3xl shadow-xl mb-3 border-2 border-slate-700`}
                    >
                      {selectedApp.iconLetter}
                    </div>
                    <h2 className="text-base font-bold text-white">{selectedApp.name}</h2>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedApp.pkg}</p>
                    <span className="text-[10px] text-slate-500 mt-1">Version 34.2.0 • Installé depuis Play Store</span>

                    {/* BIG SYSTEM ACTION BUTTONS: DÉSINSTALLER & FORCER L'ARRÊT */}
                    <div className="grid grid-cols-2 gap-3 w-full mt-5">
                      <button
                        onClick={() => setIsUninstallDialog(true)}
                        className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Désinstaller</span>
                      </button>

                      <button
                        onClick={() => setIsForceStopDialog(true)}
                        className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                      >
                        <StopCircle className="w-4 h-4" />
                        <span>Forcer l'arrêt</span>
                      </button>
                    </div>
                  </div>

                  {/* Android System Settings Detail List */}
                  <div className="p-4 space-y-4 text-xs">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <Bell className="w-4 h-4 text-sky-400" />
                          <div>
                            <div className="font-semibold text-slate-200">Notifications</div>
                            <div className="text-[10px] text-slate-400">Autorisées • Son et vibreur</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-bold">Activées</span>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <KeyRound className="w-4 h-4 text-indigo-400" />
                          <div>
                            <div className="font-semibold text-slate-200">Autorisations système</div>
                            <div className="text-[10px] text-slate-400">Appareil photo, Micro, Stockage</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400">3 accordées</span>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <HardDrive className="w-4 h-4 text-amber-400" />
                          <div>
                            <div className="font-semibold text-slate-200">Espace de stockage et cache</div>
                            <div className="text-[10px] text-slate-400">Taille : {selectedApp.size}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => showToast('Cache système vidé')}
                          className="text-[10px] text-sky-400 font-bold px-2 py-1 bg-sky-950 border border-sky-500/30 rounded-lg"
                        >
                          Vider cache
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <Wifi className="w-4 h-4 text-purple-400" />
                          <div>
                            <div className="font-semibold text-slate-200">Données mobiles et Wi-Fi</div>
                            <div className="text-[10px] text-slate-400">Consommation : {selectedApp.dataUsage}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <BatteryCharging className="w-4 h-4 text-emerald-400" />
                          <div>
                            <div className="font-semibold text-slate-200">Batterie</div>
                            <div className="text-[10px] text-slate-400">{selectedApp.battery} depuis la recharge</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400">Optimisée</span>
                      </div>
                    </div>

                    <div className="p-3 bg-sky-950/40 border border-sky-500/30 rounded-xl text-center">
                      <div className="text-[11px] font-bold text-sky-300">Besoin d'aide avec cette application ?</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Contactez l'expert ExtraTech au 0661460899</div>
                      <button
                        onClick={handleStartCall}
                        className="mt-2 py-1.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-[11px]"
                      >
                        📞 Appeler l'assistance
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 3: REAL CALL SCREEN WITH EXTRATECH (0661460899) */}
              {activeScreen === 'call' && (
                <div className="flex-1 flex flex-col bg-gradient-to-b from-[#0F172A] via-[#090D1A] to-[#020617] p-6 text-center justify-between select-none">
                  <div className="pt-8">
                    <span className="text-xs uppercase tracking-widest text-sky-400 font-bold bg-sky-950/80 border border-sky-500/40 px-3 py-1 rounded-full">
                      Appel en cours...
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-4 tracking-tight">ExtraTechPhone</h2>
                    <p className="text-sm font-mono text-sky-300 mt-1">0661460899</p>
                    <p className="text-xs text-slate-400 mt-2">Support &amp; Réparation Smartphone Android</p>
                    <div className="text-lg font-mono text-emerald-400 font-bold mt-4">
                      {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
                    </div>
                  </div>

                  {/* Pulsing avatar */}
                  <div className="flex justify-center my-6">
                    <div className="relative">
                      <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-4xl shadow-2xl animate-pulse ring-4 ring-sky-500/30">
                        ⚡
                      </div>
                    </div>
                  </div>

                  {/* Direct link fallback */}
                  <div className="text-xs text-slate-400">
                    <a
                      href="tel:0661460899"
                      className="text-sky-400 underline font-semibold hover:text-sky-300"
                    >
                      Ouvrir dans le vrai téléphone (tel:0661460899)
                    </a>
                  </div>

                  {/* Hangup button */}
                  <div className="pb-6">
                    <button
                      onClick={handleEndCall}
                      className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 text-white flex items-center justify-center mx-auto shadow-2xl shadow-red-600/50 cursor-pointer transition-transform"
                    >
                      <PhoneOff className="w-7 h-7" />
                    </button>
                    <p className="text-[11px] text-slate-400 mt-2">Raccrocher</p>
                  </div>
                </div>
              )}

              {/* Toast Overlay */}
              {toastMessage && (
                <div className="absolute bottom-16 left-4 right-4 bg-slate-900/95 text-white px-3 py-2 rounded-xl text-xs text-center shadow-2xl border border-slate-700 animate-bounce z-50">
                  {toastMessage}
                </div>
              )}

              {/* Uninstall Confirmation Modal (System Dialog) */}
              {isUninstallDialog && selectedApp && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                  <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-5 w-full max-w-xs text-center shadow-2xl">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-3">
                      <Trash2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Désinstaller l'application ?</h3>
                    <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                      Voulez-vous désinstaller <strong>{selectedApp.name}</strong> ({selectedApp.pkg}) de votre appareil ?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsUninstallDialog(false)}
                        className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleUninstall}
                        className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30"
                      >
                        Désinstaller
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Force Stop Confirmation Modal */}
              {isForceStopDialog && selectedApp && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                  <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-5 w-full max-w-xs text-center shadow-2xl">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Forcer l'arrêt ?</h3>
                    <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                      Si vous forcez l'arrêt d'une application, elle risque de ne plus fonctionner correctement.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsForceStopDialog(false)}
                        className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleForceStop}
                        className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Assistant Diagnostic Report Modal */}
              {showDiagnoseModal && (
                <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                  <div className="bg-[#131B2E] border border-indigo-500 rounded-2xl p-5 w-full max-w-xs shadow-2xl text-left">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🤖</span>
                      <div>
                        <h4 className="text-xs font-bold text-indigo-300">Rapport Assistant ExtraTech</h4>
                        <div className="text-[10px] text-slate-400">Analyse de sécurité terminée</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300 mb-4">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                        <span>Apps analysées :</span>
                        <strong className="text-white">{apps.length} applications</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-red-950/50 border border-red-500/40 flex justify-between">
                        <span>Apps suspectes / Adware :</span>
                        <strong className="text-red-400">
                          {apps.filter((a) => a.isSuspicious).length} détectée(s)
                        </strong>
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-500/40 flex justify-between">
                        <span>Statut mémoire :</span>
                        <strong className="text-emerald-400">92% fluide</strong>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setShowDiagnoseModal(false);
                          handleStartCall();
                        }}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Appeler l'expert (0661460899)</span>
                      </button>
                      <button
                        onClick={() => setShowDiagnoseModal(false)}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                      >
                        Fermer le rapport
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
