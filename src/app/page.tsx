"use client";

import React from 'react';
import Link from 'next/link';
import { Bot, ArrowRight, Zap, Shield, MessageCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 overflow-x-hidden">
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <Bot size={32} className="text-indigo-400" />
          <span className="text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            X-Bot
          </span>
        </div>
        <div className="hidden md:flex space-x-8 font-medium text-slate-300">
          <a href="#" className="hover:text-white transition">功能特色</a>
          <a href="#" className="hover:text-white transition">客戶案例</a>
          <a href="#" className="hover:text-white transition">方案計價</a>
        </div>
        <Link href="/dashboard" className="bg-white text-slate-900 px-6 py-2.5 rounded-full font-bold hover:bg-indigo-50 transition shadow-[0_0_15px_rgba(255,255,255,0.3)] flex items-center">
          登入後台 <ArrowRight size={16} className="ml-2" />
        </Link>
      </nav>

      <div className="relative pt-20 pb-32 flex flex-col items-center justify-center text-center px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-cyan-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-semibold backdrop-blur-sm">
          🚀 X-Islands 旗下最新力作
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
          讓 AI 成為您的 <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
            24H 金牌客服管家
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
          專為民宿與地方業者打造的 LINE 智能回覆系統。<br />
          零程式碼基礎、三分鐘建立專屬知識庫，從此告別半夜回覆訊息的疲勞。
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/dashboard" className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/30 transition transform hover:-translate-y-1">
            免費體驗 X-Bot
          </Link>
          <button className="px-8 py-4 rounded-full font-bold text-lg border border-slate-700 hover:bg-slate-800 transition text-slate-300">
            預約專人展示
          </button>
        </div>
      </div>
    </div>
  );
}