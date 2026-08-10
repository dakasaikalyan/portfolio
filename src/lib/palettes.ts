/** Per-stage sky palettes: [skyTop, skyBottom, sea] */
export const STAGE_PALETTES: Record<
  number,
  {
    skyTop: [number, number, number]
    skyBottom: [number, number, number]
    sea: [number, number, number]
  }
> = {
  0: {
    skyTop: [5, 11, 20],
    skyBottom: [10, 24, 48],
    sea: [6, 18, 34],
  },
  1: {
    skyTop: [6, 12, 24],
    skyBottom: [12, 28, 52],
    sea: [7, 20, 38],
  },
  2: {
    skyTop: [28, 8, 12],
    skyBottom: [48, 14, 20],
    sea: [22, 8, 14],
  },
  3: {
    skyTop: [36, 6, 10],
    skyBottom: [56, 12, 18],
    sea: [28, 6, 12],
  },
  4: {
    skyTop: [8, 22, 28],
    skyBottom: [12, 40, 48],
    sea: [6, 28, 34],
  },
  5: {
    skyTop: [14, 24, 18],
    skyBottom: [28, 42, 24],
    sea: [10, 30, 28],
  },
  6: {
    skyTop: [5, 14, 22],
    skyBottom: [8, 32, 42],
    sea: [5, 24, 34],
  },
}
