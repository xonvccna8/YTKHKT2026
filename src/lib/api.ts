import { GenerateResult } from '@/types';

export async function generateIdeas(formData: any): Promise<GenerateResult> {
  const response = await fetch('/api/generate-ideas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || `API Error: ${response.status}`);
  }

  return response.json();
}
