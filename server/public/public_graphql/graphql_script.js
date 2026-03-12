const apiTypeSelect = document.getElementById("apiType");
const getAllBtn = document.getElementById("getAllBtn");
const getOneBtn = document.getElementById("getOneBtn");
const rowIdInput = document.getElementById("rowId");
const output = document.getElementById("output");

// Function that displays the data in html element
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

    // Else if GraphQL, send a POST request to /graphql
    const response = await fetch("/graphql", {
      method: "POST",
      // The requests content is JSON
      headers: {
        "Content-Type": "application/json",
      },
      // Sending the GraphQL-query in the request body
      body: JSON.stringify({
        query: `
        query {
            testTable {
            id
            name
            }
        }
        `,
      }),
    });
    if (!response.ok) {
      throw new Error(`GraphQL-fetch failed: ${response.status}`);
    } else {
      const result = await response.json();
      responseData = result.data;
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

    const response = await fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
              query GetTestRow($id: ID!) {
              testRow(id: $id) {
                  id
                  name
              }
              }
          `,
        variables: {
          id: id,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL-fetch failed: ${response.status}`);
    } else {
      const result = await response.json();
      responseData = result.data;
    }

    showResult(responseData);
  } catch (error) {
    showError(error.message);
  }
}

getAllBtn.addEventListener("click", fetchAll);
getOneBtn.addEventListener("click", fetchOne);
