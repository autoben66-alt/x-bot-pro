import { NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// 1. 初始化 Firebase (後端版本)
const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG || '{}');
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// 2. Gemini API 呼叫函數
async function askGemini(prompt: string, knowledge: any) {
  const apiKey = process.env.GEMINI_API_KEY; // 請在 Vercel 設定此環境變數
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  // 構造 RAG System Prompt
  const systemInstruction = `
    你是 ${knowledge.shopName} 的 AI 客服管家。
    請根據以下資訊回答客人，語氣要 ${knowledge.tone === 'enthusiastic' ? '親切且帶有 Emoji' : '專業且有禮貌'}。
    
    【民宿資訊】
    - 入住時間：${knowledge.checkIn}
    - 退房時間：${knowledge.checkOut}
    - WiFi 名稱：${knowledge.wifiSsid}
    - WiFi 密碼：${knowledge.wifiPass}
    
    【常見問題庫】
    ${knowledge.qaList?.map((qa: any) => `問：${qa.q} 答：${qa.a}`).join('\n')}
    
    【特殊指令】
    ${knowledge.customRules}
    
    【注意事項】
    1. 如果資訊中沒有答案，請委婉告知並說「管家會盡快聯繫您」。
    2. 嚴禁編造房價或不存在的服務。
  `;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] }
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text || "抱歉，我現在有點頭暈，請稍後再問我。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "系統忙碌中，請聯繫真人管家。";
  }
}

// 3. Webhook 主要處理邏輯
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const events = body.events;

    // 從 URL 參數中獲取 userId 以識別是哪家民宿
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId || !events || events.length === 0) {
      return NextResponse.json({ status: 'no_events' });
    }

    // 讀取該民宿在 Firestore 的最新知識庫
    const appId = process.env.NEXT_PUBLIC_APP_ID || 'default';
    const configDocRef = doc(db, 'artifacts', appId, 'users', userId, 'settings', 'config');
    const configSnap = await getDoc(configDocRef);
    const knowledge = configSnap.exists() ? configSnap.data() : null;

    if (!knowledge || !knowledge.isActive) {
      return NextResponse.json({ status: 'ai_disabled' });
    }

    // 處理每一則訊息
    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const userMessage = event.message.text;
        const replyToken = event.replyToken;

        // 呼叫 Gemini 產生回答
        const aiReply = await askGemini(userMessage, knowledge);

        // 回傳訊息給 LINE (需使用業者的 lineToken)
        await fetch('https://api.line.me/v2/bot/message/reply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${knowledge.lineToken}`
          },
          body: JSON.stringify({
            replyToken: replyToken,
            messages: [{ type: 'text', text: aiReply }]
          })
        });
      }
    }

    return NextResponse.json({ message: 'OK' });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}