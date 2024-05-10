function toggleInputs() {
    const dailyInputs = document.getElementById("dailyInputs");
    const dailyInputsTo = document.getElementById("dailyInputsTo");
    const monthlyInputs = document.getElementById("monthlyInputs");
    const monthlyInputsTo = document.getElementById("monthlyInputsTo");

    const dailyRadio = document.getElementById("daily");
    const monthlyRadio = document.getElementById("monthly");

    if (dailyRadio.checked) {
      dailyInputs.style.display = "block";
      dailyInputsTo.style.display = "block";
      monthlyInputs.style.display = "none";
      monthlyInputsTo.style.display = "none";
    } else if (monthlyRadio.checked) {
      dailyInputs.style.display = "none";
      dailyInputsTo.style.display = "none";
      monthlyInputs.style.display = "block";
      monthlyInputsTo.style.display = "block";
    }
  }

  // Attach event listener to radio buttons
  document.querySelectorAll('input[name="interval"]').forEach((radio) => {
    radio.addEventListener("change", toggleInputs);
  });

  function executeReport() {
    let startDate;
    let endDate;

    let falconApplication = "Falcon";
    let omniApplication = "Omni";

    let reportValue = document.getElementById("dropdownForreport").value;
    let matchFalcon = reportValue.match(/Falcon/);
    console.log("Mathched falcon value : " + matchFalcon);
    let matchOmni = reportValue.match(/Omni/);
    console.log("Mathched falcon value : " + matchOmni);

    const dailyRadioButton = document.getElementById("daily");
    console.log(dailyRadioButton);
    const monthlyRadioButton = document.getElementById("monthly");
    const reportType = dailyRadioButton.checked
      ? dailyRadioButton.value
      : monthlyRadioButton.value;

    console.log("Report type is : " + reportType);

    const dropdownValue =
      document.getElementById("dropdownForreport").value;

    if (reportType == "Monthly") {
      //startDate = document.getElementById("startMonth").value;
      // endDate = document.getElementById("endMonth").value;
      const rawStartMonth = document.getElementById("startMonth").value; // '2024-01'
      const rawEndMonth = document.getElementById("endMonth").value; // '2024-02'

      console.log("rawStartMonth :", rawStartMonth);
      startDate = formatDate(rawStartMonth);
      console.log("formated startDate", startDate); // Output: 2024-01-01T00:00:00.000Z

      // Format end date
      console.log("rawEndMonth :", rawEndMonth);
      endDate = formatDate(rawEndMonth, true); // Pass true to indicate end of month
      console.log("formated endDate", endDate); // Output: 2024-01-31T23:59:00.000Z
    } else {
      startDate = document.getElementById("startDate").value;
      startDate = startDate + " 00:00:00.000";
      endDate = document.getElementById("endDate").value;
      endDate = endDate + " 23:59:59.000";
    }
    console.log(
      `Your given Input \n startDate: ${startDate}, endDate: ${endDate}, reportType: ${reportType}, dropdownForreport : ${dropdownValue}`
    );

    //exportButton.style.display = 'block';

    //   const isValid = startDate && endDate && reportType && dropdownValue;
    //   executeButton.style.display = isValid ? "block" : "none";

    let apiUrl;

    if (
      dropdownValue === "getIVRReportForFalcon" &&
      reportType == "Daily"
    ) {
      apiUrl = `http://localhost:8080/api/daily?application=${encodeURIComponent(
        matchFalcon
      )}&startDate=${encodeURIComponent(
        startDate
      )}&endDate=${encodeURIComponent(endDate)}`;
    } else if (
      dropdownValue === "getIVRReportForOmni" &&
      reportType == "Daily"
    ) {
      apiUrl = `http://localhost:8080/api/daily?application=${encodeURIComponent(
        matchOmni
      )}&startDate=${encodeURIComponent(
        startDate
      )}&endDate=${encodeURIComponent(endDate)}`;
    }

    if (
      dropdownValue === "getIVRReportForFalcon" &&
      reportType == "Monthly"
    ) {
      apiUrl = `http://localhost:8080/api/monthly?application=${encodeURIComponent(
        matchFalcon
      )}&startDate=${encodeURIComponent(
        startDate
      )}&endDate=${encodeURIComponent(
        endDate
      )}&reportType=${encodeURIComponent(reportType)}`;
    } else if (
      dropdownValue === "getIVRReportForOmni" &&
      reportType == "Monthly"
    ) {
      apiUrl = `http://localhost:8080/api/monthly?application=${encodeURIComponent(
        matchOmni
      )}&startDate=${encodeURIComponent(
        startDate
      )}&endDate=${encodeURIComponent(
        endDate
      )}&reportType=${encodeURIComponent(reportType)}`;
    }

    // const startDate = '2024-01-01 00:00:00.000';
    // const endDate = '2024-02-15 23:59:59.000';
    // const reportType = 'Daily';

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => {
        if (!response.ok) {
          // throw new Error(`HTTP error! Status: ${response.status}`);

          return response.json();
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        exportButton.style.display = "block";

        console.log("Data is : " + data);
        const message = data.message;
        console.log("Message:", message);

        if (data.statusCode === 200) {
          displayData(data);
        } else {
          showErrorMessage(data.message);
        }

        // Handle the response data as needed
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function exportToExcel() {
    const container = document.getElementById("resultContainer");

    // Check if container has child elements (data)
    if (container.hasChildNodes()) {
      const table = container.querySelector("table");

      // Get all rows except the first one (headers)
      const rows = table.querySelectorAll("tr:not(:first-child)");

      // Convert the table to a worksheet
      const ws = XLSX.utils.table_to_sheet(table);
      // const ws = XLSX.utils.table_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // Generate Excel file and trigger download
      XLSX.writeFile(wb, "report.xlsx");
    } else {
      alert("No data to export.");
    }
  }

  function showErrorMessage(message) {
    // alert(message);
    const errorMessageElement = document.getElementById("errorMessage");

    // Set the message content and style
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = "block";
  }

  function updateInputs() {
    let startDate;
    let endDate;
    let startMonth;
    let endMonth;

    const dailyRadioButton = document.getElementById("daily");
    const monthlyRadioButton = document.getElementById("monthly");
    const reportType = dailyRadioButton.checked
      ? dailyRadioButton.value
      : monthlyRadioButton.value;

    const dropdownValue =
      document.getElementById("dropdownForreport").value;

    if (reportType == "Monthly") {
      var rawStartMonth = document.getElementById("startMonth").value; // '2024-01'
      var rawEndMonth = document.getElementById("endMonth").value; // '2024-02'

      console.log("rawStartMonth :", rawStartMonth);
      console.log("rawStartMonth :", rawEndMonth);
      startMonth = rawStartMonth;
      endMonth = rawEndMonth;
    }

    startDate = document.getElementById("startDate").value;
    endDate = document.getElementById("endDate").value;

    // Add your validation logic here
    const isValid =
      ((startDate && endDate) || (startMonth && endMonth)) &&
      (dropdownValue === "getIVRReportForFalcon" ||
        dropdownValue === "getIVRReportForOmni");

    // Show/hide and enable/disable the execute button based on validation result
    executeButton.style.display = isValid ? "flex" : "none";
    executeButton.disabled = !isValid;
  }

  function formatDate(rawDate, isEndOfMonth = false) {
    console.log("Passed raw data inside formatDate:", rawDate);

    const [year, month] = rawDate.split("-"); // assuming the format is 'yyyy-mm'
    const day = isEndOfMonth ? 1 : 1; // Set day to 1 for both start and end date

    // Ensure month and day are zero-padded
    const formattedMonth = month.padStart(2, "0");
    const formattedDay = day.toString().padStart(2, "0");

    const date = new Date(
      `${year}-${formattedMonth}-${formattedDay}T00:00:00.000Z`
    );

    // Check for invalid date
    if (isNaN(date.getTime())) {
      console.error("Invalid Date:", rawDate);
      return null; // or handle the error as needed
    }

    // If it's the end of the month, set to the last second of the day
    if (isEndOfMonth) {
      date.setUTCMonth(date.getUTCMonth() + 1, 0); // Move to the next month and set to the last day
      date.setUTCHours(23, 59, 59, 0);
    }

    // Format the date as 'yyyy-mm-dd HH:mm:ss.000'
    const formattedDate = date.toISOString().replace("T", " ").slice(0, 23);

    return formattedDate;
  }

  function displayData(data) {
    // Variable Declarations
    let startDate;
    let endDate;
    const resultContainer = document.getElementById("resultContainer");
    const dropdownValue =
      document.getElementById("dropdownForreport").value;
    const dailyRadioButton = document.getElementById("daily");
    const monthlyRadioButton = document.getElementById("monthly");
    const reportType = dailyRadioButton.checked
      ? dailyRadioButton.value
      : monthlyRadioButton.value;
    const tableContainer = document.createElement("div");
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Set Start and End Date based on Report Type
    if (reportType == "Monthly") {
      var rawStartMonth = document.getElementById("startMonth").value; // '2024-01'
      var rawEndMonth = document.getElementById("endMonth").value; // '2024-02'
      startDate = rawStartMonth;
      endDate = rawEndMonth;
    } else {
      startDate = document.getElementById("startDate").value;
      endDate = document.getElementById("endDate").value;
    }

    // Display Title and Dates
    const title =
      dropdownValue === "getIVRReportForOmni"
        ? "Dnata Omni Report"
        : "Dnata Falcon Report";
    resultContainer.innerHTML = `<h3 class="mt-4"><center><b>${title}<b></center></h3>`;
    resultContainer.innerHTML += `<p class="mt-2"><center><strong>From :</strong> ${startDate} - <strong>To :</strong> ${endDate}<center></p>`;

    // Table styling
    tableContainer.style.overflowY = "auto";
    tableContainer.style.maxHeight = "450px";
    tableContainer.style.textAlign = "center";
    table.classList.add("table", "table-striped");

    // Table header
    const headers = [
      "Date",
      "Offered",
      "Answered",
      "Transferred",
      "Avg. handling time on IVR (in Seconds)",
    ];
    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      thead.appendChild(th);
    });
    table.appendChild(thead);

    // Table body

    if (reportType == "Daily") {
      data.responseBody.forEach((item, index) => {
        try {
          const row = document.createElement("tr");
          row.classList.add(index % 2 === 0 ? "even-row" : "odd-row");

          for (const key in item) {
            const cell = document.createElement("td");
            const cellValue = item[key];

            if (key === "AvgHandlingTimeInSeconds" && cellValue === null) {
              cell.textContent = "-";
            } else {
              cell.textContent = item[key];
            }

            row.appendChild(cell);
          }

          tbody.appendChild(row);
        } catch (error) {
          console.error("Error processing data item:", error);
        }
      });
    } else {
      const item = data.responseBody;

      const row = document.createElement("tr");
      row.classList.add("single-row"); // You can define the class for single rows if needed

      for (const key in item) {
        const cell = document.createElement("td");
        const cellValue = item[key];

        if (key === "AvgHandlingTimeInSeconds" && cellValue === null) {
          cell.textContent = "-";
        } else {
          cell.textContent = item[key];
        }

        row.appendChild(cell);
      }

      tbody.appendChild(row);
    }

    table.appendChild(tbody);
    // Append table to result container
    tableContainer.appendChild(table);
    resultContainer.appendChild(tableContainer);
  }