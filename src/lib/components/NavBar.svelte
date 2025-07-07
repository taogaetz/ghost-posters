<script lang="ts">
  import HomeLink from './HomeLink.svelte'
  import CreateThreadButton from './CreateThreadButton.svelte'
  import handleFormSubmission from '$lib/handlers/handleFormSubmission'
  const {user} = $props();




</script>

<div class="navbar font-mono">
  <div class="navbar-start"><span class="text-xs">Hello {user.firstname}<span/><HomeLink /></div>
  <div class="navbar-center w-[6rem] mt-2 p-2">
      <a href="/v"><button class="btn btn-ghost"><img src="/favicon.png"/></button></a>
  </div>
  <div class="navbar-end text-slate-700 text-xs">vibecheck beta 0.1.2</div>
  
</div>

<CreateThreadButton onsubmit={handleFormSubmission} />

