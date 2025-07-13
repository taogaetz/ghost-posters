<script lang="ts">
import {compressImage} from './helpers/compressImage.ts'
  let dialogRef: HTMLDialogElement; 
  let title = $state(''); 
  let imageFile: File | null = $state(null); 
  let isSubmitting = $state(false); 
  let isCompressing = $state(false);

  function openModal() {
    dialogRef.showModal();
  }


async function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      console.log("attemplting compression of: ", file)
      isCompressing = true;
      imageFile = null; // Clear existing file while compressing
      
      try {
        // Compress the file immediately
        const compressedBlob = await compressImage(file);
        
        // Overwrite the imageFile state with the compressed Blob, converted back to a File
        imageFile = new File(
          [compressedBlob], 
          file.name, 
          { type: compressedBlob.type }
        );
      console.log("succesfully compressed file: ", imageFile)
      } catch (err) {
        alert("Image compression failed. Please try a different image.");
        console.error("Compression failed:", err);
        imageFile = null;
        target.value = ''; // Clear the input field if compression fails
      } finally {
        isCompressing = false;
      }
    } else {
      imageFile = null;
    }
}

</script>

<button class="btn" onclick={openModal}>New Thread +</button>

<dialog bind:this={dialogRef} id="my_modal_3" class="modal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onclick={closeModal}>✕</button>
    </form>

    <h3 class="text-lg font-bold">New Thread</h3>

    <form action="/v/post/thread" method="POST" enctype="multipart/form-data">

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
          required
          name="file"
          type="file"
          class="file-input file-input-bordered w-full"
          accept="image/*"
          onchange={handleFileChange}
        />

        <div class="modal-action mt-4">
          <button class="btn btn-primary" type="submit">Post Thread</button>
          <button class="btn" type="button" onclick={closeModal}>Cancel</button>
        </div>
      </div>
    </form>
  </div>
</dialog>


