chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "summarize") {
    chrome.storage.local.get(["apiKey"], (res) => {
      const apiKey = (res.apiKey || "").trim();

      if (!apiKey) {
        sendResponse({ error: "NO_KEY" });
        return;
      }

      console.log("API key found, would summarise highlight id:", msg.id);

      sendResponse({ ok: true });
    });

    return true;
  }
});
