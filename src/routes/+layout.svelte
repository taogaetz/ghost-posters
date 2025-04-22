<script lang="ts">
	import '../app.css';
	
	let { children, data } = $props();
  
  data = JSON.stringify(data)
</script>


<div class="bg-orange-300">
  <h1 >Hello!</h1>


  {#if data}
    <pre>{data}</pre>
  {:else}
    <pre>No data!</pre>
  {/if}}
  {@render children()}
  </div>
