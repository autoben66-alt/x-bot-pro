import { NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// 🌟 強制標記為動態路由，防止 Vercel 在 Build Time 嘗試靜態編譯此 API
export const dynamic = 'force-dynamic';

// 封裝 Firebase 初始化，避免在全域執行導致 projectId 缺失錯誤
function initFirebase() {
  const configStr = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
  if (!configStr) {
    console.error("Missing NEXT_PUBLIC_FIREBASE_CONFIG environment variable.");
    return null;
  }
  const firebaseConfig = JSON.parse(configStr);
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
}

async function askGemini(prompt: string, knowledge: any) {
  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const systemInstruction = `
    你是 ${knowledge.shopName} 的 AI 客服管家。
    請根據以下資訊回答，語氣要 ${knowledge.tone === 'enthusiastic' ? '親切且帶有 Emoji' : '專業有禮貌'}。
    入住：${knowledge.checkIn}，退房：${knowledge.checkOut}。
    WiFi：${knowledge.wifiSsid} / 密碼：${knowledge.wifiPass}。
    常見問題集：${JSON.stringify(knowledge.qaList)}
    規則：${knowledge.customRules}
    如果不知道答案，請說「管家會盡快聯繫您」。
  `;

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] }
      })
    });
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "系統忙碌中。";
  } catch (e) { return "暫時無法回覆。"; }
}

export async function POST(req: Request) {
  try {
    const app = initFirebase();
    if (!app) return NextResponse.json({ error: 'Config missing' }, { status: 500 });
    
    const db = getFirestore(app);
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const body = await req.json();

    if (!userId || !body.events) return NextResponse.json({ ok: true });

    const appId = process.env.NEXT_PUBLIC_APP_ID || 'x-bot-pro-app';
    const configSnap = await getDoc(doc(db, 'artifacts', appId, 'users', userId, 'settings', 'config'));
    const knowledge = configSnap.data();

    if (!knowledge || !knowledge.isActive) return NextResponse.json({ ok: true });

    for (const event of body.events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const aiReply = await askGemini(event.message.text, knowledge);
        await fetch('https://api.line.me/v2/bot/message/reply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${knowledge.lineToken}`
          },
          body: JSON.stringify({
            replyToken: event.replyToken,
            messages: [{ type: 'text', text: aiReply }]
          })
        });
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'error' }, { status: 500 });
  }
}