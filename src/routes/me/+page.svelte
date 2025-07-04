<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { tick } from 'svelte'; // tick is useful for DOM updates like focusing
  import { goto } from '$app/navigation';

  // Props using Svelte 5 Runes
  let { data } = $props();

  // Define which fields are editable and their display names
  const editableFields = ['handle', 'name', 'avatar', 'description', 'location'] as const;
  type EditableFieldKey = typeof editableFields[number];

  const fieldDisplayNames: Record<EditableFieldKey, string> = {
    handle: 'Handle',
    name: 'Display Name',
    avatar: 'Avatar URL',
    description: 'Bio',
    location: 'Location'
  };

  // Component state using Svelte 5 $state rune for reactivity
  let activeField = $state<EditableFieldKey | null>(null);
  let inputValue = $state('');
  let feedbackMessage = $state('');
  let feedbackType = $state<'success' | 'error' | ''>('');
  let submitting = $state(false);

  // DOM element bindings
  let modalCheckbox: HTMLInputElement | undefined;
  let inputElement: HTMLInputElement | HTMLTextAreaElement | undefined; // Can be input or textarea

  /**
   * Opens the editing modal for a specified field.
   */
  const openModal = (field: EditableFieldKey) => {
    activeField = field;
    // Ensure data.user.profile and field exist before trying to access
    // Use `as string` assuming profile values are strings, adjust if not.
    inputValue = (data.user.profile?.[field] as string) ?? '';
    feedbackMessage = '';
    feedbackType = '';
    if (modalCheckbox) {
      modalCheckbox.checked = true; // DaisyUI pattern to show modal
    }
    // Wait for modal to be visible, then focus the input
    tick().then(() => {
      inputElement?.focus();
    });
  };

  /**
   * Closes the editing modal and resets its state.
   */
  const closeModal = () => {
    if (modalCheckbox) {
      modalCheckbox.checked = false; // DaisyUI pattern to hide modal
    }
    // Delay reset to allow modal closing animation
    setTimeout(() => {
      activeField = null;
      // inputValue = ''; // Keep inputValue if user reopens quickly for same field? Or clear. Clearing is cleaner.
      // feedbackMessage = '';
      // feedbackType = '';
      // submitting = false; // Submitting is already reset in submitUpdate
    }, 30); // Adjust timeout to match DaisyUI's modal animation duration
  };

  /**
   * Submits the updated field value to the server.
   */
  const submitUpdate = async () => {
    if (!activeField) return;

    submitting = true;
    feedbackMessage = '';
    feedbackType = '';

    const updates = {
      [activeField]: inputValue.trim() // Send trimmed value
    };

    try {
      const res = await fetch('/v/me', { // Your backend endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      const json = await res.json(); // Attempt to parse JSON for error details or success data

      if (res.ok) {
        feedbackMessage = `${fieldDisplayNames[activeField]} updated successfully! 🎉`;
        feedbackType = 'success';

        // Optimistic UI Update:
        // Directly update the nested property of the `data` prop.
        // In Svelte 5, if `data` (or its source) is reactive, this should trigger UI updates.
        if (data.user.profile && activeField) {
          (data.user.profile as any)[activeField] = inputValue.trim();
        }

        // Revalidate data with the server to ensure consistency
        // This will re-run relevant `load` functions.
        // Use a more specific invalidation path if possible, or `invalidateAll()` implicitly.
        //
        await goto(location.pathname, { invalidateAll: true });

        setTimeout(() => {
          closeModal();
        }, 30); // Give user time to read success message
      } else {
        // Handle API errors (e.g., validation errors)
        let errorMessage = json?.error || json?.message || `Failed to update ${fieldDisplayNames[activeField]}.`;
        if (json?.errors && activeField && json.errors[activeField]) { // Check for field-specific errors
          errorMessage = json.errors[activeField];
        }
        feedbackMessage = errorMessage;
        feedbackType = 'error';
      }
    } catch (err) {
      // Handle network errors or unexpected issues
      console.error('Update submission error:', err);
      feedbackMessage = 'A network error occurred. Please try again. 🌐';
      feedbackType = 'error';
    } finally {
      submitting = false;
    }
  };

  // enter and esc work for inputs:
  //
  function handleKeydown(e: KeyboardEvent) {
  const isTextarea = e.target instanceof HTMLTextAreaElement;
  const isInput = e.target instanceof HTMLInputElement;

  if (e.key === 'Escape') {
    e.preventDefault();
    closeModal();
    return;
  }

  if (
    (isTextarea && (e.ctrlKey || e.metaKey) && e.key === 'Enter') ||
    (isInput && e.key === 'Enter')
  ) {
    e.preventDefault();
    submitUpdate();
  }
}


  /**
   * Helper to get current value for display, handling undefined profile data.
   */
  function getCurrentValue(key: EditableFieldKey): string {
    return (data.user.profile?.[key] as string) ?? '—';
  }
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
  {#each editableFields as key (key)}
    <button
      class="btn btn-outline justify-start items-center text-left h-auto py-4 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 border-base-300 hover:border-primary-focus"
      on:click={() => openModal(key)}
      aria-label={`Edit ${fieldDisplayNames[key]}`}
    >
      <div class="flex flex-col w-full">
        <span class="uppercase font-semibold text-xs text-base-content/70 tracking-wider mb-1">{fieldDisplayNames[key]}</span>
        {#if key === 'avatar'}
          <div class="mt-1 flex items-center gap-3">
            {#if data.user.profile?.avatar}
              <div class="avatar">
                <div class="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                  <img src={data.user.profile.avatar} alt="Current Avatar" class="object-cover" />
                </div>
              </div>
              <span class="text-sm truncate text-base-content/80 flex-1">{data.user.profile.avatar}</span>
            {:else}
              <span class="text-base-content/90 text-lg">—</span>
            {/if}
          </div>
        {:else}
          <span class="text-base-content/90 text-lg truncate">{getCurrentValue(key)}</span>
        {/if}
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 ml-auto opacity-60 flex-shrink-0">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
    </button>
  {/each}
</div>

<input type="checkbox" id={`edit-modal-toggle-${Math.random().toString(36).substring(2)}`} class="modal-toggle" bind:this={modalCheckbox} />

<div class="modal modal-bottom sm:modal-middle" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="modal-box relative pb-6">
    <button
        class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 z-10"
        on:click={closeModal}
        aria-label="Close modal"
    >×</button>

    {#if activeField}
      <h3 id="modal-title" class="font-bold text-xl mb-6 text-center sm:text-left">
        Update {fieldDisplayNames[activeField]}
      </h3>

      {#if activeField === 'avatar'}
        {#if inputValue.trim()}
          <div class="mb-4 flex flex-col items-center">
            <div class="avatar">
              <div class="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={inputValue.trim()} alt="Avatar Preview" class="object-cover" />
              </div>
            </div>
            <span class="text-xs text-base-content/70 mt-2">Preview</span>
          </div>
        {/if}
        <input
            type="url"
            bind:this={inputElement}
            class="input input-bordered w-full text-base"
            class:input-success={feedbackType === 'success'}
            class:input-error={feedbackType === 'error'}
            bind:value={inputValue}
            placeholder="Enter new avatar URL (e.g., https://...)"
            disabled={submitting}
            aria-describedby="feedback-area"
            on:keydown={handleKeydown}
        />
      {:else if activeField === 'description'}
        <textarea
            bind:this={inputElement}
            class="textarea textarea-bordered w-full min-h-32 text-base"
            class:textarea-success={feedbackType === 'success'}
            class:textarea-error={feedbackType === 'error'}
            bind:value={inputValue}
            placeholder={`Enter your ${fieldDisplayNames[activeField]?.toLowerCase()}`}
            disabled={submitting}
            on:keydown={handleKeydown}
            aria-describedby="feedback-area"
        ></textarea>
      {:else}
        <input
            type="text"
            bind:this={inputElement}
            class="input input-bordered w-full text-base"
            class:input-success={feedbackType === 'success'}
            class:input-error={feedbackType === 'error'}
            bind:value={inputValue}
            placeholder={`Enter new ${fieldDisplayNames[activeField]?.toLowerCase()}`}
            disabled={submitting}
            aria-describedby="feedback-area"
            on:keydown={handleKeydown}
        />
      {/if}

      {#if feedbackMessage}
        <div
          id="feedback-area"
          role="alert"
          class="mt-4 p-3 rounded-lg text-sm font-medium text-center"
          class:bg-success={feedbackType === 'success'}
          class:text-success-content={feedbackType === 'success'}
          class:bg-error={feedbackType === 'error'}
          class:text-error-content={feedbackType === 'error'}
        >
          {feedbackMessage}
        </div>
      {/if}

      <div class="modal-action mt-8">
        <button class="btn btn-ghost" on:click={closeModal} disabled={submitting}>Cancel</button>
        <button
          class="btn btn-primary"
          on:click={submitUpdate}
          disabled={submitting || (activeField !== 'avatar' && !inputValue.trim())}
        >
          {#if submitting}
            <span class="loading loading-spinner loading-sm"></span>
            Saving...
          {:else}
            Save Changes
          {/if}
        </button>
      </div>
    {:else}
      <div class="p-8 text-center">
        <span class="loading loading-dots loading-lg"></span>
        <p class="mt-2">Loading editor...</p>
      </div>
    {/if}
  </div>
  <label class="modal-backdrop" for={`edit-modal-toggle-${Math.random().toString(36).substring(2)}`} on:click={closeModal}>Close</label>
</div>

<style>
  /* Optional: Add some global styles or Tailwind anapply directives if needed */
  /* For example, to ensure consistent focus rings if not fully handled by DaisyUI */
  /* :global(button:focus-visible, input:focus-visible, textarea:focus-visible) {
    outline: 2px solid theme('colors.primary');
    outline-offset: 2px;
  } */
</style>
