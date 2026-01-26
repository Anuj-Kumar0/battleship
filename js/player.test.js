import player from "./player.js";

describe("player.getRandomMove", () => {
  test("returns valid board coordinates", () => {
    const p = player("computer");
    const [x, y] = p.getRandomMove();

    expect(x).toBeGreaterThanOrEqual(0);
    expect(x).toBeLessThan(10);
    expect(y).toBeGreaterThanOrEqual(0);
    expect(y).toBeLessThan(10);
  });

  test("never repeats the same move", () => {
    const p = player("computer");
    const moves = new Set();

    for (let i = 0; i < 50; i++) {
      const move = p.getRandomMove().toString();
      expect(moves.has(move)).toBe(false);
      moves.add(move);
    }
  });
});
