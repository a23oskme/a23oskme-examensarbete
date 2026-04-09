const output = document.getElementById("output");
const timingOutput = document.getElementById("timing");

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

async function fetchRestData(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return await response.json();
}

// GET ONE PAGE
async function fetchPageById(pageId) {
  try {
    const start = performance.now();
    const data = await fetchRestData(`/rest/pages/${pageId}`);
    const end = performance.now();

    showTiming(end - start);
    showResult(data);
  } catch (error) {
    showError(error.message);
  }
}

// GET ONE CATEGORY
async function fetchCategoryById(categoryId) {
  try {
    const start = performance.now();
    const data = await fetchRestData(`/rest/categories/${categoryId}`);
    const end = performance.now();

    showTiming(end - start);
    showResult(data);
  } catch (error) {
    showError(error.message);
  }
}

// GET CATEGORIES FOR A PAGE
async function fetchPageCategories(pageId) {
  try {
    const start = performance.now();
    const data = await fetchRestData(`/rest/pages/${pageId}/categories`);
    const end = performance.now();

    showTiming(end - start);
    showResult(data);
  } catch (error) {
    showError(error.message);
  }
}

// GET PAGES FOR ONE CATEGORY
async function fetchCategoryPages(categoryId) {
  try {
    const start = performance.now();
    const data = await fetchRestData(`/rest/categories/${categoryId}/pages`);
    const end = performance.now();

    showTiming(end - start);
    showResult(data);
  } catch (error) {
    showError(error.message);
  }
}

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

document.getElementById("getPageCategoriesBtn").addEventListener("click", () => {
  const pageId = document.getElementById("pageCategoriesInput").value.trim();

  if (!pageId) {
    showError("Please enter a page id.");
    return;
  }

  fetchPageCategories(pageId);
});

document.getElementById("getCategoryPagesBtn").addEventListener("click", () => {
  const categoryId = document.getElementById("categoryPagesIdInput").value.trim();

  if (!categoryId) {
    showError("Please enter a category id.");
    return;
  }

  fetchCategoryPages(categoryId);
});

