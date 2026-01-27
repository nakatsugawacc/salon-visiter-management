<script>
  import { visitors } from '$lib/stores/visitors';
  import VisitorCard from './VisitorCard.svelte';

  export let checkpoint;
  
  $: checkpointVisitors = $visitors.filter(v => v.currentCheckpointId === checkpoint.id);
</script>

<div class="flex-shrink-0 w-80">
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="{checkpoint.color} px-4 py-3 border-b-2 border-gray-200">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-bold text-gray-800">{checkpoint.name}</h2>
        <span class="bg-white text-gray-700 text-sm font-semibold px-3 py-1 rounded-full">
          {checkpointVisitors.length}人
        </span>
      </div>
    </div>
    
    <div class="p-4 bg-gray-50 min-h-[400px] max-h-[600px] overflow-y-auto">
      {#if checkpointVisitors.length === 0}
        <p class="text-gray-400 text-center mt-8 text-sm">待機中の来店者はいません</p>
      {:else}
        {#each checkpointVisitors as visitor (visitor.id)}
          <VisitorCard {visitor} />
        {/each}
      {/if}
    </div>
  </div>
</div>
