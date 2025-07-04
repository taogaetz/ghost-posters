<script>

import ThreadCard from "../lib/components/ThreadCard.svelte"

let { data, children } = $props();

let cards = data.publicThreads;


</script>

<div class="bg-dark-bg text-xl p-5">
  <h1>What's Happening</h1>
</div>

<div class="flex justify-center">
<div class="carousel space-x-9 rounded-box flex pt-3 md:grid lg:grid xl:grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6 ">
  {#each cards as data}
  <div class="sm:carousel-item h-full">
      <ThreadCard {data}/>
  </div>
  {/each}
</div>
  </div>

<div class="text-3xl bg-blue-500"></div>
