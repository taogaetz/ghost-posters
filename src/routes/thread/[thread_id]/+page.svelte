<script lang='ts'>

import {imageResizeParams} from '$lib/components/helpers/imageResizeParams'
// width, height, quality

let { data, children } = $props();

const thread = data.thread[0]
</script>

<div class="max-w-3xl mx-auto p-4 space-y-6">
  <header>
    <h1 class="text-3xl font-bold">{thread.title}</h1>
    <div class="text-sm text-gray-500 bg-orange-900 rounded-md w-fit px-1">
      <span class="capitalize">{thread.status}</span> • 
      {thread.date_created}
    </div>
  </header>

  {#if thread.image}
    <img
      src={`https://api.vibecheck.ca/assets/${thread.image}${imageResizeParams(90, 500)}`}

      alt={thread.title}
      class="w-full rounded-xl shadow"
    />
  {/if}

</div>
