import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lightbulb, KeyRound } from 'lucide-react';
import { login } from '@/lib/storage';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function LoginPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(code)) {
      navigate('/');
    } else {
      setError('Mã truy cập không hợp lệ. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob" />
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-4000" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="glass-panel border-teal-500/30">
          <CardHeader className="space-y-3 pb-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(20,184,166,0.5)] relative"
            >
              <Lightbulb className="w-8 h-8 text-white relative z-10" />
              <div className="absolute inset-0 bg-white/20 blur-md rounded-2xl"></div>
            </motion.div>
            <CardTitle className="text-2xl font-bold text-slate-100">KHKT Idea Champion</CardTitle>
            <p className="text-teal-200/70 text-sm">Trợ lý AI tạo ý tưởng nghiên cứu khoa học kỹ thuật cho học sinh trung học</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-teal-500/50" />
                  <Input
                    type="password"
                    placeholder="Nhập mã truy cập..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="pl-10 h-11"
                    required
                  />
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-sm text-red-500 text-center"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
              <Button type="submit" className="w-full h-11 text-base shadow-md">
                Vào hệ thống
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
