import toFloatOrNull from "./toFloatOrNull";

test("value is empty, then null", () => {
  const result = toFloatOrNull("");
  expect(result).toBeNull();
});

test("value is 1.10, then float 1.1", () => {
  const result = toFloatOrNull("1.10");
  expect(result).toBe(1.1);
});
