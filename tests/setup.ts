// Global test setup
import { jest } from '@jest/globals';

// Increase timeout for image processing tests
jest.setTimeout(10000);

// Mock console.warn to avoid noise in tests
global.console.warn = jest.fn();

// Setup test environment
process.env.NODE_ENV = 'test'; 