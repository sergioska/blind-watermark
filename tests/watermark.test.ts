import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { addWatermark, extractWatermark } from '../src/watermark';
import { WatermarkOptions } from '../src/types';
import { createTestImage, cleanupTestFiles } from './test-utils';

describe('DWT-Watermark Library', () => {
  let testImageBuffer: Buffer;
  const testMessage = 'Hello, World!';
  const defaultOptions: WatermarkOptions = {
    channel: 0,
    q: 12,
    seed: 1234,
    reps: 3
  };

  beforeEach(async () => {
    // Create a test image for each test
    testImageBuffer = await createTestImage(256, 256);
  });

  afterEach(async () => {
    // Clean up test files
    await cleanupTestFiles();
  });

  describe('addWatermark', () => {
    it('should add watermark successfully with default options', async () => {
      const result = await addWatermark(testImageBuffer, testMessage, defaultOptions);
      
      expect(result).toBeDefined();
      expect(result.image).toBeInstanceOf(Buffer);
      expect(result.image.length).toBeGreaterThan(0);
    });

    it('should add watermark with custom quantization step', async () => {
      const customOptions: WatermarkOptions = { ...defaultOptions, q: 8 };
      const result = await addWatermark(testImageBuffer, testMessage, customOptions);
      
      expect(result.image).toBeInstanceOf(Buffer);
      expect(result.image.length).toBeGreaterThan(0);
    });

    it('should add watermark with custom seed', async () => {
      const customOptions: WatermarkOptions = { ...defaultOptions, seed: 9999 };
      const result = await addWatermark(testImageBuffer, testMessage, customOptions);
      
      expect(result.image).toBeInstanceOf(Buffer);
      expect(result.image.length).toBeGreaterThan(0);
    });

    it('should add watermark with custom redundancy', async () => {
      const customOptions: WatermarkOptions = { ...defaultOptions, reps: 5 };
      const result = await addWatermark(testImageBuffer, testMessage, customOptions);
      
      expect(result.image).toBeInstanceOf(Buffer);
      expect(result.image.length).toBeGreaterThan(0);
    });

    it('should add watermark to different channels', async () => {
      const channels = [0, 1, 2] as const;
      
      for (const channel of channels) {
        const options: WatermarkOptions = { ...defaultOptions, channel };
        const result = await addWatermark(testImageBuffer, testMessage, options);
        
        expect(result.image).toBeInstanceOf(Buffer);
        expect(result.image.length).toBeGreaterThan(0);
      }
    });

    it('should handle empty watermark text', async () => {
      const result = await addWatermark(testImageBuffer, '', defaultOptions);
      
      expect(result.image).toBeInstanceOf(Buffer);
      expect(result.image.length).toBeGreaterThan(0);
    });

    it('should handle long watermark text', async () => {
      const longMessage = 'A'.repeat(100); // 100 character message
      const result = await addWatermark(testImageBuffer, longMessage, defaultOptions);
      
      expect(result.image).toBeInstanceOf(Buffer);
      expect(result.image.length).toBeGreaterThan(0);
    });

    it('should throw error for extremely long watermark', async () => {
      const extremelyLongMessage = 'A'.repeat(10000); // Very long message
      
      await expect(
        addWatermark(testImageBuffer, extremelyLongMessage, defaultOptions)
      ).rejects.toThrow('Watermark troppo lungo');
    });

    it('should handle different image formats', async () => {
      // Test with default output (PNG)
      const pngResult = await addWatermark(testImageBuffer, testMessage, defaultOptions);
      expect(pngResult.image).toBeInstanceOf(Buffer);

      // Test with different options
      const customResult = await addWatermark(testImageBuffer, testMessage, {
        ...defaultOptions,
        q: 16
      });
      expect(customResult.image).toBeInstanceOf(Buffer);
    });
  });

  describe('extractWatermark', () => {
    let watermarkedImage: Buffer;

    beforeEach(async () => {
      // Create watermarked image for extraction tests
      const result = await addWatermark(testImageBuffer, testMessage, defaultOptions);
      watermarkedImage = result.image;
    });

    it('should extract watermark successfully with correct options', async () => {
      const extractedMessage = await extractWatermark(watermarkedImage, defaultOptions);
      
      expect(extractedMessage).toBe(testMessage);
    });

    it('should extract watermark with different quantization steps', async () => {
      const customOptions: WatermarkOptions = { ...defaultOptions, q: 8 };
      const result = await addWatermark(testImageBuffer, testMessage, customOptions);
      
      const extractedMessage = await extractWatermark(result.image, customOptions);
      expect(extractedMessage).toBe(testMessage);
    });

    it('should extract watermark with different seeds', async () => {
      const customOptions: WatermarkOptions = { ...defaultOptions, seed: 9999 };
      const result = await addWatermark(testImageBuffer, testMessage, customOptions);
      
      const extractedMessage = await extractWatermark(result.image, customOptions);
      expect(extractedMessage).toBe(testMessage);
    });

    it('should extract watermark with different redundancy', async () => {
      const customOptions: WatermarkOptions = { ...defaultOptions, reps: 5 };
      const result = await addWatermark(testImageBuffer, testMessage, customOptions);
      
      const extractedMessage = await extractWatermark(result.image, customOptions);
      expect(extractedMessage).toBe(testMessage);
    });

    it('should extract watermark from different channels', async () => {
      const channels = [0, 1, 2] as const;
      
      for (const channel of channels) {
        const options: WatermarkOptions = { ...defaultOptions, channel };
        const result = await addWatermark(testImageBuffer, testMessage, options);
        
        const extractedMessage = await extractWatermark(result.image, options);
        expect(extractedMessage).toBe(testMessage);
      }
    });

    it('should extract empty watermark', async () => {
      const result = await addWatermark(testImageBuffer, '', defaultOptions);
      const extractedMessage = await extractWatermark(result.image, defaultOptions);
      
      expect(extractedMessage).toBe('');
    });

    it('should extract long watermark', async () => {
      const longMessage = 'A'.repeat(100);
      const result = await addWatermark(testImageBuffer, longMessage, defaultOptions);
      
      const extractedMessage = await extractWatermark(result.image, defaultOptions);
      expect(extractedMessage).toBe(longMessage);
    });

    it('should fail extraction with wrong channel', async () => {
      const wrongOptions: WatermarkOptions = { ...defaultOptions, channel: 1 };
      
      await expect(
        extractWatermark(watermarkedImage, wrongOptions)
      ).rejects.toThrow();
    });

    it('should fail extraction with wrong quantization step', async () => {
      const wrongOptions: WatermarkOptions = { ...defaultOptions, q: 16 };
      
      await expect(
        extractWatermark(watermarkedImage, wrongOptions)
      ).rejects.toThrow();
    });

    it('should fail extraction with wrong seed', async () => {
      const wrongOptions: WatermarkOptions = { ...defaultOptions, seed: 9999 };
      
      await expect(
        extractWatermark(watermarkedImage, wrongOptions)
      ).rejects.toThrow();
    });

    it('should fail extraction with wrong redundancy', async () => {
      const wrongOptions: WatermarkOptions = { ...defaultOptions, reps: 1 };
      
      await expect(
        extractWatermark(watermarkedImage, wrongOptions)
      ).rejects.toThrow();
    });
  });

  describe('End-to-End Tests', () => {
    it('should work with round-trip watermarking', async () => {
      const originalMessage = 'Round-trip test message';
      
      // Add watermark
      const { image: watermarked } = await addWatermark(
        testImageBuffer, 
        originalMessage, 
        defaultOptions
      );
      
      // Extract watermark
      const extractedMessage = await extractWatermark(watermarked, defaultOptions);
      
      // Verify
      expect(extractedMessage).toBe(originalMessage);
    });

    it('should work with multiple watermarking operations', async () => {
      const messages = ['First', 'Second', 'Third'];
      let currentImage = testImageBuffer;
      
      // Apply multiple watermarks
      for (const message of messages) {
        const result = await addWatermark(currentImage, message, defaultOptions);
        currentImage = result.image;
      }
      
      // Extract last watermark
      const extractedMessage = await extractWatermark(currentImage, defaultOptions);
      expect(extractedMessage).toBe(messages[messages.length - 1]);
    });

    it('should maintain image quality after watermarking', async () => {
      const { image: watermarked } = await addWatermark(
        testImageBuffer, 
        testMessage, 
        defaultOptions
      );
      
      // Basic quality checks
      expect(watermarked.length).toBeGreaterThan(0);
      expect(watermarked.length).toBeCloseTo(testImageBuffer.length, -2); // Within 100 bytes
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid image buffer', async () => {
      const invalidBuffer = Buffer.from('invalid image data');
      
      await expect(
        addWatermark(invalidBuffer, testMessage, defaultOptions)
      ).rejects.toThrow();
    });

    it('should handle invalid options', async () => {
      const invalidOptions = { ...defaultOptions, q: -1 };
      
      await expect(
        addWatermark(testImageBuffer, testMessage, invalidOptions)
      ).rejects.toThrow();
    });

    it('should handle missing seed in extraction', async () => {
      const { image: watermarked } = await addWatermark(
        testImageBuffer, 
        testMessage, 
        defaultOptions
      );
      
      const optionsWithoutSeed = { ...defaultOptions };
      delete optionsWithoutSeed.seed;
      
      await expect(
        extractWatermark(watermarked, optionsWithoutSeed)
      ).rejects.toThrow('Seed is required for extraction');
    });
  });

  describe('Performance Tests', () => {
    it('should handle large images efficiently', async () => {
      const largeImage = await createTestImage(1024, 1024);
      const startTime = Date.now();
      
      const result = await addWatermark(largeImage, testMessage, defaultOptions);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(result.image).toBeInstanceOf(Buffer);
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should handle large watermark text efficiently', async () => {
      const largeMessage = 'A'.repeat(1000);
      const startTime = Date.now();
      
      const result = await addWatermark(testImageBuffer, largeMessage, defaultOptions);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(result.image).toBeInstanceOf(Buffer);
      expect(duration).toBeLessThan(3000); // Should complete within 3 seconds
    });
  });
}); 