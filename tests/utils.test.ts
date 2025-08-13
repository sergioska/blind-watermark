import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { 
  stringToBytes, 
  bytesToString, 
  toBits, 
  u32ToBits, 
  makePermutation, 
  posMod, 
  fromBits, 
  bitsToU32 
} from '../src/utils';

describe('Utility Functions', () => {
  describe('stringToBytes', () => {
    it('should convert string to bytes correctly', () => {
      const result = stringToBytes('Hello');
      expect(result).toEqual([72, 101, 108, 108, 111]);
    });

    it('should handle empty string', () => {
      const result = stringToBytes('');
      expect(result).toEqual([]);
    });

    it('should handle special characters', () => {
      const result = stringToBytes('Hello, 世界!');
      expect(result.length).toBeGreaterThan(5);
    });
  });

  describe('bytesToString', () => {
    it('should convert bytes to string correctly', () => {
      const result = bytesToString([72, 101, 108, 108, 111]);
      expect(result).toBe('Hello');
    });

    it('should handle empty array', () => {
      const result = bytesToString([]);
      expect(result).toBe('');
    });

    it('should handle single byte', () => {
      const result = bytesToString([65]);
      expect(result).toBe('A');
    });
  });

  describe('toBits', () => {
    it('should convert bytes to bits correctly', () => {
      const result = toBits([65]); // 'A' = 65 = 01000001
      expect(result).toEqual([0, 1, 0, 0, 0, 0, 0, 1]);
    });

    it('should handle multiple bytes', () => {
      const result = toBits([65, 66]); // 'AB'
      expect(result).toEqual([
        0, 1, 0, 0, 0, 0, 0, 1, // A
        0, 1, 0, 0, 0, 0, 1, 0  // B
      ]);
    });

    it('should handle empty array', () => {
      const result = toBits([]);
      expect(result).toEqual([]);
    });
  });

  describe('u32ToBits', () => {
    it('should convert u32 to bits correctly', () => {
      const result = u32ToBits(65);
      expect(result).toHaveLength(32);
      expect(result[31]).toBe(1); // LSB should be 1 for 65
    });

    it('should handle zero', () => {
      const result = u32ToBits(0);
      expect(result).toHaveLength(32);
      expect(result.every(bit => bit === 0)).toBe(true);
    });

    it('should handle large numbers', () => {
      const result = u32ToBits(4294967295); // Max u32
      expect(result).toHaveLength(32);
      expect(result.every(bit => bit === 1)).toBe(true);
    });
  });

  describe('bitsToU32', () => {
    it('should convert bits to u32 correctly', () => {
      const bits = new Array(32).fill(0);
      bits[31] = 1; // 65 in 32 bits (LSB = 1)
      const result = bitsToU32(bits, 0);
      expect(result).toBe(1);
    });

    it('should handle 32 bits', () => {
      const bits = new Array(32).fill(1); // All 1s
      const result = bitsToU32(bits, 0);
      expect(result).toBe(4294967295); // Max u32
    });

    it('should handle offset', () => {
      const bits = new Array(36).fill(0);
      bits[35] = 1; // 1 at offset 4 (position 35)
      const result = bitsToU32(bits, 4);
      expect(result).toBe(1);
    });
  });

  describe('makePermutation', () => {
    it('should create permutation of correct length', () => {
      const result = makePermutation(10, 1234);
      expect(result).toHaveLength(10);
    });

    it('should create unique indices', () => {
      const result = makePermutation(100, 1234);
      const uniqueIndices = new Set(result);
      expect(uniqueIndices.size).toBe(100);
    });

    it('should be deterministic with same seed', () => {
      const result1 = makePermutation(50, 1234);
      const result2 = makePermutation(50, 1234);
      expect(result1).toEqual(result2);
    });

    it('should be different with different seeds', () => {
      const result1 = makePermutation(50, 1234);
      const result2 = makePermutation(50, 5678);
      expect(result1).not.toEqual(result2);
    });
  });

  describe('posMod', () => {
    it('should return positive modulo', () => {
      expect(posMod(7, 5)).toBe(2);
      expect(posMod(-3, 5)).toBe(2);
      expect(posMod(10, 5)).toBe(0);
    });

    it('should handle edge cases', () => {
      expect(posMod(0, 5)).toBe(0);
      expect(posMod(5, 5)).toBe(0);
      expect(posMod(-5, 5)).toBe(0);
    });
  });

  describe('fromBits', () => {
    it('should convert bits to bytes correctly', () => {
      const bits = [0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0]; // "AB"
      const result = fromBits(bits);
      expect(result).toEqual([65, 66]);
    });

    it('should handle incomplete byte', () => {
      const bits = [0, 1, 0, 0, 0, 0, 0]; // 7 bits
      const result = fromBits(bits);
      expect(result).toEqual([]); // fromBits requires complete bytes
    });

    it('should handle empty array', () => {
      const result = fromBits([]);
      expect(result).toEqual([]);
    });

    it('should handle single bit', () => {
      const result = fromBits([1]);
      expect(result).toEqual([]); // fromBits requires complete bytes
    });
  });

  describe('Round-trip conversions', () => {
    it('should convert string to bytes and back correctly', () => {
      const original = 'Hello, World!';
      const bytes = stringToBytes(original);
      const result = bytesToString(bytes);
      expect(result).toBe(original);
    });

    it('should convert bytes to bits and back correctly', () => {
      const original = [65, 66, 67]; // "ABC"
      const bits = toBits(original);
      const result = fromBits(bits);
      expect(result).toEqual(original);
    });

    it('should convert u32 to bits and back correctly', () => {
      const original = 12345;
      const bits = u32ToBits(original);
      const result = bitsToU32(bits, 0);
      expect(result).toBe(original);
    });
  });

  describe('Edge cases', () => {
    it('should handle very long strings', () => {
      const longString = 'A'.repeat(1000);
      const bytes = stringToBytes(longString);
      const result = bytesToString(bytes);
      expect(result).toBe(longString);
    });

    it('should handle very long bit arrays', () => {
      const longBits = new Array(1000).fill(1);
      const bytes = fromBits(longBits);
      expect(bytes.length).toBe(125); // 1000 bits = 125 bytes
    });

    it('should handle permutation with size 1', () => {
      const result = makePermutation(1, 1234);
      expect(result).toEqual([0]);
    });

    it('should handle permutation with size 0', () => {
      const result = makePermutation(0, 1234);
      expect(result).toEqual([]);
    });
  });
}); 