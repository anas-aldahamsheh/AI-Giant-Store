declare global {
  function describe(name: string, fn: () => void): void;
  function it(name: string, fn: () => void | Promise<void>): void;
  function expect(actual: any): {
    toBe(expected: any): void;
    toEqual(expected: any): void;
    toBeDefined(): void;
    toContain(expected: any): void;
    toBeGreaterThan(expected: any): void;
    toBeGreaterThanOrEqual(expected: any): void;
    toBeLessThan(expected: any): void;
    toBeLessThanOrEqual(expected: any): void;
    toBeNull(): void;
    toBeFalsy(): void;
    toBeTruthy(): void;
    toBeUndefined(): void;
    toThrow(expected?: any): void;
    not: {
      toBe(expected: any): void;
      toEqual(expected: any): void;
      toBeDefined(): void;
      toContain(expected: any): void;
      toBeGreaterThan(expected: any): void;
      toBeGreaterThanOrEqual(expected: any): void;
      toBeLessThan(expected: any): void;
      toBeLessThanOrEqual(expected: any): void;
      toBeNull(): void;
      toBeFalsy(): void;
      toBeTruthy(): void;
      toBeUndefined(): void;
      toThrow(expected?: any): void;
    };
  };
}
export {};
