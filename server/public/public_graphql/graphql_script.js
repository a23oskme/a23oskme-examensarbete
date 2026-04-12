const output = document.getElementById("output");
const timingOutput = document.getElementById("timing");

// Function that displays the data in html element
function showResult(data) {
  // Change JavaScript-object into formatted JSON-string
  output.textContent = JSON.stringify(data, null, 2);
}

function showError(error) {
  output.textContent = "Error:\n" + error;
}

function showTiming(ms) {
  timingOutput.textContent = `Request time: ${ms.toFixed(2)} ms`;
}

async function fetchGraphQLData(query, variables = {}) {
  const response = await fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const result = await response.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors.map((error) => error.message).join("\n"));
  }

  return result.data;
}

// GET ONE PAGE
async function fetchPageById(pageId) {
  try {
    const start = performance.now();

    const data = await fetchGraphQLData(
      `
      query GetPage($id: ID!) {
        page(id: $id) {
          page_id
          page_namespace
          page_title
          page_is_redirect
        }
      }
      `,
      { id: pageId },
    );

    const end = performance.now();
    showTiming(end - start);
    showResult(data.page);
  } catch (error) {
    showError(error.message);
  }
}

// GET ONE CATEGORY
async function fetchCategoryById(categoryId) {
  try {
    const start = performance.now();

    const data = await fetchGraphQLData(
      `
      query GetCategory($id: ID!) {
        category(id: $id) {
          cat_id
          cat_title
        }
      }
      `,
      { id: categoryId },
    );

    const end = performance.now();
    showTiming(end - start);
    showResult(data.category);
  } catch (error) {
    showError(error.message);
  }
}


  }

  try {
              }
  } catch (error) {
    showError(error.message);
  }
}

// GET HTML ELEMENTS AND APPLY EVENTLISTENERS
document.getElementById("getPageBtn").addEventListener("click", () => {
  const pageId = document.getElementById("pageIdInput").value.trim();

  if (!pageId) {
    showError("Please enter a page id.");
    return;
  }

  fetchPageById(pageId);
});

document.getElementById("getCategoryBtn").addEventListener("click", () => {
  const categoryId = document.getElementById("categoryIdInput").value.trim();

  if (!categoryId) {
    showError("Please enter a category id.");
    return;
  }

  fetchCategoryById(categoryId);
});

