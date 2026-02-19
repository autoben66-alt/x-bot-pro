"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Save, MessageCircle, Settings, Power, Smartphone,
  CheckCircle2, Bot, Database, LineChart, MessageSquare, 
  Plus, ArrowRight, LogOut, Trash2, Zap, LayoutDashboard,
  TrendingUp, Users, ShieldCheck, HelpCircle
} from 'lucide-react';

export default function DashboardPage() {
  // --- 狀態管理 ---
  const [config, setConfig] = useState({
    isActive: true, 
    shopName: "灣琉海景 Villa",
    checkIn: "15:00",
    checkOut: "11:00",
    wifiSsid: "Bayliu_Guest",
    wifiPass: "bayliu888",
    tone: "enthusiastic",
    customRules: "遇到客人殺價，委婉拒絕並說明我們已經是優惠價，但可以提供延遲一小時退房作為補償。"
  });

  const [qaList, setQaList] = useState([
    { id: 1, q: "請問有提供早餐嗎？", a: "有的！我們提供在地特色洪媽媽早餐，供應時間為 08:00 - 10:00。" },
    { id: 2, q: "可以帶寵物嗎？", a: "不好意思，為了維護其他旅客權益，我們目前全面禁止攜帶寵物入住喔。" },
    { id: 3, q: "附近有推薦的機車租借嗎？", a: "有的！我們有配合的車行，租金一天 400 元，就在港口旁邊非常方便。" }
  ]);

  const [analytics, setAnalytics] = useState({
    savedHours: 42,
    resolutionRate: 94,
    totalMessages: 1248,
    activeUsers: 156
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: '嗨！我是 AI 小管家，系統設定已同步。您可以試著問我 WiFi、早餐或是租車資訊喔！😊' }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [activeTab, setActiveTab] = useState('knowledge'); // 'dashboard', 'knowledge', 'settings'

  // --- 邏輯處理 ---
  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setConfig((prev: any) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage("AI 邏輯模型已更新完成！");
      setTimeout(() => setSaveMessage(""), 3000);
    }, 1500);
  };

  const handleAddQA = () => {
    const newQA = { id: Date.now(), q: "新問題", a: "請輸入答案" };
    setQaList([newQA, ...qaList]);
  };

  const handleDeleteQA = (id: number) => {
    setQaList(qaList.filter(item => item.id !== id));
  };

  // 模擬 RAG 回覆邏輯 (同步前台展示情境)
  const simulateAIResponse = (question: string) => {
    let response = "";
    const q = question.toLowerCase();

    // 1. 匹配知識庫
    const matchedQA = qaList.find(item => q.includes(item.q.replace(/請問|嗎|？|\?/g, '')));
    if (matchedQA) return matchedQA.a + (config.tone === 'enthusiastic' ? " 🥰" : "");

    // 2. 匹配基礎變數
    if (q.includes("wifi") || q.includes("網路")) {
      response = `收到！我們的 WiFi 帳號是【${config.wifiSsid}】，密碼是【${config.wifiPass}】。📶`;
    } else if (q.includes("入住") || q.includes("退房") || q.includes("幾點")) {
      response = `我們的入住時間是 ${config.checkIn} 之後，退房時間是 ${config.checkOut} 之前喔！🏠`;
    } else if (q.includes("便宜") || q.includes("折扣") || q.includes("殺價")) {
      response = `關於價格的部分，${config.customRules} 🙏`;
    } else {
      response = `這個問題我還在學習中...😅 我先幫您記錄下來，稍後請真人管家回覆您！`;
    }

    if (config.tone === 'professional') {
      response = response.replace(/喔！|🥰|📶|🏠|🙏|😅/g, "。").replace("😊", "");
    }
    return response;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    setChatHistory(prev => [...prev, { role: 'user', content: inputMessage }]);
    const currentInput = inputMessage;
    setInputMessage("");

    setTimeout(() => {
      const aiReply = simulateAIResponse(currentInput);
      setChatHistory(prev => [...prev, { role: 'assistant', content: aiReply }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* 側邊導航 */}
      <aside className="w-full md:w-64 bg-[#0f172a] text-white flex-shrink-0 flex flex-col z-20 shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Bot size={28} className="text-indigo-400" />
            <h1 className="text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              X-Bot
            </h1>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-semibold">{config.shopName} 後台</p>
        </div>
        
        <nav className="flex-1 mt-6 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} /><span>數據概覽</span>
          </button>
          <button 
            onClick={() => setActiveTab('knowledge')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'knowledge' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Database size={20} /><span>AI 知識庫管理</span>
          </button>
          <button 
            className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-xl transition"
          >
            <MessageSquare size={20} /><span>對話紀錄回溯</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Settings size={20} /><span>LINE 串接設定</span>
          </button>
        </nav>

        <div className="px-4 pb-6">
           <Link href="/" className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition border border-slate-700">
             <LogOut size={18} /><span>返回官網首頁</span>
           </Link>
        </div>
      </aside>

      {/* 主內容區 */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* 數據儀表板頁面 */}
          {activeTab === 'dashboard' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold mb-8 flex items-center">
                <LayoutDashboard className="mr-3 text-indigo-600" />營運數據指標
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: "已節省人力時間", value: `${analytics.savedHours} hr`, icon: <Clock />, color: "text-indigo-600", bg: "bg-indigo-50" },
                  { label: "AI 自主解決率", value: `${analytics.resolutionRate}%`, icon: <CheckCircle2 />, color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "本月總訊息數", value: analytics.totalMessages, icon: <MessageCircle />, color: "text-cyan-600", bg: "bg-cyan-50" },
                  { label: "不重複房客數", value: analytics.activeUsers, icon: <Users />, color: "text-orange-600", bg: "bg-orange-50" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                      {stat.icon}
                    </div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                    <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center py-20">
                <TrendingUp size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-400">趨勢圖表整合中</h3>
                <p className="text-slate-400 text-sm">串接 LINE Webhook 後將會在此顯示每日流量曲線</p>
              </div>
            </div>
          )}

          {/* 知識庫管理頁面 */}
          {activeTab === 'knowledge' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="xl:col-span-2 space-y-6">
                <header className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-3xl font-bold">AI 知識庫管理</h2>
                    <p className="text-slate-500">業者只需專注填寫資訊，AI 會自動學習如何回覆。</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-indigo-100 text-indigo-600 font-bold text-sm">
                    <Zap size={16} /> <span>極速同步模式</span>
                  </div>
                </header>

                {/* 總開關 */}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-indigo-100 flex justify-between items-center bg-gradient-to-r from-white to-indigo-50/30">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                      <Power size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">啟用 AI 機器人</h3>
                      <p className="text-sm text-slate-500">目前狀態：{config.isActive ? '正在 LINE 官方帳號提供服務' : '已關閉'}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="isActive" checked={config.isActive} onChange={handleInputChange} className="sr-only peer" />
                    <div className="w-14 h-7 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {/* 基礎參數 */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="font-bold text-slate-800 mb-6 flex items-center text-lg">
                    <Settings size={20} className="mr-2 text-indigo-500" /> 民宿營運變數
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">時間設定</label>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] block text-slate-400">入住時間</span>
                          <input type="time" name="checkIn" value={config.checkIn} onChange={handleInputChange} className="w-full bg-transparent font-bold outline-none" />
                        </div>
                        <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] block text-slate-400">退房時間</span>
                          <input type="time" name="checkOut" value={config.checkOut} onChange={handleInputChange} className="w-full bg-transparent font-bold outline-none" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">網路設定</label>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] block text-slate-400">WiFi 帳號</span>
                          <input type="text" name="wifiSsid" value={config.wifiSsid} onChange={handleInputChange} className="w-full bg-transparent font-bold outline-none" />
                        </div>
                        <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] block text-slate-400">WiFi 密碼</span>
                          <input type="text" name="wifiPass" value={config.wifiPass} onChange={handleInputChange} className="w-full bg-transparent font-bold outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 自訂 Q&A */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 flex items-center text-lg">
                      <HelpCircle size={20} className="mr-2 text-indigo-500" /> 特殊問題 Q&A
                    </h3>
                    <button 
                      onClick={handleAddQA}
                      className="text-sm bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-bold hover:bg-indigo-100 transition flex items-center"
                    >
                      <Plus size={18} className="mr-1" /> 新增問答對
                    </button>
                  </div>
                  <div className="space-y-4">
                    {qaList.map((qa) => (
                      <div key={qa.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 relative group">
                        <button 
                          onClick={() => handleDeleteQA(qa.id)}
                          className="absolute -top-2 -right-2 bg-white text-red-400 p-1.5 rounded-full shadow-md border border-red-50/50 opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start">
                            <span className="text-indigo-400 font-black mr-2 mt-2">Q</span>
                            <input 
                              type="text" 
                              value={qa.q} 
                              onChange={(e) => {
                                const newList = qaList.map(item => item.id === qa.id ? { ...item, q: e.target.value } : item);
                                setQaList(newList);
                              }}
                              className="w-full bg-transparent border-b border-slate-200 p-2 focus:border-indigo-400 outline-none text-sm font-bold"
                            />
                          </div>
                          <div className="flex items-start">
                            <span className="text-emerald-400 font-black mr-2 mt-2">A</span>
                            <textarea 
                              value={qa.a} 
                              onChange={(e) => {
                                const newList = qaList.map(item => item.id === qa.id ? { ...item, a: e.target.value } : item);
                                setQaList(newList);
                              }}
                              className="w-full bg-transparent border-b border-slate-200 p-2 focus:border-emerald-400 outline-none text-sm h-12"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI 個性 */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="font-bold text-slate-800 mb-6 flex items-center text-lg">
                    <Zap size={20} className="mr-2 text-indigo-500" /> AI 個性指令 (System Prompt)
                  </h3>
                  <div className="flex space-x-4 mb-6">
                    {['enthusiastic', 'professional'].map((t) => (
                      <button 
                        key={t}
                        onClick={() => setConfig({...config, tone: t})}
                        className={`flex-1 p-4 rounded-2xl border-2 transition-all ${config.tone === t ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-100 hover:border-slate-200'}`}
                      >
                        <p className={`font-bold ${config.tone === t ? 'text-indigo-600' : 'text-slate-400'}`}>
                          {t === 'enthusiastic' ? '🔥 熱情親切風格' : '💼 專業管家風格'}
                        </p>
                      </button>
                    ))}
                  </div>
                  <textarea 
                    name="customRules" value={config.customRules} onChange={handleInputChange}
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm h-28 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="例如：遇到殺價、客人詢問超出服務範圍的內容該如何應對..."
                  />
                </div>

                {/* 儲存按鈕 */}
                <div className="flex items-center justify-between py-6">
                  <div className="flex items-center text-emerald-600 font-bold transition-all duration-300" style={{ opacity: saveMessage ? 1 : 0 }}>
                    <CheckCircle2 size={20} className="mr-2" /> {saveMessage}
                  </div>
                  <button 
                    onClick={handleSave} disabled={isSaving}
                    className={`bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition transform active:scale-95 ${isSaving ? 'opacity-70 animate-pulse' : ''}`}
                  >
                    <Save size={20} className="inline mr-2" /> {isSaving ? 'AI 模型訓練中...' : '儲存並重新訓練 AI'}
                  </button>
                </div>
              </div>

              {/* 右側：手機模擬器 (Sandbox) */}
              <div className="xl:col-span-1">
                <div className="sticky top-8">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="font-bold text-slate-700 flex items-center"><Smartphone size={18} className="mr-2" /> 即時測試沙盒</h3>
                    <button onClick={() => setChatHistory([{ role: 'assistant', content: '重置完成！您可以隨意發問測試 AI 的表現。' }])} className="text-xs text-slate-400 hover:text-indigo-600">重置對話</button>
                  </div>

                  <div className="bg-slate-900 rounded-[3rem] p-4 shadow-2xl border-4 border-slate-800 w-full max-w-sm mx-auto h-[680px] flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20"></div>
                    
                    <div className="bg-[#242e38] text-white p-4 pt-10 rounded-t-3xl flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white"><Bot size={20} /></div>
                      <div>
                        <div className="font-bold text-[13px]">{config.shopName}</div>
                        <div className="text-[10px] text-green-400 font-medium tracking-wider">● AI 機器人自動回覆中</div>
                      </div>
                    </div>

                    <div className="flex-1 bg-slate-800 bg-opacity-50 overflow-y-auto p-4 space-y-4">
                       {chatHistory.map((msg, index) => (
                          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'assistant' && (
                               <div className="w-8 h-8 rounded-full bg-indigo-500 mr-2 flex items-center justify-center text-white text-[10px] mt-1 shrink-0"><Bot size={14} /></div>
                            )}
                            <div className={`max-w-[80%] p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-emerald-400 text-slate-900 rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none'}`}>
                              {msg.content}
                            </div>
                          </div>
                       ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="bg-white p-3 flex items-center space-x-2 rounded-b-3xl border-t border-slate-100 pb-6">
                      <input 
                        type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="點擊此處開始發問測試..."
                        className="flex-1 bg-slate-50 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      />
                      <button type="submit" disabled={!inputMessage.trim()} className="bg-indigo-600 w-10 h-10 flex items-center justify-center rounded-full text-white shadow-md active:scale-90 transition">
                        <ArrowRight size={18} />
                      </button>
                    </form>
                  </div>
                  <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start space-x-3 text-indigo-700 text-xs leading-relaxed">
                    <ShieldCheck size={20} className="shrink-0 mt-0.5" />
                    <p>當您在左側修改「入住時間」或「個性風格」後，點擊儲存，右側沙盒會即時同步新的回覆邏輯。</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 設定頁面 (LINE 串接預覽) */}
          {activeTab === 'settings' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h2 className="text-3xl font-bold mb-8">LINE 官方帳號設定</h2>
               <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl">
                  <div className="flex items-center space-x-4 mb-8 p-4 bg-green-50 rounded-2xl border border-green-100">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white"><Smartphone /></div>
                    <div className="flex-1">
                      <h4 className="font-bold text-green-800 uppercase tracking-widest text-xs">連線狀態</h4>
                      <p className="text-green-600 font-black">已成功與 LINE 伺服器對接</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">LINE Channel Access Token</label>
                      <input type="password" readonly value="****************************************" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Webhook URL (複製此網址貼回 LINE 後台)</label>
                      <div className="flex space-x-2">
                        <input type="text" readonly value="https://x-bot-wine.vercel.app/api/webhook" className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl text-indigo-600 font-mono text-xs" />
                        <button className="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold text-sm">複製</button>
                      </div>
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