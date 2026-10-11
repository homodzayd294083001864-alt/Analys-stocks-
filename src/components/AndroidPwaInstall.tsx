import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Check, HelpCircle, Share2, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const AndroidPwaInstall: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [dismissedBanner, setDismissedBanner] = useState<boolean>(false);

  useEffect(() => {
    // Check if already running in standalone PWA mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone || document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('Install prompt error:', err);
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  if (isInstalled || dismissedBanner) {
    return null;
  }

  return (
    <>
      {/* Top Android Install Notification Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border-b border-amber-500/30 text-slate-100 py-2.5 px-4 shadow-xl relative z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4 text-amber-400 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-amber-300">تثبيت تطبيق HOMOD SMC على أندرويد (Android PWA)</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                  تطبيقات الشاشة الرئيسية
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                تثبيت سريع بدون الحاجة لـ Google Play — يعمل كتطبيق أندرويد مستقل بشاشة كاملة وبسرعة فائقة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer ring-2 ring-amber-300/40"
            >
              <Download className="w-4 h-4" />
              <span>تثبيت الآن على أندرويد</span>
            </button>

            <button
              onClick={() => setShowGuideModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
              title="طريقة التثبيت اليدوية"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">الخطوات</span>
            </button>

            <button
              onClick={() => setDismissedBanner(true)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Manual Android Installation Modal Guide */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-5 text-slate-100 dir-rtl">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">كيفية تثبيت التطبيق على هاتف أندرويد</h3>
                <p className="text-xs text-slate-400">خطوات بسيطة للتثبيت في ثوانٍ معدودة</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <p className="font-bold text-slate-200">افتح خيارات المتصفح (Chrome أو Edge)</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    اضغط على النقاط الثلاث العلوية <strong className="text-amber-300 font-mono">(⋮)</strong> في أعلى يمين أو يسار شاشة المتصفح.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <p className="font-bold text-slate-200">اختر "تثبيت التطبيق" أو "الإضافة إلى الشاشة الرئيسية"</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    ستظهر لك أيقونة <strong className="text-emerald-400">"تثبيت التطبيق (Install app)"</strong> أو <strong className="text-emerald-400">"Add to Home screen"</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <div>
                  <p className="font-bold text-slate-200">تأكيد التثبيت</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    اضغط على "تثبيت". سيظهر رمز <strong>HOMOD SMC TRADER</strong> فوراً على شاشة هاتفك الرئيسية ويتم فتح المنصة بشاشة كاملة كأي تطبيق أندرويد.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold text-xs py-2.5 rounded-xl shadow-lg hover:from-amber-300 hover:to-amber-400 transition-all cursor-pointer text-center"
              >
                فهمت ذلك - إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
