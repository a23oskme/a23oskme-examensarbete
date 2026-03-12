const getAllBtn = document.getElementById("getAllBtn");
const getOneBtn = document.getElementById("getOneBtn");
const rowIdInput = document.getElementById("rowId");
const output = document.getElementById("output");

function showResult(data) {
  // Change JavaScript-object into formatted JSON-string
  output.textContent = JSON.stringify(data, null, 2);
}

function showError(error) {
  output.textContent = "Error:\n" + error;
}

// Function that fetches all rows from the chosen API
async function fetchAll() {
  try {
    // Variable to hold the response
    let responseData;
    // Send a GET-request to the REST-endpoint to get all rows
    const response = await fetch("/rest/test-table");
    // If the response is not okey, throw an error
    if (!response.ok) {
      throw new Error(`REST-fetch failed: ${response.status}`);
    } else {
      // If else, the response is okey, turn the JSON-response into a JavaScrip-object
      responseData = await response.json();
    }
    
    showResult(responseData);
  } catch (error) {
    showError(error.message);
  }
}

// Function that fetches one row based on id
async function fetchOne() {
  // Get inserted id
  const id = rowIdInput.value;

  // Show error if the user did not enter an id
  if (!id) {
    showError("Enter ID.");
    return;
  }

  try {
    let responseData;

    // Fetch from REST-endpoint for a specific row
    const response = await fetch(`/rest/test-table/${id}`);
    if (!response.ok) {
      throw new Error(`REST-fetch failed: ${response.status}`);
    }
    responseData = await response.json();

    showResult(responseData);
  } catch (error) {
    showError(error.message);
  }
}

getAllBtn.addEventListener("click", fetchAll);
getOneBtn.addEventListener("click", fetchOne);
