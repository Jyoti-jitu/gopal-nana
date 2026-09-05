import cloudinaryAssets from './cloudinary-assets.json';

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'thumb' | 'fit' | 'limit' | 'pad' | 'scale' | 'auto';
  gravity?: 'auto' | 'face' | 'center';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'png' | 'jpg';
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'bctl2gxd';

/**
 * Returns a transformed Cloudinary URL.
 * Automatically resolves local /images/... paths to their Cloudinary CDN URLs.
 */
export function getCloudinaryUrl(
  srcOrPublicId: string,
  options: CloudinaryTransformOptions = {}
): string {
  if (!srcOrPublicId) return '';

  // 1. Resolve relative path from assets mapping if present
  let url = (cloudinaryAssets as Record<string, string>)[srcOrPublicId] || srcOrPublicId;

  // If not a Cloudinary URL and not starting with http, build from public_id
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    const cleanId = srcOrPublicId.replace(/^\//, '');
    url = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${cleanId}`;
  }

  // If not a res.cloudinary.com URL, return as-is
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  // 2. Build transformation segment
  const transforms: string[] = [];

  if (options.format) {
    transforms.push(`f_${options.format}`);
  } else {
    transforms.push('f_auto');
  }

  if (options.quality) {
    transforms.push(`q_${options.quality}`);
  } else {
    transforms.push('q_auto');
  }

  if (options.width) {
    transforms.push(`w_${options.width}`);
  }
  if (options.height) {
    transforms.push(`h_${options.height}`);
  }
  if (options.crop) {
    transforms.push(`c_${options.crop}`);
  }
  if (options.gravity) {
    transforms.push(`g_${options.gravity}`);
  }

  const transformString = transforms.join(',');

  if (url.includes('/image/upload/')) {
    const [prefix, suffix] = url.split('/image/upload/');
    if (suffix.startsWith('f_auto') || suffix.startsWith('c_')) {
      return url;
    }
    return `${prefix}/image/upload/${transformString}/${suffix}`;
  }

  return url;
}

export default getCloudinaryUrl;
