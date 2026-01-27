<script>
  import { visitors } from '$lib/stores/visitors';
  import { page } from '$app/stores';

  $: baseUrl = $page.url.origin;
  
  let showQRCodes = false;
</script>

<button 
  on:click={() => showQRCodes = !showQRCodes}
  class="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors font-medium z-40"
>
  {showQRCodes ? 'QRコードを閉じる' : 'QRコードを表示'}
</button>

{#if showQRCodes}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" on:click={() => showQRCodes = false}>
    <div class="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto" on:click|stopPropagation>
      <h2 class="text-2xl font-bold mb-6 text-gray-800">お客様用QRコード</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each $visitors as visitor (visitor.id)}
          <div class="border-2 border-gray-200 rounded-lg p-4 text-center">
            <h3 class="font-bold text-lg mb-2 text-gray-700">{visitor.name}</h3>
            <p class="text-xs text-gray-500 mb-3">{visitor.phone}</p>
            <div class="bg-gray-100 p-4 rounded inline-block mb-3">
              <div class="text-8xl">📱</div>
            </div>
            <p class="text-xs text-gray-600 break-all mb-2">
              {baseUrl}/checkin/{visitor.qrToken}
            </p>
            <div class="flex gap-2 justify-center">
              <a 
                href="/checkin/{visitor.qrToken}" 
                target="_blank"
                class="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                お客様画面 →
              </a>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}
