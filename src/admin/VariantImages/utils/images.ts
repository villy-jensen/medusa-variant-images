export type FormImage = {
  url: string;
  name?: string;
  size?: number;
  nativeFile?: File;
};

const splitImages = (images: FormImage[]): { uploadImages: FormImage[]; existingImages: FormImage[] } => {
  const uploadImages: FormImage[] = [];
  const existingImages: FormImage[] = [];

  images.forEach((image) => {
    if (image.nativeFile) {
      uploadImages.push(image);
    } else {
      existingImages.push(image);
    }
  });

  return { uploadImages, existingImages };
};

export const prepareImages = async (images: FormImage[], fetch: any) => {
  const { uploadImages, existingImages } = splitImages(images);

  let uploadedImgs: FormImage[] = [];
  if (uploadImages.length > 0) {
    const files = uploadImages.map((i) => i.nativeFile);
    const { files: uploaded } = await fetch('/admin/uploads', { body: { files } }).then((res: any) => {
      if (!res) return { files: undefined };
      return res;
    });

    uploadedImgs = uploaded;
  }

  return [...existingImages, ...uploadedImgs];
};
