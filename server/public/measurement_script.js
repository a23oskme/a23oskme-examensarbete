// ==UserScript==
// @name         API measurement script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Run API measurements from the UI and download csv
// @match        http://localhost:3000/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // pageById
  // categoryById
  // pageCategories
  // categoryPages
  // deepTraversal
  const TEST_TYPE = "pageById";
  const SEED = 1;
  const MAX_REQUESTS = 100;
  const DELAY_MS = 100;

  const PAGE_TSV_URL = "http://localhost:3000/data/pages.tsv";
  const CATEGORY_TSV_URL = "http://localhost:3000/data/category.tsv";

  // SEED GENERATOR COPIED FROM https://github.com/LenaSYS/Random-Number-Generator/blob/master/seededrandom.js

  function jsf32(a, b, c, d) {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    let t = a - ((b << 23) | (b >>> 9)) | 0;
    a = b ^ ((c << 16) | (c >>> 16)) | 0;
    b = c + ((d << 11) | (d >>> 21)) | 0;
    b = c + d | 0;
    c = d + t | 0;
    d = a + t | 0;
    return (d >>> 0) / 4294967296;
  }

  Math.random = function () {
    let rand = jsf32(0xF1EA5EED, Math.randSeed + 6871, Math.randSeed + 1889, Math.randSeed + 56781);
    Math.randSeed += Math.floor(rand * 37237);
    return rand;
  };

  Math.setSeed = function (seed) {
    Math.randSeed = seed;
    for (let i = 0; i < 7; i++) {
      Math.random();
    }
  };

  Math.randSeed = Math.floor(Date.now());

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function shuffleWithSeed(array, seed) {
    Math.setSeed(seed);

    let shuffled = array.slice();

    for (let i = shuffled.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }

    return shuffled;
  }

  function getTimingValue() {
    return document.getElementById("timing").textContent.trim();
  }

  function getOutputValue() {
    return document.getElementById("output").textContent;
  }

  function getMsFromTimingText(text) {
    return text.replace("Request time:", "").replace("ms", "").trim();
  }

  function getApiType() {
    if (window.location.pathname.includes("graphql")) {
      return "graphql";
    }
    return "rest";
  }

  function getTestConfig() {
    if (TEST_TYPE === "pageById") {
      return {
        inputId: "pageIdInput",
        buttonId: "getPageBtn",
        tsvUrl: PAGE_TSV_URL,
        idType: "page"
      };
    }

    if (TEST_TYPE === "categoryById") {
      return {
        inputId: "categoryIdInput",
        buttonId: "getCategoryBtn",
        tsvUrl: CATEGORY_TSV_URL,
        idType: "category"
      };
    }

    if (TEST_TYPE === "pageCategories") {
      return {
        inputId: "pageCategoriesInput",
        buttonId: "getPageCategoriesBtn",
        tsvUrl: PAGE_TSV_URL,
        idType: "page"
      };
    }

    if (TEST_TYPE === "categoryPages") {
      return {
        inputId: "categoryPagesIdInput",
        buttonId: "getCategoryPagesBtn",
        tsvUrl: CATEGORY_TSV_URL,
        idType: "category"
      };
    }

    if (TEST_TYPE === "deepTraversal") {
      return {
        inputId: "deepPageIdInput",
        buttonId: "getDeepTraversalBtn",
        tsvUrl: PAGE_TSV_URL,
        idType: "page"
      };
    }

    throw new Error("Unknown TEST_TYPE");
  }

  function waitForUiChange(oldTiming, oldOutput) {
    return new Promise(resolve => {
      const timingEl = document.getElementById("timing");
      const outputEl = document.getElementById("output");

      const observer = new MutationObserver(() => {
        const newTiming = timingEl.textContent.trim();
        const newOutput = outputEl.textContent;

        if (newTiming !== oldTiming || newOutput !== oldOutput) {
          observer.disconnect();
          resolve({
            timingText: newTiming,
            outputText: newOutput
          });
        }
      });

      observer.observe(timingEl, {
        childList: true,
        characterData: true,
        subtree: true
      });

      observer.observe(outputEl, {
        childList: true,
        characterData: true,
        subtree: true
      });
    });
  }

  async function getIds(tsvUrl) {
    const response = await fetch(tsvUrl);
    const text = await response.text();

    const lines = text.trim().split("\n");
    let ids = [];

    for (let i = 1; i < lines.length; i++) {
      let parts = lines[i].trim().split(/\s+/);
      let id = Number(parts[0]);

      if (!Number.isNaN(id)) {
        ids.push(id);
      }
    }

    ids.sort((a, b) => a - b);
    ids = shuffleWithSeed(ids, SEED);
    ids = ids.slice(0, MAX_REQUESTS);

    return ids;
  }

  async function runOne(idValue, runNumber, config) {
    const input = document.getElementById(config.inputId);
    const button = document.getElementById(config.buttonId);

    const oldTiming = getTimingValue();
    const oldOutput = getOutputValue();

    input.value = idValue;
    button.click();

    const result = await waitForUiChange(oldTiming, oldOutput);

    return {
      run: runNumber,
      api_type: getApiType(),
      test_type: TEST_TYPE,
      id_type: config.idType,
      id_value: idValue,
      time_ms: getMsFromTimingText(result.timingText),
      seed: SEED
    };
  }

  function downloadCsv(rows) {
    let csv = "run,api_type,test_type,id_type,id_value,time_ms,seed\n";

    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      csv += `${row.run},${row.api_type},${row.test_type},${row.id_type},${row.id_value},${row.time_ms},${row.seed}\n`;
    }

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${getApiType()}_${TEST_TYPE}_measurements.csv`;
    a.click();

    URL.revokeObjectURL(url);
  }

  async function runMeasurement() {
    const config = getTestConfig();
    const ids = await getIds(config.tsvUrl);
    let results = [];

    console.log("API type:", getApiType());
    console.log("Test type:", TEST_TYPE);
    console.log("Seed:", SEED);

    for (let i = 0; i < ids.length; i++) {
      console.log(`Request ${i + 1}/${ids.length}: ${ids[i]}`);
      let result = await runOne(ids[i], i + 1, config);
      results.push(result);
      await sleep(DELAY_MS);
    }

    downloadCsv(results);
    console.table(results);
  }

  window.runMeasurement = runMeasurement;
  console.log("Run runMeasurement() in the console");
})();