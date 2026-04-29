import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { getFavorites, removeFavorite } from '@/lib/storage';
import { Idea } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Idea[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleRemove = (id: string) => {
    removeFavorite(id);
    setFavorites(getFavorites());
  };

  if (favorites.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(244,63,94,0.1)]">
          <Heart className="w-10 h-10 text-rose-400/50" />
        </div>
        <h2 className="text-2xl font-bold text-slate-200 mb-2">Chưa có ý tưởng yêu thích</h2>
        <p className="text-teal-200/50 max-w-md mx-auto">Hãy nhấn biểu tượng trái tim trên ý tưởng ở trang kết quả để lưu lại.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
          Ý Tưởng Yêu Thích
        </h2>
        <p className="text-teal-100/70 mt-1">Danh sách các ý tưởng bạn đã lưu lại để phát triển thêm.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((idea) => (
          <Card key={idea.id} className="hover:shadow-[0_0_20px_rgba(20,184,166,0.15)] transition-shadow flex flex-col border-teal-500/20 bg-slate-900/40 backdrop-blur-md">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-xs border-teal-500/30 text-teal-300">{idea.id}</Badge>
                <div className="flex items-center gap-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  Điểm: {idea.scores?.total || 0}
                </div>
              </div>
              <CardTitle className="text-md leading-tight line-clamp-2 text-slate-200">{idea.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-slate-400 line-clamp-3 mb-2">{idea.shortDescription}</p>
              <div className="text-xs text-slate-500">
                <span className="font-semibold text-teal-400/70">Lĩnh vực:</span> <span className="text-slate-300">{idea.mainField}</span>
              </div>
            </CardContent>
            <div className="p-4 pt-0 mt-auto flex justify-between gap-2 border-t border-teal-500/10 mt-4">
              <Button variant="outline" size="sm" className="w-full text-xs h-8">Chi tiết</Button>
              <Button variant="ghost" size="sm" onClick={() => handleRemove(idea.id)} className="w-8 h-8 p-0 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
