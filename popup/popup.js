document.addEventListener("DOMContentLoaded", () => {
  loadHighlights();
});

const loadHighlights = () => {
  chrome.storage.local.get(["highlights"], (result) => {
    const highlights = result.highlights || [];
    const container = document.querySelector(".highlights-container");

    container.innerHTML = "";

    if (highlights.length === 0) {
      const emptyMessageElement = document.createElement("div");
      emptyMessageElement.className = "empty-message";
      emptyMessageElement.textContent = "No highlights saved yet";
      container.appendChild(emptyMessageElement);
      return;
    }

    highlights.forEach((highlight) => {
      const highlightElement = document.createElement("div");
      highlightElement.className = "highlight-item";

      const textElement = document.createElement("div");
      textElement.className = "highlight-text";
      textElement.textContent = highlight.text;
      highlightElement.appendChild(textElement);

      const urlElement = document.createElement("div");
      urlElement.className = "highlight-url";
      const link = document.createElement("a");
      link.href = highlight.url;
      link.textContent = highlight.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      urlElement.appendChild(link);
      highlightElement.appendChild(urlElement);

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        deleteHighlight(highlight.id);
      });
      highlightElement.appendChild(deleteButton);

      const summarizeButton = document.createElement("button");
      summarizeButton.className = "summarize-button";
      summarizeButton.textContent = "Summarize";
      summarizeButton.addEventListener("click", () => {
        summarizeButton.disabled = true;
        summarizeButton.textContent = "Summarizing…";

        chrome.runtime.sendMessage(
          { action: "summarize", id: highlight.id },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError.message);
              alert("Could not start summarization.");
            } else if (response?.error === "NO_KEY") {
              alert("Please set your OpenAI API key in the Options page.");
            } else if (response?.ok) {
              loadHighlights(); // will rebuild the list
            } else {
              alert("Background said: " + (response?.error || "unknown error"));
            }

            summarizeButton.disabled = false;
            summarizeButton.textContent = "Summarize";
          }
        );
      });
      highlightElement.appendChild(summarizeButton);

      container.appendChild(highlightElement);
    });
  });
};

const deleteHighlight = (highlightId) => {
  chrome.storage.local.get(["highlights"], (result) => {
    const highlights = result.highlights || [];

    const updatedHighlights = highlights.filter((h) => h.id !== highlightId);

    chrome.storage.local.set({ highlights: updatedHighlights }, () => {
      console.log("Highlight deleted");
      loadHighlights();
    });
  });
};
