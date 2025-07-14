chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "summarize") {
    chrome.storage.local.get(["apiKey"], (res) => {
      const apiKey = (res.apiKey || "").trim();

      if (!apiKey) {
        sendResponse({ error: "NO_KEY" });
        return;
      }

      console.log("API key found, would summarise highlight id:", msg.id);

      chrome.storage.local.get(["highlights"], (highlightsRes) => {
        const highlights = highlightsRes.highlights || [];
        const highlight = highlights.find((h) => h.id === msg.id);

        if (!highlight) {
          sendResponse({ error: "HIGHLIGHT_NOT_FOUND" });
          return;
        }

        console.log(
          "Found highlight:",
          highlight.text.substring(0, 50) + "..."
        );

        sendResponse({ ok: true });
      });

      return true;
    });
  }
});
