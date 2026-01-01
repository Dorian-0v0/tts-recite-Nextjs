// app/login/page.tsx
'use client';

import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTheme } from 'next-themes';

export default function LoginPage() {
  // 获取当前浏览器的主题颜色
  const { resolvedTheme } = useTheme()
  console.log("resolvedTheme", resolvedTheme);
  

  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 粒子背景 */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: { value: resolvedTheme == "light" ? '#f5f5f5' : '#0f172a' }, // slate-900 背景色，更暗更专业
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: { enable: true, mode: 'push' },
              onHover: { enable: true, mode: 'repulse' },
              resize: true,
            },
            modes: {
              push: { quantity: 4 },
              repulse: { distance: 140, duration: 0.4 },
            },
          },
          particles: {
            color: { value: '#1ab0f1ff' }, // sky-400，清新科技感
            links: {
              color: resolvedTheme == "light" ? "#043a92ff" : "#a5a6a8ff", // slate-300
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: { default: 'bounce' },
              random: true,
              speed: 1,
              straight: false,
            },
            number: {
              density: { enable: true, area: 800 },
              value: 60, // 减少数量，提升性能
            },
            opacity: { value: 0.6 },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-0"
      />

      {/* 登录表单容器 - 居中且在粒子之上 */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md shadow-xl border-slate-700/30 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">欢迎回来</CardTitle>
            <p className="text-sm">请输入您的账号信息登录</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  邮箱地址
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@example.com"
                  className="border-slate-700 placeholder:text-slate-500 focus-visible:ring-sky-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    密码
                  </label>
                  <Link href="/forgot" className="text-sm text-sky-400 hover:underline">
                    忘记密码？
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="border-slate-700 placeholder:text-slate-500 focus-visible:ring-sky-500"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white"
              >
                登录
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              还没有账号？{' '}
              <Link href="/register" className="text-sky-400 hover:underline font-medium">
                立即注册
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}