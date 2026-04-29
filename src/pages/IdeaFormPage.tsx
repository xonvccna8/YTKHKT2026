import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lightbulb, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';

import { generateIdeas } from '@/lib/api';
import { saveHistory } from '@/lib/storage';

const FIELDS = [
  "Khoa học động vật", "Khoa học xã hội và hành vi", "Hóa sinh", "Y sinh và khoa học sức khỏe",
  "Kỹ thuật y sinh", "Sinh học tế bào và phân tử", "Hóa học", "Sinh học trên máy tính và Sinh - Tin",
  "Khoa học Trái đất và Môi trường", "Hệ thống nhúng", "Năng lượng: Hóa học", "Năng lượng: Vật lí",
  "Kỹ thuật cơ khí", "Kĩ thuật môi trường", "Khoa học vật liệu", "Toán học", "Vi sinh",
  "Vật lí và Thiên văn", "Khoa học thực vật", "Rô bốt và máy thông minh", "Phần mềm hệ thống", "Y học chuyển dịch"
];

export default function IdeaFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    level: 'THPT',
    grade: '',
    target: 'Cấp tỉnh',
    fields: [] as string[],
    techLimit: 'Cơ bản',
    resources: '',
    context: '',
    problem: '',
    uniquePoint: '',
    avoidIdeas: '',
    specialRequest: '',
    aiMode: 'Cơ bản'
  });

  const handleFieldToggle = (field: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.includes(field) 
        ? prev.fields.filter(f => f !== field)
        : [...prev.fields, field]
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fields.length === 0) {
      alert("Vui lòng chọn ít nhất 1 lĩnh vực!");
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const result = await generateIdeas(formData);
      
      // Save history
      saveHistory({
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        inputData: formData,
        result: result,
        aiMode: formData.aiMode,
        modelUsed: formData.aiMode === 'Nâng cao' ? 'GPT-5.4/DeepSeek' : 'GPT-5.4-mini'
      });

      navigate('/result', { state: { formData, result } });
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tạo ý tưởng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          Khởi Tạo Ý Tưởng Mới
        </h2>
        <p className="text-gray-600 mt-1">Cung cấp thông tin chi tiết để AI tạo ra các ý tưởng phù hợp nhất với nguồn lực và mục tiêu của bạn.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản & Bối cảnh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="level">Cấp học</Label>
                    <select id="level" name="level" value={formData.level} onChange={handleChange} className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                      <option value="Tiểu học">Tiểu học</option>
                      <option value="THCS">THCS</option>
                      <option value="THPT">THPT</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade">Lớp (Cụ thể)</Label>
                    <Input id="grade" name="grade" placeholder="VD: 11A1" value={formData.grade} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target">Mục tiêu dự thi</Label>
                    <select id="target" name="target" value={formData.target} onChange={handleChange} className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                      <option value="Cấp trường">Cấp trường</option>
                      <option value="Cấp huyện">Cấp huyện</option>
                      <option value="Cấp tỉnh">Cấp tỉnh</option>
                      <option value="Cấp quốc gia">Cấp quốc gia</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="context">Bối cảnh thực tế</Label>
                  <Textarea id="context" name="context" placeholder="VD: Trường học ở vùng nông thôn, thường xuyên thiếu điện, có nhiều rác thải nông nghiệp..." value={formData.context} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problem">Vấn đề muốn giải quyết</Label>
                  <Textarea id="problem" name="problem" placeholder="VD: Học sinh khó tập trung trong giờ học, ô nhiễm tiếng ồn, nông sản khó bảo quản..." value={formData.problem} onChange={handleChange} required />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nguồn lực & Yêu cầu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="techLimit">Giới hạn công nghệ</Label>
                    <select id="techLimit" name="techLimit" value={formData.techLimit} onChange={handleChange} className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                      <option value="Cơ bản">Cơ bản (Mô hình vật lý, mạch đơn giản)</option>
                      <option value="Trung bình">Trung bình (Arduino, app cơ bản, dữ liệu nhỏ)</option>
                      <option value="Nâng cao">Nâng cao (AI, IoT, phân tích dữ liệu lớn, sinh học phân tử)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="uniquePoint">Điểm riêng / Lợi thế</Label>
                    <Input id="uniquePoint" name="uniquePoint" placeholder="VD: Trường có phòng Lab tốt, gần biển..." value={formData.uniquePoint} onChange={handleChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resources">Nguồn lực sẵn có</Label>
                  <Textarea id="resources" name="resources" placeholder="VD: Cảm biến nhiệt độ, máy tính cấu hình trung bình, giáo viên hỗ trợ môn Sinh..." value={formData.resources} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avoidIdeas">Ý tưởng không muốn trùng</Label>
                  <Textarea id="avoidIdeas" name="avoidIdeas" placeholder="VD: Không làm thùng rác thông minh, không làm app nhắc học tập..." value={formData.avoidIdeas} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequest">Yêu cầu đặc biệt (Tuỳ chọn)</Label>
                  <Input id="specialRequest" name="specialRequest" placeholder="VD: Phải sử dụng vật liệu tái chế từ nhựa..." value={formData.specialRequest} onChange={handleChange} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lĩnh vực chính</CardTitle>
                <p className="text-xs text-gray-500">Chọn 1 hoặc nhiều lĩnh vực (22 lĩnh vực chuẩn)</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-2 pb-2">
                  {FIELDS.map(field => (
                    <button
                      key={field}
                      type="button"
                      onClick={() => handleFieldToggle(field)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                        formData.fields.includes(field)
                          ? 'bg-blue-100 border-blue-500 text-blue-700 font-medium'
                          : 'bg-white border-gray-300 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {field}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-100 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="text-lg">Cấu hình AI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Chế độ suy luận</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, aiMode: 'Cơ bản' })}
                      className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                        formData.aiMode === 'Cơ bản' ? 'bg-white border-blue-500 text-blue-700 shadow-sm font-medium' : 'bg-transparent border-gray-300 text-gray-600'
                      }`}
                    >
                      Cơ bản (Nhanh)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, aiMode: 'Nâng cao' })}
                      className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                        formData.aiMode === 'Nâng cao' ? 'bg-white border-purple-500 text-purple-700 shadow-sm font-medium' : 'bg-transparent border-gray-300 text-gray-600'
                      }`}
                    >
                      Nâng cao (Sâu)
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.aiMode === 'Cơ bản' ? 'Sử dụng GPT-5.4-mini để tạo nhanh ý tưởng.' : 'Sử dụng mô hình thông minh nhất (GPT-5.4 / DeepSeek V4 Pro) để phân tích chuyên sâu.'}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                {error && (
                  <div className="w-full p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200 mb-2">
                    {error}
                  </div>
                )}
                <Button type="submit" disabled={loading} className="w-full text-base h-12 shadow-md gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang tạo 20 ý tưởng...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="w-5 h-5" />
                      Tạo 20 Ý Tưởng Ngay
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
