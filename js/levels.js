const COLS = 6;
const ROWS = 6;
const EXIT_ROW = 2;

const LEVELS = [
  {
    truck: { c: 1, r: 2 },
    pieces: [{ c: 3, r: 2, w: 1, h: 2 }],
  },
  {
    truck: { c: 1, r: 2 },
    pieces: [
      { c: 3, r: 0, w: 2, h: 1 },
      { c: 3, r: 2, w: 1, h: 2 },
      { c: 3, r: 4, w: 3, h: 1 },
    ],
  },
  {
    truck: { c: 0, r: 2 },
    pieces: [
      { c: 3, r: 2, w: 1, h: 2 },
      { c: 4, r: 2, w: 1, h: 2 },
    ],
  },
  {
    truck: { c: 1, r: 2 },
    pieces: [
      { c: 3, r: 0, w: 3, h: 1, kind: "plank" },
      { c: 3, r: 2, w: 1, h: 2 },
      { c: 4, r: 2, w: 1, h: 2 },
      { c: 2, r: 4, w: 3, h: 1 },
    ],
  },
  {
    truck: { c: 1, r: 2 },
    pieces: [
      { c: 2, r: 0, w: 3, h: 1 },
      { c: 3, r: 2, w: 1, h: 2 },
      { c: 3, r: 4, w: 1, h: 2 },
    ],
  },
  {
    truck: { c: 0, r: 2 },
    pieces: [
      { c: 3, r: 0, w: 2, h: 1 },
      { c: 4, r: 2, w: 1, h: 2 },
      { c: 4, r: 4, w: 1, h: 2 },
    ],
  },
  {
    truck: { c: 1, r: 2 },
    pieces: [
      { c: 2, r: 1, w: 3, h: 1 },
      { c: 3, r: 2, w: 1, h: 2 },
      { c: 3, r: 4, w: 1, h: 2 },
    ],
  },
  {
    truck: { c: 0, r: 2 },
    pieces: [
      { c: 4, r: 0, w: 2, h: 1 },
      { c: 5, r: 2, w: 1, h: 2 },
      { c: 5, r: 4, w: 1, h: 2 },
    ],
  },
  {
    truck: { c: 1, r: 2 },
    pieces: [
      { c: 3, r: 0, w: 1, h: 2 },
      { c: 3, r: 2, w: 1, h: 2 },
      { c: 2, r: 4, w: 3, h: 1 },
    ],
  },
  {
    truck: { c: 1, r: 2 },
    pieces: [
      { c: 2, r: 0, w: 3, h: 1 },
      { c: 5, r: 0, w: 1, h: 2 },
      { c: 0, r: 3, w: 2, h: 1 },
      { c: 3, r: 2, w: 1, h: 2 },
      { c: 3, r: 4, w: 1, h: 2 },
    ],
  },
  {
    truck: { c: 1, r: 2 },
    pieces: [
      { c: 0, r: 0, w: 1, h: 2 },
      { c: 2, r: 0, w: 3, h: 1 },
      { c: 3, r: 2, w: 1, h: 2 },
      { c: 3, r: 4, w: 1, h: 2 },
    ],
  },
  {
    truck: { c: 1, r: 2 },
    pieces: [
      { c: 0, r: 0, w: 1, h: 2 },
      { c: 1, r: 0, w: 3, h: 1 },
      { c: 3, r: 2, w: 1, h: 2 },
      { c: 3, r: 4, w: 1, h: 2 },
    ],
  },
  {
    truck: { c: 1, r: 2 },
    pieces: [
      { c: 0, r: 0, w: 1, h: 2 },
      { c: 1, r: 1, w: 3, h: 1 },
      { c: 3, r: 2, w: 1, h: 2 },
      { c: 3, r: 4, w: 1, h: 2 },
    ],
  },
  {
    truck: { c: 1, r: 2 },
    pieces: [
      { c: 0, r: 0, w: 1, h: 2 },
      { c: 2, r: 1, w: 3, h: 1 },
      { c: 3, r: 2, w: 1, h: 2 },
      { c: 3, r: 4, w: 1, h: 2 },
    ],
  },
  {
    truck: { c: 2, r: 2 },
    pieces: [
      { c: 1, r: 0, w: 1, h: 2 },
      { c: 2, r: 0, w: 3, h: 1 },
      { c: 4, r: 2, w: 1, h: 2 },
      { c: 4, r: 4, w: 1, h: 2 },
    ],
  },
  {
    truck: { c: 0, r: 2 },
    pieces: [
      { c: 3, r: 0, w: 1, h: 2 },
      { c: 4, r: 0, w: 2, h: 1 },
      { c: 5, r: 2, w: 1, h: 2 },
      { c: 5, r: 4, w: 1, h: 2 },
    ],
  },
  {
    truck: { c: 1, r: 2 },
    pieces: [
      { c: 3, r: 0, w: 1, h: 2 },
      { c: 3, r: 2, w: 1, h: 2 },
      { c: 0, r: 4, w: 1, h: 2 },
      { c: 1, r: 4, w: 3, h: 1 },
    ],
  },
  {
    truck: { c: 1, r: 2 },
    pieces: [
      { c: 3, r: 0, w: 1, h: 2 },
      { c: 3, r: 2, w: 1, h: 2 },
      { c: 0, r: 4, w: 1, h: 2 },
      { c: 2, r: 4, w: 3, h: 1 },
    ],
  },
  {
    truck: { c: 2, r: 2 },
    pieces: [
      { c: 1, r: 0, w: 1, h: 2 },
      { c: 3, r: 0, w: 3, h: 1 },
      { c: 4, r: 2, w: 1, h: 2 },
      { c: 4, r: 4, w: 1, h: 2 },
    ],
  },
  {
    truck: { c: 2, r: 2 },
    pieces: [
      { c: 1, r: 0, w: 1, h: 2 },
      { c: 2, r: 1, w: 3, h: 1 },
      { c: 4, r: 2, w: 1, h: 2 },
      { c: 4, r: 4, w: 1, h: 2 },
    ],
  },
];
