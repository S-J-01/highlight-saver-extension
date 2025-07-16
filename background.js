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

        fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "Summarize the following text in 1-2 sentences:",
              },
              {
                role: "user",
                content: highlight.text,
              },
            ],
            max_tokens: 100,
          }),
        })
          .then((resp) => resp.json())
          .then((data) => {
            if (data.error) {
              console.error("OpenAI error:", data.error);
              sendResponse({
                error: "OPENAI_ERROR",
                message: data.error.message,
              });
              return;
            }

            const summary = data.choices[0].message.content.trim();
            console.log("Got summary:", summary);

            highlight.summary = summary;
            chrome.storage.local.set({ highlights }, () => {
              sendResponse({ ok: true, summary });
            });
          })
          .catch((err) => {
            console.error("Fetch error:", err);
            sendResponse({ error: "NETWORK_ERROR", message: err.message });
          });
      });

      return true;
    });
  }
});
