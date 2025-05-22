<script lang="ts">
  const { data } = $props();

</script>

<div class="card bg-base-100 w-60 shadow-sm">
  <figure class="w-full aspect-[11/17] overflow-hidden rounded-md">
    <img
      src={data.img}
      alt="Poster"
      class="w-full h-full object-cover"
    />
  </figure>
  <div class="card-body items-center text-center">
    <h2 class="card-title">{data.title}</h2>
    <p>{data.message}</p>
    <div class="card-actions">
      <button class="btn btn-primary">Chat</button>
    </div>
  </div>
</div>

