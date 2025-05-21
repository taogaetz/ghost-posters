<script lang="ts">
	import '../app.css';
  import NavBar from '../lib/components/NavBar.svelte'
	let { children, data } = $props();
  
  let user = data.user
</script>

<NavBar user={user}/>
<div class=" font-mono text-white py-4 px-6 shadow-md">

  <div class="w-full flex flex-col gap-4">
    <ol class="flex items-center justify-between w-full">
      <li>
        <div>
          {#if user}
            <h1 class="text-lg font-semibold">Hi {user.firstname}!</h1>
          {:else}
            <pre class="text-sm text-gray-700 italic">no data!</pre>
          {/if}
        </div>
      </li>
      <li>
      </li>
    </ol>
    {@render children()}
  </div>
</div>

