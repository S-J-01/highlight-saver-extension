chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "summarize") {
    console.log("Background received summarize request for id:", msg.id);

    sendResponse({ ok: true });
  }
});
