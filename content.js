let saveHighlightPopup = null;

document.addEventListener("mouseup", (event) => {
  removeSaveHighlightPopup();

  try {
    const selection = window.getSelection();

    const selectedText = selection ? selection.toString().trim() : "";

    if (selectedText.length > 0) {
      createSaveHighlightPopup(selectedText, event);
    }
  } catch (error) {
    console.log(
      "Error during mouseup processing and creating Save Highlight Popup: ",
      error
    );

    removeSaveHighlightPopup();
  }
});

const createSaveHighlightPopup = (textToSave, event) => {
  saveHighlightPopup = document.createElement("div");
  saveHighlightPopup.className = "save-highlight-popup";
  saveHighlightPopup.textContent = "Save Highlight";

  const topPos = event.pageY + 10;
  const leftPos = event.pageX + 10;

  saveHighlightPopup.style.top = `${topPos}px`;
  saveHighlightPopup.style.left = `${leftPos}px`;

  saveHighlightPopup.addEventListener("mousedown", (event) => {
    event.stopPropagation();
  });

  saveHighlightPopup.addEventListener("mouseup", (event) => {
    event.stopPropagation();
  });

  saveHighlightPopup.addEventListener("click", () => {
    console.log("save clicked");
    console.log("Text being passed to saveHighlight:", '"' + textToSave + '"');
    saveHighlight(textToSave);
    removeSaveHighlightPopup();
  });

  document.body.appendChild(saveHighlightPopup);
};

const removeSaveHighlightPopup = () => {
  if (saveHighlightPopup && saveHighlightPopup.parentNode) {
    saveHighlightPopup.parentNode.removeChild(saveHighlightPopup);
  }
};

const saveHighlight = (text) => {
  console.log("saveHighlight called with text:", text);
  if (typeof text !== "string" || text.trim().length === 0) {
    console.error(
      "saveHighlight called with invalid or empty text. Save failed."
    );
    return;
  }

  const highlight = {
    id: Date.now().toString(),
    text: text,
    url: window.location.href,
  };

  chrome.storage.local.get(["highlights"], (result) => {
    if (chrome.runtime.lastError) {
      console.log(
        "Error getting highlights from storage:",
        chrome.runtime.lastError.message
      );
      return;
    }
    console.log("Retrieved from storage before saving:", result);

    const highlights = result.highlights || [];
    highlights.push(highlight);

    console.log("Array to be set in storage:", highlights);

    chrome.storage.local.set({ highlights: highlights }, () => {
      if (chrome.runtime.lastError) {
        console.log(
          "Error saving highlights to storage:",
          chrome.runtime.lastError.message
        );
      } else {
        console.log("Highlight saved successfully (from callback)");
      }
    });
  });
};

document.addEventListener("mousedown", (event) => {
  if (saveHighlightPopup && !saveHighlightPopup.contains(event.target)) {
    try {
      removeSaveHighlightPopup();
    } catch (error) {
      console.log(
        "Error during mousedown processing and removing Save Highlight Popup:",
        error
      );
    }
  }
});
