<script>
  import { page } from '$app/stores';
  import { visitors, visitorTokens, notifications } from '$lib/stores/visitors';
  import { onMount, onDestroy } from 'svelte';

  let visitor = null;
  let elapsedTime = '';
  let interval;
  let isProcessing = false;
  let successMessage = '';

  $: token = $page.params.token;
  $: visitorId = visitorTokens[token];
  $: visitor = $visitors.find(v => v.id === visitorId);

  // QRスキャンからの経過時間を計算
  function updateElapsedTime() {
    if (!visitor?.qrScannedAt) {
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

  function handleArrival() {
    isProcessing = true;
    const currentToken = $page.params.token;
    const currentVisitorId = visitorTokens[currentToken];
    
    // updateStatus内で自動で通知が生成される
    visitors.updateStatus(currentVisitorId, '受付');
    
    // ユーザーへのフィードバック
    successMessage = '✅ 来店を確認しました。スタッフがまもなくお呼びします。';
    setTimeout(() => {
      isProcessing = false;
      successMessage = '';
    }, 3000);
  }

  function handleChangeDoneBeforeTreatment() {
    isProcessing = true;
    const currentToken = $page.params.token;
    const currentVisitorId = visitorTokens[currentToken];
    
    // updateStatus内で自動で通知が生成される
    visitors.updateStatus(currentVisitorId, '着替え完了(施術前)');
    
    successMessage = '✅ お着替え完了を確認しました。スタッフに伝わりました。';
    setTimeout(() => {
      isProcessing = false;
      successMessage = '';
    }, 3000);
  }

  function handleChangeDoneAfterTreatment() {
    isProcessing = true;
    const currentToken = $page.params.token;
    const currentVisitorId = visitorTokens[currentToken];
    
    // updateStatus内で自動で通知が生成される
    visitors.updateStatus(currentVisitorId, '完了');
    
    successMessage = '✅ ご利用ありがとうございました。お疲れさまでした。';
    setTimeout(() => {
      isProcessing = false;
      successMessage = '';
    }, 3000);
  }

  onMount(() => {
    updateElapsedTime();
    interval = setInterval(updateElapsedTime, 10000);
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<svelte:head>
  <title>お客様画面 - {visitor?.name || '不明'}</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
  <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
    {#if !visitor}
      <div class="text-center">
        <div class="text-6xl mb-4">❌</div>
        <h1 class="text-2xl font-bold text-red-600 mb-2">無効なQRコード</h1>
        <p class="text-gray-600">このURLは無効です</p>
      </div>
    {:else}
      <div class="text-center mb-6">
        <div class="text-5xl mb-3">👤</div>
        <h1 class="text-2xl font-bold text-gray-800 mb-1">
          {visitor.name} 様
        </h1>
        <p class="text-sm text-gray-500">{visitor.phone}</p>
        <div class="mt-3 inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
          <p class="text-xs font-medium">現在のステータス</p>
          <p class="text-lg font-bold">{visitor.detailedStatus}</p>
        </div>
        {#if visitor.assignedRoom}
          <div class="mt-2 inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-lg">
            <p class="text-sm font-bold">施術部屋: {visitor.assignedRoom}</p>
          </div>
        {/if}
        <div class="mt-3 text-sm text-gray-600">
          経過時間: <span class="font-bold text-blue-600">{elapsedTime}</span>
        </div>
      </div>

      <div class="space-y-3">
        {#if successMessage}
          <div class="bg-green-50 border-2 border-green-500 rounded-lg p-4 text-center animate-pulse">
            <p class="text-green-700 font-bold text-lg">{successMessage}</p>
          </div>
        {/if}

        {#if visitor.detailedStatus === '未来店'}
          <button
            on:click={handleArrival}
            disabled={isProcessing}
            class="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if isProcessing}
              ⏳ 処理中...
            {:else}
              👋 来店
            {/if}
          </button>
        {:else if visitor.detailedStatus === '受付' || visitor.detailedStatus === '入室'}
          <button
            on:click={handleChangeDoneBeforeTreatment}
            disabled={isProcessing}
            class="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if isProcessing}
              ⏳ 処理中...
            {:else}
              ✨ お着替え完了（施術前）
            {/if}
          </button>
        {:else if visitor.detailedStatus === '施術完了' || visitor.detailedStatus === '退出準備中'}
          <button
            on:click={handleChangeDoneAfterTreatment}
            disabled={isProcessing}
            class="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if isProcessing}
              ⏳ 処理中...
            {:else}
              🎊 お着替え終了（退店前）
            {/if}
          </button>
        {:else}
          <div class="bg-yellow-50 rounded-lg p-6 text-center">
            <p class="text-gray-700 text-sm leading-relaxed">
              そのままお待ちください<br/>
              スタッフがまもなくご案内いたします
            </p>
          </div>
        {/if}
      </div>

      <div class="mt-6 text-center text-xs text-gray-400">
        {new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
    {/if}
  </div>
</div>
