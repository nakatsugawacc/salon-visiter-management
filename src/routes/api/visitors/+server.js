import { json } from '@sveltejs/kit';

// サーバーメモリに訪問者データを保持（簡易版）
let visitors = null;
let lastUpdate = Date.now();

export async function GET() {
  return json(
    {
      visitors,
      lastUpdate
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    }
  );
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
