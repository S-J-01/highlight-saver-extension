let savePopup = null;

document.addEventListener('mouseup', (event) => {
    removePopup();

    try {
        const selection = window.getSelection();

        if (selection && selection.toString().trim().length > 0) {
            const targetCheck = event.target;
            createSavePopup(selection, event);
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

function createSavePopup(selection, event) {
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
        saveHighlight(selection.toString());
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
    const highlight = {
        id: Date.now().toString(), 
        text: text,
        url: window.location.href
    };
    
    chrome.storage.local.get(['highlights'], (result) =>{
        const highlights = result.highlights || [];
        highlights.push(highlight);
        
        chrome.storage.local.set({ highlights: highlights }, ()=> {
            console.log('Highlight saved successfully');
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