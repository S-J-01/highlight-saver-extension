document.addEventListener("DOMContentLoaded", () => {
  const apiKeyInput = document.getElementById("apiKeyInput");
  const apiKeyButton = document.getElementById("apiKeyButton");
  const keySaveStatusMessage = document.getElementById("keySaveStatusMessage");

  function saveApiKey() {
    const apiKey = apiKeyInput.value.trim();

    if (apiKey) {
      chrome.storage.local.set({ apiKey: apiKey }, () => {
        if (chrome.runtime.lastError) {
          console.log(
            "Error while saving apiKey",
            chrome.runtime.lastError.message
          );
        } else {
          console.log("api key saved successfully");
        }
      });
    } else {
      keySaveStatusMessage.textContent = "Please enter api key";
    }
  }

  apiKeyButton.addEventListener("click", saveApiKey);
});
