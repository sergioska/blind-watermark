export function haarDWT(matrix: number[][]): [number[][], number[][], number[][], number[][]] {
  const rows = matrix.length;
  const cols = matrix[0].length;

  if (rows % 2 !== 0 || cols % 2 !== 0) {
    throw new Error(`haarDWT: dimensioni dispari non supportate (rows=${rows}, cols=${cols})`);
  }

  // Step 1: transform rows
  const temp = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols / 2; c++) {
      const a = matrix[r][2 * c];
      const b = matrix[r][2 * c + 1];
      temp[r][c] = (a + b) / 2;
      temp[r][c + cols / 2] = (a - b) / 2;
    }
  }

  // Step 2: transform columns
  const LL = Array.from({ length: rows / 2 }, () => Array(cols / 2).fill(0));
  const HL = Array.from({ length: rows / 2 }, () => Array(cols / 2).fill(0));
  const LH = Array.from({ length: rows / 2 }, () => Array(cols / 2).fill(0));
  const HH = Array.from({ length: rows / 2 }, () => Array(cols / 2).fill(0));

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows / 2; r++) {
      const a = temp[2 * r][c];
      const b = temp[2 * r + 1][c];
      if (c < cols / 2) {
        LL[r][c] = (a + b) / 2;
        HL[r][c] = (a - b) / 2;
      } else {
        const cc = c - cols / 2;
        LH[r][cc] = (a + b) / 2;
        HH[r][cc] = (a - b) / 2;
      }
    }
  }

  return [LL, HL, LH, HH];
}

export function haarIDWT(LL: number[][], HL: number[][], LH: number[][], HH: number[][]): number[][] {
  const rows = LL.length * 2;
  const cols = LL[0].length * 2;

  const temp = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let c = 0; c < cols / 2; c++) {
    for (let r = 0; r < rows / 2; r++) {
      temp[2 * r][c] = LL[r][c] + HL[r][c];
      temp[2 * r + 1][c] = LL[r][c] - HL[r][c];
      temp[2 * r][c + cols / 2] = LH[r][c] + HH[r][c];
      temp[2 * r + 1][c + cols / 2] = LH[r][c] - HH[r][c];
    }
  }

  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols / 2; c++) {
      matrix[r][2 * c] = temp[r][c] + temp[r][c + cols / 2];
      matrix[r][2 * c + 1] = temp[r][c] - temp[r][c + cols / 2];
    }
  }

  return matrix;
}