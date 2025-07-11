<script lang="ts">
  let dialogRef: HTMLDialogElement; 
  let title = $state(''); 
  let imageFile: File | null = $state(null); 

  function openModal() {
    dialogRef.showModal();
  }

</script>

<button class="btn" onclick={openModal}>New Thread +</button>

<dialog bind:this={dialogRef} id="my_modal_3" class="modal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onclick={closeModal}>✕</button>
    </form>

    <h3 class="text-lg font-bold">New Thread</h3>

    <form action="/v/post/thread" method="POST" enctype="application/json">

      <div class="py-4 space-y-4">
        <textarea
          required
          name="title"
          class="textarea textarea-bordered w-full"
          placeholder="type shit..."
          bind:value={title}
          rows="3"
        ></textarea>

        <input
          name="imageFile"
          type="file"
          class="file-input file-input-bordered w-full"
          accept="image/*"
          onchange={(e) => {
            const target = e.target as HTMLInputElement;
            if (target.files?.[0]) imageFile = target.files[0];
          }}
        />

        <div class="modal-action mt-4">
          <button class="btn btn-primary" type="submit">Post Thread</button>
          <button class="btn" type="button" onclick={closeModal}>Cancel</button>
        </div>
      </div>
    </form>
  </div>
</dialog>


