"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Bot, ArrowRight, Zap, Shield, MessageCircle, 
  Smartphone, Users, BarChart3, Clock, Check, 
  Star, Coffee, Moon, Globe, Sparkles
} from 'lucide-react';

// 定價方案資料
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
  return (
    <div className="min-h-screen bg-[#020617] font-sans text-slate-100 overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* 背景裝飾光暈 */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* 導覽列 */}
      <nav className="container mx-auto px-6 py-8 flex justify-between items-center relative z-50">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot size={24} className="text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            X-Bot
          </span>
        </div>
        
        <div className="hidden lg:flex space-x-10 text-sm font-semibold text-slate-400">
          <a href="#features" className="hover:text-white transition">功能特色</a>
          <a href="#process" className="hover:text-white transition">運作流程</a>
          <a href="#pricing" className="hover:text-white transition">方案計價</a>
          <a href="#" className="hover:text-white transition">關於我們</a>
        </div>

        <Link 
          href="/dashboard"
          className="bg-white text-slate-900 px-6 py-2.5 rounded-full font-bold hover:bg-indigo-50 transition-all flex items-center shadow-lg active:scale-95"
        >
          進入控制台 <ArrowRight size={16} className="ml-2" />
        </Link>
      </nav>

      {/* 英雄區塊 (Hero Section) */}
      <section className="relative pt-20 pb-32 px-6 z-10">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-indigo-300 text-sm font-bold mb-8 animate-fade-in">
            <Sparkles size={14} />
            <span>X-Islands 旗下全新 AI 品牌</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter">
            不再為了 <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 italic">重複的問題</span> <br />
            犧牲您的睡眠時間
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            專為離島民宿打造。當您在睡覺、帶導覽、或享受生活時，<br className="hidden md:block" />
            X-Bot 在 LINE 上 24 小時親切接待您的客人。
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              href="/dashboard"
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-10 py-5 rounded-2xl font-black text-xl hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all transform hover:-translate-y-1 active:scale-95"
            >
              免費啟動 AI 管家
            </Link>
            <button className="w-full sm:w-auto px-10 py-5 rounded-2xl font-bold text-xl border border-slate-700 hover:bg-slate-800 transition text-slate-300 flex items-center justify-center">
              觀看實機展示
            </button>
          </div>

          {/* 數據小標籤 */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-slate-500 font-bold uppercase text-xs tracking-widest">
            <div className="flex items-center space-x-2"><Clock size={16}/> <span>24/7 自動值班</span></div>
            <div className="flex items-center space-x-2"><MessageCircle size={16}/> <span>三分鐘快速導入</span></div>
            <div className="flex items-center space-x-2"><Shield size={16}/> <span>100% 準確回覆</span></div>
          </div>
        </div>
      </section>

      {/* 情境共鳴區塊 (The Struggle) */}
      <section className="py-24 bg-[#0a0f1e] border-y border-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                您是否也厭倦了 <br />
                這些「機械式」的對話？
              </h2>
              <div className="space-y-4">
                {[
                  { q: "請問 WiFi 密碼多少？", time: "凌晨 01:30" },
                  { q: "船票多少錢？要去哪裡搭？", time: "帶導覽中..." },
                  { q: "民宿地址在哪？怎麼去？", time: "忙著清潔中..." }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex justify-between items-center group hover:border-indigo-500/30 transition">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-4"></div>
                      <span className="text-lg font-medium text-slate-300">{item.q}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-bold">{item.time}</span>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-slate-400 text-lg">
                這些問題雖然簡單，卻不斷切碎您的休息時間。
                <span className="text-indigo-400 font-bold"> 讓 X-Bot 幫您擋下 80% 的重複訊息。</span>
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] rounded-full"></div>
              <div className="relative bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-2xl">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-slate-700 h-10 w-2/3 rounded-xl rounded-tl-none animate-pulse"></div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-indigo-600 h-12 w-3/4 rounded-xl rounded-tr-none flex items-center px-4 text-sm font-bold">
                      「您好！本館 WiFi 密碼為 bayliu888，祝您上網愉快 😊」
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-slate-700 h-10 w-1/2 rounded-xl rounded-tl-none"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 功能特色 (Features) */}
      <section id="features" className="py-32 container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6">更強大的功能，更好的體驗</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">不只是一個回覆機器人，它是真正懂旅遊業的智能助理。</p>
        </div>
        
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
            <div key={i} className="bg-white/5 border border-slate-800 p-8 rounded-3xl hover:bg-white/10 transition group">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 定價方案 (Pricing) */}
      <section id="pricing" className="py-32 bg-[#020617] relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">簡單透明的方案</h2>
            <p className="text-slate-400 text-lg">選擇最適合您的產品，開始您的數位轉型。</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <div 
                key={i} 
                className={`relative rounded-3xl p-8 flex flex-col ${
                  plan.highlight 
                  ? 'bg-gradient-to-b from-indigo-600/20 to-indigo-900/40 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20' 
                  : 'bg-slate-900/50 border border-slate-800'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                    最受歡迎
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-4xl font-black text-white">NT$ {plan.price}</span>
                    <span className="text-slate-500 font-bold">/ 月</span>
                  </div>
                  <p className="mt-4 text-slate-400 text-sm leading-relaxed h-12">
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-start space-x-3 text-sm">
                      <div className="mt-1 bg-emerald-500/20 rounded-full p-0.5">
                        <Check size={14} className="text-emerald-400" />
                      </div>
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-4 rounded-2xl font-black transition-all active:scale-95 ${
                  plan.highlight 
                  ? 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-lg shadow-indigo-500/30' 
                  : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
                }`}>
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 底部區塊 (Footer) */}
      <footer className="py-20 px-6 border-t border-slate-800">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <Bot size={24} className="text-indigo-400" />
                <span className="text-xl font-black tracking-tight">X-Bot</span>
              </div>
              <p className="text-slate-500 text-sm max-w-xs">
                X-Islands 離島旅遊入口網旗下產品。<br />
                專注於提升地方觀光產業的數位競爭力。
              </p>
            </div>
            
            <div className="flex space-x-12">
              <div className="space-y-4">
                <h4 className="font-bold text-slate-300 text-sm uppercase tracking-widest">產品</h4>
                <ul className="space-y-2 text-slate-500 text-sm">
                  <li><a href="#" className="hover:text-white transition">功能介紹</a></li>
                  <li><a href="#" className="hover:text-white transition">解決方案</a></li>
                  <li><a href="#" className="hover:text-white transition">定價方案</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-slate-300 text-sm uppercase tracking-widest">公司</h4>
                <ul className="space-y-2 text-slate-500 text-sm">
                  <li><a href="#" className="hover:text-white transition">關於我們</a></li>
                  <li><a href="#" className="hover:text-white transition">隱私政策</a></li>
                  <li><a href="#" className="hover:text-white transition">服務條款</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-20 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center text-slate-600 text-[10px] font-bold uppercase tracking-widest">
            <p>© 2024 X-Islands Tech. All Rights Reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="https://www.x-islands.com/" className="hover:text-white transition">X-Islands 入口網</a>
              <a href="#" className="hover:text-white transition">X-Match 媒合網</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}