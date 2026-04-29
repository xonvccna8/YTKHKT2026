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
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Chưa có ý tưởng yêu thích</h2>
        <p className="text-gray-500">Hãy nhấn biểu tượng trái tim trên ý tưởng để lưu lại.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          Ý Tưởng Yêu Thích
        </h2>
        <p className="text-gray-600">Danh sách các ý tưởng bạn đã lưu lại để phát triển thêm.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((idea) => (
          <Card key={idea.id} className="hover:shadow-md transition-shadow flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-xs">{idea.id}</Badge>
                <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
                  Điểm: {idea.scores?.total || 0}
                </div>
              </div>
              <CardTitle className="text-md leading-tight line-clamp-2">{idea.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-gray-600 line-clamp-3 mb-2">{idea.shortDescription}</p>
              <div className="text-xs text-gray-500">
                <span className="font-semibold">Lĩnh vực:</span> {idea.mainField}
              </div>
            </CardContent>
            <div className="p-4 pt-0 mt-auto flex justify-between gap-2 border-t border-gray-100 mt-4">
              <Button variant="outline" size="sm" className="w-full text-xs h-8">Chi tiết</Button>
              <Button variant="ghost" size="sm" onClick={() => handleRemove(idea.id)} className="w-8 h-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
