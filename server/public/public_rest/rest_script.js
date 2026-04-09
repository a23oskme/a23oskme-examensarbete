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

// GET A PAGE AND ITS CATEGORY
// THEN GET ALL PAGES FOR THAT CATEGORY
// THEN GET ALL CATEGORIES FOR THOSE PAGES
async function fetchDeepPageTraversal(pageId) {
  try {
    const totalStart = performance.now();

    const page = await fetchRestData(`/rest/pages/${pageId}`);
    const categories = await fetchRestData(`/rest/pages/${pageId}/categories`);

    const categoriesWithPages = [];

    for (const category of categories) {
      const pages = await fetchRestData(`/rest/categories/${category.cat_id}/pages`);
      const pagesWithCategories = [];

      for (const relatedPage of pages) {
        const relatedPageCategories = await fetchRestData(
          `/rest/pages/${relatedPage.page_id}/categories`
        );

        pagesWithCategories.push({
          page_id: relatedPage.page_id,
          page_namespace: relatedPage.page_namespace,
          page_title: relatedPage.page_title,
          page_is_redirect: relatedPage.page_is_redirect,
          categories: relatedPageCategories
        });
      }

      categoriesWithPages.push({
        cat_id: category.cat_id,
        cat_title: category.cat_title,
        pages: pagesWithCategories
      });
    }

    const result = {
      page: page,
      categories: categoriesWithPages
    };

    const totalEnd = performance.now();
    showTiming(totalEnd - totalStart);
    showResult(result);
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

document.getElementById("getDeepTraversalBtn").addEventListener("click", () => {
  const pageId = document.getElementById("deepPageIdInput").value.trim();

  if (!pageId) {
    showError("Please enter a page id.");
    return;
  }

  fetchDeepPageTraversal(pageId);
});