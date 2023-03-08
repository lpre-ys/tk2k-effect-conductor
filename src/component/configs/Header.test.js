import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

test("style is props.color", () => {
  const mockFn = jest.fn();
  render(<Header color={{ color: "red" }} setIsOption={mockFn} />);

  const target = screen.getByTestId("config-header-icon-right");
  expect(target).toHaveStyle({ color: "red" });
});

describe("Option", () => {
  test("setIsOption is function, then show Angle icon", () => {
    const mockFn = jest.fn();
    render(<Header isOption={true} setIsOption={mockFn} />);

    const target = screen.getByTestId("config-header-icon-down");
    expect(target).toBeInTheDocument();
  });
  test("setIsOption is not function, then show Dot icon", () => {
    render(<Header isOption={true} setIsOption={null} />);

    const target = screen.getByTestId("config-header-icon-dot");
    expect(target).toBeInTheDocument();
  });
  test("isOption true, then show AngleDown", () => {
    const mockFn = jest.fn();
    render(<Header isOption={true} setIsOption={mockFn} />);

    const target = screen.getByTestId("config-header-icon-down");
    expect(target).toBeInTheDocument();
  });
  test("isOption false, then show AngleRight", () => {
    const mockFn = jest.fn();
    render(<Header isOption={false} setIsOption={mockFn} />);

    const target = screen.getByTestId("config-header-icon-right");
    expect(target).toBeInTheDocument();
  });
});

describe("validate", () => {
  test("isValid true, then no error icon", () => {
    render(<Header isValid={true} />);

    const target = screen.queryByTestId("config-header-icon-error");
    expect(target).not.toBeInTheDocument();
  });
  test("isValid false, then show error icon", () => {
    render(<Header isValid={false} />);

    const target = screen.queryByTestId("config-header-icon-error");
    expect(target).toBeInTheDocument();
  });
});

describe("sub", () => {
  describe("is not sub", () => {
    describe("heading element", () => {
      test("level is 2", () => {
        render(<Header />);

        const target = screen.getByRole("heading", { level: 2 });
        expect(target).toBeInTheDocument();
      });
      test("do not have sub style", () => {
        render(<Header />);

        const target = screen.getByRole("heading", { level: 2 });
        expect(target).not.toHaveStyle({ fontSize: '1.1em' });
      });
    });
    describe("icon do not have sub style", () => {
      test("is use Option", () => {
        const mockFn = jest.fn();
        render(<Header setIsOption={mockFn} isOption={true} />);

        const target1 = screen.getByTestId("config-header-icon-down");
        expect(target1).not.toHaveStyle({ top: "0.15em" });

        render(<Header setIsOption={mockFn} isOption={false} />);
        const target2 = screen.getByTestId("config-header-icon-right");
        expect(target2).not.toHaveStyle({ top: "0.15em" });
      });
      test("not use Option", () => {
        render(<Header />);

        const target = screen.getByTestId("config-header-icon-dot");
        expect(target).not.toHaveStyle({ top: "0.15em" });
      });
    });
  });
  describe("is sub", () => {
    describe("heading element", () => {
      test("level is 3", () => {
        render(<Header isSub={true} />);

        const target = screen.getByRole("heading", { level: 3 });
        expect(target).toBeInTheDocument();
      });
      test("have sub style", () => {
        render(<Header isSub={true} />);

        const target = screen.getByRole("heading", { level: 3 });
        expect(target).toHaveStyle({ fontSize: '1.1em' });
      });
    });
    describe("icon have sub style", () => {
      test("is use Option", () => {
        const mockFn = jest.fn();
        render(<Header isSub={true} setIsOption={mockFn} isOption={true} />);

        const target1 = screen.getByTestId("config-header-icon-down");
        expect(target1).toHaveStyle({ top: "0.15em" });

        render(<Header isSub={true} setIsOption={mockFn} isOption={false} />);
        const target2 = screen.getByTestId("config-header-icon-right");
        expect(target2).toHaveStyle({ top: "0.15em" });
      });
      test("not use Option", () => {
        render(<Header isSub={true} />);

        const target = screen.getByTestId("config-header-icon-dot");
        expect(target).toHaveStyle({ top: "0em" });
      });
    });
  });

});
