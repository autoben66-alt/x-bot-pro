"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Save, MessageCircle, Settings, Power, Smartphone,
  CheckCircle2, Bot, Database, LineChart, MessageSquare, 
  Plus, ArrowRight, LogOut, Trash2, Zap, LayoutDashboard,
  TrendingUp, Users, ShieldCheck, HelpCircle, Clock, Copy, AlertCircle,
  CreditCard, Sparkles, Star
} from 'lucide-react';

// Firebase 相關模組匯入
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  onSnapshot, 
  collection, 
  query, 
  getDoc,
  updateDoc
} from 'firebase/firestore';

export default function DashboardPage() {
  // --- Firebase 與 Auth 狀態 ---
  const [db, setDb] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // --- UI 與 業務狀態 ---
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'knowledge', 'settings'
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: '嗨！我是 AI 小管家。設定儲存後，我會立刻學習新的知識喔！😊' }
  ]);

  // --- 業者設定與知識庫資料 ---
  const [config, setConfig] = useState({
    isActive: true, 
    shopName: "我的民宿名稱",
    checkIn: "15:00",
    checkOut: "11:00",
    wifiSsid: "Guest_WiFi",
    wifiPass: "88888888",
    tone: "enthusiastic", // 熱情親切
    customRules: "請保持禮貌，若遇到殺價請委婉拒絕。",
    lineToken: "", 
    currentPlan: "X-Pro", // 對應首頁方案
  });

  const [qaList, setQaList] = useState<any[]>([]);

  // 模擬數據
  const [analytics] = useState({
    savedHours: 24,
    resolutionRate: 88,
    totalMessages: 512,
    activeUsers: 89
  });

  // --- 1. Firebase 初始化 (優化判斷邏輯) ---
  useEffect(() => {
    const startFirebase = async () => {
      let firebaseConfig: any = null;
      
      // 優先從環境變數讀取
      if (process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
        try {
          firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);
        } catch (e) {
          console.error("Firebase config parse error");
        }
      } 
      
      // 若無，則讀取 Canvas 模擬變數
      if (!firebaseConfig || !firebaseConfig.projectId) {
        // @ts-ignore
        const mockConfig = typeof __firebase_config !== 'undefined' ? __firebase_config : '{}';
        try {
          firebaseConfig = JSON.parse(mockConfig);
        } catch (e) {
          firebaseConfig = null;
        }
      }

      // 若最終仍無有效設定，進入純 Demo 模式
      if (!firebaseConfig || !firebaseConfig.projectId) {
        console.warn("未偵測到資料庫設定，系統將以展示模式運作。");
        setIsAuthReady(true); 
        return;
      }

      try {
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
        const firestore = getFirestore(app);
        const auth = getAuth(app);
        setDb(firestore);

        onAuthStateChanged(auth, async (user) => {
          if (user) {
            setUserId(user.uid);
            setIsAuthReady(true);
          } else {
            // @ts-ignore
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
              // @ts-ignore
              await signInWithCustomToken(auth, __initial_auth_token).catch(() => signInAnonymously(auth));
            } else {
              await signInAnonymously(auth);
            }
          }
        });
      } catch (err) {
        console.error("Firebase Init Error:", err);
        setIsAuthReady(true);
      }
    };
    startFirebase();
  }, []);

  // --- 2. 實時數據監聽 ---
  useEffect(() => {
    if (!isAuthReady || !userId || !db) return;

    // @ts-ignore
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'x-bot-pro-app';
    const configPath = doc(db, 'artifacts', appId, 'users', userId, 'settings', 'config');

    const unsub = onSnapshot(configPath, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setConfig(prev => ({ ...prev, ...data }));
        if (data.qaList) setQaList(data.qaList);
      }
    });

    return () => unsub();
  }, [isAuthReady, userId, db]);

  // --- 3. 功能處理 ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setConfig(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    if (!db || !userId) {
      setSaveMessage("展示模式：設定已暫存。");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }
    setIsSaving(true);
    
    try {
      // @ts-ignore
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'x-bot-pro-app';
      const configPath = doc(db, 'artifacts', appId, 'users', userId, 'settings', 'config');
      
      await setDoc(configPath, {
        ...config,
        qaList: qaList,
        updatedAt: new Date().toISOString(),
        ownerId: userId
      }, { merge: true });

      setSaveMessage("AI 知識庫已同步至雲端！");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Save Error:", error);
      setSaveMessage("儲存失敗，請確認權限。");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddQA = () => {
    const newQA = { id: Date.now().toString(), q: "新問題", a: "新答案" };
    setQaList([newQA, ...qaList]);
  };

  const handleDeleteQA = (id: string) => {
    setQaList(qaList.filter(item => item.id !== id));
  };

  const handleCopyWebhook = () => {
    if (typeof window === 'undefined') return;
    const url = `https://${window.location.host}/api/webhook?userId=${userId || 'guest'}`;
    const textArea = document.createElement("textarea");
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setSaveMessage("網址已複製！");
    } catch (err) {
      console.error('Copy Error', err);
    }
    document.body.removeChild(textArea);
    setTimeout(() => setSaveMessage(""), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setChatHistory(prev => [...prev, { role: 'user', content: inputMessage }]);
    const currentInput = inputMessage;
    setInputMessage("");

    setTimeout(() => {
      let reply = "抱歉，這個問題超出了我的知識範圍，我會記錄下來請真人管家處理喔！😅";
      const q = currentInput.toLowerCase();
      const found = qaList.find(item => q.includes(item.q.toLowerCase().replace(/\?|？|請問/g, '')));
      
      if (found) reply = found.a;
      else if (q.includes("wifi")) reply = `WiFi 帳號是【${config.wifiSsid}】，密碼是【${config.wifiPass}】。📶`;
      else if (q.includes("入住") || q.includes("時間")) reply = `我們的入住時間是 ${config.checkIn}，退房時間是 ${config.checkOut} 喔！🏠`;

      if (config.tone === 'enthusiastic') reply += " 🥰";
      setChatHistory(prev => [...prev, { role: 'assistant', content: reply }]);
    }, 800);
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Bot size={48} className="animate-bounce text-indigo-400 mb-4" />
        <p className="text-lg font-bold">正在連接加密通訊伺服器...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* 側邊導覽欄 */}
      <aside className="w-full md:w-64 bg-[#0f172a] text-white flex-shrink-0 flex flex-col z-20 shadow-2xl">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Bot size={28} className="text-indigo-400" />
            <h1 className="text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">X-Bot</h1>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-mono break-all">{userId || "DEMO_MODE"}</p>
        </div>
        
        <nav className="flex-1 mt-6 px-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <LayoutDashboard size={20} /><span>數據概覽</span>
          </button>
          <button onClick={() => setActiveTab('knowledge')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'knowledge' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Database size={20} /><span>知識庫管理</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Settings size={20} /><span>LINE 串接</span>
          </button>
        </nav>

        <div className="px-4 pb-6">
           <Link href="/" className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition border border-slate-700">
             <LogOut size={18} /><span>返回官網首頁</span>
           </Link>
        </div>
      </aside>

      {/* 主內容區域 */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* 分頁 1: 數據概覽與方案 */}
          {activeTab === 'dashboard' && (
            <div className="animate-in fade-in duration-500 space-y-10">
              <h2 className="text-3xl font-bold mb-8 flex items-center text-slate-800">
                <LayoutDashboard className="mr-3 text-indigo-600" />營運成效統計
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "節省客服時數", val: `${analytics.savedHours}h`, icon: <Clock />, color: "text-indigo-600", bg: "bg-indigo-50" },
                  { label: "AI 解決率", val: `${analytics.resolutionRate}%`, icon: <ShieldCheck />, color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "總訊息量", val: analytics.totalMessages, icon: <MessageSquare />, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "活躍房客", val: analytics.activeUsers, icon: <Users />, color: "text-orange-600", bg: "bg-orange-50" },
                ].map((s, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-4`}>{s.icon}</div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                    <p className={`text-3xl font-black mt-1 ${s.color}`}>{s.val}</p>
                  </div>
                ))}
              </div>

              {/* 方案管理區塊 (對應首頁方案) */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:border-indigo-300">
                <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4">
                   <div className="flex items-center space-x-3">
                      <CreditCard className="text-indigo-600" />
                      <h3 className="font-bold text-xl text-slate-800">目前方案管理</h3>
                   </div>
                   <div className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center shadow-lg shadow-indigo-100">
                     <Star size={12} className="mr-1.5 fill-white" /> {config.currentPlan} 專業管家
                   </div>
                </div>
                <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 space-y-5">
                    <p className="text-slate-600 text-sm leading-relaxed">
                      您目前正在使用 <span className="font-bold text-indigo-600">專業管家 (X-Pro)</span> 方案。此方案提供完整 AI 核心功能，包含語氣風格自訂、無上限 Q&A 以及 LINE 官方帳號全自動回覆。
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {["AI 客服語氣自訂", "無限 Q&A 知識庫", "LINE 官方帳號串接", "自動發送入住導航"].map((feat, i) => (
                        <div key={i} className="flex items-center space-x-2.5 text-sm text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <div className="bg-emerald-500 rounded-full p-0.5"><CheckCircle2 size={12} className="text-white" /></div>
                          <span className="font-medium">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-indigo-50/50 rounded-2xl p-6 flex flex-col justify-center border border-indigo-100 text-center">
                    <div className="mb-4">
                      <span className="text-indigo-900 font-bold block mb-1 text-xs uppercase tracking-widest">方案費用</span>
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-black text-indigo-600 tracking-tighter">NT$ 880</span>
                        <span className="text-indigo-400 text-xs font-bold ml-1">/ 月</span>
                      </div>
                    </div>
                    <button className="w-full bg-white border border-indigo-200 text-indigo-600 py-3 rounded-xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95">
                      升級至 X-Biz (商業版)
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center">
                <TrendingUp size={40} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-bold">歷史對話趨勢分析圖</p>
                <p className="text-slate-400 text-xs mt-1 italic">連線正式資料庫後將自動產生成效報告</p>
              </div>
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in duration-500">
              <div className="xl:col-span-2 space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-3xl font-bold text-slate-800">AI 知識庫訓練</h2>
                  <div className="flex items-center space-x-2 text-emerald-600 text-sm font-bold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                    <Zap size={14} /> <span>即時同步：{db ? '雲端連線中' : '展示模式'}</span>
                  </div>
                </div>

                {/* AI 機器人開關 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 flex justify-between items-center bg-gradient-to-r from-white to-indigo-50/20">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl transition-all duration-300 ${config.isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' : 'bg-slate-200 text-slate-500'}`}>
                      <Power size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">AI 自動回覆系統</h3>
                      <p className="text-sm text-slate-500 font-medium">{config.isActive ? '正在 LINE 帳號中 24H 值班' : '已關閉，客人訊息將保持未讀'}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="isActive" checked={config.isActive} onChange={handleInputChange} className="sr-only peer" />
                    <div className="w-14 h-7 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>

                {/* AI 客服個性設定 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                  <h3 className="font-bold text-slate-800 flex items-center text-lg">
                    <Sparkles size={20} className="mr-2 text-indigo-500" /> AI 客服語氣設定
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'enthusiastic', label: '🔥 熱情親切風格', desc: '大量使用 Emoji，適合度假民宿' },
                      { id: 'professional', label: '💼 專業管家風格', desc: '用詞俐落有禮，適合精品商旅' }
                    ].map((t) => (
                      <button 
                        key={t.id}
                        onClick={() => setConfig({...config, tone: t.id})}
                        className={`p-4 rounded-2xl border-2 transition-all text-left ${config.tone === t.id ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-100 hover:border-slate-200'}`}
                      >
                        <p className={`font-bold ${config.tone === t.id ? 'text-indigo-600' : 'text-slate-600'}`}>{t.label}</p>
                        <p className="text-[11px] text-slate-400 mt-1 font-medium">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2.5">給 AI 的特殊交代 (System Prompt)</label>
                    <textarea 
                      name="customRules" 
                      value={config.customRules} 
                      onChange={handleInputChange}
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm h-28 focus:ring-2 focus:ring-indigo-500 outline-none resize-none shadow-inner"
                      placeholder="例如：若客人問到優惠，請委婉告知目前的房價已經是離島最低價了..."
                    />
                  </div>
                </div>

                {/* 核心營運參數 - 🌟 修正跑版重點 🌟 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6 overflow-hidden">
                  <h3 className="font-bold text-slate-800 flex items-center text-lg">
                    <Settings size={20} className="mr-2 text-indigo-500" /> 核心營運參數 (RAG 基礎)
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 時間設定區 */}
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest font-mono">Operations Time</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 min-w-0">
                          <span className="text-[10px] text-slate-500 mb-1.5 block font-bold">入住 Check-In</span>
                          <input type="time" name="checkIn" value={config.checkIn} onChange={handleInputChange} className="w-full bg-transparent font-black outline-none text-base text-slate-700" />
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 min-w-0">
                          <span className="text-[10px] text-slate-500 mb-1.5 block font-bold">退房 Check-Out</span>
                          <input type="time" name="checkOut" value={config.checkOut} onChange={handleInputChange} className="w-full bg-transparent font-black outline-none text-base text-slate-700" />
                        </div>
                      </div>
                    </div>
                    {/* 網路設定區 */}
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest font-mono">Network Access</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="min-w-0">
                           <span className="text-[10px] text-slate-500 mb-1.5 block font-bold ml-1">WiFi SSID</span>
                           <input type="text" name="wifiSsid" value={config.wifiSsid} onChange={handleInputChange} className="w-full p-3 border-2 border-slate-50 rounded-2xl bg-slate-50 outline-none focus:border-indigo-400 focus:bg-white transition-all text-sm font-bold truncate" placeholder="WiFi 名稱" />
                        </div>
                        <div className="min-w-0">
                           <span className="text-[10px] text-slate-500 mb-1.5 block font-bold ml-1">Password</span>
                           <input type="text" name="wifiPass" value={config.wifiPass} onChange={handleInputChange} className="w-full p-3 border-2 border-slate-50 rounded-2xl bg-slate-50 outline-none focus:border-indigo-400 focus:bg-white transition-all text-sm font-bold truncate" placeholder="WiFi 密碼" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 問答庫 Q&A */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 flex items-center text-lg"><HelpCircle size={20} className="mr-2 text-indigo-500" /> 特殊問題訓練 (Q&A)</h3>
                    <button onClick={handleAddQA} className="text-xs bg-indigo-50 text-indigo-600 px-4 py-2.5 rounded-xl font-bold flex items-center hover:bg-indigo-100 transition-all active:scale-95 border border-indigo-100"><Plus size={16} className="mr-1" /> 新增問答對</button>
                  </div>
                  <div className="space-y-4">
                    {qaList.length === 0 && (
                      <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-400 text-sm font-medium">尚未建立特殊問答，AI 目前僅會回答基礎參數資訊。</p>
                      </div>
                    )}
                    {qaList.map((qa) => (
                      <div key={qa.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50 relative group transition-all hover:bg-white hover:shadow-md border border-slate-200">
                        <button onClick={() => handleDeleteQA(qa.id)} className="absolute -top-2 -right-2 bg-white text-red-400 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white transform hover:scale-110 border border-slate-100"><Trash2 size={14} /></button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex items-start">
                            <div className="bg-indigo-500 text-white text-[10px] font-black rounded-md px-1.5 py-0.5 mr-3 mt-2 shrink-0">Q</div>
                            <input value={qa.q} onChange={(e) => setQaList(qaList.map(i => i.id === qa.id ? { ...i, q: e.target.value } : i))} className="w-full bg-transparent border-b border-slate-200 p-2 text-sm font-bold outline-none focus:border-indigo-500 transition-colors" placeholder="房客的問題..." />
                          </div>
                          <div className="flex items-start">
                            <div className="bg-emerald-500 text-white text-[10px] font-black rounded-md px-1.5 py-0.5 mr-3 mt-2 shrink-0">A</div>
                            <textarea value={qa.a} onChange={(e) => setQaList(qaList.map(i => i.id === qa.id ? { ...i, a: e.target.value } : i))} className="w-full bg-transparent border-b border-slate-200 p-2 text-sm h-12 outline-none focus:border-emerald-500 resize-none font-medium text-slate-600" placeholder="AI 應回覆的正確答案..." />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 儲存列 */}
                <div className="flex items-center justify-between py-8">
                  <div className="flex items-center text-emerald-600 font-bold opacity-0 transition-all duration-500" style={{ opacity: saveMessage ? 1 : 0, transform: saveMessage ? 'translateX(0)' : 'translateX(-10px)' }}>
                    <CheckCircle2 size={20} className="mr-2" /> {saveMessage}
                  </div>
                  <button onClick={handleSave} disabled={isSaving} className={`bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 transition-all transform active:scale-95 flex items-center ${isSaving ? 'opacity-50 animate-pulse' : 'hover:bg-indigo-700 hover:-translate-y-1'}`}>
                    {isSaving ? <Zap size={20} className="animate-spin mr-2" /> : <Save size={20} className="mr-2" />}
                    {isSaving ? '同步大腦資料庫中...' : '儲存並同步 AI 知識庫'}
                  </button>
                </div>
              </div>

              {/* 測試沙盒 */}
              <div className="xl:col-span-1">
                <div className="sticky top-8 space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <h3 className="font-bold flex items-center text-slate-700 tracking-tight"><Smartphone size={18} className="mr-2 text-indigo-500" /> AI 回覆驗證沙盒</h3>
                    <button onClick={() => setChatHistory([{ role: 'assistant', content: '重置完成！您可以隨意測試發問。' }])} className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">Reset</button>
                  </div>
                  <div className="bg-slate-900 rounded-[3rem] p-4 border-8 border-slate-800 shadow-2xl h-[650px] flex flex-col overflow-hidden relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20"></div>
                    <div className="bg-[#242e38] p-4 pt-10 rounded-t-2xl flex items-center space-x-3 text-white border-b border-slate-700">
                      <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-inner shadow-indigo-400/50"><Bot size={20} /></div>
                      <div>
                        <div className="font-bold text-sm leading-none">{config.shopName || "智能客服"}</div>
                        <div className="text-[9px] text-green-400 mt-1 font-medium italic animate-pulse">● 模擬雲端連線中...</div>
                      </div>
                    </div>
                    <div className="flex-1 bg-slate-800 bg-opacity-20 overflow-y-auto p-4 space-y-4 selection:bg-indigo-500/50">
                      {chatHistory.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                          <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-indigo-500 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none font-medium'}`}>{m.content}</div>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleSendMessage} className="bg-white p-3 flex items-center space-x-2 rounded-b-3xl pb-8 border-t border-slate-700/20">
                      <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="問問看 WiFi 或 入住時間..." className="flex-1 px-4 py-2 bg-slate-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium" />
                      <button type="submit" className="bg-indigo-600 p-2.5 rounded-full text-white shadow-md hover:bg-indigo-500 active:scale-90 transition-all"><ArrowRight size={18} /></button>
                    </form>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start space-x-2">
                    <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-amber-700 leading-tight font-medium">沙盒模擬環境：更改語氣或參數後需點擊下方「儲存」按鈕，更改才會同步至您的 LINE 正式帳號。</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 分頁 3: LINE 串接頁面 */}
          {activeTab === 'settings' && (
            <div className="animate-in fade-in duration-500 max-w-2xl">
              <h2 className="text-3xl font-bold mb-8 text-slate-800">LINE 官方帳號通訊設定</h2>
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-10">
                <div className="p-6 bg-green-50 border border-green-200 rounded-[1.5rem] flex items-center space-x-5 shadow-sm">
                   <div className="bg-green-500 p-3 rounded-full text-white shadow-lg shadow-green-200"><CheckCircle2 size={24} /></div>
                   <div className="flex-1">
                      <p className="text-green-900 font-black text-lg">系統通訊正常</p>
                      <p className="text-green-600 text-sm font-medium">您的 X-Bot 已成功掛載至 Vercel 加密通訊節點</p>
                   </div>
                </div>
                
                <div className="space-y-4">
                  <label className="block text-sm font-black text-slate-700 uppercase tracking-widest ml-1">LINE Channel Access Token</label>
                  <input type="password" name="lineToken" value={config.lineToken} onChange={handleInputChange} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-mono text-xs" placeholder="在此貼上您的長期權限令牌 (Long-lived Token)" />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Webhook URL (回傳位址)</label>
                  <div className="flex space-x-3">
                    <input type="text" readOnly value={`https://${typeof window !== 'undefined' ? window.location.host : '...'}/api/webhook?userId=${userId || 'guest'}`} className="flex-1 p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-indigo-600 font-mono text-xs select-all shadow-inner overflow-hidden" />
                    <button onClick={handleCopyWebhook} className="bg-slate-900 text-white px-8 py-5 rounded-2xl font-black text-sm flex items-center hover:bg-slate-800 hover:shadow-lg active:scale-95 transition-all shadow-md"><Copy size={18} className="mr-2" /> 複製</button>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 text-[11px] flex items-start space-x-3 leading-relaxed font-medium">
                   <AlertCircle size={18} className="shrink-0 mt-0.5 text-indigo-500" />
                   <div className="space-y-2">
                     <p className="text-slate-800 font-black">重要串接指南：</p>
                     <p>1. 進入 LINE Developers 管理後台。<br/>2. 在 Messaging API 設定中，將上方 URL 貼入「Webhook URL」。<br/>3. 開啟「Use webhook」選項。<br/>4. 前往 LINE OA 後台，將「回應模式」設為「聊天機器人」，並停用「自動回應」。</p>
                   </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}