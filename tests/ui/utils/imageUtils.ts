// utils/imageUtils.ts
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/**
 * Retrieves the filenames of image files from the specified directory.
 * @param directoryPath - The path to the directory containing images.
 * @returns An array of image filenames with relative paths.
 */
export function getImageFilenames(directoryPath: string): string[] {
  return fs
    .readdirSync(directoryPath)
    .filter(
      (file) =>
        file.endsWith('.svg') || file.endsWith('.png') || file.endsWith('.jpg'),
    ) // Filter for image files
    .map((file) => `/${file}`); // Convert to relative paths for comparison
}

// Example usage of import.meta.url to resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export { __dirname };
