<!-- src/routes/profile/+layout.svelte -->
<script lang="ts">
  let { data, children } = $props();
</script>

<div class="min-h-screen flex items-center justify-center p-4">
  <div class="card bg-base-100 shadow-xl w-full max-w-2xl">
    <div class="card-body">
      <h2 class="card-title text-2xl mb-4">User Profile</h2>

      {@render children?.()}
    </div>
  </div>
</div>

