let savePopup = null;

document.addEventListener('mouseup', (event) => {
    removePopup();
    
    try {
        const selection = window.getSelection();
        
    
        const selectedText = selection ? selection.toString().trim() : "";

        if (selectedText.length > 0) {
            createSavePopup(selectedText, event); 
        }
    } catch (e) {
        if (e instanceof SecurityError) {
            console.warn("Highlight Saver: Blocked access to a cross-origin frame. Cannot create popup for selection originating in this frame.", e.message);
        } else {
            console.error("Highlight Saver: Error during mouseup processing:", e);
        }
        removePopup();
    }
});

function createSavePopup(textToSave, event) {
    savePopup = document.createElement('div');
    savePopup.className = 'highlight-saver-popup';
    savePopup.textContent = 'Save Highlight';
    
    const topPos = event.pageY + 10;
    const leftPos = event.pageX + 10;
    
    Object.assign(savePopup.style, {
        position: 'absolute',
        top: `${topPos}px`,
        left: `${leftPos}px`,
        backgroundColor: 'white',
        color: 'black',
        padding: '8px 12px',
        zIndex: '9999',
        cursor: 'pointer',
        fontSize: '14px'
    });
    
    savePopup.addEventListener('mousedown', (e) => {
        e.stopPropagation();
    });

    savePopup.addEventListener('mouseup', (e) => {
        e.stopPropagation();
    });
   
    savePopup.addEventListener('click', ()=> {
        console.log('save clicked'); 
        console.log("Text being passed to saveHighlight:", '"' + textToSave + '"');
        saveHighlight(textToSave);
        removePopup();
        
    });
    
    document.body.appendChild(savePopup);
}

function removePopup() {
    if (savePopup && savePopup.parentNode) {
        savePopup.parentNode.removeChild(savePopup);
    }
}

function saveHighlight(text) {
    console.log("saveHighlight called with text:", text);
    if (typeof text !== 'string' || text.trim().length === 0) {
        console.error("saveHighlight called with invalid or empty text. Aborting save.");
        return;
    }

    const highlight = {
        id: Date.now().toString(), 
        text: text,
        url: window.location.href
    };
    
    console.log("Attempting to save highlight object:", highlight);

    chrome.storage.local.get(['highlights'], (result) =>{
        if (chrome.runtime.lastError) {
            console.error("Error getting highlights from storage:", chrome.runtime.lastError.message);
            return;
        }
        console.log("Retrieved from storage before saving:", result);

        const highlights = result.highlights || [];
        highlights.push(highlight);
        
        console.log("Array to be set in storage:", highlights);

        chrome.storage.local.set({ highlights: highlights }, ()=> {
            if (chrome.runtime.lastError) {
                console.error("Error saving highlights to storage:", chrome.runtime.lastError.message);
            } else {
                console.log('Highlight saved successfully (from callback)');
            }
        });
    });
}

document.addEventListener('mousedown', (event) => {
    if (savePopup && !savePopup.contains(event.target)) {
         try {
             const ownerDoc = event.target.ownerDocument;
             removePopup();
         } catch (e) {
             if (e instanceof SecurityError) {
                 console.warn("Highlight Saver: Mousedown in cross-origin frame detected, removing popup.");
                 removePopup();
             } else {
                 console.error("Highlight Saver: Error during mousedown processing:", e);
        removePopup();
             }
         }
    }
});