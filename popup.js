document.getElementById('start').addEventListener('click', () => {
    chrome.runtime.sendMessage({action: "startScript"});
    window.close(); // Close the popup when the script starts
  });
  