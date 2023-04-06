import { render, screen, fireEvent } from "@testing-library/react";
import { useSelector, useDispatch } from "react-redux";
import EasePolyParams from "./EasePolyParams";

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
        x: { easingOptions: { easePoly: { exponent: 1.0 } } },
        y: { easingOptions: { easePoly: { exponent: 2.5 } } },
        scale: {
          trig: { amp: { easingOptions: { easePoly: { exponent: 4.4 } } } },
        },
        opacity: { easingOptions: { easeElastic: { amplitude: 2.5 } } },
      },
      {
        x: { easingOptions: { easePoly: { exponent: 3.0 } } },
        y: {},
        scale: { easingOptions: { easePoly: { exponent: null } } },
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

  test("type is x, then params exponent is 1.0", () => {
    render(<EasePolyParams type="x" setIsValid={jest.fn()} />);

    const target = screen.getByTestId("easepoly-exponent");
    expect(target).toHaveValue(1.0);
  });
  test("type is y, then params exponent is 2.5", () => {
    render(<EasePolyParams type="y" setIsValid={jest.fn()} />);

    const target = screen.getByTestId("easepoly-exponent");
    expect(target).toHaveValue(2.5);
  });
  test("easingOptions is empty, then params exponent is empty", () => {
    render(<EasePolyParams type="scale" setIsValid={jest.fn()} />);

    const target = screen.getByTestId("easepoly-exponent");
    expect(target).toHaveValue(null);
  });
  test("easingOptions.easePoly is empty, then params exponent is empty", () => {
    render(<EasePolyParams type="opacity" setIsValid={jest.fn()} />);

    const target = screen.getByTestId("easepoly-exponent");
    expect(target).toHaveValue(null);
  });
  test("type is trig then params is trig exponent", () => {
    render(<EasePolyParams type="scale.trig.amp" setIsValid={jest.fn()} />);

    const target = screen.getByTestId("easepoly-exponent");
    expect(target).toHaveValue(4.4);
  });
});
describe('validation', () => {
  const setIsValid = jest.fn();
  test('value is empty, then validate OK', () => {
    render(<EasePolyParams type="x" setIsValid={setIsValid} />);

    setIsValid.mockClear();
    const target = screen.getByTestId("easepoly-exponent");
    fireEvent.change(target, { target: { value: "" } });

    expect(setIsValid).toBeCalledTimes(1);
    const [isValid] = setIsValid.mock.calls[0];
    expect(isValid).toBeTruthy();
  });
  test('value is 0.1, then validate OK', () => {
    render(<EasePolyParams type="x" setIsValid={setIsValid} />);

    setIsValid.mockClear();
    const target = screen.getByTestId("easepoly-exponent");
    fireEvent.change(target, { target: { value: "0.1" } });

    expect(setIsValid).toBeCalledTimes(1);
    const [isValid] = setIsValid.mock.calls[0];
    expect(isValid).toBeTruthy();
  });
  test('value is 0, then validate NG', () => {
    render(<EasePolyParams type="x" setIsValid={setIsValid} />);

    setIsValid.mockClear();
    const target = screen.getByTestId("easepoly-exponent");
    fireEvent.change(target, { target: { value: "0" } });

    expect(setIsValid).toBeCalledTimes(1);
    const [isValid] = setIsValid.mock.calls[0];
    expect(isValid).toBeFalsy();
  });
  test('value is -0.1, then validate NG', () => {
    render(<EasePolyParams type="x" setIsValid={setIsValid} />);

    setIsValid.mockClear();
    const target = screen.getByTestId("easepoly-exponent");
    fireEvent.change(target, { target: { value: "-0.1" } });

    expect(setIsValid).toBeCalledTimes(1);
    const [isValid] = setIsValid.mock.calls[0];
    expect(isValid).toBeFalsy();
  });
});
test('onChange, then call dispatched updateEasingOptions', () => {
  render(<EasePolyParams type="opacity" setIsValid={jest.fn()} />);

  const target = screen.getByTestId("easepoly-exponent");
  dispatch.mockClear();
  fireEvent.change(target, { target: { value: "5.5" } });

  expect(dispatch).toBeCalledTimes(1);
  const [arg] = dispatch.mock.calls[0];
  const { type, payload } = arg;
  expect(type).toContain('updateEasingOptions');
  expect(payload.type).toBe('opacity');
  expect(payload.easing).toBe('easePoly');
  expect(payload.value).toEqual({ exponent: 5.5 });
});
describe('isChange', () => {
  test('exponent is 1.0, value is 1.1, then changed', () => {
    render(<EasePolyParams type="x" setIsValid={jest.fn()} />);

    const target = screen.getByTestId('easepoly-exponent');
    expect(target).toHaveValue(1.0);

    dispatch.mockClear();
    fireEvent.change(target, { target: { value: "1.1" } });

    expect(target).toHaveValue(1.1);
    expect(dispatch).toBeCalledTimes(1);
    const [arg] = dispatch.mock.calls[0];
    const { payload } = arg;
    expect(payload.value).toEqual({ exponent: 1.1 });
  });
  test('exponent is 1.0, value is 1, then not changed', () => {
    render(<EasePolyParams type="x" setIsValid={jest.fn()} />);

    const target = screen.getByTestId('easepoly-exponent');
    expect(target).toHaveValue(1.0);

    dispatch.mockClear();
    fireEvent.change(target, { target: { value: "1" } });

    expect(target).toHaveValue(1);
    expect(dispatch).not.toBeCalled();
  });
  test('exponent is 1.0, value is empty, then change to null', () => {
    render(<EasePolyParams type="x" setIsValid={jest.fn()} />);

    const target = screen.getByTestId('easepoly-exponent');
    expect(target).toHaveValue(1.0);

    fireEvent.change(target, { target: { value: "-10" } });
    dispatch.mockClear();
    fireEvent.change(target, { target: { value: "" } });

    expect(target).not.toHaveValue();
    expect(dispatch).toBeCalledTimes(1);
    const [arg] = dispatch.mock.calls[0];
    const { payload } = arg;
    expect(payload.value).toEqual({ exponent: null });
  });
  test('exponent is null, value is 0.3, then change', () => {
    state.celList.celIndex = 1;
    useSelector.mockImplementation((callback) => callback(state));

    render(<EasePolyParams type="scale" setIsValid={jest.fn()} />);

    const target = screen.getByTestId('easepoly-exponent');
    expect(target).not.toHaveValue();

    dispatch.mockClear();
    fireEvent.change(target, { target: { value: "0.3" } });

    expect(target).toHaveValue(0.3);
    expect(dispatch).toBeCalledTimes(1);
    const [arg] = dispatch.mock.calls[0];
    const { payload } = arg;
    expect(payload.value).toEqual({ exponent: 0.3 });
  });
  test('exponent is null, value is empty, then not change', () => {
    state.celList.celIndex = 1;
    useSelector.mockImplementation((callback) => callback(state));

    render(<EasePolyParams type="scale" setIsValid={jest.fn()} />);

    const target = screen.getByTestId('easepoly-exponent');
    expect(target).not.toHaveValue();

    fireEvent.change(target, { target: { value: "-10" } });
    dispatch.mockClear();
    fireEvent.change(target, { target: { value: "" } });

    expect(target).not.toHaveValue();
    expect(dispatch).not.toBeCalled();
  });
});