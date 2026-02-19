"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bot, LayoutDashboard, Users, Activity, Settings, 
  Search, ShieldAlert, Cpu, HardDrive, BarChart3, 
  CheckCircle2, AlertCircle, Save, ExternalLink, Filter
} from 'lucide-react';

// 模擬業者資料
const initialMerchants = [
  { id: "user_001", name: "灣琉海景 Villa", plan: "X-Pro", usage: 72, messages: 1248, status: "Active" },
  { id: "user_002", name: "青之海民宿", plan: "X-Lite", usage: 15, messages: 320, status: "Active" },
  { id: "user_003", name: "星空露營區", plan: "X-Biz", usage: 88, messages: 5400, status: "Warning" },
  { id: "user_004", name: "琉球潛水館", plan: "X-Pro", usage: 45, messages: 890, status: "Active" },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('merchants'); // 'overview', 'merchants', 'resources'
  const [merchants, setMerchants] = useState(initialMerchants);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // 控管業者方案權限
  const handlePlanChange = (merchantId: string, newPlan: string) => {
    setMerchants(prev => prev.map(m => m.id === merchantId ? { ...m, plan: newPlan } : m));
  };

  const filteredMerchants = merchants.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-800">
      
      {/* 管理員側邊欄 */}
      <aside className="w-64 bg-[#0f172a] text-white flex-shrink-0 flex flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <ShieldAlert size={28} className="text-red-500" />
            <h1 className="text-xl font-black tracking-tight">X-Bot ADMIN</h1>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest font-bold">總後台管理系統</p>
        </div>
        
        <nav className="flex-1 mt-6 px-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <LayoutDashboard size={18} /><span>系統總覽</span>
          </button>
          <button onClick={() => setActiveTab('merchants')} className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'merchants' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Users size={18} /><span>業者方案控管</span>
          </button>
          <button onClick={() => setActiveTab('resources')} className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'resources' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Activity size={18} /><span>資源消耗監控</span>
          </button>
        </nav>

        <div className="p-6 mt-auto">
          <Link href="/dashboard" className="flex items-center justify-center space-x-2 text-xs text-slate-500 hover:text-white transition">
            <ExternalLink size={14} /><span>切換至業者視角</span>
          </Link>
        </div>
      </aside>

      {/* 管理員主內容 */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* 分頁：系統總覽 */}
          {activeTab === 'overview' && (
            <div className="animate-in fade-in duration-500 space-y-8">
              <h2 className="text-3xl font-bold text-slate-800 flex items-center">系統健康狀態</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: "總業者數", val: "156", color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "當日訊息流", val: "24,800", color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "當月 Token 消耗", val: "8.4M", color: "text-indigo-600", bg: "bg-indigo-50" },
                  { label: "API 平均延遲", val: "420ms", color: "text-orange-600", bg: "bg-orange-50" },
                ].map((s, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                    <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.val}</p>
                  </div>
                ))}
              </div>
              <div className="h-64 bg-white rounded-3xl border border-slate-200 flex items-center justify-center text-slate-400 italic">
                [ 全球請求分佈圖表預留區 ]
              </div>
            </div>
          )}

          {/* 分頁：業者方案控管 (核心功能) */}
          {activeTab === 'merchants' && (
            <div className="animate-in fade-in duration-500 space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <h2 className="text-3xl font-bold text-slate-800">業者方案控管</h2>
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" placeholder="搜尋業者名稱或 ID..." 
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl w-full md:w-80 outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-[10px]">業者資訊</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-[10px]">當前方案</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-[10px]">訊息消耗 (月)</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-[10px]">狀態</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-[10px] text-right">權限調整</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMerchants.map((merchant) => (
                      <tr key={merchant.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{merchant.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{merchant.id}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider ${
                            merchant.plan === 'X-Biz' ? 'bg-red-50 text-red-600' : 
                            merchant.plan === 'X-Pro' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {merchant.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                             <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-indigo-500 h-full" style={{ width: `${merchant.usage}%` }}></div>
                             </div>
                             <span className="text-xs font-bold text-slate-600">{merchant.messages}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs">
                          {merchant.status === 'Active' ? 
                            <span className="text-emerald-600 flex items-center"><CheckCircle2 size={12} className="mr-1"/> 正常</span> : 
                            <span className="text-amber-600 flex items-center"><AlertCircle size={12} className="mr-1"/> 負載過高</span>
                          }
                        </td>
                        <td className="px-6 py-4 text-right">
                          <select 
                            value={merchant.plan}
                            onChange={(e) => handlePlanChange(merchant.id, e.target.value)}
                            className="text-xs font-bold border border-slate-200 rounded-lg p-1.5 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="X-Lite">X-Lite (基礎)</option>
                            <option value="X-Pro">X-Pro (專業)</option>
                            <option value="X-Biz">X-Biz (旗艦)</option>
                            <option value="Blocked">⚠️ 停權暫停</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end pt-4">
                 <button className="bg-[#0f172a] text-white px-8 py-3 rounded-2xl font-black text-sm flex items-center shadow-xl hover:bg-slate-800 active:scale-95 transition">
                   <Save size={18} className="mr-2" /> 儲存權限異動
                 </button>
              </div>
            </div>
          )}

          {/* 分頁：資源消耗監控 (原業者後台遷移過來) */}
          {activeTab === 'resources' && (
            <div className="animate-in fade-in duration-500 space-y-10">
              <div className="flex justify-between items-center">
                 <h2 className="text-3xl font-bold text-slate-800 flex items-center"><Activity className="mr-3 text-indigo-600" />系統資源負載監控</h2>
                 <div className="flex items-center space-x-2 text-xs font-bold bg-white px-4 py-2 rounded-full border border-slate-200">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span>所有 API 通道連線中</span>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* 全局 API 用量 */}
                 <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                       <h3 className="font-bold text-lg flex items-center"><Cpu size={20} className="mr-2 text-red-500" /> 全平台 Gemini Token 消耗</h3>
                       <span className="text-indigo-600 font-black tracking-tighter">4.2M / 10M</span>
                    </div>
                    <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden border border-slate-200 shadow-inner p-1">
                       <div className="bg-gradient-to-r from-red-500 to-indigo-600 h-full rounded-full transition-all" style={{ width: `42%` }}></div>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      本月總算力支出預估：<span className="font-bold text-slate-800">$128.50 USD</span>。<br/>
                      目前全平台業者平均解決率維持在 92%，負載穩定。
                    </p>
                 </div>

                 {/* 全局儲存空間 */}
                 <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                       <h3 className="font-bold text-lg flex items-center"><HardDrive size={20} className="mr-2 text-emerald-500" /> Firestore 寫入與存儲</h3>
                       <span className="text-emerald-600 font-black tracking-tighter">1.5 GB / 5 GB</span>
                    </div>
                    <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden border border-slate-200 shadow-inner p-1">
                       <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `30%` }}></div>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      包含知識庫 PDF 與 Q&A 資料。儲存成本極低，<br/>
                      可考慮開放 X-Biz 業者上傳更大體積的教學影片。
                    </p>
                 </div>
              </div>

              <div className="p-8 bg-red-50 border border-red-100 rounded-[2.5rem] flex items-start space-x-4">
                 <ShieldAlert className="text-red-600 shrink-0 mt-1" />
                 <div className="space-y-2">
                    <p className="text-red-900 font-black">管理員成本警示說明</p>
                    <p className="text-red-700 text-xs leading-relaxed font-medium">
                      當「全平台 Token 消耗」超過 8M 時，建議調整 X-Lite (免費版) 的回覆限制。
                      <br/>* 此區域僅供管理員查看，用於動態調整各方案的硬體與 AI 算力配額，確保營運毛利。
                    </p>
                 </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}