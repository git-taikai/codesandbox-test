(() => {
  let clickTimeoutId = null;
  let currentConfig = null;

  const clearClickTimer = () => {
    if (clickTimeoutId !== null) {
      clearTimeout(clickTimeoutId);
      clickTimeoutId = null;
    }
  };

  const getRandomDelay = (min, max) => {
    const minMs = Math.max(0, Number(min) || 0);
    const maxMs = Math.max(minMs, Number(max) || minMs);
    if (maxMs === minMs) {
      return minMs;
    }
    return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  };

  const clickButton = (selector) => {
    if (!selector) {
      return false;
    }
    const target = document.querySelector(selector);
    if (!target) {
      console.warn(`[Random Interval Button Clicker] Selector not found: ${selector}`);
      return false;
    }

    target.click();
    console.debug(`[Random Interval Button Clicker] Clicked element for selector: ${selector}`);
    return true;
  };

  const scheduleNextClick = () => {
    if (!currentConfig) {
      return;
    }

    const { selector, minInterval, maxInterval } = currentConfig;
    clickButton(selector);

    const nextDelay = getRandomDelay(minInterval, maxInterval);
    clickTimeoutId = setTimeout(scheduleNextClick, nextDelay);
  };

  const startClicking = (config) => {
    stopClicking();
    currentConfig = {
      selector: config.selector,
      minInterval: config.minInterval,
      maxInterval: config.maxInterval
    };
    scheduleNextClick();
  };

  const stopClicking = () => {
    clearClickTimer();
    currentConfig = null;
  };

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!message || !message.type) {
      return;
    }

    if (message.type === "START_AUTO_CLICK") {
      startClicking(message.payload);
      sendResponse({ status: "running" });
    } else if (message.type === "STOP_AUTO_CLICK") {
      stopClicking();
      sendResponse({ status: "stopped" });
    }
  });

  window.addEventListener("beforeunload", () => {
    stopClicking();
  });
})();
