import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import App from "./App";
import makeTransparentImage from "./util/makeTransparentImage";

const INIT_MATERIAL = {
  originalImage: null,
  transparentImage: null,
  maxPage: 0,
  transparentColor: null,
  bgColor: "transparent",
};

const INIT_CEL_CONFIG = {
  x: {
    from: 0,
    to: 0,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  y: {
    from: 0,
    to: 0,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  scale: {
    from: 100,
    to: 100,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  opacity: {
    from: 0,
    to: 0,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  frame: { start: 1, volume: 20 }, // 20: INIT_MAX_FRAME
  page: { start: 1, end: 1 },
};
jest.mock(
  "./component/Material",
  () =>
    ({ loadImage, msg, material, changeTrColor, changeMaterial }) => {
      return (
        <div data-testid="material">
          <button
            type="button"
            data-testid="material-load-image"
            onClick={() => {
              loadImage("data", "test.png");
            }}
          />
          <input
            type="text"
            data-testid="material-change-trcolor"
            defaultValue=""
            onChange={({ target }) => {
              changeTrColor(
                ...target.value.split(",").map((v) => parseInt(v.trim()))
              );
            }}
          />
          <input
            type="text"
            data-testid="material-change-material"
            defaultValue=""
            onChange={({ target }) => {
              const [type, value] = target.value
                .split(":")
                .map((v) => v.trim());
              changeMaterial(type, value);
            }}
          />
          <p data-testid="material-msg">{msg}</p>
          <p data-testid="material-bgcolor">{material.bgColor}</p>
          <p data-testid="material-material-json">{JSON.stringify(material)}</p>
        </div>
      );
    }
);

jest.mock("./util/makeTransparentImage");

// * Material *
describe("<Material />", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("has Material component", () => {
    render(<App />);

    const target = screen.getByTestId("material");
    expect(target).toBeInTheDocument();
  });
  test("material is App.material", () => {
    render(<App />);

    const target = screen.getByTestId("material-material-json");
    expect(JSON.parse(target.textContent)).toEqual(INIT_MATERIAL);
  });
  describe("handleLoadImage", () => {
    test("resolved, then update material and reset msg", async () => {
      const mockMake = makeTransparentImage;
      mockMake.mockResolvedValue({
        transparent: "transparent-image",
        maxPage: 42,
        trColor: "test-trcolor",
      });
      render(<App />);

      fireEvent.click(screen.getByTestId("material-load-image"));

      expect(mockMake).toBeCalled();
      await waitFor(() => {
        const targetMsg = screen.getByTestId("material-msg");
        expect(targetMsg).toHaveTextContent("");
      });
      await waitFor(() => {
        const targetMaterial = screen.getByTestId("material-material-json");
        const expectData = {
          originalImage: "data",
          transparentImage: "transparent-image",
          maxPage: 42,
          transparentColor: "test-trcolor",
          bgColor: "transparent",
        };
        expect(JSON.parse(targetMaterial.textContent)).toEqual(expectData);
      });
      await waitFor(() => {
        const targetName = screen.getByLabelText("素材ファイル:");
        expect(targetName).toHaveValue("test.png");
      });
    });
    test("rejected width, then show message", async () => {
      const mockMake = makeTransparentImage;
      mockMake.mockRejectedValue(new Error("width"));
      render(<App />);
      fireEvent.click(screen.getByTestId("material-load-image"));

      await waitFor(() => {
        const target = screen.getByText("素材画像の横幅が正しくないようです。");
        expect(target).toBeInTheDocument();
      });
    });
    test("rejected height, then show message", async () => {
      const mockMake = makeTransparentImage;
      mockMake.mockRejectedValue(new Error("height"));
      render(<App />);
      fireEvent.click(screen.getByTestId("material-load-image"));

      await waitFor(() => {
        const target = screen.getByText("素材画像の縦幅が正しくないようです。");
        expect(target).toBeInTheDocument();
      });
    });
  });
  test("handleChangeTrColor call makeTransparentImage with trColor", async () => {
    const mockMake = makeTransparentImage;
    mockMake.mockResolvedValue({
      transparent: "test",
      maxPage: 0,
      trColor: "test",
    });
    render(<App />);

    fireEvent.change(screen.getByTestId("material-change-trcolor"), {
      target: { value: "42, 52, 43" },
    });

    expect(mockMake).toBeCalledWith(null, { r: 42, g: 52, b: 43 });
    await waitFor(() => {
      const targetMsg = screen.getByTestId("material-msg");
      expect(targetMsg).toHaveTextContent("");
    });
  });
  // material - change - material
  test("handleChangeMaterial update material state,", () => {
    render(<App />);

    fireEvent.change(screen.getByTestId("material-change-material"), {
      target: { value: "bgColor: testBgColor" },
    });

    const target = screen.getByTestId("material-bgcolor");
    expect(target).toHaveTextContent("testBgColor");
  });
});

// * Player *
const mockPause = jest.fn();
const mockPlaypause = jest.fn();
jest.mock("./component/Player", () => {
  const { forwardRef } = jest.requireActual("react");
  return {
    __esModule: true,
    default: forwardRef(
      (
        {
          material,
          maxFrame,
          setMaxFrame,
          globalFrame,
          setGlobalFrame,
          celConfigList,
          changeConfig,
        },
        ref
      ) => {
        ref.current = { pause: mockPause, playpause: mockPlaypause };
        return (
          <div data-testid="player">
            <p data-testid="player-material-json">{JSON.stringify(material)}</p>
            <p data-testid="player-max-frame">{maxFrame}</p>
            <p data-testid="player-global-frame">{globalFrame}</p>
            <p data-testid="player-cel-config-list-json">
              {JSON.stringify(celConfigList)}
            </p>
            <input
              type="text"
              data-testid="player-set-global-frame"
              onChange={({ target }) => {
                setGlobalFrame(target.value);
              }}
            />
            <input
              type="text"
              data-testid="player-set-max-frame"
              onChange={({ target }) => {
                setMaxFrame(target.value);
              }}
            />
          </div>
        );
      }
    ),
  };
});
describe("<Player />", () => {
  test("has Player component", () => {
    render(<App />);

    const target = screen.getByTestId("player");
    expect(target).toBeInTheDocument();
  });

  test("material is App.material", () => {
    render(<App />);

    const target = screen.getByTestId("player-material-json");
    expect(JSON.parse(target.textContent)).toEqual(INIT_MATERIAL);
  });

  test("frameConfig is App.frameConfig", () => {
    render(<App />);

    expect(screen.getByTestId("player-max-frame")).toHaveTextContent("20");
    expect(screen.getByTestId("player-global-frame")).toHaveTextContent("0");
  });

  test("celConfigList is App.celConfigList", () => {
    render(<App />);

    const target = screen.getByTestId("player-cel-config-list-json");
    expect(JSON.parse(target.textContent)).toEqual([INIT_CEL_CONFIG]);
  });
  test("setMaxFrame, then update maxFrame", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("player-set-max-frame"), {
      target: { value: "42" },
    });
    expect(screen.getByTestId("player-max-frame")).toHaveTextContent("42");
  });

  describe("changeConfig", () => {
    test("type: globalFrame, value: 0 then update globalFrame", () => {
      render(<App />);
      // 初期値が0なので、1回7に変えてから0に戻して、変わった事を確認する
      fireEvent.change(screen.getByTestId("player-set-global-frame"), {
        target: { value: "7" },
      });
      expect(screen.getByTestId("player-global-frame")).toHaveTextContent("7");
      fireEvent.change(screen.getByTestId("player-set-global-frame"), {
        target: { value: "0" },
      });
      expect(screen.getByTestId("player-global-frame")).toHaveTextContent("0");
    });
    test("type: globalFrame, value: max - 1 then update globalFrame", () => {
      render(<App />);
      // 初期値でのテスト
      fireEvent.change(screen.getByTestId("player-set-global-frame"), {
        target: { value: "19" },
      });
      expect(screen.getByTestId("player-global-frame")).toHaveTextContent("19");

      // max更新後のテスト
      fireEvent.change(screen.getByTestId("player-set-max-frame"), {
        target: { value: "30" },
      });
      fireEvent.change(screen.getByTestId("player-set-global-frame"), {
        target: { value: "29" },
      });

      expect(screen.getByTestId("player-global-frame")).toHaveTextContent("29");
    });

    test("type: globalFrame, value: -1 then no update", () => {
      render(<App />);
      fireEvent.change(screen.getByTestId("player-set-global-frame"), {
        target: { value: "-1" },
      });
      expect(screen.getByTestId("player-global-frame")).toHaveTextContent("0");
    });
    test("type: globalFrame, value: max then no update", () => {
      render(<App />);
      // 初期値でのテスト
      fireEvent.change(screen.getByTestId("player-set-global-frame"), {
        target: { value: "20" },
      });
      expect(screen.getByTestId("player-global-frame")).toHaveTextContent("0");

      // max更新後のテスト
      fireEvent.change(screen.getByTestId("player-set-max-frame"), {
        target: { value: "30" },
      });
      fireEvent.change(screen.getByTestId("player-set-global-frame"), {
        target: { value: "30" },
      });

      expect(screen.getByTestId("player-global-frame")).toHaveTextContent("0");
    });
  });

  describe("handleKeyDown", () => {
    beforeEach(() => {
      mockPause.mockClear();
      mockPlaypause.mockClear();
    });
    test("Left key down, then call ref.pause and globalFrame -1", () => {
      render(<App />);
      // globalFrameの初期値が0だと面倒なので、最初に適当な値（7）にでもしておく。
      fireEvent.change(screen.getByTestId("player-set-global-frame"), {
        target: { value: "7" },
      });
      fireEvent.keyDown(document, {
        target: { tagName: "test" },
        key: "ArrowLeft",
      });

      expect(mockPause).toBeCalled();
      expect(screen.getByTestId("player-global-frame")).toHaveTextContent("6");
    });
    test("Right key down, then call ref.pause and globalFrame +1", () => {
      render(<App />);
      // globalFrameの初期値が0だと面倒なので、最初に適当な値（7）にでもしておく。
      fireEvent.change(screen.getByTestId("player-set-global-frame"), {
        target: { value: "7" },
      });
      fireEvent.keyDown(document, {
        target: { tagName: "test" },
        key: "ArrowRight",
      });

      expect(mockPause).toBeCalled();
      expect(screen.getByTestId("player-global-frame")).toHaveTextContent("8");
    });
    test("Space key down, target tag is BUTTON, then noop", () => {
      render(<App />);
      fireEvent.keyDown(document, {
        target: { tagName: "BUTTON" },
        key: " ",
      });

      expect(mockPlaypause).not.toBeCalled();
    });
    test("Space key down, target tag is not BUTTON, then call Playpause", () => {
      render(<App />);
      fireEvent.keyDown(document, {
        target: { tagName: "test" },
        key: " ",
      });

      expect(mockPlaypause).toBeCalled();
    });
  });
});

// * Configs
jest.mock(
  "./component/Configs",
  () =>
    ({ celId, material, config, update }) => {
      return (
        <div data-testid="configs">
          <p data-testid="configs-cel-id">{celId}</p>
          <p data-testid="configs-material">{JSON.stringify(material)}</p>
          <p data-testid="configs-config">{JSON.stringify(config)}</p>
          <input
            type="text"
            data-testid="configs-update"
            onChange={({ target }) => {
              const [type, config] = target.value
                .split(":")
                .map((v) => v.trim());
              update(type, config);
            }}
          />
        </div>
      );
    }
);
describe("<Configs />", () => {
  test("has Configs component", () => {
    render(<App />);

    const target = screen.getByTestId("configs");
    expect(target).toBeInTheDocument();
  });
  test("celId is App.selectedCelId", () => {
    render(<App />);

    const target = screen.getByTestId("configs-cel-id");

    // 変更後、追従すること
    fireEvent.change(screen.getByTestId("timeline-input-selectedcel"), {
      target: { value: 3 },
    });
    expect(target).toHaveTextContent(3);
  });
  test("material is App.material", () => {
    render(<App />);

    const target = screen.getByTestId("configs-material");
    expect(JSON.parse(target.textContent)).toEqual(INIT_MATERIAL);
  });
  describe("config", () => {
    test("INIT, then celConfigList[0]", () => {
      render(<App />);

      const target = screen.getByTestId("configs-config");
      expect(JSON.parse(target.textContent)).toEqual(INIT_CEL_CONFIG);
    });
    test("List.length = 5, selected = 0, then celConfigList[0]", () => {
      render(<App />);
      // globalFrameを変える事により、startで判別がつくようにする
      for (let i = 0; i < 4; i++) {
        fireEvent.change(screen.getByTestId("timeline-set-global-frame"), {
          target: { value: `${10 + i}` },
        });
        userEvent.click(screen.getByTestId("timeline-add"));
      }
      // selectedCelIdを0に変更
      const inputElement = screen.getByTestId("timeline-input-selectedcel");
      fireEvent.change(inputElement, { target: { value: 0 } });

      const target = JSON.parse(
        screen.getByTestId("configs-config").textContent
      );
      expect(target.frame.start).toEqual(1);
    });
    test("List.length = 5, selected = 1, then celConfigList[1]", () => {
      render(<App />);
      // globalFrameを変える事により、startで判別がつくようにする
      for (let i = 0; i < 4; i++) {
        fireEvent.change(screen.getByTestId("timeline-set-global-frame"), {
          target: { value: `${10 + i}` },
        });
        userEvent.click(screen.getByTestId("timeline-add"));
      }
      // selectedCelIdを1に変更
      const inputElement = screen.getByTestId("timeline-input-selectedcel");
      fireEvent.change(inputElement, { target: { value: 1 } });

      const target = JSON.parse(
        screen.getByTestId("configs-config").textContent
      );
      expect(target.frame.start).toEqual(11);
    });
    test("List.length = 5, selected = 4, then celConfigList[4]", () => {
      render(<App />);
      // globalFrameを変える事により、startで判別がつくようにする
      for (let i = 0; i < 4; i++) {
        fireEvent.change(screen.getByTestId("timeline-set-global-frame"), {
          target: { value: `${10 + i}` },
        });
        userEvent.click(screen.getByTestId("timeline-add"));
      }
      // selectedCelIdを1に変更
      const inputElement = screen.getByTestId("timeline-input-selectedcel");
      fireEvent.change(inputElement, { target: { value: 4 } });

      const target = JSON.parse(
        screen.getByTestId("configs-config").textContent
      );
      expect(target.frame.start).toEqual(14);
    });
  });
  describe("update", () => {
    // * 現在、App側では値の内容は一切チェックしていない。バリデーションは入力側のComponentに任せている。
    test("selected: 0, type: x, then set List[0].x", () => {
      render(<App />);

      fireEvent.change(screen.getByTestId("configs-update"), {
        target: { value: "x: testx" },
      });

      const target = JSON.parse(
        screen.getByTestId("configs-config").textContent
      );
      expect(target.x).toBe("testx");
    });
    test("selected: 0, type: y, then set List[0].y", () => {
      render(<App />);

      fireEvent.change(screen.getByTestId("configs-update"), {
        target: { value: "y: testy" },
      });

      const target = JSON.parse(
        screen.getByTestId("configs-config").textContent
      );
      expect(target.y).toBe("testy");
    });
    test("selected: 0, type: xxx, then noop", () => {
      render(<App />);

      fireEvent.change(screen.getByTestId("configs-update"), {
        target: { value: "xxx: testXXX" },
      });

      const target = JSON.parse(
        screen.getByTestId("configs-config").textContent
      );
      expect(target.xxx).not.toBe("testXXX");
    });
    test("selected: 1, List.length: 2 type: x, then set List[1].x", () => {
      render(<App />);
      userEvent.click(screen.getByTestId("timeline-add"));
      fireEvent.change(screen.getByTestId("timeline-input-selectedcel"), {
        target: { value: 1 },
      });
      fireEvent.change(screen.getByTestId("configs-update"), {
        target: { value: "x: test1x" },
      });

      const target1 = JSON.parse(
        screen.getByTestId("configs-config").textContent
      );
      expect(target1.x).toBe("test1x");
      fireEvent.change(screen.getByTestId("timeline-input-selectedcel"), {
        target: { value: 0 },
      });
      const target0 = JSON.parse(
        screen.getByTestId("configs-config").textContent
      );
      expect(target0.x).not.toBe("test1x");
    });
  });
});

// * Timeline *

jest.mock(
  "./component/Timeline",
  () =>
    ({
      selected,
      handler,
      maxFrame,
      globalFrame,
      setGlobalFrame,
      configList,
      handleAdd,
      handleDelete,
      handleCopy,
    }) => {
      return (
        <div data-testid="timeline">
          <p data-testid="timeline-selected">{selected}</p>
          <p data-testid="timeline-max-frame">{maxFrame}</p>
          <p data-testid="timeline-global-frame">{globalFrame}</p>
          <p data-testid="timeline-config-list">{JSON.stringify(configList)}</p>
          <input
            type="text"
            onChange={({ target }) => {
              handler(target.value);
            }}
            data-testid="timeline-input-selectedcel"
          />
          <input
            type="text"
            data-testid="timeline-set-global-frame"
            onChange={({ target }) => {
              setGlobalFrame(target.value);
            }}
          />
          <button
            type="button"
            data-testid="timeline-add"
            onClick={() => {
              handleAdd();
            }}
          />
          <button
            type="button"
            data-testid="timeline-delete"
            onClick={() => {
              handleDelete();
            }}
          />
          <button
            type="button"
            data-testid="timeline-copy"
            onClick={() => {
              handleCopy();
            }}
          />
        </div>
      );
    }
);

describe("<Timeline />", () => {
  test("has Timeline component", () => {
    render(<App />);

    const target = screen.getByTestId("timeline");
    expect(target).toBeInTheDocument();
  });

  describe("selected and handler", () => {
    test("selected is App.selectedCelId", () => {
      render(<App />);

      const target = screen.getByTestId("timeline-selected");
      expect(target).toHaveTextContent(0); // 初期値ゼロ
    });
    test("change selectedCelId from timeline", () => {
      render(<App />);

      const inputElement = screen.getByTestId("timeline-input-selectedcel");
      fireEvent.change(inputElement, { target: { value: 42 } });

      const target = screen.getByTestId("timeline-selected");
      expect(target).toHaveTextContent("42");
    });
  });
  test("globalFrame is App.state.globalFrame", () => {
    render(<App />);

    const target = screen.getByTestId("timeline-global-frame");
    expect(target).toHaveTextContent(0);

    // 別のコンポーネント経由で変更して、値が追従すること
    fireEvent.change(screen.getByTestId("player-set-global-frame"), {
      target: { value: "12" },
    });
    expect(target).toHaveTextContent(12);
  });
  test("maxFrame is App.state.maxFrame", () => {
    render(<App />);

    const target = screen.getByTestId("timeline-max-frame");
    expect(target).toHaveTextContent(20);

    // 別のコンポーネント経由で変更して、値が追従すること
    fireEvent.change(screen.getByTestId("player-set-max-frame"), {
      target: { value: "26" },
    });
    expect(target).toHaveTextContent(26);
  });
  test("setGlobalFrame is change App.setGlobalFrame", () => {
    render(<App />);

    const target = screen.getByTestId("timeline-global-frame");
    expect(target).toHaveTextContent(0);

    // Timeline経由で値を変更して、反映されること
    fireEvent.change(screen.getByTestId("timeline-set-global-frame"), {
      target: { value: "17" },
    });
    expect(target).toHaveTextContent(17);
  });
  test("configList is App.celConfigList", () => {
    render(<App />);

    const target = screen.getByTestId("timeline-config-list");
    expect(JSON.parse(target.textContent)).toEqual([INIT_CEL_CONFIG]);
  });
  describe("handleAdd", () => {
    test("call, then Add celConfigList", () => {
      render(<App />);

      userEvent.click(screen.getByTestId("timeline-add"));

      const target = JSON.parse(
        screen.getByTestId("timeline-config-list").textContent
      );
      expect(target).toHaveLength(2);
    });
    test("added, then start is globalFrame + 1", () => {
      render(<App />);

      fireEvent.change(screen.getByTestId("timeline-set-global-frame"), {
        target: { value: "3" },
      });
      userEvent.click(screen.getByTestId("timeline-add"));

      const target = JSON.parse(
        screen.getByTestId("timeline-config-list").textContent
      );
      expect(target[1].frame.start).toBe(4);
    });
    test("added, then volume is maxFrame - globalFrame", () => {
      render(<App />);

      fireEvent.change(screen.getByTestId("timeline-set-global-frame"), {
        target: { value: "9" },
      });
      fireEvent.change(screen.getByTestId("player-set-max-frame"), {
        target: { value: "11" },
      });
      userEvent.click(screen.getByTestId("timeline-add"));

      const target = JSON.parse(
        screen.getByTestId("timeline-config-list").textContent
      );
      expect(target[1].frame.volume).toBe(2);
    });
    describe("selectedCel", () => {
      test("length = 1 added, then selectedCelId is 1", () => {
        render(<App />);

        userEvent.click(screen.getByTestId("timeline-add"));

        const target = screen.getByTestId("timeline-selected");
        expect(target).toHaveTextContent(1);
      });
      test("length = 4 added, then selectedCelId is 4", () => {
        render(<App />);

        userEvent.click(screen.getByTestId("timeline-add"));
        userEvent.click(screen.getByTestId("timeline-add"));
        userEvent.click(screen.getByTestId("timeline-add"));

        const configList = JSON.parse(
          screen.getByTestId("timeline-config-list").textContent
        );
        expect(configList).toHaveLength(4);

        // Listが4件の状態で、追加ボタンを押す
        userEvent.click(screen.getByTestId("timeline-add"));

        const target = screen.getByTestId("timeline-selected");
        expect(target).toHaveTextContent(4);
      });
    });
  });
  describe("handleDelete", () => {
    test("List.length = 1 call, then noop", () => {
      render(<App />);

      userEvent.click(screen.getByTestId("timeline-delete"));

      const target = JSON.parse(
        screen.getByTestId("timeline-config-list").textContent
      );
      expect(target).toHaveLength(1);
    });
    test("List.length = 2 call, then length = 1", () => {
      render(<App />);

      // まずは1つ増やしておく
      userEvent.click(screen.getByTestId("timeline-add"));
      const pre = JSON.parse(
        screen.getByTestId("timeline-config-list").textContent
      );
      expect(pre).toHaveLength(2);

      // 削除
      userEvent.click(screen.getByTestId("timeline-delete"));

      const target = JSON.parse(
        screen.getByTestId("timeline-config-list").textContent
      );
      expect(target).toHaveLength(1);
    });
    test("List.length = 5, selectedCel = 3, then remove List[3]", () => {
      render(<App />);

      // globalFrameを変える事により、startで判別がつくようにする
      for (let i = 0; i < 4; i++) {
        fireEvent.change(screen.getByTestId("timeline-set-global-frame"), {
          target: { value: `${10 + i}` },
        });
        userEvent.click(screen.getByTestId("timeline-add"));
      }
      // selectedCelIdを3に変更
      const inputElement = screen.getByTestId("timeline-input-selectedcel");
      fireEvent.change(inputElement, { target: { value: 3 } });

      userEvent.click(screen.getByTestId("timeline-delete"));

      const target = JSON.parse(
        screen.getByTestId("timeline-config-list").textContent
      );
      expect(target).toHaveLength(4);

      expect(target[0].frame.start).toBe(1);
      expect(target[1].frame.start).toBe(11);
      expect(target[2].frame.start).toBe(12);
      // (start:13)が消えてる
      expect(target[3].frame.start).toBe(14);
    });
    describe("selectedCelId", () => {
      test("selectedCelId is 1 call, then selectedCelId is 0", () => {
        render(<App />);

        // まずは1個増やす
        userEvent.click(screen.getByTestId("timeline-add"));
        // selectedCelIdも1に変更（念のため）
        const inputElement = screen.getByTestId("timeline-input-selectedcel");
        fireEvent.change(inputElement, { target: { value: 1 } });

        // 削除
        userEvent.click(screen.getByTestId("timeline-delete"));

        const target = screen.getByTestId("timeline-selected");
        expect(target).toHaveTextContent(0);
      });
      test("selectedCelId is 0 call, then selectedCelId is 0", () => {
        render(<App />);

        // まずは1個増やす
        userEvent.click(screen.getByTestId("timeline-add"));
        // selectedCelIdを0に変更
        const inputElement = screen.getByTestId("timeline-input-selectedcel");
        fireEvent.change(inputElement, { target: { value: 0 } });

        // 削除
        userEvent.click(screen.getByTestId("timeline-delete"));

        const target = screen.getByTestId("timeline-selected");
        expect(target).toHaveTextContent(0);
      });
    });
  });
  describe("handleCopy", () => {
    test("List.length = 5, selected is 0, then List[0] copy and insert List[1]", () => {
      render(<App />);
      // globalFrameを変える事により、startで判別がつくようにする
      for (let i = 0; i < 4; i++) {
        fireEvent.change(screen.getByTestId("timeline-set-global-frame"), {
          target: { value: `${10 + i}` },
        });
        userEvent.click(screen.getByTestId("timeline-add"));
      }
      // selectedCelIdを3に変更
      const inputElement = screen.getByTestId("timeline-input-selectedcel");
      fireEvent.change(inputElement, { target: { value: 0 } });

      userEvent.click(screen.getByTestId("timeline-copy"));

      const target = JSON.parse(
        screen.getByTestId("timeline-config-list").textContent
      );
      expect(target).toHaveLength(6);

      expect(target[0].frame.start).toBe(1);
      expect(target[1].frame.start).toBe(1);
      expect(target[2].frame.start).toBe(11);
      expect(target[3].frame.start).toBe(12);
      expect(target[4].frame.start).toBe(13);
      expect(target[5].frame.start).toBe(14);
    });
    test("List.length = 5, selected is 1, then List[1] copy and insert List[2]", () => {
      render(<App />);
      // globalFrameを変える事により、startで判別がつくようにする
      for (let i = 0; i < 4; i++) {
        fireEvent.change(screen.getByTestId("timeline-set-global-frame"), {
          target: { value: `${10 + i}` },
        });
        userEvent.click(screen.getByTestId("timeline-add"));
      }
      // selectedCelIdを3に変更
      const inputElement = screen.getByTestId("timeline-input-selectedcel");
      fireEvent.change(inputElement, { target: { value: 1 } });

      userEvent.click(screen.getByTestId("timeline-copy"));

      const target = JSON.parse(
        screen.getByTestId("timeline-config-list").textContent
      );
      expect(target).toHaveLength(6);

      expect(target[0].frame.start).toBe(1);
      expect(target[1].frame.start).toBe(11);
      expect(target[2].frame.start).toBe(11);
      expect(target[3].frame.start).toBe(12);
      expect(target[4].frame.start).toBe(13);
      expect(target[5].frame.start).toBe(14);
    });
    test("List.length = 5, selected is 4, then List[4] copy and insert List[5]", () => {
      render(<App />);
      // globalFrameを変える事により、startで判別がつくようにする
      for (let i = 0; i < 4; i++) {
        fireEvent.change(screen.getByTestId("timeline-set-global-frame"), {
          target: { value: `${10 + i}` },
        });
        userEvent.click(screen.getByTestId("timeline-add"));
      }
      // selectedCelIdを3に変更
      const inputElement = screen.getByTestId("timeline-input-selectedcel");
      fireEvent.change(inputElement, { target: { value: 4 } });

      userEvent.click(screen.getByTestId("timeline-copy"));

      const target = JSON.parse(
        screen.getByTestId("timeline-config-list").textContent
      );
      expect(target).toHaveLength(6);

      expect(target[0].frame.start).toBe(1);
      expect(target[1].frame.start).toBe(11);
      expect(target[2].frame.start).toBe(12);
      expect(target[3].frame.start).toBe(13);
      expect(target[4].frame.start).toBe(14);
      expect(target[5].frame.start).toBe(14);
    });
    test("List.length = 5, selected is 4, then noop", () => {
      render(<App />);
      // globalFrameを変える事により、startで判別がつくようにする
      for (let i = 0; i < 4; i++) {
        fireEvent.change(screen.getByTestId("timeline-set-global-frame"), {
          target: { value: `${10 + i}` },
        });
        userEvent.click(screen.getByTestId("timeline-add"));
      }
      // selectedCelIdを5に変更
      const inputElement = screen.getByTestId("timeline-input-selectedcel");
      fireEvent.change(inputElement, { target: { value: 5 } });

      userEvent.click(screen.getByTestId("timeline-copy"));

      const target = JSON.parse(
        screen.getByTestId("timeline-config-list").textContent
      );
      expect(target).toHaveLength(5);
    });
    test("List.length = 5, selected is -1, then noop", () => {
      render(<App />);
      // globalFrameを変える事により、startで判別がつくようにする
      for (let i = 0; i < 4; i++) {
        fireEvent.change(screen.getByTestId("timeline-set-global-frame"), {
          target: { value: `${10 + i}` },
        });
        userEvent.click(screen.getByTestId("timeline-add"));
      }
      // selectedCelIdを5に変更
      const inputElement = screen.getByTestId("timeline-input-selectedcel");
      fireEvent.change(inputElement, { target: { value: -1 } });

      userEvent.click(screen.getByTestId("timeline-copy"));

      const target = JSON.parse(
        screen.getByTestId("timeline-config-list").textContent
      );
      expect(target).toHaveLength(5);
    });
  });
});
