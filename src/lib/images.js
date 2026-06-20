const MAX_IMAGE_BYTES = 1_500_000;

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected.'));
      return;
    }

    if (!file.type.startsWith('image/')) {
      reject(new Error('Please upload an image file (JPG, PNG, or WebP).'));
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      reject(new Error('Image must be smaller than 1.5 MB.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read the image file.'));
    reader.readAsDataURL(file);
  });
}
