import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle } from 'docx';
import { GenerateResult } from '@/types';

export async function exportToWord(result: GenerateResult, formData: any) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "BÁO CÁO Ý TƯỞNG KHOA HỌC KỸ THUẬT",
            heading: HeadingLevel.TITLE,
            alignment: "center",
          }),
          new Paragraph({
            text: "KHKT Idea Champion",
            alignment: "center",
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "1. THÔNG TIN BỐI CẢNH",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Cấp học: ", bold: true }),
              new TextRun(`${formData.level} (${formData.grade})`),
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Bối cảnh: ", bold: true }),
              new TextRun(formData.context),
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Vấn đề cần giải quyết: ", bold: true }),
              new TextRun(formData.problem),
            ]
          }),
          new Paragraph({
            text: "2. TOP 3 Ý TƯỞNG CHAMPION",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          ...result.top3.flatMap(champion => {
            const idea = result.ideas.find(i => i.id === champion.ideaId);
            if (!idea) return [];
            return [
              new Paragraph({
                text: `Top ${champion.rank}: ${idea.title}`,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
              }),
              new Paragraph({ text: `Lĩnh vực: ${idea.mainField}` }),
              new Paragraph({ text: `Lý do chọn: ${champion.reason}` }),
              new Paragraph({ text: `Điểm mạnh nhất: ${champion.strongestPoint}` }),
              new Paragraph({ text: `Rủi ro: ${champion.riskToImprove}` }),
              new Paragraph({ text: `Mô tả: ${idea.shortDescription}` }),
              new Paragraph({ text: `Cơ chế/Phương pháp: ${idea.mechanism}` }),
            ];
          }),
          new Paragraph({
            text: "3. DANH SÁCH 20 Ý TƯỞNG CHI TIẾT",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 600, after: 200 },
          }),
          ...result.ideas.flatMap(idea => [
            new Paragraph({
              text: `${idea.id}: ${idea.title}`,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 100 },
            }),
            new Paragraph({ text: `Lĩnh vực: ${idea.mainField} | Điểm: ${idea.scores?.total || 0}` }),
            new Paragraph({ text: `Vấn đề giải quyết: ${idea.problem}` }),
            new Paragraph({ text: `Điểm mới: ${idea.novelty}` }),
            new Paragraph({ text: `Đối tượng áp dụng: ${idea.targetUsers}` }),
            new Paragraph({ text: `Độ khó: ${idea.difficulty}` }),
          ])
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `KHKT_Ideas_${new Date().toISOString().slice(0,10)}.docx`;
  link.click();
  window.URL.revokeObjectURL(url);
}
