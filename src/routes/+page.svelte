<script>
  import { checkpoints, visitors, notifications } from '$lib/stores/visitors';
  import CheckpointColumn from '$lib/components/CheckpointColumn.svelte';
  import Notification from '$lib/components/Notification.svelte';
  import QRCodeDisplay from '$lib/components/QRCodeDisplay.svelte';
  import CheckinModal from '$lib/components/CheckinModal.svelte';
</script>

<svelte:head>
  <title>来店者管理ダッシュボード</title>
</svelte:head>

<Notification />
<CheckinModal />

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
  <header class="bg-white shadow-md">
    <div class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">
          🏢 来店者管理ダッシュボード
        </h1>
        <div class="flex items-center gap-4">
          <div class="text-sm text-gray-600">
            来店者数: <span class="font-bold text-blue-600">{$visitors.length}人</span>
          </div>
          <button 
            on:click={() => visitors.reset()}
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm"
          >
            リセット
          </button>
        </div>
      </div>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8">
    <div class="flex gap-6">
      <!-- 受付 -->
      <CheckpointColumn checkpoint={$checkpoints[0]} />
      
      <!-- 施術部屋A/B/C（縦並び） -->
      <div class="flex flex-col gap-6">
        <CheckpointColumn checkpoint={$checkpoints[1]} />
        <CheckpointColumn checkpoint={$checkpoints[2]} />
        <CheckpointColumn checkpoint={$checkpoints[3]} />
      </div>
      
      <!-- 完了 -->
      <CheckpointColumn checkpoint={$checkpoints[4]} />
    </div>
  </main>

  <QRCodeDisplay />
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }
</style>
