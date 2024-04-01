let MAX_REQUESTS = 10; // Maximum number of connection requests to send

const NOTE = "Hey {{firstName}}, excited to connect!"; // Note to include with connection requests

const DELAY = 4000; // Delay (in milliseconds) between each action
let totalRequestsSent = 0; // Counter for total connection requests sent

// This function initializes the script and starts the process
function executeScript() {
 console.log("Script initialized...");
 setTimeout(() => scrollBottom({}), DELAY); // Scroll to the bottom of the page after the initial delay
}

// This function scrolls to the bottom of the page
function scrollBottom(data) {
 window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
 setTimeout(() => scrollTop(data), DELAY); // After a delay, scroll to the top of the page
}

// This function scrolls to the top of the page
function scrollTop(data) {
 window.scrollTo({ top: 0, behavior: "smooth" });
 setTimeout(() => inspectElements(data), DELAY); // After a delay, inspect the page elements
}

// This function inspects the elements on the page and initiates data compilation
function inspectElements(data) {
 var totalRows = getAvailableProfiles(); // Get the number of available profiles on the page
 if (totalRows >= 0) {
   compileData(data); // If there are available profiles, compile the data
 } else {
   console.log(
     `Script completed. Sent ${totalRequestsSent} connection requests.`
   ); // If no available profiles, log the total requests sent and exit the script
 }
}

// This function compiles the data from the page (buttons, names, etc.)
function compileData(data) {
 var elements = document.querySelectorAll("button"); // Get all button elements on the page
 data.pageButtons = [...elements].filter(
   (element) => element.textContent.trim() === "Connect"
 ); // Filter for "Connect" buttons
 if (!data.pageButtons || data.pageButtons.length === 0) {
   console.log("Moving to next page..."); // If no "Connect" buttons found, move to the next page
   setTimeout(() => {
     goToNextPage();
   }, DELAY);
 } else {
   data.pageButtonTotal = data.pageButtons.length; // Store the total number of "Connect" buttons on the page
   data.pageButtonIndex = 0; // Initialize the index of the current "Connect" button
   var names = document.getElementsByClassName("entity-result__title-text"); // Get name elements
   names = [...names].filter((element) =>
     element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.textContent.includes(
       "Connect\n"
     )
   ); // Filter for names associated with "Connect" buttons
   data.connectNames = [...names].map(
     (element) => element.innerText.split(" ")[0]
   ); // Extract and store the first names from the name elements
   setTimeout(() => {
     sendInvites(data);
   }, DELAY); // After a delay, start sending connection requests
 }
}

// This function sends connection requests
function sendInvites(data) {
 if (MAX_REQUESTS == 0) {
   console.log("Max requests reached!"); // If the maximum number of requests has been reached, log a message
   console.log(
     `Script completed. Sent ${totalRequestsSent} connection requests.`
   ); // Log the total requests sent and exit the script
 } else {
   var button = data.pageButtons[data.pageButtonIndex]; // Get the current "Connect" button
   button.click(); // Click the "Connect" button
   if (!!NOTE) {
     setTimeout(() => clickAddNote(data), DELAY); // If a note is provided, click the "Add a note" button after a delay
   } else {
     setTimeout(() => clickSendWithoutNote(data), DELAY); // If no note, click the "Send without a note" button after a delay
   }
 }
}

// This function clicks the "Add a note" button and initiates the note insertion process
function clickAddNote(data) {
 var buttons = document.querySelectorAll("button"); // Get all button elements on the page
 var addNoteButton = Array.prototype.filter.call(
   buttons,
   (el) => el.textContent.trim() === "Add a note"
 ); // Filter for the "Add a note" button
 if (addNoteButton && addNoteButton[0]) {
   addNoteButton[0].click(); // Click the "Add a note" button
   setTimeout(() => insertNote(data), DELAY); // After a delay, insert the note
 } else {
   setTimeout(() => clickDone(data), DELAY); // If no "Add a note" button found, click the "Done" button after a delay
 }
}

// This function clicks the "Send without a note" button
function clickSendWithoutNote(data) {
 var buttons = document.querySelectorAll("button"); // Get all button elements on the page
 var doneButton = Array.prototype.filter.call(
   buttons,
   (el) => el.textContent.trim() === "Send without a note"
 ); // Filter for the "Send without a note" button
 if (doneButton && doneButton[0]) {
   doneButton[0].click(); // Click the "Send without a note" button
 }
 setTimeout(() => clickClose(data), DELAY); // After a delay, click the "Close" button
}

// This function inserts the note and initiates the "Done" button click process
function insertNote(data) {
 let noteTextBox = document.getElementById("custom-message"); // Get the note text box element
 noteTextBox.value = NOTE.replace(
   "{{firstName}}",
   data.connectNames[data.pageButtonIndex]
 ); // Insert the note with the personalized first name
 noteTextBox.dispatchEvent(new Event("input", { bubbles: true })); // Trigger an "input" event to update the note text box
 setTimeout(() => clickDone(data), DELAY); // After a delay, click the "Done" button
}

// This function clicks the "Done" button
function clickDone(data) {
 var buttons = document.querySelectorAll("button"); // Get all button elements on the page
 var doneButton = Array.prototype.filter.call(
   buttons,
   (el) => el.textContent.trim() === "Send"
 ); // Filter for the "Send" button
 if (doneButton && doneButton[0]) {
   doneButton[0].click(); // Click the "Send" button
 }
 setTimeout(() => clickClose(data), DELAY); // After a delay, click the "Close" button
}

// This function clicks the "Close" button and prepares for the next connection request or page
function clickClose(data) {
 var closeButton = document.getElementsByClassName(
   "artdeco-modal__dismiss artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view"
 ); // Get the "Close" button element
 if (closeButton && closeButton[0]) {
   closeButton[0].click(); // Click the "Close" button
 }
 console.log(
   `Invite sent to ${data.pageButtonIndex + 1} out of ${data.pageButtonTotal}`
 ); // Log the progress of the current connection request
 MAX_REQUESTS--; // Decrement the maximum requests counter
 totalRequestsSent++; // Increment the total requests sent counter
 if (data.pageButtonIndex === data.pageButtonTotal - 1) {
   setTimeout(() => goToNextPage(), DELAY); // If all "Connect" buttons on the page have been processed, move to the next page after a delay
 } else {
   data.pageButtonIndex++; // Otherwise, increment the "Connect" button index
   setTimeout(() => sendInvites(data), DELAY); // After a delay, send the next connection request
 }
}

// This function navigates to the next page
function goToNextPage() {
 var pagerButton = document.querySelector(".artdeco-pagination__button--next"); // Get the "Next Page" button element
 if (!pagerButton || pagerButton.length === 0) {
   console.log("No next page button found!"); // If no "Next Page" button found, log a message
   console.log(
     `Script completed. Sent ${totalRequestsSent} connection requests.`
   ); // Log the total requests sent and exit the script
 }
 console.log("Going to next page..."); // Log a message indicating that the script is moving to the next page
 pagerButton.click(); // Click the "Next Page" button
 setTimeout(() => executeScript(), DELAY); // After a delay, execute the script on the next page
}

// This function gets the number of available profiles on the page
function getAvailableProfiles() {
 var search_results = document.getElementsByClassName("search-result"); // Get all search result elements on the page
 if (search_results && search_results.length != 0) {
   return search_results.length; // Return the number of search results (available profiles)
 } else {
   return 0; // If no search results found, return 0
 }
}

executeScript(); // Call the function to start the script