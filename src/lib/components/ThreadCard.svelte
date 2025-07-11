
<script lang="ts">
  const { data } = $props();

  const imgUrl = data.image?.id
    ? `https://api.vibecheck.ca/assets/${data.image.id}`
    : '/favicon.png'; // fallback image

  const threadUrl = data.id
    ? `/v/thread/${data.id}`
    : '#'; // disable link or fallback route
</script>

<div class="card bg-base-100 w-60 shadow-sm">
  <figure class="w-full aspect-[11/17] overflow-hidden rounded-md">
    <img
      src={imgUrl}
      alt="Poster"
      class="w-full h-full object-cover"
    />
  </figure>
  <div class="card-body items-center text-center">
    <h2 class="card-title">{data.title}</h2>
    <p>{data.message}</p>
    <div class="card-actions">
      {#if data.id}
        <a href={threadUrl} class="btn btn-primary">Chat</a>
      {:else}
        <button class="btn btn-disabled">Unavailable</button>
      {/if}
    </div>
  </div>
</div>
