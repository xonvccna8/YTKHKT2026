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
        <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Chưa có lịch sử tạo ý tưởng</h2>
        <p className="text-gray-500">Hãy quay lại trang chủ và bắt đầu tạo những ý tưởng đầu tiên.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <History className="w-6 h-6 text-blue-500" />
            Lịch Sử Tạo Ý Tưởng
          </h2>
          <p className="text-gray-600">Xem lại các lần tạo ý tưởng trước đây của bạn.</p>
        </div>
        <Button variant="danger" onClick={handleClear} className="gap-2">
          <Trash2 className="w-4 h-4" /> Xóa tất cả
        </Button>
      </div>

      <div className="space-y-4">
        {history.map((record) => (
          <Card key={record.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <div>
                <CardTitle className="text-lg">
                  Lần tạo: {new Date(record.createdAt).toLocaleString('vi-VN')}
                </CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{record.aiMode}</Badge>
                  <Badge variant="secondary">{record.modelUsed}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  Xem lại <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(record.id)} className="text-red-500 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-700">
                <span className="font-semibold">Vấn đề:</span> {record.inputData?.problem || 'Không có'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
