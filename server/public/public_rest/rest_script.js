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

  try {
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

