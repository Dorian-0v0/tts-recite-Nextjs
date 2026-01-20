// app/api/chat/stream/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    // 这里使用 OpenAI 兼容的流式 API
    const API_KEY = process.env.OPENAI_API_KEY;
    const API_URL = 'https://api.openai.com/v1/chat/completions';
    
    // 或者使用其他支持流式的 LLM API
    // 这里以 OpenAI 为例
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // 或其他模型
        messages: messages,
        stream: true,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    console.log("response", response);
    

    // 创建可读流
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        
        try {
          while (true) {
            const { done, value } = await reader!.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim() !== '');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  // 发送 TTS 标记，表示可以开始 TTS
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'tts_ready', text: '' })}\n\n`));
                  controller.close();
                  break;
                }
                
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices[0]?.delta?.content || '';
                  
                  if (content) {
                    // 发送文本流
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ type: 'text', content })}\n\n`)
                    );
                  }
                } catch (e) {
                  console.error('Error parsing JSON:', e);
                }
              }
            }
          }
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Stream error:', error);
    return NextResponse.json({ error: 'Stream failed' }, { status: 500 });
  }
}