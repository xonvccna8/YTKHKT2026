import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, Trash2, ArrowRight } from 'lucide-react';
import { getHistory, clearHistory, removeHistory } from '@/lib/storage';
import { HistoryRecord } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClear = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử?')) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleDelete = (id: string) => {
    removeHistory(id);
    setHistory(getHistory());
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-slate-900/50 border border-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(20,184,166,0.1)]">
          <History className="w-10 h-10 text-teal-400/50" />
        </div>
        <h2 className="text-2xl font-bold text-slate-200 mb-2">Chưa có lịch sử tạo ý tưởng</h2>
        <p className="text-teal-200/50 max-w-md mx-auto">Hãy quay lại trang chủ và bắt đầu tạo những ý tưởng đầu tiên của bạn.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent flex items-center gap-2">
            <History className="w-8 h-8 text-teal-400" />
            Lịch Sử Tạo Ý Tưởng
          </h2>
          <p className="text-teal-100/70 mt-1">Xem lại các lần tạo ý tưởng trước đây của bạn.</p>
        </div>
        <Button variant="danger" onClick={handleClear} className="gap-2 bg-rose-500/20 border-rose-500/30 text-rose-300 hover:bg-rose-500 hover:text-white">
          <Trash2 className="w-4 h-4" /> Xóa tất cả
        </Button>
      </div>

      <div className="space-y-4">
        {history.map((record) => (
          <Card key={record.id} className="hover:shadow-[0_0_20px_rgba(20,184,166,0.15)] transition-shadow border-teal-500/20 bg-slate-900/40 backdrop-blur-md">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <div>
                <CardTitle className="text-lg text-slate-200">
                  Lần tạo: {new Date(record.createdAt).toLocaleString('vi-VN')}
                </CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="border-teal-500/30 text-teal-300">{record.aiMode}</Badge>
                  <Badge variant="secondary" className="bg-slate-800 text-slate-300">{record.modelUsed}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1 border-teal-500/30 text-teal-300 hover:bg-teal-500/10 hover:text-teal-200">
                  Xem lại <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(record.id)} className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-teal-950/30 border border-teal-500/10 rounded-lg p-3 text-sm text-slate-300">
                <span className="font-semibold text-teal-400/70">Vấn đề:</span> {record.inputData?.problem || 'Không có'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
