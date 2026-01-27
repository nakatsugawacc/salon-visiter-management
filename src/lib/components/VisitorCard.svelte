<script>
  import { onMount, onDestroy } from 'svelte';
  import { visitors, checkpoints } from '$lib/stores/visitors';
  import StaffStatusModal from './StaffStatusModal.svelte';

  export let visitor;
  
  let elapsedTime = '';
  let interval;
  let showStaffModal = false;

  $: statusLabel = visitor.detailedStatus || '未来店';
  $: statusColor = visitor.detailedStatus === '未来店' 
    ? 'bg-gray-100 text-gray-700'
    : visitor.detailedStatus === '完了'
    ? 'bg-gray-200 text-gray-600'
    : 'bg-green-100 text-green-800';

  // QRスキャンからの経過時間を計算
  function updateElapsedTime() {
    if (!visitor.qrScannedAt) {
      elapsedTime = '未スキャン';
      return;
    }
    const now = new Date();
    const scanned = new Date(visitor.qrScannedAt);
    const diffMs = now - scanned;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) elapsedTime = '< 1分';
    else if (diffMins < 60) elapsedTime = `${diffMins}分`;
    else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      elapsedTime = `${hours}時間${mins}分`;
    }
  }

  onMount(() => {
    updateElapsedTime();
    interval = setInterval(updateElapsedTime, 10000);
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<div class="bg-white rounded-lg shadow-md p-4 mb-3 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
  <div class="flex justify-between items-start mb-2">
    <div class="flex-1">
      <h3 class="font-bold text-lg text-gray-800">{visitor.name}</h3>
      <div class="flex flex-wrap gap-2 mt-1">
        <span class={`text-xs px-2 py-1 rounded-full font-medium ${statusColor}`}>
          {statusLabel}
        </span>
        {#if visitor.assignedRoom}
          <span class="text-xs px-2 py-1 rounded-full font-medium bg-purple-100 text-purple-800">
            部屋{visitor.assignedRoom}
          </span>
        {/if}
      </div>
    </div>
    <span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">
      {elapsedTime}
    </span>
  </div>
  <p class="text-sm text-gray-600 mb-1">
    <span class="inline-block mr-1">📞</span>
    {visitor.phone}
  </p>
  <p class="text-xs text-gray-500 mb-3">
    到着: {new Date(visitor.arrivedAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
  </p>

  <div class="space-y-2 pt-2 border-t border-gray-200">
    <button
      on:click={() => showStaffModal = true}
      class="w-full py-2 px-3 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
    >
      🔧 スタッフ操作
    </button>
  </div>
</div>

{#if showStaffModal}
  <StaffStatusModal {visitor} onClose={() => showStaffModal = false} />
{/if}
