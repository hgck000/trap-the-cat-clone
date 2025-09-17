import { describe, it, expect } from 'vitest';
import { neighborsOf } from '../features/board/hex';

describe('neighborsOf (odd-r offset)', () => {
  it('middle cell has up to 6 neighbors', () => {
    const ns = neighborsOf({ r: 5, c: 5 }, 11);
    expect(ns.length).toBe(6);
  });
  it('corner cell has fewer neighbors', () => {
  const ns = neighborsOf({ r: 0, c: 0 }, 11);
  // Góc trên trái (0,0) trong odd-r có đúng 2 neighbors: (0,1) và (1,0)
  expect(ns.length).toBe(2);
});

});
