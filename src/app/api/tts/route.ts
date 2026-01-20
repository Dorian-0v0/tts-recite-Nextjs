// app/api/tts/route.ts
import { NextRequest, NextResponse } from 'next/server';

const DASHSCOPE_API_URL = 'https://dashscope.aliyuncs.com/api/v1';
const API_KEY = process.env.DASHSCOPE_API_KEY;

export async function POST(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: 'Missing DASHSCOPE_API_KEY' }, { status: 500 });
  }

  try {
    const { text, voice = 'Cherry', model = 'qwen3-tts-flash', language_type = 'Chinese' } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing "text"' }, { status: 400 });
    }

    // ✅ 关键修复：使用 task 包裹参数
    const payload = {
      model,
      input: {
        text,
        voice,
        language_type,
      },
    };

    const response = await fetch(`${DASHSCOPE_API_URL}/services/aigc/multimodal-generation/generation`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    console.log("response", response);
    

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('DashScope TTS Error:', errorData);
      return NextResponse.json(
        { error: 'TTS service failed', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('TTS API Internal Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}            