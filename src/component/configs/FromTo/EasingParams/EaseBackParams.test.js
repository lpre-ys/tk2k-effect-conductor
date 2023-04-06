import { render, screen, fireEvent } from "@testing-library/react";
import { useSelector, useDispatch } from "react-redux";
import EaseBackParams from "./EaseBackParams";

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
        x: { easingOptions: { easeBack: { overshoot: 1.0 } } },
        y: { easingOptions: { easeBack: { overshoot: 2.5 } } },
        scale: {
          trig: { amp: { easingOptions: { easeBack: { overshoot: 4.4 } } } },
        },
        opacity: { easingOptions: { easeElastic: { amplitude: 2.5 } } },
      },
      {
        x: { easingOptions: { easeBack: { overshoot: 3.0 } } },
        y: {},
        scale: { easingOptions: { easeBack: { overshoot: null } } },
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

  test("type is x, then params overshoot is 1.0", () => {
    render(<EaseBackParams type="x" setIsValid={jest.fn()} />);

    const target = screen.getByTestId("easeback-overshoot");
    expect(target).toHaveValue(1.0);
  });
  test("type is y, then params overshoot is 2.5", () => {
    render(<EaseBackParams type="y" setIsValid={jest.fn()} />);

    const target = screen.getByTestId("easeback-overshoot");
    expect(target).toHaveValue(2.5);
  });
  test("easingOptions is empty, then params overshoot is empty", () => {
    render(<EaseBackParams type="scale" setIsValid={jest.fn()} />);

    const target = screen.getByTestId("easeback-overshoot");
    expect(target).toHaveValue(null);
  });
  test("easingOptions.easeBack is empty, then params overshoot is empty", () => {
    render(<EaseBackParams type="opacity" setIsValid={jest.fn()} />);

    const target = screen.getByTestId("easeback-overshoot");
    expect(target).toHaveValue(null);
  });
  test("type is trig then params is trig overshoot", () => {
    render(<EaseBackParams type="scale.trig.amp" setIsValid={jest.fn()} />);

    const target = screen.getByTestId("easeback-overshoot");
    expect(target).toHaveValue(4.4);
  });
});
describe('validation', () => {
  const setIsValid = jest.fn();
  test('value is empty, then validate OK', () => {
    render(<EaseBackParams type="x" setIsValid={setIsValid} />);

    setIsValid.mockClear();
    const target = screen.getByTestId("easeback-overshoot");
    fireEvent.change(target, { target: { value: "" } });

    expect(setIsValid).toBeCalledTimes(1);
    const [isValid] = setIsValid.mock.calls[0];
    expect(isValid).toBeTruthy();
  });
  test('value is 0.1, then validate OK', () => {
    render(<EaseBackParams type="x" setIsValid={setIsValid} />);

    setIsValid.mockClear();
    const target = screen.getByTestId("easeback-overshoot");
    fireEvent.change(target, { target: { value: "0.1" } });

    expect(setIsValid).toBeCalledTimes(1);
    const [isValid] = setIsValid.mock.calls[0];
    expect(isValid).toBeTruthy();
  });
  test('value is 0, then validate NG', () => {
    render(<EaseBackParams type="x" setIsValid={setIsValid} />);

    setIsValid.mockClear();
    const target = screen.getByTestId("easeback-overshoot");
    fireEvent.change(target, { target: { value: "0" } });

    expect(setIsValid).toBeCalledTimes(1);
    const [isValid] = setIsValid.mock.calls[0];
    expect(isValid).toBeFalsy();
  });
  test('value is -0.1, then validate NG', () => {
    render(<EaseBackParams type="x" setIsValid={setIsValid} />);

    setIsValid.mockClear();
    const target = screen.getByTestId("easeback-overshoot");
    fireEvent.change(target, { target: { value: "-0.1" } });

    expect(setIsValid).toBeCalledTimes(1);
    const [isValid] = setIsValid.mock.calls[0];
    expect(isValid).toBeFalsy();
  });
});
test('onChange, then call dispatched updateEasingOptions', () => {
  render(<EaseBackParams type="opacity" setIsValid={jest.fn()} />);

  const target = screen.getByTestId("easeback-overshoot");
  dispatch.mockClear();
  fireEvent.change(target, { target: { value: "5.5" } });

  expect(dispatch).toBeCalledTimes(1);
  const [arg] = dispatch.mock.calls[0];
  const { type, payload } = arg;
  expect(type).toContain('updateEasingOptions');
  expect(payload.type).toBe('opacity');
  expect(payload.easing).toBe('easeBack');
  expect(payload.value).toEqual({ overshoot: 5.5 });
});
describe('isChange', () => {
  test('overshoot is 1.0, value is 1.1, then changed', () => {
    render(<EaseBackParams type="x" setIsValid={jest.fn()} />);

    const target = screen.getByTestId('easeback-overshoot');
    expect(target).toHaveValue(1.0);

    dispatch.mockClear();
    fireEvent.change(target, { target: { value: "1.1" } });

    expect(target).toHaveValue(1.1);
    expect(dispatch).toBeCalledTimes(1);
    const [arg] = dispatch.mock.calls[0];
    const { payload } = arg;
    expect(payload.value).toEqual({ overshoot: 1.1 });
  });
  test('overshoot is 1.0, value is 1, then not changed', () => {
    render(<EaseBackParams type="x" setIsValid={jest.fn()} />);

    const target = screen.getByTestId('easeback-overshoot');
    expect(target).toHaveValue(1.0);

    dispatch.mockClear();
    fireEvent.change(target, { target: { value: "1" } });

    expect(target).toHaveValue(1);
    expect(dispatch).not.toBeCalled();
  });
  test('overshoot is 1.0, value is empty, then change to null', () => {
    render(<EaseBackParams type="x" setIsValid={jest.fn()} />);

    const target = screen.getByTestId('easeback-overshoot');
    expect(target).toHaveValue(1.0);

    fireEvent.change(target, { target: { value: "-10" } });
    dispatch.mockClear();
    fireEvent.change(target, { target: { value: "" } });

    expect(target).not.toHaveValue();
    expect(dispatch).toBeCalledTimes(1);
    const [arg] = dispatch.mock.calls[0];
    const { payload } = arg;
    expect(payload.value).toEqual({ overshoot: null });
  });
  test('overshoot is null, value is 0.3, then change', () => {
    state.celList.celIndex = 1;
    useSelector.mockImplementation((callback) => callback(state));

    render(<EaseBackParams type="scale" setIsValid={jest.fn()} />);

    const target = screen.getByTestId('easeback-overshoot');
    expect(target).not.toHaveValue();

    dispatch.mockClear();
    fireEvent.change(target, { target: { value: "0.3" } });

    expect(target).toHaveValue(0.3);
    expect(dispatch).toBeCalledTimes(1);
    const [arg] = dispatch.mock.calls[0];
    const { payload } = arg;
    expect(payload.value).toEqual({ overshoot: 0.3 });
  });
  test('overshoot is null, value is empty, then not change', () => {
    state.celList.celIndex = 1;
    useSelector.mockImplementation((callback) => callback(state));

    render(<EaseBackParams type="scale" setIsValid={jest.fn()} />);

    const target = screen.getByTestId('easeback-overshoot');
    expect(target).not.toHaveValue();

    fireEvent.change(target, { target: { value: "-10" } });
    dispatch.mockClear();
    fireEvent.change(target, { target: { value: "" } });

    expect(target).not.toHaveValue();
    expect(dispatch).not.toBeCalled();
  });
});