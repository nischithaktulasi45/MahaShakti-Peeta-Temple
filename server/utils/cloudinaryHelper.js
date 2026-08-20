const cloudinary = require("../config/cloudinary");

const isCloudinaryConfigured = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  return Boolean(
    CLOUDINARY_CLOUD_NAME &&
    CLOUDINARY_API_KEY &&
    CLOUDINARY_API_SECRET &&
    CLOUDINARY_CLOUD_NAME.toLowerCase() !== "root" &&
    CLOUDINARY_CLOUD_NAME.toLowerCase() !== "your_cloud_name"
  );
};

/**
 * Upload a memory buffer to Cloudinary using upload_stream
 * @param {Buffer} buffer
 * @param {Object} options (folder, resource_type, etc.)
 * @returns {Promise<{ url: string, publicId: string }>}
 */
const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || "temple-website",
      resource_type: options.resource_type || "auto",
      ...options,
    };

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        return reject(error);
      }
      if (!result) {
        return reject(new Error("No result returned from Cloudinary"));
      }
      resolve({
        url: result.secure_url || result.url,
        publicId: result.public_id,
        format: result.format,
        resourceType: result.resource_type,
      });
    });

    stream.end(buffer);
  });
};

/**
 * Delete a media item from Cloudinary
 * @param {string} publicId
 * @param {string} resourceType ("image" | "video" | "raw")
 */
const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  if (!publicId) return;
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    console.log(`Cloudinary deletion [${publicId}]:`, result?.result || result);
    return result;
  } catch (error) {
    console.warn(`Failed to delete ${publicId} from Cloudinary:`, error?.message || error);
  }
};

module.exports = {
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
  deleteFromCloudinary,
};
