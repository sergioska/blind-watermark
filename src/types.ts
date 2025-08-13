export interface WatermarkOptions {
  alpha?: number;
  channel?: 0 | 1 | 2;
  q?: number;          // quantization step QIM
  seed?: number;       // permutation positions
  reps?: number;       // repetitions for robustness
}

export interface WatermarkResult {
  image: Buffer;
}