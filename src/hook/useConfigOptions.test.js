import { renderHook } from "@testing-library/react";
import { useConfigOption } from "./useConfigOption";

describe("optionProps", () => {
  test("key is Date.now()", () => {
    Date.now = jest.fn(() => 1674030617777);
    const { result } = renderHook(() => useConfigOption(jest.fn(), jest.fn()));
    const { optionProps } = result.current;

    expect(optionProps.key).toBe(1674030617777);
  });
});
describe("headerProps", () => {
  describe("color", () => {
    test("hasOption() is true, then color is #00838F", () => {
      const hasOption = jest.fn(() => true);
      const { result } = renderHook(() =>
        useConfigOption(hasOption, jest.fn())
      );
      const { headerProps } = result.current;

      expect(headerProps.color).toMatchObject({ color: "#00838F" });
    });
    test("hasOption() is false, then color is #9E9E9E", () => {
      const hasOption = jest.fn(() => false);
      const { result } = renderHook(() =>
        useConfigOption(hasOption, jest.fn())
      );
      const { headerProps } = result.current;

      expect(headerProps.color).toMatchObject({ color: "#9E9E9E" });
    });
  });
  describe("reset", () => {
    test("call args.reset", () => {
      const reset = jest.fn();
      const { result } = renderHook(() => useConfigOption(jest.fn(), reset));
      const { headerProps } = result.current;

      headerProps.reset({ stopPropagation: jest.fn() });
      expect(reset).toBeCalled();
    });
    test("call e.stopPropagation", () => {
      const { result } = renderHook(() =>
        useConfigOption(jest.fn(), jest.fn())
      );
      const { headerProps } = result.current;

      const stopPropagation = jest.fn();
      headerProps.reset({ stopPropagation });
      expect(stopPropagation).toBeCalled();
    });
  });
});
