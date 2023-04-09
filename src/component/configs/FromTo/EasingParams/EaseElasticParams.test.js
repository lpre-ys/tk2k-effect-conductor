import { render, screen, fireEvent } from "@testing-library/react";
import { useSelector, useDispatch } from "react-redux";
import EaseElasticParams from "./EaseElasticParams";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

const dispatch = jest.fn();

const state = {
  celList: {
    celIndex: 0,
    list: [
      {
        x: { easingOptions: { easeElastic: { amplitude: 1.0, period: null } } },
        y: { easingOptions: { easeElastic: { amplitude: null, period: 0.2 } } },
        scale: {
          trig: {
            amp: {
              easingOptions: { easeElastic: { amplitude: 4.4, period: 4.5 } },
            },
          },
        },
        opacity: { easingOptions: { easeBack: { overshoot: 2.6 } } },
      },
      {
        x: { easingOptions: { easeElastic: { amplitude: 3.0 } } },
        y: {},
        scale: { easingOptions: { easeElastic: { amplitude: null, period: null } } },
      },
    ],
  },
};
beforeEach(() => {
  state.celList.celIndex = 0;
  useSelector.mockImplementation((callback) => callback(state));
  useDispatch.mockImplementation(() => dispatch);
});

afterEach(() => {
  useSelector.mockClear();
  useDispatch.mockClear();
  dispatch.mockClear();
});
describe("INIT params", () => {
  test("type is x, then params amplitude is 1.0, period is null", () => {
    render(<EaseElasticParams type="x" setIsValid={jest.fn()} />);

    const amplitude = screen.getByTestId("easeelastic-amplitude");
    const period = screen.getByTestId("easeelastic-period");
    expect(amplitude).toHaveValue(1.0);
    expect(period).not.toHaveValue();
  });
  test("type is y, then params amplitude is 0.2", () => {
    render(<EaseElasticParams type="y" setIsValid={jest.fn()} />);

    const amplitude = screen.getByTestId("easeelastic-amplitude");
    const period = screen.getByTestId("easeelastic-period");
    expect(amplitude).not.toHaveValue();
    expect(period).toHaveValue(0.2);
  });
  test("easingOptions is empty, then params amplitude is empty", () => {
    render(<EaseElasticParams type="scale" setIsValid={jest.fn()} />);

    const amp = screen.getByTestId("easeelastic-amplitude");
    const period = screen.getByTestId("easeelastic-period");
    expect(amp).not.toHaveValue();
    expect(period).not.toHaveValue();
  });
  test("easingOptions.easeElastic is empty, then params is empty", () => {
    render(<EaseElasticParams type="opacity" setIsValid={jest.fn()} />);

    const amp = screen.getByTestId("easeelastic-amplitude");
    const period = screen.getByTestId("easeelastic-period");
    expect(amp).not.toHaveValue();
    expect(period).not.toHaveValue();
  });
  test("type is trig then params is trig amplitude and period", () => {
    render(<EaseElasticParams type="scale.trig.amp" setIsValid={jest.fn()} />);

    const amp = screen.getByTestId("easeelastic-amplitude");
    const period = screen.getByTestId("easeelastic-period");
    expect(amp).toHaveValue(4.4);
    expect(period).toHaveValue(4.5);
  });
});
describe("validation", () => {
  const setIsValid = jest.fn();
  describe("amplitude", () => {
    test("value is empty, then validate OK", () => {
      render(<EaseElasticParams type="x" setIsValid={setIsValid} />);

      setIsValid.mockClear();
      const target = screen.getByTestId("easeelastic-amplitude");
      fireEvent.change(target, { target: { value: "" } });

      expect(setIsValid).toBeCalledTimes(1);
      const [isValid] = setIsValid.mock.calls[0];
      expect(isValid).toBeTruthy();
    });
    test("value is 1.1, then validate OK", () => {
      render(<EaseElasticParams type="x" setIsValid={setIsValid} />);

      setIsValid.mockClear();
      const target = screen.getByTestId("easeelastic-amplitude");
      fireEvent.change(target, { target: { value: "1.1" } });

      expect(setIsValid).toBeCalledTimes(1);
      const [isValid] = setIsValid.mock.calls[0];
      expect(isValid).toBeTruthy();
    });
    test("value is 1.0, then validate OK", () => {
      render(<EaseElasticParams type="x" setIsValid={setIsValid} />);

      setIsValid.mockClear();
      const target = screen.getByTestId("easeelastic-amplitude");
      fireEvent.change(target, { target: { value: "1.0" } });

      expect(setIsValid).toBeCalledTimes(1);
      const [isValid] = setIsValid.mock.calls[0];
      expect(isValid).toBeTruthy();
    });
    test("value is 0.9, then validate NG", () => {
      render(<EaseElasticParams type="x" setIsValid={setIsValid} />);

      setIsValid.mockClear();
      const target = screen.getByTestId("easeelastic-amplitude");
      fireEvent.change(target, { target: { value: "0.9" } });

      expect(setIsValid).toBeCalledTimes(1);
      const [isValid] = setIsValid.mock.calls[0];
      expect(isValid).toBeFalsy();
    });
  });
  describe("period", () => {
    test("value is empty, then validate OK", () => {
      render(<EaseElasticParams type="y" setIsValid={setIsValid} />);

      setIsValid.mockClear();
      const target = screen.getByTestId("easeelastic-period");
      fireEvent.change(target, { target: { value: "" } });

      expect(setIsValid).toBeCalledTimes(1);
      const [isValid] = setIsValid.mock.calls[0];
      expect(isValid).toBeTruthy();
    });
    test("value is 0.1, then validate OK", () => {
      render(<EaseElasticParams type="y" setIsValid={setIsValid} />);

      setIsValid.mockClear();
      const target = screen.getByTestId("easeelastic-period");
      fireEvent.change(target, { target: { value: "0.1" } });

      expect(setIsValid).toBeCalledTimes(1);
      const [isValid] = setIsValid.mock.calls[0];
      expect(isValid).toBeTruthy();
    });
    test("value is 0.0, then validate NG", () => {
      render(<EaseElasticParams type="y" setIsValid={setIsValid} />);

      setIsValid.mockClear();
      const target = screen.getByTestId("easeelastic-period");
      fireEvent.change(target, { target: { value: "0.0" } });

      expect(setIsValid).toBeCalledTimes(1);
      const [isValid] = setIsValid.mock.calls[0];
      expect(isValid).toBeFalsy();
    });
    test("value is -0.1, then validate NG", () => {
      render(<EaseElasticParams type="y" setIsValid={setIsValid} />);

      setIsValid.mockClear();
      const target = screen.getByTestId("easeelastic-period");
      fireEvent.change(target, { target: { value: "-0.1" } });

      expect(setIsValid).toBeCalledTimes(1);
      const [isValid] = setIsValid.mock.calls[0];
      expect(isValid).toBeFalsy();
    });
  });
});
describe("update", () => {
  test("change amplitude, then call dispatched updateEasingOptions", () => {
    render(<EaseElasticParams type="opacity" setIsValid={jest.fn()} />);

    const target = screen.getByTestId("easeelastic-amplitude");
    dispatch.mockClear();
    fireEvent.change(target, { target: { value: "5.5" } });

    expect(dispatch).toBeCalledTimes(1);
    const [arg] = dispatch.mock.calls[0];
    const { type, payload } = arg;
    expect(type).toContain("updateEasingOptions");
    expect(payload.type).toBe("opacity");
    expect(payload.easing).toBe("easeElastic");
    expect(payload.value).toEqual({ amplitude: 5.5, period: null });
  });
  test("change period, then call dispatched updateEasingOptions", () => {
    render(<EaseElasticParams type="opacity" setIsValid={jest.fn()} />);

    const target = screen.getByTestId("easeelastic-period");
    dispatch.mockClear();
    fireEvent.change(target, { target: { value: "5.6" } });

    expect(dispatch).toBeCalledTimes(1);
    const [arg] = dispatch.mock.calls[0];
    const { type, payload } = arg;
    expect(type).toContain("updateEasingOptions");
    expect(payload.type).toBe("opacity");
    expect(payload.easing).toBe("easeElastic");
    expect(payload.value).toEqual({ period: 5.6, amplitude: null });
  });
});
describe("isChange", () => {
  describe("amplitude", () => {
    test("amplitude is 1.0, value is 1.1, then changed", () => {
      render(<EaseElasticParams type="x" setIsValid={jest.fn()} />);

      const target = screen.getByTestId("easeelastic-amplitude");
      expect(target).toHaveValue(1.0);

      dispatch.mockClear();
      fireEvent.change(target, { target: { value: "1.1" } });

      expect(target).toHaveValue(1.1);
      expect(dispatch).toBeCalledTimes(1);
      const [arg] = dispatch.mock.calls[0];
      const { payload } = arg;
      expect(payload.value).toEqual({ amplitude: 1.1, period: null });
    });
    test("amplitude is 1.0, value is 1, then not changed", () => {
      render(<EaseElasticParams type="x" setIsValid={jest.fn()} />);

      const target = screen.getByTestId("easeelastic-amplitude");
      expect(target).toHaveValue(1.0);

      dispatch.mockClear();
      fireEvent.change(target, { target: { value: "1" } });

      expect(target).toHaveValue(1);
      expect(dispatch).not.toBeCalled();
    });
    test("amplitude is 1.0, value is empty, then change to null", () => {
      render(<EaseElasticParams type="x" setIsValid={jest.fn()} />);

      const target = screen.getByTestId("easeelastic-amplitude");
      expect(target).toHaveValue(1.0);

      fireEvent.change(target, { target: { value: "-10" } });
      dispatch.mockClear();
      fireEvent.change(target, { target: { value: "" } });

      expect(target).not.toHaveValue();
      expect(dispatch).toBeCalledTimes(1);
      const [arg] = dispatch.mock.calls[0];
      const { payload } = arg;
      expect(payload.value).toEqual({ amplitude: null, period: null });
    });
    test("amplitude is null, value is 1.3, then change", () => {
      state.celList.celIndex = 1;
      useSelector.mockImplementation((callback) => callback(state));

      render(<EaseElasticParams type="scale" setIsValid={jest.fn()} />);

      const target = screen.getByTestId("easeelastic-amplitude");
      expect(target).not.toHaveValue();

      dispatch.mockClear();
      fireEvent.change(target, { target: { value: "1.3" } });

      expect(target).toHaveValue(1.3);
      expect(dispatch).toBeCalledTimes(1);
      const [arg] = dispatch.mock.calls[0];
      const { payload } = arg;
      expect(payload.value).toEqual({ amplitude: 1.3, period: null });
    });
    test("amplitude is null, value is empty, then not change", () => {
      state.celList.celIndex = 1;
      useSelector.mockImplementation((callback) => callback(state));

      render(<EaseElasticParams type="scale" setIsValid={jest.fn()} />);

      const target = screen.getByTestId("easeelastic-amplitude");
      expect(target).not.toHaveValue();

      fireEvent.change(target, { target: { value: "-10" } });
      dispatch.mockClear();
      fireEvent.change(target, { target: { value: "" } });

      expect(target).not.toHaveValue();
      expect(dispatch).not.toBeCalled();
    });
  });
  describe("period", () => {
    test("period is 0.2, value is 0.4, then changed", () => {
      render(<EaseElasticParams type="y" setIsValid={jest.fn()} />);

      const target = screen.getByTestId("easeelastic-period");
      expect(target).toHaveValue(0.2);

      dispatch.mockClear();
      fireEvent.change(target, { target: { value: "0.4" } });

      expect(target).toHaveValue(0.4);
      expect(dispatch).toBeCalledTimes(1);
      const [arg] = dispatch.mock.calls[0];
      const { payload } = arg;
      expect(payload.value).toEqual({ amplitude: null, period: 0.4 });
    });
    test("period is 0.2, value is 0.20, then not changed", () => {
      render(<EaseElasticParams type="y" setIsValid={jest.fn()} />);

      const target = screen.getByTestId("easeelastic-period");
      expect(target).toHaveValue(0.2);

      dispatch.mockClear();
      fireEvent.change(target, { target: { value: "0.20" } });

      expect(target).toHaveValue(0.2);
      expect(dispatch).not.toBeCalled();
    });
    test("period is 0.2, value is empty, then change to null", () => {
      render(<EaseElasticParams type="y" setIsValid={jest.fn()} />);

      const target = screen.getByTestId("easeelastic-period");
      expect(target).toHaveValue(0.2);

      fireEvent.change(target, { target: { value: "-10" } });
      dispatch.mockClear();
      fireEvent.change(target, { target: { value: "" } });

      expect(target).not.toHaveValue();
      expect(dispatch).toBeCalledTimes(1);
      const [arg] = dispatch.mock.calls[0];
      const { payload } = arg;
      expect(payload.value).toEqual({ amplitude: null, period: null });
    });
    test("period is null, value is 0.4, then change", () => {
      state.celList.celIndex = 1;
      useSelector.mockImplementation((callback) => callback(state));

      render(<EaseElasticParams type="scale" setIsValid={jest.fn()} />);

      const target = screen.getByTestId("easeelastic-period");
      expect(target).not.toHaveValue();

      dispatch.mockClear();
      fireEvent.change(target, { target: { value: "0.4" } });

      expect(target).toHaveValue(0.4);
      expect(dispatch).toBeCalledTimes(1);
      const [arg] = dispatch.mock.calls[0];
      const { payload } = arg;
      expect(payload.value).toEqual({ period: 0.4, amplitude: null });
    });
    test("period is null, value is empty, then not change", () => {
      state.celList.celIndex = 1;
      useSelector.mockImplementation((callback) => callback(state));

      render(<EaseElasticParams type="scale" setIsValid={jest.fn()} />);

      const target = screen.getByTestId("easeelastic-period");
      expect(target).not.toHaveValue();

      fireEvent.change(target, { target: { value: "-10" } });
      dispatch.mockClear();
      fireEvent.change(target, { target: { value: "" } });

      expect(target).not.toHaveValue();
      expect(dispatch).not.toBeCalled();
    });
  });
});
