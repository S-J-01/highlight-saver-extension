
document.addEventListener('DOMContentLoaded', () => {
    loadHighlights();
  });
  
  const loadHighlights = () => {
    chrome.storage.local.get(['highlights'], (result) => {
      const highlights = result.highlights || [];
      const container = document.querySelector('.highlights-container');
      
     
      container.innerHTML = '';
      
      if (highlights.length === 0) {
        container.innerHTML = '<div>No highlights saved yet</div>';
        return;
      }
      
      
      highlights.forEach((highlight) => {
        const highlightElement = document.createElement('div');
        highlightElement.className = 'highlight-item';
        
        
        const textElement = document.createElement('div');
        textElement.className= 'highlight-url';
        textElement.textContent = highlight.text;
        highlightElement.appendChild(textElement);
        
        
        const urlElement = document.createElement('div');
        urlElement.className = 'highlight-url';
        urlElement.textContent = highlight.url;
        highlightElement.appendChild(urlElement);
        
        
        const deleteButton = document.createElement('div');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
          deleteHighlight(highlight.id);
        });
        highlightElement.appendChild(deleteButton);
        
        container.appendChild(highlightElement);
      });
    });
  };
  
  const deleteHighlight = (highlightId) => {
    chrome.storage.local.get(['highlights'], (result) => {
      const highlights = result.highlights || [];
      
      
      const updatedHighlights = highlights.filter(h => h.id !== highlightId);
      
      
      chrome.storage.local.set({ highlights: updatedHighlights }, () => {
        console.log('Highlight deleted');
        loadHighlights(); 
      });
    });
  };