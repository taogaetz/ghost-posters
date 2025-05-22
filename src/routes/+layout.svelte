<script lang="ts">
	import '../app.css';
  import NavBar from '../lib/components/NavBar.svelte'
	let { children, data } = $props();
  
  let user = data.user
</script>

<NavBar user={user}/>
<div class="h-[auto] pb-20 font-mono text-white shadow-md bg-[url(https://vibecheck.ca/content/images/size/w2000/2025/05/bricks.jpg)] bg-repeat">
{@render children()}
</div>

