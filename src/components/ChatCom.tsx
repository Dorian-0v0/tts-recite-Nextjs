'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { SendIcon } from 'lucide-react'
import { ScrollArea } from '@radix-ui/react-scroll-area'

export default function ChatCom() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ id: string; role: "user" | "assistant"; content: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // 用于管理 audio 播放实例（避免多个同时播放）
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    // 新增：调用 TTS 并播放
    const speakText = async (text: string) => {
        try {
            const res = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    voice: 'Cherry',
                    model: 'qwen3-tts-flash',
                    language_type: 'Chinese',
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                console.error('TTS API error:', err);
                return;
            }

            const data = await res.json();
            const audioUrl = data.output?.audio?.url;

            if (!audioUrl) {
                console.error('No audio URL in response:', data);
                return;
            }

            // 创建或复用 audio 元素
            if (audioRef.current) {
                audioRef.current.src = audioUrl;
            } else {
                audioRef.current = new Audio(audioUrl);
            }

            // 播放音频
            try {
                await audioRef.current.play();
            } catch (playErr) {
                console.warn('Audio play failed (likely autoplay blocked):', playErr);
                // 可选：提示用户点击播放
            }
        } catch (err) {
            console.error('TTS playback error:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { id: Date.now().toString(), role: 'user' as const, content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // 🔄 替换为你的实际 LLM API 调用
            const llmRes = await fetch('/api/tts', { // 假设你有 /api/llm 接口
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: input }),
            });

            const llmData = await llmRes.json();
            const aiReply = llmData.reply || `你问了：“${input}”`;

            const aiMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant' as const,
                content: aiReply
            };
            setMessages((prev) => [...prev, aiMessage]);

            // 🔊 关键：AI 回复后立即 TTS 播放
            speakText(aiReply);

        } catch (err) {
            console.error(err);
            const errorMsg = {
                id: (Date.now() + 1).toString(),
                role: 'assistant' as const,
                content: '抱歉，我暂时无法回答。'
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    // 自动滚动到底部
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    // 清理 audio URL
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                URL.revokeObjectURL(audioRef.current.src);
            }
        };
    }, []);

    return (
        <div className="flex flex-col h-screen max-w-4xl mx-auto w-full p-4">
            <ScrollArea
                ref={scrollAreaRef}
                className="flex-1 pr-4 overflow-y-auto"
            >
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        开始对话吧！
                    </div>
                ) : (
                    messages.map((m) => (
                        <div
                            key={m.id}
                            className={`mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}
                        >
                            <div
                                className={`inline-block p-3 rounded-lg max-w-[80%] ${m.role === 'user'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-800'
                                    }`}
                            >
                                {m.content}
                            </div>
                        </div>
                    ))
                )}
            </ScrollArea>

            <form onSubmit={handleSubmit} className="flex gap-2 mt-2 w-full">
                <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="输入你的问题..."
                    className="w-full"
                    disabled={isLoading}
                />
                <Button type="submit" disabled={!input.trim() || isLoading}>
                    <SendIcon className="w-4 h-4" />
                </Button>
            </form>
        </div>
    );
} 