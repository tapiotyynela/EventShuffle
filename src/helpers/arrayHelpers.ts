export const isArraysEqual = (array1: string[], array2: string[]) => {
    if (array1.length === array2.length) {
        return array1.every(element => {
          if (array2.includes(element)) return true;
          return false;
        });
      }
      return false;
}

export const doesArrayContainValues = (array: string[], contains: string[]) => {
  if (array.length === contains.length || array.length > contains.length) {
    return contains.every(element => {
      if (array.includes(element)) return true;
      return false;
    });
  }
  return false;
}