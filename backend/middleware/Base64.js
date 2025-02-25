import sharp from "sharp";

const convertImageToBase64 = async (imageUrl) => {
  try {
    const response = await get(imageUrl, { responseType: "arraybuffer" });
    
    // Compress the image using sharp
    const compressedImageBuffer = await sharp(response.data)
      .resize(300, 300) // Resize to 300x300 (adjust as necessary)
      .jpeg({ quality: 80 }) // Compress image to 80% quality
      .toBuffer();
    
    // Convert the compressed image to base64
    const base64Image = compressedImageBuffer.toString("base64");
    
    return `data:${response.headers["content-type"]};base64,${base64Image}`;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    // Return null or a default image if there's an error
    return null;
  }
};

export default convertImageToBase64;
