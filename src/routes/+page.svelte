<script>

import ThreadCard from "../lib/components/ThreadCard.svelte"

let { data, children } = $props();

function getRandomImageUrl() {
  const width = Math.floor(Math.random() * 300) + 300;  // 300–600
  const height = Math.floor(Math.random() * 200) + 300; // 300–500
  return `https://picsum.photos/${width}/${height}/`;
}

let cards = [
  { title: "Hello", message: "Bigtime swagmachine", permalink: "/", img: getRandomImageUrl() },
  { title: "Svelte 5 is 🔥", message: "No more $: needed", permalink: "/thread/svelte5", img: getRandomImageUrl() },
  { title: "Tailwind Tips", message: "Use flex and grid wisely", permalink: "/thread/tailwind", img: getRandomImageUrl() },
  { title: "Daily Vibes", message: "Coffee, code, commit", permalink: "/thread/vibes", img: getRandomImageUrl() },
  { title: "Launch Incoming", message: "Product goes live next week", permalink: "/thread/launch", img: getRandomImageUrl() },
  { title: "Funny Bug", message: "It works when I’m watching it", permalink: "/thread/bug", img: getRandomImageUrl() },
  { title: "Refactor Day", message: "Breaking everything to make it better", permalink: "/thread/refactor", img: getRandomImageUrl() },
  { title: "Weekend Reads", message: "Check out this SvelteKit guide", permalink: "/thread/sveltekit", img: getRandomImageUrl() },
  { title: "Feedback Needed", message: "Roast my landing page", permalink: "/thread/feedback", img: getRandomImageUrl() },
  { title: "Just Vibes", message: "No thoughts, just pixels", permalink: "/thread/justvibes", img: getRandomImageUrl() },
];


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
