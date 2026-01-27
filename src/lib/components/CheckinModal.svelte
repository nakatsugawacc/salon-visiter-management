<script>
  import { latestCheckin } from '$lib/stores/visitors';
  import { fade, scale } from 'svelte/transition';
  import { onDestroy } from 'svelte';

  let show = false;
  let hideTimer;

  function playChime() {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (err) {
      console.warn('音の再生に失敗しました', err);
    }
  }

  $: if ($latestCheckin) {
    show = true;
    playChime();
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      show = false;
    }, 4500);
  }

  $: notificationType = $latestCheckin?.type || 'checkin';
  $: title = notificationType === 'ready' 
    ? '準備完了' 
    : notificationType === 'treatment_complete' 
    ? '施術完了' 
    : 'チェックイン';
  $: subtitle = notificationType === 'ready' 
    ? 'お客様の準備が整いました' 
    : notificationType === 'treatment_complete' 
    ? '着替えが完了しました' 
    : 'チェックインがありました';
  $: emoji = notificationType === 'ready' 
    ? '✨' 
    : notificationType === 'treatment_complete' 
    ? '🎊' 
    : '🎉';

  function close() {
    show = false;
  }

  onDestroy(() => {
    if (hideTimer) clearTimeout(hideTimer);
  });
</script>

{#if show && $latestCheckin}
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" transition:fade>
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" transition:scale={{ duration: 200 }}>
      <div class="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-3xl">{emoji}</span>
          <div>
            <p class="text-sm opacity-80">{subtitle}</p>
            <h3 class="text-xl font-bold">{title}</h3>
          </div>
        </div>
        <button aria-label="close" class="text-white/80 hover:text-white" on:click={close}>✕</button>
      </div>

      <div class="p-6 space-y-3">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-bold">
            {$latestCheckin.visitorName.slice(0, 1)}
          </div>
          <div>
            <p class="text-gray-900 font-semibold">{$latestCheckin.visitorName}</p>
            {#if $latestCheckin.checkpointName}
              <p class="text-sm text-gray-500">{$latestCheckin.checkpointName}</p>
            {/if}
          </div>
        </div>

        <div class="text-sm text-gray-600">
          <p>ステータス: <span class="font-semibold text-green-600">来店中</span></p>
          <p class="mt-1">時刻: {new Date($latestCheckin.timestamp).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
        </div>

        <div class="flex gap-3 pt-2">
          <button on:click={close} class="flex-1 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">閉じる</button>
          <a href="/" class="flex-1 py-2 rounded-lg bg-blue-600 text-white text-center hover:bg-blue-700">ダッシュボードを見る</a>
        </div>
      </div>
    </div>
  </div>
{/if}
