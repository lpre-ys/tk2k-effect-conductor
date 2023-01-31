import { useState } from "react";

export function useConfigOption(hasOption, reset) {
  const [isOption, setIsOption] = useState(false);
  const [optionKey, setOptionKey] = useState(Date.now());

  const headerColorStyle = {
    color: hasOption() ? "#00838F" : "#9E9E9E",
  };

  const onReset = (e) => {
    reset();
    setOptionKey(Date.now());
    // ヘッダ側の処理を行わない
    e.stopPropagation();
  }

  return {
    headerProps: {
      reset: onReset,
      color: headerColorStyle,
      isOption,
      setIsOption
    },
    optionProps: {
      key: optionKey,
      isOption,
    }
  }
}