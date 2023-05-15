import { screen, render } from "@testing-library/react";

import { ColorPreview } from "./ColorPreview";

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
  render(
    <ColorPreview
      red={{ from: 10, to: 20 }}
      green={{ from: 30, to: 40 }}
      blue={{ from: 50, to: 60 }}
      tkSat={{ from: 70, to: 80 }}
    />
  );

  expect(screen.getAllByTestId("mock-red")[0]).toHaveTextContent("10");
  expect(screen.getAllByTestId("mock-green")[0]).toHaveTextContent("30");
  expect(screen.getAllByTestId("mock-blue")[0]).toHaveTextContent("50");
  expect(screen.getAllByTestId("mock-sat")[0]).toHaveTextContent("70");
});

describe("To", () => {
  test("deafult, then image's parameter is config.to", () => {
    render(
      <ColorPreview
        red={{ from: 10, to: 20 }}
        green={{ from: 30, to: 40 }}
        blue={{ from: 50, to: 60 }}
        tkSat={{ from: 70, to: 80 }}
      />
    );

    expect(screen.getAllByTestId("mock-red")[1]).toHaveTextContent("20");
    expect(screen.getAllByTestId("mock-green")[1]).toHaveTextContent("40");
    expect(screen.getAllByTestId("mock-blue")[1]).toHaveTextContent("60");
    expect(screen.getAllByTestId("mock-sat")[1]).toHaveTextContent("80");
  });
  test("easing is fixed, then image's parameter is config.from", () => {
    render(
      <ColorPreview
        red={{ from: 10, to: 20, easing: "fixed" }}
        green={{ from: 30, to: 40, easing: "fixed" }}
        blue={{ from: 50, to: 60, easing: "fixed" }}
        tkSat={{ from: 70, to: 80, easing: "fixed" }}
      />
    );

    expect(screen.getAllByTestId("mock-red")[1]).toHaveTextContent("10");
    expect(screen.getAllByTestId("mock-green")[1]).toHaveTextContent("30");
    expect(screen.getAllByTestId("mock-blue")[1]).toHaveTextContent("50");
    expect(screen.getAllByTestId("mock-sat")[1]).toHaveTextContent("70");
  });
  test("mixed, then check color's config.easing", () => {
    render(
      <ColorPreview
        red={{ from: 10, to: 20, easing: "easeLinear" }}
        green={{ from: 30, to: 40, easing: "fixed" }}
        blue={{ from: 50, to: 60, easing: "easeLinear" }}
        tkSat={{ from: 70, to: 80, easing: "fixed" }}
      />
    );

    expect(screen.getAllByTestId("mock-red")[1]).toHaveTextContent("20");
    expect(screen.getAllByTestId("mock-green")[1]).toHaveTextContent("30");
    expect(screen.getAllByTestId("mock-blue")[1]).toHaveTextContent("60");
    expect(screen.getAllByTestId("mock-sat")[1]).toHaveTextContent("70");

  });
});
