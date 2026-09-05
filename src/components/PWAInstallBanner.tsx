import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Check, X, Share2, PlusSquare, Wifi, WifiOff } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);
  const [showBanner, setShowBanner] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    // Check if app is already running standalone
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      setShowBanner(false);
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // App installed listener
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    // Network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setShowBanner(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('Install prompt error:', err);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Fallback hint
      alert('To install this app on your device: open browser menu (⋮) and tap "Install app" or "Add to Home Screen"');
    }
  };

  return (
    <>
      {/* Offline Status Badge if offline */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs px-4 py-1.5 text-center font-medium flex items-center justify-center gap-2 sticky top-0 z-50 shadow-sm">
          <WifiOff className="w-3.5 h-3.5" />
          <span>You are currently offline. Cached quotes & bookings are saved locally.</span>
        </div>
      )}

      {/* Floating Bottom PWA Install Banner */}
      {showBanner && !isInstalled && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 animate-fade-in">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-4 shadow-2xl border border-indigo-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl p-1.5 shrink-0 flex items-center justify-center shadow">
                <img src="/logo.svg" alt="Shammah Logo" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight">Shammah Movers App</span>
                  <span className="bg-purple-500/30 text-purple-200 text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase">PWA</span>
                </div>
                <p className="text-xs text-blue-200 truncate">
                  Install for offline access & instant bookings
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleInstallClick}
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow transition-all hover:scale-105 active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
              <button
                onClick={() => setShowBanner(false)}
                className="text-blue-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Install Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-slate-800 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-blue-50 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-blue-100">
              <img src="/logo.svg" alt="Shammah Logo" className="w-12 h-12 object-contain" />
            </div>

            <h3 className="text-lg font-bold text-center text-slate-900 mb-1">
              Install Shammah App on iOS
            </h3>
            <p className="text-xs text-slate-500 text-center mb-5">
              Follow these simple steps in Safari to add Shammah Movers and Cleaners to your home screen:
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="text-xs text-slate-700">
                  Tap the <span className="font-semibold text-blue-900 inline-flex items-center gap-1"><Share2 className="w-3.5 h-3.5 inline" /> Share</span> button at the bottom of Safari.
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="text-xs text-slate-700">
                  Scroll down and tap <span className="font-semibold text-blue-900 inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5 inline" /> Add to Home Screen</span>.
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="text-xs text-slate-700">
                  Tap <span className="font-semibold text-blue-900">Add</span> in the top right corner. You're all set!
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-6 w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
