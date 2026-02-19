"use client";

import React, { useState, useEffect } from 'react';
import { 
  Save, MessageCircle, Wifi, Clock, Settings, Power, Smartphone,
  CheckCircle2, Bot, Database, LineChart, CreditCard, MessageSquare,
  Plus, ArrowRight, Zap, Shield, Globe, LogOut, Mail, Lock, LogIn, UserPlus, 
  Copy, AlertCircle, Star, Activity, Cpu, HardDrive, LayoutDashboard, 
  ShieldCheck, Users, TrendingUp, HelpCircle, Trash2
} from 'lucide-react';

// Firebase 相關模組匯入
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { getAnalytics, isSupported } from "firebase/analytics";

// ==========================================
// 1. 產品行銷首頁 (Landing Page Component)
// ==========================================
const LandingPage = ({ onNavigate }: any) => {
  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 overflow-x-hidden">
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <Bot size={32} className="text-indigo-400" />
          <span className="text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">X-Bot</span>
        </div>
        <div className="hidden md:flex space-x-8 font-medium text-slate-300">
          <a href="#" className="hover:text-white transition">功能特色</a>
          <a href="#" className="hover:text-white transition">方案計價</a>
        </div>
        <button 
          onClick={() => onNavigate('dashboard')}
          className="bg-white text-slate-900 px-6 py-2.5 rounded-full font-bold hover:bg-indigo-50 transition shadow-[0_0_15px_rgba(255,255,255,0.3)] flex items-center"
        >
          進入控制台 <ArrowRight size={16} className="ml-2" />
        </button>
      </nav>

      <div className="relative pt-20 pb-32 flex flex-col items-center justify-center text-center px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-semibold backdrop-blur-sm">🚀 X-Islands 旗下最新力作</div>
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">讓 AI 成為您的 <br className="hidden md:block" /><span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">24H 金牌客服管家</span></h1>
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">專為民宿與地方業者打造的 LINE 智能回覆系統。<br />只需填寫資料，AI 就能代您回覆房客所有重複問題。</p>
        <button onClick={() => onNavigate('dashboard')} className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-lg transition transform hover:-translate-y-1">免費啟動 AI 管家</button>
      </div>
    </div>
  );
};

// ==========================================
// 2. 業者控制台 (Dashboard Component)
// ==========================================
const DashboardComponent = ({ onNavigate }: any) => {
  const [authInstance, setAuthInstance] = useState<any>(null);
  const [db, setDb] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  const [isLoginView, setIsLoginView] = useState(true);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [config, setConfig] = useState({
    isActive: true, 
    shopName: "我的民宿名稱",
    checkIn: "15:00",
    checkOut: "11:00",
    wifiSsid: "Guest_WiFi",
    wifiPass: "88888888",
    tone: "enthusiastic",
    customRules: "",
    lineToken: "",
    currentPlan: "X-Pro"
  });

  const [qaList, setQaList] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([{ role: 'assistant', content: '嗨！我是 AI 小管家，請問有什麼我可以幫您的嗎？😊' }]);
  const [inputMessage, setInputMessage] = useState("");

  // Firebase 初始化邏輯
  useEffect(() => {
    const initFirebase = async () => {
      let firebaseConfig: any = null;
      
      // 1. 優先從環境變數讀取
      if (process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
        try { firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG); } catch (e) {}
      }
      
      // 2. 如果環境變數不存在，使用您提供的真實設定作為預設值
      if (!firebaseConfig || !firebaseConfig.projectId) {
        firebaseConfig = {
          apiKey: "AIzaSyDoMtzJ3UD8x1XQZIwgBh9H6xi9OfOa8rg",
          authDomain: "x-bot-pro.firebaseapp.com",
          projectId: "x-bot-pro",
          storageBucket: "x-bot-pro.firebasestorage.app",
          messagingSenderId: "579508810629",
          appId: "1:579508810629:web:69301a1eabe87b86cc0aec",
          measurementId: "G-XFWM3H5SV6"
        };
      }

      try {
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
        const firestore = getFirestore(app);
        const authObj = getAuth(app);
        setDb(firestore);
        setAuthInstance(authObj);

        // 初始化 Analytics (僅在瀏覽器環境且支援時)
        if (typeof window !== "undefined") {
          isSupported().then((supported) => {
            if (supported) getAnalytics(app);
          });
        }

        onAuthStateChanged(authObj, (user) => {
          setUserId(user ? user.uid : null);
          setIsAuthReady(true);
        });
      } catch (err) {
        console.error("Firebase 連線失敗:", err);
        setIsAuthReady(true);
      }
    };
    initFirebase();
  }, []);

  // 資料監聽
  useEffect(() => {
    if (!isAuthReady || !userId || !db) return;
    const appId = process.env.NEXT_PUBLIC_APP_ID || 'x-bot-pro-app';
    const unsub = onSnapshot(doc(db, 'artifacts', appId, 'users', userId, 'settings', 'config'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setConfig(prev => ({ ...prev, ...data }));
        if (data.qaList) setQaList(data.qaList);
      }
    });
    return () => unsub();
  }, [isAuthReady, userId, db]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authInstance) return setAuthError("系統初始化中...");
    setIsAuthenticating(true);
    setAuthError("");
    try {
      if (isLoginView) await signInWithEmailAndPassword(authInstance, authEmail, authPassword);
      else await createUserWithEmailAndPassword(authInstance, authEmail, authPassword);
    } catch (err: any) { setAuthError("驗證失敗，請檢查帳密或網路。"); }
    finally { setIsAuthenticating(false); }
  };

  const handleAnonymous = async () => {
    if (!authInstance) return setAuthError("系統初始化中...");
    setIsAuthenticating(true);
    try { await signInAnonymously(authInstance); } 
    catch (err) { setAuthError("匿名功能未開啟。"); }
    finally { setIsAuthenticating(false); }
  };

  const handleSave = async () => {
    if (!db || !userId) return setSaveMessage("預覽模式：無法儲存。");
    setIsSaving(true);
    try {
      const appId = process.env.NEXT_PUBLIC_APP_ID || 'x-bot-pro-app';
      await setDoc(doc(db, 'artifacts', appId, 'users', userId, 'settings', 'config'), {
        ...config, qaList, updatedAt: new Date().toISOString()
      }, { merge: true });
      setSaveMessage("AI 知識庫同步完成！");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (e) { setSaveMessage("儲存失敗。"); }
    finally { setIsSaving(false); }
  };

  const simulateAIResponse = (q: string) => {
    const text = q.toLowerCase();
    let reply = "抱歉，我還在學習這方面的知識，會請真人管家處理喔！😅";
    const found = qaList.find(i => text.includes(i.q.toLowerCase().replace(/\?|？|請問/g, '')));
    if (found) reply = found.a;
    else if (text.includes("wifi")) reply = `WiFi 帳號是【${config.wifiSsid}】，密碼是【${config.wifiPass}】。📶`;
    else if (text.includes("入住")) reply = `入住時間為 ${config.checkIn}，退房為 ${config.checkOut}。🏠`;
    if (config.tone === 'enthusiastic') reply += " 🥰";
    return reply;
  };

  if (!isAuthReady) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-bold animate-pulse">正在連線至雲端資料庫...</div>;

  // 登入註冊頁面
  if (!userId) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"><Bot size={32} className="text-white" /></div>
            <h1 className="text-3xl font-black text-slate-900">X-Bot 控制台</h1>
            <p className="text-slate-500 mt-2">請登入您的業者帳號</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <input type="email" required placeholder="Email 地址" value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium" />
            <input type="password" required placeholder="密碼" value={authPassword} onChange={e => setAuthPassword(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium" />
            {authError && <div className="text-red-500 text-xs font-bold px-2">⚠️ {authError}</div>}
            <button type="submit" disabled={isAuthenticating} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50">{isLoginView ? '立即登入' : '註冊帳號'}</button>
            <button type="button" onClick={handleAnonymous} disabled={isAuthenticating} className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-200 transition-all disabled:opacity-50"><Zap size={18} className="text-amber-500 fill-amber-500" /><span>快速匿名體驗</span></button>
          </form>
          <div className="mt-6 text-center pt-4 border-t border-slate-100">
            <button onClick={() => setIsLoginView(!isLoginView)} className="text-indigo-600 font-bold text-sm underline">{isLoginView ? '還沒有帳號？點此註冊' : '已有帳號？返回登入'}</button>
          </div>
        </div>
      </div>
    );
  }

  // 後台主介面
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      <aside className="w-full md:w-64 bg-[#0f172a] text-white flex-shrink-0 flex flex-col z-20 shadow-2xl">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2"><Bot size={28} className="text-indigo-400" /><h1 className="text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">X-Bot</h1></div>
          <p className="text-[10px] text-slate-500 mt-2 font-mono break-all leading-tight">UID: {userId}</p>
        </div>
        <nav className="flex-1 mt-6 px-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><LayoutDashboard size={20} /><span>數據概覽</span></button>
          <button onClick={() => setActiveTab('knowledge')} className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'knowledge' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Database size={20} /><span>知識庫管理</span></button>
          <button onClick={() => setActiveTab('settings')} className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Settings size={20} /><span>LINE 串接</span></button>
        </nav>
        <div className="px-4 pb-6 mt-auto">
          <button onClick={() => signOut(authInstance)} className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition"><LogOut size={18} /><span>登出系統</span></button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-3xl font-black text-slate-800">營運概況</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: "節省客服時數", val: "24h", icon: <Clock />, color: "text-indigo-600", bg: "bg-indigo-50" },
                  { label: "AI 解決率", val: "88%", icon: <ShieldCheck />, color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "本月訊息量", val: "512", icon: <MessageSquare />, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "不重複客群", val: "89", icon: <Users />, color: "text-orange-600", bg: "bg-orange-50" },
                ].map((s, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><div className={`w-12 h-12 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-4`}>{s.icon}</div><p className="text-sm font-bold text-slate-400">{s.label}</p><p className={`text-3xl font-black mt-1 ${s.color}`}>{s.val}</p></div>
                ))}
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 p-8 flex items-center justify-between">
                <div className="flex items-center space-x-4"><CreditCard className="text-indigo-600" size={32} /><div><h3 className="font-bold text-xl">方案：{config.currentPlan} 專業管家</h3><p className="text-sm text-slate-500">無限 Q&A 與語氣自訂權限已解鎖</p></div></div>
                <div className="text-right"><span className="text-3xl font-black text-indigo-600">NT$ 880</span><span className="text-slate-400 text-sm font-bold ml-1">/ 月</span></div>
              </div>
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in">
              <div className="xl:col-span-2 space-y-6">
                <div className="flex justify-between items-center mb-2"><h2 className="text-3xl font-bold">知識庫管理</h2><div className="flex items-center space-x-2 text-emerald-600 text-sm font-bold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100"><Zap size={14} /> <span>即時同步：{db ? '正式在線' : '展示'}</span></div></div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                  <h3 className="font-bold flex items-center text-lg"><Star size={20} className="mr-2 text-indigo-500" /> AI 客服語氣</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[{id:'enthusiastic', l:'🔥 熱情親切'}, {id:'professional', l:'💼 專業管家'}].map(t => (
                      <button key={t.id} onClick={() => setConfig({...config, tone: t.id})} className={`p-4 rounded-2xl border-2 transition-all font-bold ${config.tone === t.id ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100'}`}>{t.l}</button>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                  <h3 className="font-bold flex items-center text-lg"><Settings size={20} className="mr-2 text-indigo-500" /> 核心營運參數</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4"><label className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">Operations Time</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100"><span className="text-[9px] text-slate-500 block">入住</span><input type="time" value={config.checkIn} onChange={e => setConfig({...config, checkIn: e.target.value})} className="w-full bg-transparent font-bold outline-none text-sm" /></div>
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100"><span className="text-[9px] text-slate-500 block">退房</span><input type="time" value={config.checkOut} onChange={e => setConfig({...config, checkOut: e.target.value})} className="w-full bg-transparent font-bold outline-none text-sm" /></div>
                      </div>
                    </div>
                    <div className="space-y-4"><label className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">Network Access</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" value={config.wifiSsid} onChange={e => setConfig({...config, wifiSsid: e.target.value})} className="w-full p-3 border rounded-xl bg-slate-50 text-sm font-medium outline-none" placeholder="名稱" />
                        <input type="text" value={config.wifiPass} onChange={e => setConfig({...config, wifiPass: e.target.value})} className="w-full p-3 border rounded-xl bg-slate-50 text-sm font-medium outline-none" placeholder="密碼" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-lg flex items-center"><HelpCircle size={20} className="mr-2 text-indigo-500" /> 特殊問題 Q&A</h3><button onClick={() => setQaList([...qaList, {q:'新問題', a:'新答案'}])} className="text-xs bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-bold border border-indigo-100">+ 新增問答</button></div>
                  <div className="space-y-4">{qaList.map((qa, i) => (<div key={i} className="p-5 border border-slate-100 rounded-2xl bg-slate-50 relative group"><button onClick={() => setQaList(qaList.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-white text-red-400 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><input value={qa.q} onChange={e => setQaList(qaList.map((item, idx) => idx === i ? {...item, q: e.target.value} : item))} className="bg-transparent border-b border-slate-200 p-2 text-sm font-bold outline-none" placeholder="房客問題..." /><textarea value={qa.a} onChange={e => setQaList(qaList.map((item, idx) => idx === i ? {...item, a: e.target.value} : item))} className="bg-transparent border-b border-slate-200 p-2 text-sm h-12 outline-none" placeholder="回覆內容..." /></div></div>))}</div>
                </div>

                <div className="flex items-center justify-between py-6">
                  <div className="flex items-center text-emerald-600 font-bold opacity-0 transition-all duration-300" style={{ opacity: saveMessage ? 1 : 0 }}><CheckCircle2 size={20} className="mr-2" /> {saveMessage}</div>
                  <button onClick={handleSave} disabled={isSaving} className={`bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all ${isSaving ? 'opacity-50 animate-pulse' : 'hover:bg-indigo-700'}`}>{isSaving ? '同步大腦中...' : '儲存並更新 AI'}</button>
                </div>
              </div>

              <div className="xl:col-span-1">
                <div className="sticky top-8 space-y-4">
                  <h3 className="font-bold text-slate-700 flex items-center px-2"><Smartphone size={18} className="mr-2 text-indigo-500" /> AI 驗證沙盒</h3>
                  <div className="bg-slate-900 rounded-[3rem] p-4 border-8 border-slate-800 shadow-2xl h-[620px] flex flex-col overflow-hidden relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20"></div>
                    <div className="bg-[#242e38] p-4 pt-10 rounded-t-2xl flex items-center space-x-3 text-white border-b border-slate-700"><div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white"><Bot size={20} /></div><div><div className="font-bold text-sm leading-none">{config.shopName}</div><div className="text-[9px] text-green-400 mt-1 font-medium italic animate-pulse">● 智能連線中</div></div></div>
                    <div className="flex-1 bg-slate-800 bg-opacity-20 overflow-y-auto p-4 space-y-4">{chatHistory.map((m, i) => (<div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-indigo-500 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none font-medium'}`}>{m.content}</div></div>))}</div>
                    <form onSubmit={e => { e.preventDefault(); if(!inputMessage.trim()) return; setChatHistory([...chatHistory, {role:'user', content:inputMessage}]); const msg = inputMessage; setInputMessage(""); setTimeout(() => setChatHistory(prev => [...prev, {role:'assistant', content:simulateAIResponse(msg)}]), 800); }} className="bg-white p-3 flex items-center space-x-2 rounded-b-3xl pb-8 border-t border-slate-700/20"><input type="text" value={inputMessage} onChange={e => setInputMessage(e.target.value)} placeholder="測試輸入..." className="flex-1 px-4 py-2 bg-slate-100 rounded-full text-sm outline-none" /><button type="submit" className="bg-indigo-600 p-2.5 rounded-full text-white shadow-md"><ArrowRight size={18} /></button></form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-in fade-in max-w-2xl space-y-10">
              <h2 className="text-3xl font-bold text-slate-800">LINE 官方帳號通訊設定</h2>
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-8">
                <div className="p-6 bg-green-50 border border-green-200 rounded-[1.5rem] flex items-center space-x-5 shadow-sm"><div className="bg-green-500 p-3 rounded-full text-white shadow-lg shadow-green-200"><CheckCircle2 size={24} /></div><div className="flex-1"><p className="text-green-900 font-black text-lg">系統通訊正常</p><p className="text-green-600 text-sm font-medium">您的 Webhook 已準備好接收 LINE 訊息</p></div></div>
                <div className="space-y-4"><label className="block text-sm font-black text-slate-700 uppercase tracking-widest ml-1">LINE Channel Access Token</label><input type="password" value={config.lineToken} onChange={e => setConfig({...config, lineToken: e.target.value})} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-mono text-xs" placeholder="在此貼上長期權限令牌" /></div>
                <div className="space-y-4"><label className="block text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Webhook URL</label><div className="flex space-x-3"><input type="text" readOnly value={`https://${typeof window !== 'undefined' ? window.location.host : '...'}/api/webhook?userId=${userId || 'guest'}`} className="flex-1 p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-indigo-600 font-mono text-xs shadow-inner overflow-hidden" /><button onClick={handleCopyWebhook} className="bg-slate-900 text-white px-8 py-5 rounded-2xl font-black text-sm flex items-center hover:bg-slate-800 active:scale-95 transition-all shadow-md"><Copy size={18} className="mr-2" /> 複製</button></div></div>
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200 text-slate-600 text-[11px] flex items-start space-x-3 leading-relaxed font-medium"><AlertCircle size={18} className="shrink-0 mt-0.5 text-indigo-500" /><div className="space-y-2"><p className="text-slate-800 font-black">重要串接指南：</p><p>1. 前往 LINE Developers Console。<br/>2. 將上方 Webhook URL 貼入「Messaging API Settings」。<br/>3. 開啟「Use webhook」選項並停用 LINE OA 的自動回應功能。</p></div></div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// ==========================================
// 3. 主應用程式 (負責路由切換)
// ==========================================
export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  return (
    <>
      {currentPage === 'landing' ? (
        <LandingPage onNavigate={setCurrentPage} />
      ) : (
        <DashboardComponent onNavigate={setCurrentPage} />
      )}
    </>
  );
}