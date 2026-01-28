<script>
  import { visitors, notifications } from '$lib/stores/visitors';

  export let visitor;
  export let onClose;

  let selectedRoom = visitor.assignedRoom || '';

  const allStatuses = [
    { id: '受付', label: '📋 受付', color: 'bg-blue-500', needsRoom: false },
    { id: '入室', label: '🚪 入室', color: 'bg-indigo-500', needsRoom: true },
    { id: '着替え完了(施術前)', label: '✨ 着替え完了(施術前)', color: 'bg-green-500', needsRoom: false },
    { id: '施術中', label: '💆 施術中', color: 'bg-teal-500', needsRoom: false },
    { id: '施術完了', label: '✅ 施術完了', color: 'bg-purple-500', needsRoom: false },
    { id: '退出準備中', label: '👔 退出準備中', color: 'bg-orange-500', needsRoom: false },
    { id: '完了', label: '🎉 完了', color: 'bg-gray-500', needsRoom: false }
  ];

  const availableRooms = ['A', 'B', 'C'];

  async function handleRoomAssignment() {
    if (!selectedRoom) {
      alert('施術部屋を選択してください');
      return;
    }
    await visitors.updateStatus(visitor.id, '入室', selectedRoom);
    
    // 通知を送信
    const notificationData = {
      visitorName: visitor.name,
      checkpointName: `施術部屋${selectedRoom}に入室`,
      status: '入室',
      type: 'checkin',
      timestamp: new Date().toISOString()
    };
    
    notifications.add(notificationData);
    
    // サーバーに通知を送信
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData)
      });
    } catch (err) {
      console.error('Failed to send notification', err);
    }
    
    onClose();
  }

  async function handleStatusChange(newStatus) {
    await visitors.updateStatus(visitor.id, newStatus);
    
    const statusEmoji = {
      '受付': '📋',
      '入室': '🚪',
      '着替え完了(施術前)': '✨',
      '施術中': '💆',
      '施術完了': '✅',
      '退出準備中': '👔',
      '完了': '🎉'
    };

    const notificationType = newStatus === '着替え完了(施術前)' ? 'ready' 
      : newStatus === '完了' ? 'treatment_complete' 
      : 'checkin';

    const notificationData = {
      visitorName: visitor.name,
      checkpointName: `${statusEmoji[newStatus]} ${newStatus}`,
      status: newStatus,
      type: notificationType,
      timestamp: new Date().toISOString()
    };

    notifications.add(notificationData);
    
    // サーバーに通知を送信
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData)
      });
    } catch (err) {
      console.error('Failed to send notification', err);
    }

    onClose();
  }
</script>

<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" on:click={onClose}>
  <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto" on:click|stopPropagation>
    <div class="flex justify-between items-start mb-4">
      <div>
        <h2 class="text-xl font-bold text-gray-800">{visitor.name}</h2>
        <p class="text-sm text-gray-600">{visitor.phone}</p>
        <p class="text-xs text-gray-500 mt-1">現在: {visitor.detailedStatus}</p>
        {#if visitor.assignedRoom}
          <p class="text-xs text-purple-600 font-medium mt-1">施術部屋: {visitor.assignedRoom}</p>
        {/if}
      </div>
      <button on:click={onClose} class="text-gray-400 hover:text-gray-600">✕</button>
    </div>

    <!-- 施術部屋選択 -->
    {#if !visitor.assignedRoom}
      <div class="mb-4 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
        <p class="text-sm font-medium text-gray-700 mb-2">施術部屋を割り当て:</p>
        <select 
          bind:value={selectedRoom}
          class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg mb-2"
        >
          <option value="">選択してください</option>
          {#each availableRooms as room}
            <option value={room}>施術部屋 {room}</option>
          {/each}
        </select>
        <button
          on:click={handleRoomAssignment}
          class="w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700"
        >
          入室させる
        </button>
      </div>
    {/if}

    <div class="space-y-2">
      <p class="text-sm font-medium text-gray-700 mb-2">ステータスを変更:</p>
      
      {#each allStatuses as status}
        {#if !status.needsRoom || visitor.assignedRoom}
          <button
            on:click={() => handleStatusChange(status.id)}
            class={`w-full py-3 px-4 ${status.color} text-white rounded-lg font-bold hover:opacity-90 transition-opacity`}
            disabled={visitor.detailedStatus === status.id}
          >
            {status.label}
            {#if visitor.detailedStatus === status.id}
              <span class="text-xs ml-2">(現在)</span>
            {/if}
          </button>
        {/if}
      {/each}
    </div>

    <div class="mt-4 pt-4 border-t border-gray-200">
      <button
        on:click={onClose}
        class="w-full py-2 px-4 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
      >
        閉じる
      </button>
    </div>
  </div>
</div>
