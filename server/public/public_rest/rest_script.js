const output = document.getElementById("output");

function showResult(data) {
  // Change JavaScript-object into formatted JSON-string
  output.textContent = JSON.stringify(data, null, 2);
}

function showError(error) {
  output.textContent = "Error:\n" + error;
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

