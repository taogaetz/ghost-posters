<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { onMount } from 'svelte';

  let { data } = $props();
  const profile = { ...data.user.profile };

  const editableFields = ['handle', 'name', 'avatar', 'description', 'location'];

  let activeField: string | null = null;
  let inputValue = '';
  let feedback = '';
  let submitting = false;

  let modalCheckbox: HTMLInputElement;

  const openModal = (field: string) => {
    activeField = field;
    inputValue = profile[field] ?? '';
    feedback = '';
    modalCheckbox.checked = true;
  };

  const closeModal = () => {
    modalCheckbox.checked = false;
    activeField = null;
    inputValue = '';
    feedback = '';
    submitting = false;
  };

  const submitUpdate = async () => {
    console.log('attempting submit!')
    submitting = true;
    feedback = '';

    const updates = {
      [activeField]: inputValue
    };

    try {
      const res = await fetch('/v/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      const json = await res.json();

      if (res.ok) {
        profile[activeField] = inputValue;
        feedback = 'Saved!';
        await invalidate();
        setTimeout(closeModal, 1000);
      } else {
        feedback = json?.error || 'Failed to save.';
      }
    } catch (err) {
      feedback = 'Network or server error.';
    } finally {
      submitting = false;
    }
  };
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {#each editableFields as key}
    <button class="btn btn-outline justify-start" on:click={() => openModal(key)}>
      <span class="uppercase font-semibold text-sm mr-2">{key}:</span>
      <span class="text-base-content">{profile[key] || '—'}</span>
    </button>
  {/each}
</div>

<!-- Hidden checkbox to toggle modal -->
<input type="checkbox" class="modal-toggle" bind:this={modalCheckbox} />

<!-- Modal -->
<div class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Update {activeField}</h3>

    <input
      type="text"
      class="input input-bordered w-full mt-4"
      bind:value={inputValue}
      placeholder={`Enter new ${activeField}`}
      disabled={submitting}
    />

    {#if feedback}
      <div class="mt-2 text-sm" class:text-error={feedback !== 'Saved!'} class:text-success={feedback === 'Saved!'}>
        {feedback}
      </div>
    {/if}

    <div class="modal-action">
      <button class="btn btn-ghost" on:click={closeModal} disabled={submitting}>Cancel</button>
      <button class="btn btn-primary" on:click={submitUpdate} disabled={submitting}>Submit</button>
    </div>
  </div>
</div>
