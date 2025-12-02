const selectorInput = document.getElementById("selector");
const minIntervalInput = document.getElementById("minInterval");
const maxIntervalInput = document.getElementById("maxInterval");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const statusLabel = document.getElementById("status");

const setStatus = (message, isError = false) => {
  statusLabel.textContent = message;
  statusLabel.style.color = isError ? "#dc2626" : "#2563eb";
};

const getActiveTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
};

const loadStoredConfig = async () => {
  const { autoClickConfig } = await chrome.storage.sync.get("autoClickConfig");
  if (autoClickConfig) {
    selectorInput.value = autoClickConfig.selector ?? "";
    minIntervalInput.value = autoClickConfig.minInterval ?? 1000;
    maxIntervalInput.value = autoClickConfig.maxInterval ?? 3000;
  }
};

const validateConfig = (selector, minInterval, maxInterval) => {
  if (!selector) {
    throw new Error("Please enter a CSS selector for the button.");
  }

  if (!Number.isFinite(minInterval) || minInterval < 0) {
    throw new Error("Minimum interval must be a number greater than or equal to 0.");
  }

  if (!Number.isFinite(maxInterval) || maxInterval < 0) {
    throw new Error("Maximum interval must be a number greater than or equal to 0.");
  }

  if (maxInterval < minInterval) {
    throw new Error("Maximum interval must be greater than or equal to the minimum interval.");
  }
};

const toggleButtons = (isRunning) => {
  startButton.disabled = isRunning;
  stopButton.disabled = !isRunning;
};

startButton.addEventListener("click", async () => {
  try {
    const tab = await getActiveTab();
    if (!tab?.id) {
      throw new Error("Unable to determine the active tab.");
    }

    const selector = selectorInput.value.trim();
    const minInterval = Number(minIntervalInput.value);
    const maxInterval = Number(maxIntervalInput.value);

    validateConfig(selector, minInterval, maxInterval);

    const payload = { selector, minInterval, maxInterval };

    await chrome.tabs.sendMessage(tab.id, {
      type: "START_AUTO_CLICK",
      payload
    });

    await chrome.storage.sync.set({ autoClickConfig: payload });

    toggleButtons(true);
    setStatus("Auto clicker running...");
  } catch (error) {
    console.error(error);
    setStatus(error.message ?? "Failed to start auto clicker.", true);
  }
});

stopButton.addEventListener("click", async () => {
  try {
    const tab = await getActiveTab();
    if (!tab?.id) {
      throw new Error("Unable to determine the active tab.");
    }

    await chrome.tabs.sendMessage(tab.id, { type: "STOP_AUTO_CLICK" });
    toggleButtons(false);
    setStatus("Auto clicker stopped.");
  } catch (error) {
    console.error(error);
    setStatus(error.message ?? "Failed to stop auto clicker.", true);
  }
});

window.addEventListener("load", async () => {
  stopButton.disabled = true;
  await loadStoredConfig();
});
