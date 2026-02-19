"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Save, MessageCircle, Settings, Power, Smartphone,
  CheckCircle2, Bot, Database, LineChart, MessageSquare, Plus, ArrowRight, LogOut
} from 'lucide-react';

export default function DashboardPage() {
  const [config, setConfig] = useState({
    isActive: true, 
    shopName: "灣琉海景 Villa",
    checkIn: "15:00",
    checkOut: "11:00",
    wifiSsid: "Bayliu_Guest",
    wifiPass: "bayliu888",
    tone: "enthusiastic",
    customRules: "遇到客人殺價，委婉拒絕。"
  });

  const [qaList, setQaList] = useState([
    { q: "請問有提供早餐嗎？", a: "有的！提供在地早餐。" }
  ]);

  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: '嗨！我是 AI 小管家，有什麼可以幫您的嗎？😊' }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setConfig((prev: any) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setChatHistory(prev => [...prev, { role: 'user', content: inputMessage }]);
    setInputMessage("");
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'assistant', content: "收到您的訊息！(這只是前端測試)" }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* 側邊導航 */}
      <aside className="w-full md:w-64 bg-[#0f172a] text-white flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Bot size={28} className="text-indigo-400" />
            <h1 className="text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              X-Bot
            </h1>
          </div>
        </div>
        <nav className="flex-1 mt-6 px-4 space-y-2">
          <a href="#" className="flex items-center space-x-3 px-4 py-3 bg-indigo-500 bg-opacity-10 rounded-xl text-indigo-400 font-medium border border-indigo-500 border-opacity-20">
            <Database size={20} /><span>知識庫訓練</span>
          </a>
        </nav>
        <div className="px-4 pb-6">
           <Link href="/" className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition border border-slate-700">
             <LogOut size={18} /><span>回首頁</span>
           </Link>
        </div>
      </aside>

      {/* 主內容區 */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 mb-8">知識庫設定</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* 表單區 */}
             <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                   <h3 className="font-bold mb-4">基礎設定</h3>
                   <input type="text" name="wifiSsid" value={config.wifiSsid} onChange={handleInputChange} className="w-full p-2 border rounded mb-2" placeholder="WiFi 帳號" />
                   <input type="text" name="wifiPass" value={config.wifiPass} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="WiFi 密碼" />
                </div>
             </div>

             {/* 手機模擬器 */}
             <div className="bg-slate-900 rounded-[2.5rem] p-3 shadow-xl border-4 border-slate-800 h-[500px] flex flex-col">
                <div className="flex-1 bg-slate-800 p-4 space-y-4 overflow-y-auto rounded-t-2xl">
                   {chatHistory.map((msg, idx) => (
                      <div key={idx} className={`p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-emerald-400 text-black ml-auto' : 'bg-white text-black mr-auto'} max-w-[80%]`}>
                         {msg.content}
                      </div>
                   ))}
                </div>
                <form onSubmit={handleSendMessage} className="bg-white p-2 rounded-b-2xl flex">
                   <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} className="flex-1 px-2 outline-none" placeholder="輸入訊息..." />
                   <button type="submit" className="bg-indigo-500 p-2 rounded-lg text-white"><ArrowRight size={16}/></button>
                </form>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}