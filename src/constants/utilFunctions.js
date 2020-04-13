const isEqualArray = (A?: any, B?: any) => {
  if (!Array.isArray(A) || !Array.isArray(B) || A.length !== B.length) {
    return false;
  }

  let result = true;

  A.forEach((a: string) =>
    B.forEach((b: string) => {
      result = a === b;
    }),
  );

  return result;
};

export { isEqualArray };
