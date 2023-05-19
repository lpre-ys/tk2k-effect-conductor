import merge from "deepmerge";
import { screen, render } from "@testing-library/react";

import { ColorPreview } from "./ColorPreview";

const DEFAULT_CONFIG = {
  red: {
    from: 10,
    to: 20,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  green: {
    from: 30,
    to: 40,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  blue: {
    from: 50,
    to: 60,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  tkSat: {
    from: 70,
    to: 80,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  hsv: {
    min: 0,
    max: 100,
    isHsv: false,
  },
  hue: {
    from: 100,
    to: 200,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  sat: {
    from: 15,
    to: 25,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  val: {
    from: 35,
    to: 45,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  pattern: {
    start: 1,
    end: 1,
    isRoundTrip: false,
    align: "loop",
    customPattern: [],
    isCustom: false,
  },
};

jest.mock(
  "./Pattern/PatternImage.jsx",
  () =>
    ({ config, red, green, blue, sat }) => {
      return (
        <div>
          <p data-testid="mock-red">{red}</p>
          <p data-testid="mock-green">{green}</p>
          <p data-testid="mock-blue">{blue}</p>
          <p data-testid="mock-sat">{sat}</p>
        </div>
      );
    }
);
test("From image's parameter is config.from", () => {
  render(<ColorPreview config={DEFAULT_CONFIG} />);

  expect(screen.getAllByTestId("mock-red")[0]).toHaveTextContent("10");
  expect(screen.getAllByTestId("mock-green")[0]).toHaveTextContent("30");
  expect(screen.getAllByTestId("mock-blue")[0]).toHaveTextContent("50");
  expect(screen.getAllByTestId("mock-sat")[0]).toHaveTextContent("70");
});

describe("To", () => {
  test("easing is easeX, then image's parameter is config.to", () => {
    const config = merge({}, DEFAULT_CONFIG);
    config.red.easing = "easeLinear";
    config.green.easing = "easeLinear";
    config.blue.easing = "easeLinear";
    config.tkSat.easing = "easeLinear";
    render(<ColorPreview config={config} />);

    expect(screen.getAllByTestId("mock-red")[1]).toHaveTextContent("20");
    expect(screen.getAllByTestId("mock-green")[1]).toHaveTextContent("40");
    expect(screen.getAllByTestId("mock-blue")[1]).toHaveTextContent("60");
    expect(screen.getAllByTestId("mock-sat")[1]).toHaveTextContent("80");
  });
  test("easing is fixed, then image's parameter is config.from", () => {
    const config = merge({}, DEFAULT_CONFIG);
    config.red.easing = "fixed";
    config.green.easing = "fixed";
    config.blue.easing = "fixed";
    config.tkSat.easing = "fixed";
    render(<ColorPreview config={config} />);

    expect(screen.getAllByTestId("mock-red")[1]).toHaveTextContent("10");
    expect(screen.getAllByTestId("mock-green")[1]).toHaveTextContent("30");
    expect(screen.getAllByTestId("mock-blue")[1]).toHaveTextContent("50");
    expect(screen.getAllByTestId("mock-sat")[1]).toHaveTextContent("70");
  });
  test("mixed, then check color's config.easing", () => {
    const config = merge({}, DEFAULT_CONFIG);
    config.red.easing = "easeLinear";
    config.green.easing = "fixed";
    config.blue.easing = "easeLinear";
    config.tkSat.easing = "fixed";
    render(<ColorPreview config={config} />);

    expect(screen.getAllByTestId("mock-red")[1]).toHaveTextContent("20");
    expect(screen.getAllByTestId("mock-green")[1]).toHaveTextContent("30");
    expect(screen.getAllByTestId("mock-blue")[1]).toHaveTextContent("60");
    expect(screen.getAllByTestId("mock-sat")[1]).toHaveTextContent("70");

  });
});

describe('HSV mode', () => {
  test('OFF, then use RGB color', () => {
    const config = merge({}, DEFAULT_CONFIG);
    config.hsv.isHsv = false;
    render(<ColorPreview config={config} />);

    // FROM
    expect(screen.getAllByTestId("mock-red")[0]).toHaveTextContent("10");
    expect(screen.getAllByTestId("mock-green")[0]).toHaveTextContent("30");
    expect(screen.getAllByTestId("mock-blue")[0]).toHaveTextContent("50");
    expect(screen.getAllByTestId("mock-sat")[0]).toHaveTextContent("70");
    // TO
    expect(screen.getAllByTestId("mock-red")[1]).toHaveTextContent("20");
    expect(screen.getAllByTestId("mock-green")[1]).toHaveTextContent("40");
    expect(screen.getAllByTestId("mock-blue")[1]).toHaveTextContent("60");
    expect(screen.getAllByTestId("mock-sat")[1]).toHaveTextContent("80");
  });
  test('ON, then use HSV color', () => {
    const config = merge({}, DEFAULT_CONFIG);
    config.hsv.isHsv = true;
    render(<ColorPreview config={config} />);

    // FROM
    expect(screen.getAllByTestId("mock-red")[0]).toHaveTextContent("31");
    expect(screen.getAllByTestId("mock-green")[0]).toHaveTextContent("35");
    expect(screen.getAllByTestId("mock-blue")[0]).toHaveTextContent("30");
    expect(screen.getAllByTestId("mock-sat")[0]).toHaveTextContent("70");
    // TO
    expect(screen.getAllByTestId("mock-red")[1]).toHaveTextContent("34");
    expect(screen.getAllByTestId("mock-green")[1]).toHaveTextContent("41");
    expect(screen.getAllByTestId("mock-blue")[1]).toHaveTextContent("45");
    expect(screen.getAllByTestId("mock-sat")[1]).toHaveTextContent("80");
  });
});