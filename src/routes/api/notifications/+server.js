import { json } from '@sveltejs/kit';

// サーバーメモリに最新通知を保持
let latestNotification = null;
let notificationId = 0;

export async function GET() {
  return json({
    notification: latestNotification,
    id: notificationId
  });
}

export async function POST({ request }) {
  const data = await request.json();
  notificationId++;
  latestNotification = {
    ...data,
    id: notificationId,
    timestamp: new Date().toISOString()
  };
  
  return json({
    success: true,
    id: notificationId
  });
}
