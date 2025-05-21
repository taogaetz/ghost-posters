<script lang="ts">
  import HomeLink from './HomeLink.svelte'

  const props = $props();


</script>

<div class="navbar font-mono">
  <div class="navbar-start"><HomeLink /></div>
  <div class="navbar-center">
      <button class="btn btn-ghost text-xl">Vibecheck.ca</button>
  </div>
  <div class="navbar-end">hello</div>
</div>

