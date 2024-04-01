chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startScript") {
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        files: ['content.js']
      });
    }
  });
  