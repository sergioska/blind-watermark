import { PNG } from 'pngjs';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Creates a test image buffer with specified dimensions
 */
export async function createTestImage(width: number, height: number): Promise<Buffer> {
  const png = new PNG({ width, height });
  
  // Fill with test pattern (gradient)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Create a simple gradient pattern
      const r = Math.floor((x / width) * 255);
      const g = Math.floor((y / height) * 255);
      const b = Math.floor(((x + y) / (width + height)) * 255);
      
      png.data[idx] = r;     // Red
      png.data[idx + 1] = g; // Green
      png.data[idx + 2] = b; // Blue
      png.data[idx + 3] = 255; // Alpha
    }
  }
  
  return PNG.sync.write(png);
}

/**
 * Creates a test image file on disk
 */
export async function createTestImageFile(
  width: number, 
  height: number, 
  filename: string = 'test-image.png'
): Promise<string> {
  const imageBuffer = await createTestImage(width, height);
  const filepath = join(__dirname, '..', filename);
  
  writeFileSync(filepath, imageBuffer);
  return filepath;
}

/**
 * Cleans up test files
 */
export async function cleanupTestFiles(): Promise<void> {
  const testFiles = [
    'test-image.png',
    'watermarked.png',
    'extracted.png'
  ];
  
  for (const filename of testFiles) {
    const filepath = join(__dirname, '..', filename);
    if (existsSync(filepath)) {
      try {
        unlinkSync(filepath);
      } catch (error) {
        // Ignore errors during cleanup
        console.warn(`Warning: Could not delete test file ${filename}:`, error);
      }
    }
  }
}

/**
 * Compares two buffers and returns similarity percentage
 */
export function compareBuffers(buffer1: Buffer, buffer2: Buffer): number {
  if (buffer1.length !== buffer2.length) {
    return 0;
  }
  
  let differences = 0;
  for (let i = 0; i < buffer1.length; i++) {
    if (buffer1[i] !== buffer2[i]) {
      differences++;
    }
  }
  
  return ((buffer1.length - differences) / buffer1.length) * 100;
}

/**
 * Waits for specified milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generates random test data
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Creates a test image with specific content for watermarking tests
 */
export async function createTestImageWithContent(
  width: number, 
  height: number, 
  content: string
): Promise<Buffer> {
  const png = new PNG({ width, height });
  
  // Create a more complex pattern that's good for DWT testing
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Create a pattern with more frequency content
      const r = Math.floor(Math.sin(x * 0.1) * 127 + 128);
      const g = Math.floor(Math.cos(y * 0.1) * 127 + 128);
      const b = Math.floor(Math.sin((x + y) * 0.05) * 127 + 128);
      
      png.data[idx] = r;     // Red
      png.data[idx + 1] = g; // Green
      png.data[idx + 2] = b; // Blue
      png.data[idx + 3] = 255; // Alpha
    }
  }
  
  return PNG.sync.write(png);
} 