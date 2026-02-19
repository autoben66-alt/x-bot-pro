"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Save, MessageCircle, Settings, Power, Smartphone,
  CheckCircle2, Bot, Database, LineChart, MessageSquare, 
  Plus, ArrowRight, LogOut, Trash2, Zap, LayoutDashboard,
  TrendingUp, Users, ShieldCheck, HelpCircle, Clock, Copy, AlertCircle
} from 'lucide-react';

// Firebase 相關模組匯入
import { initializeApp, getApps } from 'firebase/app';
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
  const [activeTab, setActiveTab] = useState('knowledge'); // 'dashboard', 'knowledge', 'settings'
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
    tone: "enthusiastic",
    customRules: "請保持禮貌，若遇到殺價請委婉拒絕。",
    lineToken: "", 
  });

  const [qaList, setQaList] = useState<any[]>([]);

  // 模擬數據 (串接後可從 Firestore 讀取真實統計)
  const [analytics] = useState({
    savedHours: 24,
    resolutionRate: 88,
    totalMessages: 512,
    activeUsers: 89
  });

  // --- 1. Firebase 初始化 (支援 Vercel 與 模擬環境) ---
  useEffect(() => {
    const startFirebase = async () => {
      let firebaseConfig: any = null;
      
      // 1. 優先嘗試從 Vercel 環境變數讀取
      if (process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
        try {
          firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);
        } catch (e) {
          console.error("Vercel config parse error");
        }
      } 
      
      // 2. 若無環境變數，則讀取 Canvas 模擬變數
      if (!firebaseConfig || !firebaseConfig.apiKey) {
        // @ts-ignore
        const mockConfig = typeof __firebase_config !== 'undefined' ? __firebase_config : '{}';
        try {
          firebaseConfig = JSON.parse(mockConfig);
        } catch (e) {
          firebaseConfig = null;
        }
      }

      if (!firebaseConfig || !firebaseConfig.apiKey) {
        console.warn("Firebase config not found. AI features will be in demo mode.");
        return;
      }

      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
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
            try {
              // @ts-ignore
              await signInWithCustomToken(auth, __initial_auth_token);
            } catch (e) {
              await signInAnonymously(auth);
            }
          } else {
            await signInAnonymously(auth);
          }
        }
      });
    };
    startFirebase();
  }, []);

  // --- 2. 實時數據監聽 (RAG 核心) ---
  useEffect(() => {
    if (!isAuthReady || !userId || !db) return;

    // @ts-ignore
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'x-bot-pro-app';
    const configPath = doc(db, 'artifacts', appId, 'users', userId, 'settings', 'config');

    // 監聽所有設定與問答庫內容
    const unsub = onSnapshot(configPath, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setConfig(prev => ({ ...prev, ...data }));
        if (data.qaList) setQaList(data.qaList);
      }
    });

    return () => unsub();
  }, [isAuthReady, userId, db]);

  // --- 3. 處理功能函數 ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setConfig(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    if (!db || !userId) {
      setSaveMessage("Demo 模式：設定已暫存至本地。");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }
    setIsSaving(true);
    
    try {
      // @ts-ignore
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'x-bot-pro-app';
      const configPath = doc(db, 'artifacts', appId, 'users', userId, 'settings', 'config');
      
      // 同步儲存所有資訊，包含問答清單
      await setDoc(configPath, {
        ...config,
        qaList: qaList, // 這是後端 API 最需要的知識來源
        updatedAt: new Date().toISOString(),
        ownerId: userId
      }, { merge: true });

      setSaveMessage("AI 知識庫同步成功！");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("儲存失敗:", error);
      setSaveMessage("儲存失敗，請檢查權限。");
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
    const host = window.location.host;
    const url = `https://${host}/api/webhook?userId=${userId || 'guest'}`;
    
    const textArea = document.createElement("textarea");
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setSaveMessage("Webhook 網址已複製！");
    } catch (err) {
      console.error('無法複製', err);
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

    // 模擬 AI 思考與根據知識庫回答
    setTimeout(() => {
      let reply = "抱歉，這個問題超出了我的知識範圍，我會請真人管家處理喔！😅";
      const q = currentInput.toLowerCase();

      // 檢查自訂 Q&A
      const found = qaList.find(item => q.includes(item.q.toLowerCase().replace(/\?|？|請問/g, '')));
      if (found) {
        reply = found.a;
      } else if (q.includes("wifi")) {
        reply = `WiFi 帳號是【${config.wifiSsid}】，密碼是【${config.wifiPass}】。📶`;
      } else if (q.includes("入住") || q.includes("時間")) {
        reply = `我們的入住時間是 ${config.checkIn}，退房時間是 ${config.checkOut} 喔！🏠`;
      }

      if (config.tone === 'enthusiastic') reply += " 🥰";
      setChatHistory(prev => [...prev, { role: 'assistant', content: reply }]);
    }, 800);
  };

  if (!isAuthReady && db) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Bot size={48} className="animate-bounce text-indigo-400 mb-4" />
        <p className="text-lg font-bold">正在安全登入控制台...</p>
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
          <p className="text-[10px] text-slate-500 mt-2 font-mono break-all">{userId || "DEMO_ACCOUNT"}</p>
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
          
          {/* 分頁 1: 數據概覽 */}
          {activeTab === 'dashboard' && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-3xl font-bold mb-8">營運成效</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                  { label: "節省客服時數", val: `${analytics.savedHours}h`, icon: <Clock />, color: "text-indigo-600", bg: "bg-indigo-100" },
                  { label: "AI 解決率", val: `${analytics.resolutionRate}%`, icon: <ShieldCheck />, color: "text-emerald-600", bg: "bg-emerald-100" },
                  { label: "總訊息量", val: analytics.totalMessages, icon: <MessageSquare />, color: "text-blue-600", bg: "bg-blue-100" },
                  { label: "活躍房客", val: analytics.activeUsers, icon: <Users />, color: "text-orange-600", bg: "bg-orange-100" },
                ].map((s, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-4`}>{s.icon}</div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                    <p className={`text-3xl font-black mt-1 ${s.color}`}>{s.val}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white p-20 rounded-3xl border border-dashed border-slate-300 text-center">
                <TrendingUp size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-bold">歷史對話趨勢圖表預留區</p>
                <p className="text-slate-400 text-sm mt-2">連線正式資料庫後即時更新</p>
              </div>
            </div>
          )}

          {/* 分頁 2: 知識庫管理 */}
          {activeTab === 'knowledge' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold">知識庫管理</h2>
                  <div className="flex items-center space-x-2 text-emerald-600 text-sm font-bold">
                    <Zap size={16} /> <span>同步狀態：{db ? '雲端在線' : '本地模擬'}</span>
                  </div>
                </div>

                {/* 機器人總開關 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl transition-colors ${config.isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      <Power size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">AI 服務狀態</h3>
                      <p className="text-sm text-slate-500">{config.isActive ? '正在 LINE 官方帳號執行中' : '已停止自動回覆'}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="isActive" checked={config.isActive} onChange={handleInputChange} className="sr-only peer" />
                    <div className="w-14 h-7 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>

                {/* 民宿參數 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                  <h3 className="font-bold text-slate-800 flex items-center"><Settings size={20} className="mr-2 text-indigo-500" /> 民宿營運參數</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase">入住/退房時間</label>
                      <div className="flex space-x-2">
                        <input type="time" name="checkIn" value={config.checkIn} onChange={handleInputChange} className="flex-1 p-3 border rounded-xl bg-slate-50 outline-none" />
                        <input type="time" name="checkOut" value={config.checkOut} onChange={handleInputChange} className="flex-1 p-3 border rounded-xl bg-slate-50 outline-none" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase">WiFi 設定</label>
                      <div className="flex space-x-2">
                        <input type="text" name="wifiSsid" value={config.wifiSsid} onChange={handleInputChange} className="flex-1 p-3 border rounded-xl bg-slate-50 outline-none" placeholder="名稱" />
                        <input type="text" name="wifiPass" value={config.wifiPass} onChange={handleInputChange} className="flex-1 p-3 border rounded-xl bg-slate-50 outline-none" placeholder="密碼" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 問答庫 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 flex items-center"><HelpCircle size={20} className="mr-2 text-indigo-500" /> 常見問題與自訂回覆</h3>
                    <button onClick={handleAddQA} className="text-xs bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-bold flex items-center"><Plus size={16} className="mr-1" /> 新增</button>
                  </div>
                  <div className="space-y-4">
                    {qaList.length === 0 && <p className="text-center py-10 text-slate-400 text-sm">尚未建立問答，點擊「新增」來訓練 AI</p>}
                    {qaList.map((qa) => (
                      <div key={qa.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50 relative group">
                        <button onClick={() => handleDeleteQA(qa.id)} className="absolute -top-2 -right-2 bg-white text-red-400 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition hover:bg-red-500 hover:text-white"><Trash2 size={14} /></button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start"><span className="text-indigo-500 font-black mr-2 mt-2 text-xs">Q</span><input value={qa.q} onChange={(e) => setQaList(qaList.map(i => i.id === qa.id ? { ...i, q: e.target.value } : i))} className="w-full bg-transparent border-b border-slate-200 p-2 text-sm font-bold outline-none" /></div>
                          <div className="flex items-start"><span className="text-emerald-500 font-black mr-2 mt-2 text-xs">A</span><textarea value={qa.a} onChange={(e) => setQaList(qaList.map(i => i.id === qa.id ? { ...i, a: e.target.value } : i))} className="w-full bg-transparent border-b border-slate-200 p-2 text-sm h-12 outline-none" /></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 儲存列 */}
                <div className="flex items-center justify-between py-6">
                  <div className="flex items-center text-emerald-600 font-bold opacity-0 transition-opacity" style={{ opacity: saveMessage ? 1 : 0 }}>
                    <CheckCircle2 size={20} className="mr-2" /> {saveMessage}
                  </div>
                  <button onClick={handleSave} disabled={isSaving} className={`bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 transition transform active:scale-95 ${isSaving ? 'opacity-50' : 'hover:bg-indigo-700'}`}>
                    <Save size={20} className="inline mr-2" /> {isSaving ? '訓練同步中...' : '儲存並更新 AI 知識庫'}
                  </button>
                </div>
              </div>

              {/* 測試沙盒 */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <h3 className="font-bold flex items-center text-slate-600"><Smartphone size={18} className="mr-2" /> 即時測試沙盒</h3>
                    <button onClick={() => setChatHistory([{ role: 'assistant', content: '重置完成！您可以隨意測試發問。' }])} className="text-[10px] font-bold text-slate-400 hover:text-indigo-600">重置對話</button>
                  </div>
                  <div className="bg-slate-900 rounded-[3rem] p-4 border-8 border-slate-800 shadow-2xl h-[600px] flex flex-col overflow-hidden relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20"></div>
                    <div className="bg-[#242e38] p-4 pt-10 rounded-t-2xl flex items-center space-x-3 text-white">
                      <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white"><Bot size={20} /></div>
                      <div>
                        <div className="font-bold text-sm leading-none">{config.shopName || "AI 測試"}</div>
                        <div className="text-[9px] text-green-400 mt-1">● 智能回覆系統已就緒</div>
                      </div>
                    </div>
                    <div className="flex-1 bg-slate-800 bg-opacity-30 overflow-y-auto p-4 space-y-4">
                      {chatHistory.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-3.5 rounded-2xl text-[13px] ${m.role === 'user' ? 'bg-emerald-400 text-black rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none'}`}>{m.content}</div>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleSendMessage} className="bg-white p-3 flex items-center space-x-2 rounded-b-3xl pb-6">
                      <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="點擊此處測試發問..." className="flex-1 px-4 py-2 bg-slate-50 rounded-full text-sm outline-none border border-slate-100" />
                      <button type="submit" className="bg-indigo-600 p-2.5 rounded-full text-white"><ArrowRight size={18} /></button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 分頁 3: 設定頁面 */}
          {activeTab === 'settings' && (
            <div className="animate-in fade-in duration-500 max-w-2xl">
              <h2 className="text-3xl font-bold mb-8">LINE 串接設定</h2>
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
                <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center space-x-4">
                   <CheckCircle2 className="text-green-600" />
                   <div className="flex-1">
                      <p className="text-green-800 font-bold">通訊狀態：{userId ? '雲端驗證通過' : '模擬連線中'}</p>
                      <p className="text-green-600 text-xs">您的 Webhook 已準備好接收 LINE 訊息</p>
                   </div>
                </div>
                
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">LINE Messaging API Token</label>
                  <input type="password" name="lineToken" value={config.lineToken} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Channel Access Token (long-lived)" />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">Webhook URL</label>
                  <div className="flex space-x-2">
                    <input type="text" readOnly value={`https://${typeof window !== 'undefined' ? window.location.host : '...'}/api/webhook?userId=${userId || 'guest'}`} className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl text-indigo-600 font-mono text-xs" />
                    <button onClick={handleCopyWebhook} className="bg-slate-800 text-white px-6 py-4 rounded-xl font-bold text-sm flex items-center"><Copy size={18} className="mr-2" /> 複製</button>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-xs flex items-start space-x-2 leading-relaxed">
                   <AlertCircle size={16} className="shrink-0 mt-0.5" />
                   <p>請確保您的 LINE 官方帳號後台：<br/>1. 已開啟「Webhook」功能。<br/>2. 「回應模式」設為「聊天機器人」。<br/>3. Webhook URL 結尾必須包含您的 <b>userId</b> 參數。</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}