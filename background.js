// Background script for your Chrome extension
alert("Background script")
// Listener for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function() {
    // Perform any setup or initialization tasks here
    console.log('Extension installed or updated.');
  });
  
  // Listener for when the extension icon is clicked
  chrome.browserAction.onClicked.addListener(function(tab) {
    // Perform actions when the extension icon is clicked
    console.log('Extension icon clicked in tab:', tab);
  
    // Example: Open a popup
    chrome.browserAction.setPopup({ popup: 'popup.html' });
  });
  
  // Listener for messages from content scripts or other parts of the extension
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Handle messages here
    if (request.action === 'exampleAction') {
      // Perform an action based on the message
      console.log('Received a message with action:', request.action);
    }
    // You can send a response back if needed
    // sendResponse({ response: 'Message received.' });
  });
  
  // Other background script logic can be added as needed
  
  