import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Star, ArrowLeft, Download, Search, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Idea, GenerateResult } from '@/types';
import { isFavorite, saveFavorite, removeFavorite } from '@/lib/storage';
import { exportToWord } from '@/lib/docx-export';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;
  const result = location.state?.result as GenerateResult;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [favStatus, setFavStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (result?.ideas) {
      const initialFavs: Record<string, boolean> = {};
      result.ideas.forEach(idea => {
        initialFavs[idea.id] = isFavorite(idea.id);
      });
      setFavStatus(initialFavs);
    }
  }, [result]);

  const toggleFavorite = (idea: Idea) => {
    if (favStatus[idea.id]) {
      removeFavorite(idea.id);
      setFavStatus(prev => ({ ...prev, [idea.id]: false }));
    } else {
      saveFavorite(idea);
      setFavStatus(prev => ({ ...prev, [idea.id]: true }));
    }
  };

  const top3 = result?.top3 || [];
  
  const filteredIdeas = result?.ideas?.filter(idea => 
    idea.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    idea.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (!formData) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Không tìm thấy dữ liệu ý tưởng.</p>
        <Button onClick={() => navigate('/')}>Quay lại trang tạo</Button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="mb-2 -ml-3 text-slate-400 hover:text-teal-300">
            <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại tạo mới
          </Button>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">Kết Quả Sinh Ý Tưởng</h2>
          <p className="text-teal-100/70 mt-1">Dưới đây là 20 ý tưởng đã được AI chọn lọc và tối ưu cho bối cảnh của bạn.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => exportToWord(result, formData)}>
            <Download className="w-4 h-4" /> Xuất File Word
          </Button>
        </div>
      </div>

      {/* Top 3 Champion */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 blur-2xl rounded-full opacity-50" />
        <h3 className="text-xl font-bold text-amber-300 mb-4 flex items-center gap-2 relative z-10">
          <Trophy className="w-6 h-6 text-amber-400" />
          Top 3 Champion
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {top3.map((champion, idx) => {
            const idea = result.ideas.find(i => i.id === champion.ideaId);
            if (!idea) return null;
            return (
              <Card key={idx} className={`relative overflow-hidden ${idx === 0 ? 'border-amber-400/50 shadow-[0_0_30px_rgba(251,191,36,0.2)] bg-slate-900/80' : idx === 1 ? 'border-slate-300/50 bg-slate-900/80' : 'border-amber-700/50 bg-slate-900/80'}`}>
                <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full flex items-start justify-end p-2 opacity-20 ${idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-slate-300' : 'bg-amber-700'}`}>
                  <span className="text-white font-bold text-lg mr-2 mt-1">#{champion.rank}</span>
                </div>
                <CardHeader className="pt-6">
                  <Badge className="w-fit mb-2" variant={idx === 0 ? 'warning' : 'secondary'}>{idea.mainField}</Badge>
                  <CardTitle className="text-lg pr-8 line-clamp-2 text-slate-100" title={idea.title}>{idea.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="bg-teal-950/30 p-3 rounded-lg border border-teal-500/20">
                    <span className="font-semibold text-teal-300">Điểm mạnh nhất:</span>
                    <p className="text-teal-100/80">{champion.strongestPoint}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-emerald-400">Lý do chọn:</span>
                    <p className="text-slate-300 mt-1">{champion.reason}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <hr className="border-teal-500/20" />

      {/* List 20 Ideas */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-cyan-300 flex items-center gap-2">
            <Star className="w-5 h-5 text-cyan-400" />
            Danh sách 20 Ý Tưởng
          </h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-teal-500/50" />
            <Input
              placeholder="Tìm kiếm ý tưởng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-sm bg-slate-900/50 border-teal-500/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeas.map((idea) => (
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleFavorite(idea)}
                  className={`w-8 h-8 p-0 hover:bg-rose-500/10 ${favStatus[idea.id] ? 'text-rose-400' : 'text-slate-500 hover:text-rose-400'}`}
                >
                  <Heart className={`w-4 h-4 ${favStatus[idea.id] ? 'fill-rose-400' : ''}`} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
