import { describe, it, expect } from '@jest/globals';
import { haarDWT, haarIDWT } from '../src/dwt';

describe('DWT Functions', () => {
  describe('haarDWT', () => {
    it('should perform 1-level DWT on 2x2 matrix', () => {
      const input = [
        [1, 2],
        [3, 4]
      ];
      
      const [LL, HL, LH, HH] = haarDWT(input);
      
      expect(LL).toHaveLength(1);
      expect(LL[0]).toHaveLength(1);
      expect(HL).toHaveLength(1);
      expect(HL[0]).toHaveLength(1);
      expect(LH).toHaveLength(1);
      expect(LH[0]).toHaveLength(1);
      expect(HH).toHaveLength(1);
      expect(HH[0]).toHaveLength(1);
    });

    it('should perform 1-level DWT on 4x4 matrix', () => {
      const input = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16]
      ];
      
      const [LL, HL, LH, HH] = haarDWT(input);
      
      expect(LL).toHaveLength(2);
      expect(LL[0]).toHaveLength(2);
      expect(HL).toHaveLength(2);
      expect(HL[0]).toHaveLength(2);
      expect(LH).toHaveLength(2);
      expect(LH[0]).toHaveLength(2);
      expect(HH).toHaveLength(2);
      expect(HH[0]).toHaveLength(2);
    });

    it('should perform 1-level DWT on 8x8 matrix', () => {
      const input = Array.from({ length: 8 }, (_, i) =>
        Array.from({ length: 8 }, (_, j) => i * 8 + j)
      );
      
      const [LL, HL, LH, HH] = haarDWT(input);
      
      expect(LL).toHaveLength(4);
      expect(LL[0]).toHaveLength(4);
      expect(HL).toHaveLength(4);
      expect(HL[0]).toHaveLength(4);
      expect(LH).toHaveLength(4);
      expect(LH[0]).toHaveLength(4);
      expect(HH).toHaveLength(4);
      expect(HH[0]).toHaveLength(4);
    });

    it('should handle matrix with all zeros', () => {
      const input = [
        [0, 0],
        [0, 0]
      ];
      
      const [LL, HL, LH, HH] = haarDWT(input);
      
      expect(LL[0][0]).toBe(0);
      expect(HL[0][0]).toBe(0);
      expect(LH[0][0]).toBe(0);
      expect(HH[0][0]).toBe(0);
    });

    it('should handle matrix with all ones', () => {
      const input = [
        [1, 1],
        [1, 1]
      ];
      
      const [LL, HL, LH, HH] = haarDWT(input);
      
      expect(LL[0][0]).toBe(1);
      expect(HL[0][0]).toBe(0);
      expect(LH[0][0]).toBe(0);
      expect(HH[0][0]).toBe(0);
    });

    it('should handle matrix with constant values', () => {
      const input = [
        [5, 5],
        [5, 5]
      ];
      
      const [LL, HL, LH, HH] = haarDWT(input);
      
      expect(LL[0][0]).toBe(5);
      expect(HL[0][0]).toBe(0);
      expect(LH[0][0]).toBe(0);
      expect(HH[0][0]).toBe(0);
    });
  });

  describe('haarIDWT', () => {
    it('should reconstruct 2x2 matrix from DWT coefficients', () => {
      const original = [
        [1, 2],
        [3, 4]
      ];
      
      const [LL, HL, LH, HH] = haarDWT(original);
      const reconstructed = haarIDWT(LL, HL, LH, HH);
      
      expect(reconstructed).toHaveLength(2);
      expect(reconstructed[0]).toHaveLength(2);
      
      // Check that reconstruction is close to original
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          expect(reconstructed[i][j]).toBeCloseTo(original[i][j], 10);
        }
      }
    });

    it('should reconstruct 4x4 matrix from DWT coefficients', () => {
      const original = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16]
      ];
      
      const [LL, HL, LH, HH] = haarDWT(original);
      const reconstructed = haarIDWT(LL, HL, LH, HH);
      
      expect(reconstructed).toHaveLength(4);
      expect(reconstructed[0]).toHaveLength(4);
      
      // Check that reconstruction is close to original
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          expect(reconstructed[i][j]).toBeCloseTo(original[i][j], 10);
        }
      }
    });

    it('should reconstruct 8x8 matrix from DWT coefficients', () => {
      const original = Array.from({ length: 8 }, (_, i) =>
        Array.from({ length: 8 }, (_, j) => i * 8 + j)
      );
      
      const [LL, HL, LH, HH] = haarDWT(original);
      const reconstructed = haarIDWT(LL, HL, LH, HH);
      
      expect(reconstructed).toHaveLength(8);
      expect(reconstructed[0]).toHaveLength(8);
      
      // Check that reconstruction is close to original
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          expect(reconstructed[i][j]).toBeCloseTo(original[i][j], 10);
        }
      }
    });

    it('should handle modified coefficients correctly', () => {
      const original = [
        [1, 2],
        [3, 4]
      ];
      
      const [LL, HL, LH, HH] = haarDWT(original);
      
      // Modify some coefficients (simulating watermarking)
      HL[0][0] += 0.5;
      LH[0][0] += 0.3;
      HH[0][0] += 0.1;
      
      const reconstructed = haarIDWT(LL, HL, LH, HH);
      
      expect(reconstructed).toHaveLength(2);
      expect(reconstructed[0]).toHaveLength(2);
      
      // Reconstruction should be different from original due to modifications
      let hasChanges = false;
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          if (Math.abs(reconstructed[i][j] - original[i][j]) > 0.01) {
            hasChanges = true;
            break;
          }
        }
        if (hasChanges) break;
      }
      
      expect(hasChanges).toBe(true);
    });
  });

  describe('DWT Properties', () => {
    it('should preserve matrix dimensions correctly', () => {
      const sizes = [2, 4, 8, 16, 32];
      
      for (const size of sizes) {
        const input = Array.from({ length: size }, (_, i) =>
          Array.from({ length: size }, (_, j) => Math.random() * 255)
        );
        
        const [LL, HL, LH, HH] = haarDWT(input);
        const reconstructed = haarIDWT(LL, HL, LH, HH);
        
        expect(reconstructed).toHaveLength(size);
        expect(reconstructed[0]).toHaveLength(size);
      }
    });

    it('should handle edge cases with small matrices', () => {
      // Test with 1x1 matrix (should handle gracefully or throw appropriate error)
      const input1x1 = [[5]];
      
      try {
        const [LL, HL, LH, HH] = haarDWT(input1x1);
        const reconstructed = haarIDWT(LL, HL, LH, HH);
        
        expect(reconstructed).toHaveLength(1);
        expect(reconstructed[0]).toHaveLength(1);
      } catch (error) {
        // It's acceptable for 1x1 matrices to throw an error
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should maintain numerical stability', () => {
      const input = Array.from({ length: 16 }, (_, i) =>
        Array.from({ length: 16 }, (_, j) => Math.random() * 1000)
      );
      
      const [LL, HL, LH, HH] = haarDWT(input);
      const reconstructed = haarIDWT(LL, HL, LH, HH);
      
      // Check that reconstruction doesn't have extreme values
      for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
          expect(Number.isFinite(reconstructed[i][j])).toBe(true);
          expect(Number.isNaN(reconstructed[i][j])).toBe(false);
        }
      }
    });
  });

  describe('Round-trip DWT/IDWT', () => {
    it('should perfectly reconstruct simple patterns', () => {
      const patterns = [
        [[1, 0], [0, 1]],           // Diagonal pattern
        [[0, 1], [1, 0]],           // Anti-diagonal pattern
        [[1, 1], [0, 0]],           // Horizontal pattern
        [[1, 0], [1, 0]],           // Vertical pattern
      ];
      
      for (const pattern of patterns) {
        const [LL, HL, LH, HH] = haarDWT(pattern);
        const reconstructed = haarIDWT(LL, HL, LH, HH);
        
        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < 2; j++) {
            expect(reconstructed[i][j]).toBeCloseTo(pattern[i][j], 10);
          }
        }
      }
    });

    it('should handle multiple DWT/IDWT cycles', () => {
      const original = Array.from({ length: 8 }, (_, i) =>
        Array.from({ length: 8 }, (_, j) => i * 8 + j)
      );
      
      let current = original;
      
      // Perform multiple DWT/IDWT cycles
      for (let cycle = 0; cycle < 3; cycle++) {
        const [LL, HL, LH, HH] = haarDWT(current);
        current = haarIDWT(LL, HL, LH, HH);
      }
      
      // Final result should still be close to original
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          expect(current[i][j]).toBeCloseTo(original[i][j], 8);
        }
      }
    });
  });
}); 