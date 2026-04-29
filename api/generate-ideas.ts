import type { VercelRequest, VercelResponse } from '@vercel/node';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;
  if (!data) {
    return res.status(400).json({ error: 'Missing request body' });
  }

  // Choose the model based on aiMode
  // Default to OpenAI GPT-4o-mini if "Cơ bản", otherwise use gpt-4o or deepseek
  const isAdvanced = data.aiMode === 'Nâng cao';
  const apiKey = isAdvanced && DEEPSEEK_API_KEY ? DEEPSEEK_API_KEY : OPENAI_API_KEY;
  const baseUrl = isAdvanced && DEEPSEEK_API_KEY ? 'https://api.deepseek.com/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions';
  const model = isAdvanced && DEEPSEEK_API_KEY ? 'deepseek-chat' : (isAdvanced ? 'gpt-4o' : 'gpt-4o-mini');

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing API Key in server environment variables' });
  }

  const prompt = `
Hãy đóng vai một chuyên gia cố vấn xuất sắc của Cuộc thi Khoa học Kỹ thuật (KHKT) dành cho học sinh trung học tại Việt Nam.
Dựa vào các thông tin sau, hãy tạo ra ĐÚNG 20 ý tưởng nghiên cứu khoa học/kỹ thuật phù hợp, khả thi và sáng tạo nhất:

- Cấp học: ${data.level} (Lớp: ${data.grade})
- Mục tiêu dự thi: ${data.target}
- Bối cảnh thực tế: ${data.context}
- Vấn đề cần giải quyết: ${data.problem}
- Nguồn lực sẵn có: ${data.resources}
- Giới hạn công nghệ: ${data.techLimit}
- Lợi thế/Điểm riêng: ${data.uniquePoint || 'Không có'}
- Lĩnh vực mong muốn: ${data.fields.join(', ')}
- Ý tưởng CẦN TRÁNH: ${data.avoidIdeas || 'Không có'}
- Yêu cầu đặc biệt: ${data.specialRequest || 'Không có'}

YÊU CẦU QUAN TRỌNG:
1. Tạo ĐÚNG 20 ý tưởng. Không thiếu, không thừa.
2. KHÔNG tạo các ý tưởng viễn vông, phi thực tế hoặc vượt quá xa khả năng học sinh.
3. KHÔNG tạo các đề tài chung chung (ví dụ: thùng rác thông minh đếm điểm, app nhắc học bài). Phải có ĐIỂM MỚI và cụ thể gắn với bối cảnh đã cho.
4. KHÔNG trùng lặp. Mỗi ý tưởng phải khác biệt rõ rệt về cơ chế hoặc góc tiếp cận.
5. Cung cấp kết quả dưới dạng JSON theo đúng schema sau, không kèm bất kỳ markdown hoặc text nào bên ngoài:

{
  "ideas": [
    {
      "id": "KHKT-001",
      "title": "Tên ý tưởng",
      "mainField": "Lĩnh vực chính (chọn 1 trong 22 lĩnh vực chuẩn)",
      "subFields": ["Lĩnh vực phụ 1", "Lĩnh vực phụ 2"],
      "problem": "Vấn đề cụ thể giải quyết",
      "shortDescription": "Mô tả ngắn gọn (2-3 câu)",
      "novelty": "Điểm mới/sáng tạo nổi bật",
      "mechanism": "Cơ chế hoạt động / Phương pháp",
      "targetUsers": "Đối tượng áp dụng",
      "requiredResources": ["Vật liệu 1", "Công cụ 2"],
      "difficulty": "Dễ/Trung bình/Khó",
      "educationLevelFit": "Rất phù hợp/Phù hợp",
      "prototypeOrExperiment": "Mô tả ngắn cách làm mô hình/thí nghiệm kiểm chứng",
      "measurementMethod": "Cách đo lường hiệu quả",
      "risksAndLimits": "Rủi ro chính",
      "futurePotential": "Tiềm năng phát triển",
      "scores": {
        "novelty": 85,
        "creativity": 80,
        "feasibility": 90,
        "realWorldImpact": 85,
        "sustainability": 80,
        "presentationPotential": 85,
        "total": 84
      }
    }
  ],
  "top3": [
    {
      "rank": 1,
      "ideaId": "KHKT-001",
      "reason": "Lý do chọn",
      "strongestPoint": "Điểm mạnh",
      "riskToImprove": "Điểm cần cải thiện"
    }
  ]
}
`;

  try {
    const aiResponse = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: 'You are a helpful assistant that always returns perfectly formatted JSON matching the requested schema.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`AI API Error: ${aiResponse.status} ${errorText}`);
    }

    const aiData = await aiResponse.json();
    let content = aiData.choices[0].message.content;
    
    // Parse JSON
    const result = JSON.parse(content);
    res.status(200).json(result);

  } catch (error: any) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message || 'Lỗi khi gọi AI API' });
  }
}
