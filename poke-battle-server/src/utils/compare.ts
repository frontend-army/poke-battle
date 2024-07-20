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
