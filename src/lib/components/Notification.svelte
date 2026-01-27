<script>
  import { notifications } from '$lib/stores/visitors';
  import { fly, fade } from 'svelte/transition';

  function removeNotification(id) {
    notifications.remove(id);
  }
</script>

<div class="fixed top-4 right-4 z-50 space-y-2">
  {#each $notifications as notification (notification.id)}
    <div 
      class="bg-white rounded-lg shadow-2xl p-4 border-l-4 border-green-500 min-w-[320px] max-w-md"
      transition:fly="{{ x: 300, duration: 300 }}"
    >
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center mb-1">
            <span class="text-2xl mr-2">✅</span>
            <h3 class="font-bold text-gray-800">ステータス更新</h3>
          </div>
          <p class="text-sm text-gray-600 mt-1">
            <strong>{notification.visitorName}</strong> さんが<br/>
            <strong class="text-blue-600">{notification.checkpointName}</strong> に移動しました
          </p>
          <p class="text-xs text-gray-400 mt-2">
            {new Date(notification.timestamp).toLocaleTimeString('ja-JP')}
          </p>
        </div>
        <button 
          on:click={() => removeNotification(notification.id)}
          class="text-gray-400 hover:text-gray-600 ml-2"
        >
          ✕
        </button>
      </div>
    </div>
  {/each}
</div>
