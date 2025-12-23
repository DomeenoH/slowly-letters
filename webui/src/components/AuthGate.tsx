import React, { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, Mail, Feather } from 'lucide-react';

// 密码从环境变量读取，构建时注入
// 在 .env 文件中设置 VITE_AUTH_PASSWORD=你的密码
const ACCESS_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD || 'slowly2024';

// localStorage key
const AUTH_KEY = 'slowly_auth_token';

// 简单的 hash 函数（用于存储验证状态，不是真正的加密）
const simpleHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
};

const TOKEN = simpleHash(ACCESS_PASSWORD + 'slowly_salt');

interface AuthGateProps {
    children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 检查登录状态
    useEffect(() => {
        const storedToken = localStorage.getItem(AUTH_KEY);
        setIsAuthenticated(storedToken === TOKEN);
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // 模拟网络延迟，增加仪式感
        await new Promise(resolve => setTimeout(resolve, 800));

        if (password === ACCESS_PASSWORD) {
            localStorage.setItem(AUTH_KEY, TOKEN);
            setIsAuthenticated(true);
        } else {
            setError('密码错误，请重试');
            setPassword('');
        }
        setIsLoading(false);
    };

    // 加载状态
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-paper flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                    <Feather className="w-8 h-8 text-stone-400" />
                </motion.div>
            </div>
        );
    }

    // 已登录，显示主内容
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // 登录页面
    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50/30 to-stone-100 flex items-center justify-center p-4">
            {/* 背景装饰 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-stone-200/30 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative w-full max-w-md"
            >
                {/* 信封装饰顶部 */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-gradient-to-b from-amber-100 to-amber-50 rounded-t-lg shadow-sm" />

                {/* 主卡片 */}
                <div className="relative bg-paper rounded-2xl shadow-2xl shadow-stone-200/50 border border-stone-200/50 overflow-hidden">
                    {/* 纸张纹理 */}
                    <div
                        className="absolute inset-0 opacity-30 pointer-events-none"
                        style={{
                            backgroundImage: `url('https://www.transparenttextures.com/patterns/handmade-paper.png')`
                        }}
                    />

                    <div className="relative p-8 sm:p-10">
                        {/* Logo 区域 */}
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-stone-100 rounded-2xl shadow-inner mb-4"
                            >
                                <Mail className="w-8 h-8 text-amber-700" />
                            </motion.div>

                            <h1 className="text-2xl font-serif text-stone-800 mb-2">
                                Slowly Letters
                            </h1>
                            <p className="text-stone-500 text-sm">
                                请输入密码以查看你的信件档案
                            </p>
                        </div>

                        {/* 登录表单 */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-stone-600"
                                >
                                    访问密码
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Lock className="w-4 h-4 text-stone-400" />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-12 py-3 bg-white/80 border border-stone-200 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all duration-200"
                                        autoFocus
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* 错误提示 */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-red-500 text-sm text-center bg-red-50 py-2 px-4 rounded-lg"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* 提交按钮 */}
                            <motion.button
                                type="submit"
                                disabled={isLoading || !password}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium rounded-xl shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        >
                                            <Feather className="w-4 h-4" />
                                        </motion.div>
                                        <span>验证中...</span>
                                    </>
                                ) : (
                                    <>
                                        <Feather className="w-4 h-4" />
                                        <span>进入档案</span>
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* 底部装饰 */}
                        <div className="mt-8 pt-6 border-t border-stone-200/50 text-center">
                            <p className="text-xs text-stone-400">
                                🔒 你的信件数据安全存储在本地
                            </p>
                        </div>
                    </div>
                </div>

                {/* 邮戳装饰 */}
                <motion.div
                    initial={{ opacity: 0, rotate: -15 }}
                    animate={{ opacity: 0.15, rotate: -12 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="absolute -right-4 -top-4 w-24 h-24 border-4 border-dashed border-stone-400 rounded-full flex items-center justify-center"
                >
                    <span className="text-stone-400 text-xs font-mono text-center leading-tight">
                        PRIVATE<br />ACCESS
                    </span>
                </motion.div>
            </motion.div>
        </div>
    );
}

// 导出登出函数，可在其他地方调用
export const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    window.location.reload();
};
