export function getElapsedTime(arrivedAt) {
  const now = new Date();
  const arrived = new Date(arrivedAt);
  const diffMs = now - arrived;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return '< 1分';
  if (diffMins < 60) return `${diffMins}分`;
  
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return `${hours}時間${mins}分`;
}

export function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString('ja-JP', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}
