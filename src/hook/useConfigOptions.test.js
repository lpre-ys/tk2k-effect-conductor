import { renderHook } from "@testing-library/react";
import { useConfigOption } from "./useConfigOption";

describe("optionKey", () => {
  test("key is Date.now()", () => {
    Date.now = vi.fn(() => 1674030617777);
    const { result } = renderHook(() => useConfigOption(vi.fn(), vi.fn()));
    const { optionKey } = result.current;

    expect(optionKey).toBe(1674030617777);
  });
});
describe("headerProps", () => {
  describe("color", () => {
    test("hasOption() is true, then color is #00838F", () => {
      const hasOption = vi.fn(() => true);
      const { result } = renderHook(() =>
        useConfigOption(hasOption, vi.fn())
      );
      const { headerProps } = result.current;

      expect(headerProps.color).toMatchObject({ color: "#00838F" });
    });
    test("hasOption() is false, then color is #9E9E9E", () => {
      const hasOption = vi.fn(() => false);
      const { result } = renderHook(() =>
        useConfigOption(hasOption, vi.fn())
      );
      const { headerProps } = result.current;

      expect(headerProps.color).toMatchObject({ color: "#9E9E9E" });
    });
  });
  describe("reset", () => {
    test("call args.reset", () => {
      const reset = vi.fn();
      const { result } = renderHook(() => useConfigOption(vi.fn(), reset));
      const { headerProps } = result.current;

      headerProps.reset({ stopPropagation: vi.fn() });
      expect(reset).toBeCalled();
    });
    test("call e.stopPropagation", () => {
      const { result } = renderHook(() =>
        useConfigOption(vi.fn(), vi.fn())
      );
      const { headerProps } = result.current;

      const stopPropagation = vi.fn();
      headerProps.reset({ stopPropagation });
      expect(stopPropagation).toBeCalled();
    });
  });
});
