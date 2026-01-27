import { json } from '@sveltejs/kit';

// サーバーメモリに訪問者データを保持（簡易版）
let visitors = null;
let lastUpdate = Date.now();

export async function GET() {
  return json({
    visitors,
    lastUpdate
  });
}

export async function POST({ request }) {
  const data = await request.json();
  visitors = data.visitors;
  lastUpdate = Date.now();
  
  return json({
    success: true,
    lastUpdate
  });
}
