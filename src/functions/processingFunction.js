const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/dt7755ppx/upload`;
const cloudinaryUploadPreset = 'shoe_mate_shop';

export const uploadToCloundinary = async (file) => {
  try {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', cloudinaryUploadPreset);
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: data
    });
    const result = await response.json();
    console.log(result);
    return result.secure_url;
  } catch (error) {
    console.log(error);
  }
};
