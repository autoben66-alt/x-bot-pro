"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Bot, ArrowRight, Zap, Shield, MessageCircle, 
  Smartphone, Clock, Check, Sparkles
} from 'lucide-react';

// 定義痛點情境資料
const scenarios = [
  {
    id: 1,
    question: "請問 WiFi 密碼多少？",
    time: "凌晨 01:30",
    aiResponse: "您好！本館 WiFi 密碼為 bayliu888，密碼全小寫。訊號如果不穩請再跟我說喔！📶",
    iconColor: "bg-red-500"
  },
  {
    id: 2,
    question: "船票多少錢？要去哪裡搭？",
    time: "帶導覽中...",
    aiResponse: "關於船票：我們配合泰富輪船，來回全票是 $410 元。需要代訂的話請提供姓名與身分證字號給我們！🚢",
    iconColor: "bg-orange-500"
  },
  {
    id: 3,
    question: "民宿地址在哪？怎麼去？",
    time: "忙著清潔中...",
    aiResponse: "民宿地址是：屏東縣琉球鄉中興路...。點擊此連結可開啟 Google 地圖導覽：https://maps.app.goo.gl/xxx 📍",
    iconColor: "bg-blue-500"
  }
];

const pricingPlans = [
  {
    name: "基礎體驗 (X-Lite)",
    price: "0",
    description: "適合剛起步、想嘗試數位轉型的微型業者。",
    features: ["基礎房況問答", "WiFi/入住時間自動回覆", "X-Islands 基本曝光"],
    buttonText: "立即開始",
    highlight: false
  },
  {
    name: "專業管家 (X-Pro)",
    price: "880",
    description: "最受歡迎方案！讓您徹底從重複性客服中解脫。",
    features: ["AI 客服語氣自訂", "無限自訂問答庫 (Q&A)", "LINE 官方帳號無縫串接", "自動發送入住導航須知"],
    buttonText: "免費試用 14 天",
    highlight: true
  },
  {
    name: "商業進階 (X-Biz)",
    price: "2,500",
    description: "專為多館別、追求極致行銷成效的業者設計。",
    features: ["X-Islands 優先排序廣告", "X-Match 網紅媒合點數", "數據分析報表", "一對一技術支援"],
    buttonText: "聯繫專員",
    highlight: false
  }
];

export default function LandingPage() {
  // 狀態：目前選中的情境
  const [activeScenario, setActiveScenario] = useState(scenarios[0]);
  const [isTyping, setIsTyping] = useState(false);
  const demoRef = useRef<HTMLElement>(null);

  // 當切換情境時，模擬打字效果
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), 800);
    return () => clearTimeout(timer);
  }, [activeScenario]);

  // 捲動到展示區
  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30">
      
      {/* 背景裝飾光暈 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-indigo-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[120px]"></div>
      </div>

      {/* 導覽列 */}
      <nav className="relative z-50 container mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot size={24} className="text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter">
            X-Bot
          </span>
        </div>
        
        <div className="hidden lg:flex space-x-10 text-sm font-bold text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">功能特色</a>
          <a href="#pricing" className="hover:text-white transition-colors">方案計價</a>
        </div>

        <Link 
          href="/dashboard"
          className="bg-white text-slate-950 px-6 py-2.5 rounded-full font-bold hover:bg-slate-200 transition-all flex items-center shadow-xl active:scale-95"
        >
          進入控制台 <ArrowRight size={16} className="ml-2" />
        </Link>
      </nav>

      {/* 英雄區塊 (Hero Section) */}
      <section className="relative z-10 pt-16 pb-24 px-6">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-bold mb-10">
            <Sparkles size={14} />
            <span>X-Islands 旗下全新 AI 品牌</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tighter">
            不再為了 <span className="text-indigo-400">重複的問題</span> <br />
            犧牲您的睡眠時間
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            專為離島民宿打造。當您在睡覺、帶導覽、或享受生活時，<br className="hidden md:block" />
            X-Bot 在 LINE 上 24 小時親切接待您的客人。
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              href="/dashboard"
              className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all transform hover:-translate-y-1"
            >
              免費啟動 AI 管家
            </Link>
            <button 
              onClick={scrollToDemo}
              className="w-full sm:w-auto px-10 py-5 rounded-2xl font-bold text-xl border border-slate-700 hover:bg-slate-800 transition text-slate-300"
            >
              觀看實機展示
            </button>
          </div>
        </div>
      </section>

      {/* 痛點共鳴與互動展示區 (The Struggle & Live Demo) */}
      <section ref={demoRef} className="py-24 bg-slate-900/50 border-y border-slate-800/50 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* 左側：點擊觸發區 */}
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                您是否也厭倦了 <br />
                這些「機械式」的對話？
              </h2>
              <p className="text-slate-400 font-medium">點擊下方常見問題，看看 X-Bot 如何智慧回覆：</p>
              
              <div className="space-y-4">
                {scenarios.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => setActiveScenario(item)}
                    className={`w-full text-left p-6 rounded-2xl border transition-all flex justify-between items-center group ${
                      activeScenario.id === item.id 
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.2)]' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 ${item.iconColor} rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]`}></div>
                      <span className={`text-lg font-bold ${activeScenario.id === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                        {item.question}
                      </span>
                    </div>
                    {/* 修正點：將 item.t 改為 item.time */}
                    <span className="text-xs font-black text-slate-500 uppercase">{item.time}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* 右側：手機模擬器連動 */}
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-600/20 blur-[100px] rounded-full"></div>
              
              {/* 手機外框 */}
              <div className="relative bg-slate-900 border border-slate-700 p-4 pb-12 rounded-[3rem] shadow-2xl max-w-[360px] mx-auto overflow-hidden">
                {/* 手機上方元素 */}
                <div className="w-24 h-6 bg-slate-800 rounded-b-2xl mx-auto mb-4"></div>
                
                {/* LINE 介面 */}
                <div className="bg-[#242e38] p-3 rounded-t-xl flex items-center space-x-3 mb-1">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-black italic">X</div>
                  <div className="flex-1">
                    <div className="text-[12px] font-bold leading-none">灣琉海景 Villa</div>
                    <div className="text-[9px] text-green-400 mt-1">● 機器人值班中</div>
                  </div>
                </div>

                {/* 聊天對話流 */}
                <div className="h-[380px] bg-[#7289da]/10 p-4 space-y-4 overflow-hidden relative">
                   {/* 客人提問 */}
                   <div className="flex justify-start animate-fade-in-up">
                      <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none text-xs border border-slate-700 text-slate-300">
                        {activeScenario.question}
                      </div>
                   </div>

                   {/* AI 回覆 */}
                   <div className={`flex justify-end transition-all duration-500 ${isTyping ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                      <div className="bg-indigo-600 p-4 rounded-2xl rounded-tr-none shadow-xl max-w-[85%]">
                        <p className="text-[13px] font-bold leading-relaxed">
                          {activeScenario.aiResponse}
                        </p>
                      </div>
                   </div>

                   {/* 打字中動畫 */}
                   {isTyping && (
                     <div className="flex justify-end">
                       <div className="bg-indigo-900/40 px-4 py-2 rounded-full flex space-x-1">
                         <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                         <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                         <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                       </div>
                     </div>
                   )}
                </div>

                {/* 輸入框裝飾 */}
                <div className="bg-white p-3 rounded-b-xl flex items-center space-x-2">
                   <div className="flex-1 h-8 bg-slate-100 rounded-full"></div>
                   <div className="w-8 h-8 bg-indigo-500 rounded-full"></div>
                </div>
              </div>

              {/* 漂浮的小標記 */}
              <div className="absolute -bottom-6 -right-6 bg-slate-800 border border-slate-700 p-4 rounded-2xl shadow-xl hidden md:block animate-bounce">
                <div className="flex items-center space-x-2">
                  <Bot size={20} className="text-indigo-400" />
                  <span className="text-xs font-bold text-slate-300">AI 正在替您節省時間</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 特色區塊 */}
      <section id="features" className="py-32 container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-16">更強大的功能，更好的體驗</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              icon: <Zap />, 
              title: "三分鐘訓練完成", 
              desc: "填寫表單或上傳 PDF，AI 立即學會您的民宿規矩。" 
            },
            { 
              icon: <MessageCircle />, 
              title: "語氣隨心調整", 
              desc: "想要熱情親切還是專業俐落？一鍵設定 AI 的說話風格。" 
            },
            { 
              icon: <Smartphone />, 
              title: "LINE OA 完美串接", 
              desc: "免申請 API Key，授權即用。台灣客人的最愛。" 
            },
            { 
              icon: <Shield />, 
              title: "真人接管提醒", 
              desc: "遇到殺價或複雜訂房，AI 會聰明地通知您親自處理。" 
            }
          ].map((feature, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl hover:bg-slate-800 transition-all hover:border-indigo-500/30 group text-left">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 定價方案 */}
      <section id="pricing" className="py-32 container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-16">簡單透明的方案</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, i) => (
            <div 
              key={i} 
              className={`p-10 rounded-[2rem] border flex flex-col text-left transition-transform hover:-translate-y-2 ${
                plan.highlight 
                ? 'bg-indigo-900/20 border-indigo-500 shadow-2xl shadow-indigo-500/20' 
                : 'bg-slate-900/40 border-slate-800'
              }`}
            >
              <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-black tracking-tight">NT$ {plan.price}</span>
                <span className="text-slate-500 ml-2">/ 月</span>
              </div>
              <p className="text-slate-400 text-sm mb-8 min-h-[48px]">{plan.description}</p>
              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center space-x-3 text-sm">
                    <Check size={16} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-300">{f}</span>
                  </div>
                ))}
              </div>
              <button className={`w-full py-4 rounded-2xl font-black transition-colors ${
                plan.highlight ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-slate-800 hover:bg-slate-700'
              }`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 底部 */}
      <footer className="py-20 border-t border-slate-800 relative z-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <Bot className="text-indigo-400" />
              <span className="text-xl font-black">X-Bot</span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
              X-Islands 旗下產品，專注提升地方觀光競爭力。
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-4">
             <div className="flex space-x-6 text-sm font-bold text-slate-400">
               <a href="https://www.x-islands.com/" target="_blank" className="hover:text-white transition-colors">X-Islands</a>
               <a href="https://x-match-platform.vercel.app/" target="_blank" className="hover:text-white transition-colors">X-Match</a>
             </div>
             <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest">© 2024 X-Islands Tech. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}