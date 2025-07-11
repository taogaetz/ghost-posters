export default async function handleFormSubmission(payload: { title: string; imageFile: File | null }) {
  console.log('[FORM SUBMITTED]:', payload);

  const formData = new FormData();
  formData.append('title', payload.title);
  if (payload.imageFile) {
    formData.append('image', payload.imageFile);
  }

  // Log FormData contents for debugging
  for (const [key, value] of formData.entries()) {
    console.log(`[FormData] ${key}:`, value);
  }

}
