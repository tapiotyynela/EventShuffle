import {
  doesArrayContainValues,
  isArraysEqual,
} from "../../src/helpers/arrayHelpers";

describe("Array helpers", () => {
  const names1 = ["Tapio", "Esko", "Mirja"];
  const names2 = ["Tapio", "Esko", "Mirja"];
  const names3 = ["Simo", "Seppo", "Mirja"];
  const dates1 = ["2022-01-01", "2022-02-02", "2022-03-03", "2022-04-04"];
  const dates2 = ["2022-01-01", "2022-02-02"];
  const dates3 = ["2022-07-07"];

  test("should return true if two arrays are identical", () => {
    const isArraysSame = isArraysEqual(names1, names2);
    expect(isArraysSame).toBeTruthy();
  });

  test("should return false if two arrays are not identical", () => {
    const isArraysSame = isArraysEqual(names1, names3);
    expect(isArraysSame).toBeFalsy();
  });

  test("should return true if array contains given arrays all values", () => {
    const arrayContainsAll = doesArrayContainValues(dates1, dates2);
    expect(arrayContainsAll).toBeTruthy();
  });

  test("should return false if array does not contain arrays all values", () => {
    const arrayContainsAll = doesArrayContainValues(dates1, dates3);
    expect(arrayContainsAll).toBeFalsy();
  });
});
