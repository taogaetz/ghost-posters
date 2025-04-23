<script lang="ts">
	import '../app.css';
	
	let { children, data } = $props();
  
  let user = data.user
</script>


<div class="bg-orange-300 ">

  <div>
  {#if user}
    <h1>Hi {user.firstname}!</h1>
  {:else}
    <pre>No data!</pre>
  {/if}
  {@render children()}
    </div>
  </div>
