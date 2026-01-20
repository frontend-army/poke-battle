// 'CORRECT' | 'INCORRECT'| 'BIGGER' | 'SMALLER';
export const compareNumber = (target: number, guess: number) => {
  if (target === guess) {
    return "CORRECT";
  }
  return target < guess ? "SMALLER" : "BIGGER";
};
export const compareStrict = (target: unknown, guess: unknown) => {
  return target === guess ? "CORRECT" : "INCORRECT";
};

export const comparePartial = (
  target: unknown,
  otherTarget: unknown,
  guess: unknown
) => {
  if (target === guess) {
    return "CORRECT";
  }

  if (otherTarget === guess) {
    return "PARTIAL";
  }

  return "INCORRECT";
};

export const compareColors = (
  targetColors: string[],
  guessColors: string[]
) => {
  const targetSet = new Set(targetColors);
  const guessSet = new Set(guessColors);

  // Check if both sets have the same colors (exact match)
  if (
    targetSet.size === guessSet.size &&
    [...targetSet].every((color) => guessSet.has(color))
  ) {
    return "CORRECT";
  }

  // Check if there's any overlap
  const hasOverlap = [...targetSet].some((color) => guessSet.has(color));
  if (hasOverlap) {
    return "PARTIAL";
  }

  return "INCORRECT";
};
