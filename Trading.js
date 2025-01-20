// Function to process the CSV file
function processCsvData() {
    const fileInput = document.getElementById("csvFile");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please upload a CSV file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const csvData = event.target.result;
        parseCsvData(csvData);
    };
    reader.readAsText(file);
}

// Function to parse the CSV data
function parseCsvData(csvData) {
    const lines = csvData.split("\n");
    
    // Check if the file has content
    if (lines.length < 2) {
        alert("CSV file is empty or not in the expected format.");
        return;
    }
    
    // Parse headers
    const headers = lines[0].split(",");
    // Parse the first data row (assuming there’s only one row of data)
    const data = lines[1].split(",");

    // Ensure that the data array has the same length as headers
    if (data.length !== headers.length) {
        alert("CSV data does not match the expected format.");
        return;
    }

    // Create a map of headers to values
    const dataMap = {};
    headers.forEach((header, index) => {
        dataMap[header.trim()] = data[index].trim();
    });

    // Extract values from the data map
    var instrument = (dataMap["instrument"]);

    const high = parseFloat(dataMap["high"]);
    const low = parseFloat(dataMap["low"]);
    const close = parseFloat(dataMap["close"]);
    const currentLevel = parseFloat(dataMap["currentLevel"]);
    const entryLevel = parseFloat(dataMap["entryLevel"]);
    const targetLevel = parseFloat(dataMap["targetLevel"]);
  

    // Populate the form fields with the parsed data
    document.getElementById("instrument").value = instrument;
  document.getElementById("high").value = high;
    document.getElementById("low").value = low;
    document.getElementById("close").value = close;
    document.getElementById("currentLevel").value = currentLevel;
    document.getElementById("entryLevel").value = entryLevel;
    document.getElementById("targetLevel").value = targetLevel;

}





window.onload = function() {
    // Set current time and session
    document.getElementById("currentTime").innerText = new Date().toLocaleTimeString();
    document.getElementById("currentSession").innerText = getCurrentSession();
};



function calculatePivotPoints() {
    // Get user input
    const high = parseFloat(document.getElementById("high").value);
    const low = parseFloat(document.getElementById("low").value);
    const close = parseFloat(document.getElementById("close").value);
    const currentLevel = parseFloat(document.getElementById("currentLevel").value);

    // Validate the input values
    if (isNaN(high) || isNaN(low) || isNaN(close) || isNaN(currentLevel)) {
        alert("Please enter valid numbers for High, Low, Close, and Current Level.");
        return;
    }

    // Calculate Pivot Points
    const PP = (high + low + close) / 3;
    const R1 = 2 * PP - low;
    const S1 = 2 * PP - high;
    const R2 = PP + (high - low);
    const S2 = PP - (high - low);
    const R3 = high + 2 * (PP - low);
    const S3 = low - 2 * (high - PP);
    const R4 = high + 3 * (PP - low);
    const S4 = low - 3 * (high - PP);

    // Display Pivot Points
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = `
        <h3>Pivot Points</h3>
        <p><strong>Pivot Point (PP):</strong> ${PP.toFixed(2)}</p>
        <p><strong>Resistance 1 (R1):</strong> ${R1.toFixed(2)}</p>
        <p><strong>Support 1 (S1):</strong> ${S1.toFixed(2)}</p>
        <p><strong>Resistance 2 (R2):</strong> ${R2.toFixed(2)}</p>
        <p><strong>Support 2 (S2):</strong> ${S2.toFixed(2)}</p>
        <p><strong>Resistance 3 (R3):</strong> ${R3.toFixed(2)}</p>
        <p><strong>Support 3 (S3):</strong> ${S3.toFixed(2)}</p>
        <p><strong>Resistance 4 (R4):</strong> ${R4.toFixed(2)}</p>
        <p><strong>Support 4 (S4):</strong> ${S4.toFixed(2)}</p>
    `;

    // Disable the "Buy" button if the current level is above R4
    if (currentLevel >= R4) {
        document.getElementById("buyBtn").disabled = true;
    } else {
        document.getElementById("buyBtn").disabled = false;
    }

    

    // Enable the "Show Fibonacci Levels" button
    document.getElementById("calculateFib").disabled = false;
}

function calculateFibonacci(fHigh, fLow, trend) {
    let fibLevels = [0.28, 0.38, 0.50, 0.60];
    let levels = [];

    if (trend === "uptrend") {
        let range = fHigh - fLow;
        fibLevels.forEach(level => {
            levels.push(fLow + range * level);
        });
    } else if (trend === "downtrend") {
        let range = fHigh - fLow;
        fibLevels.forEach(level => {
            levels.push(fHigh - range * level);
        });
    }

    return levels;
}

function showFibonacciLevels() {
    const high = parseFloat(document.getElementById("high").value);
    const low = parseFloat(document.getElementById("low").value);
    const currentLevel = parseFloat(document.getElementById("currentLevel").value);

    // Determine trend based on user selection
    const trend = document.querySelector('input[name="trend"]:checked').value;

    // Calculate Fibonacci Levels
    const fibonacciLevels = calculateFibonacci(high, low, trend);

    // Display Fibonacci Levels
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = `
        <h3>Fibonacci Levels (${trend.charAt(0).toUpperCase() + trend.slice(1)})</h3>
        <p><strong>28%:</strong> ${fibonacciLevels[0].toFixed(2)}</p>
        <p><strong>38%:</strong> ${fibonacciLevels[1].toFixed(2)}</p>
        <p><strong>50%:</strong> ${fibonacciLevels[2].toFixed(2)}</p>
        <p><strong>60%:</strong> ${fibonacciLevels[3].toFixed(2)}</p>
    `;
//disable sell
    if (trend === "downtrend" && (currentLevel > fibonacciLevels[3] || currentLevel < S3))
         { document.getElementById("sellBtn").disabled = true;

          } else
           { 
            document.getElementById("sellBtn").disabled = false; 
           } 
           //disable buy
   if (trend === "uptrend" && currentLevel > fibonacciLevels[3])
            { 
            document.getElementById("buyBtn").disabled = true; 
          } 
         else 
    { 
        document.getElementById("buyBtn").disabled = false; } 
}

function calculateStopLoss() {
    const entryLevel = parseFloat(document.getElementById("entryLevel").value);
    const targetLevel = parseFloat(document.getElementById("targetLevel").value);

    // Validate the input values
    if (isNaN(entryLevel) || isNaN(targetLevel)) {
        alert("Please enter valid numbers for Entry Level and Target Level.");
        return;
    }

    // Determine trend based on user selection
    const trend = document.querySelector('input[name="trend"]:checked').value;

    let stopLoss;
    if (trend === "uptrend") {
        stopLoss = entryLevel - (targetLevel - entryLevel) / 2;
    } else if (trend === "downtrend") {
        stopLoss = entryLevel + (entryLevel - targetLevel) / 2;
    }

    // Display Stop Loss
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = `
        <h3>Stop Loss</h3>
        <p><strong>Stop Loss:</strong> ${stopLoss.toFixed(2)}</p>
    `;
}
function updateSessions() {
    const currentTime = new Date();
    document.getElementById("currentTime").innerText = currentTime.toLocaleTimeString();

    const sessions = [
        { name: 'India', start: 9, end: 16.5 }, // 9:00 AM to 4:30 PM IST
        { name: 'UK', start: 13.5, end: 21 }, // 9:00 AM to 5:00 PM BST (1:30 PM to 9:00 PM IST)
        { name: 'Europe', start: 12.5, end: 20 }, // 8:00 AM to 4:00 PM CET (12:30 PM to 8:00 PM IST)
        { name: 'US', start: 19, end: 2 }, // 9:00 AM to 4:00 PM EST (7:00 PM to 2:00 AM IST)
        { name: 'London', start: 13.5, end: 21 } // 9:00 AM to 5:00 PM GMT (1:30 PM to 9:00 PM IST)
    ];

    sessions.forEach(session => {
        const sessionBtn = document.getElementById(`${session.name.toLowerCase()}Btn`);
        const currentHours = currentTime.getHours() + currentTime.getMinutes() / 60;
        const sessionEndHours = session.end >= 24 ? session.end - 24 : session.end;

        if ((session.start <= currentHours && currentHours < session.end) ||
            (session.end < session.start && (currentHours >= session.start || currentHours < session.end))) {
            sessionBtn.classList.add('active');
            sessionBtn.classList.remove('inactive', 'warning');
        } else {
            sessionBtn.classList.add('inactive');
            sessionBtn.classList.remove('active', 'warning');
        }

        if ((session.end - currentHours <= 0.5 && session.end - currentHours > 0) ||
            (session.end < session.start && (24 - currentHours + session.end <= 0.5 && 24 - currentHours + session.end > 0))) {
            if (!sessionBtn.classList.contains('warning')) {
                alert(`The ${session.name} trading session will end in 30 minutes.`);
            }
            sessionBtn.classList.add('warning');
            sessionBtn.classList.remove('active', 'inactive');
        }

        if ((session.start - currentHours <= 0.5 && session.start - currentHours > 0) ||
            (session.start < currentHours && (24 - currentHours + session.start <= 0.5 && 24 - currentHours + session.start > 0))) {
            if (!sessionBtn.classList.contains('warning')) {
                alert(`The ${session.name} trading session will start in 30 minutes.`);
            }
            sessionBtn.classList.add('warning');
            sessionBtn.classList.remove('active', 'inactive');
        }
    });
}

// Event listeners for session buttons
document.getElementById("indiaBtn").addEventListener("click", updateSessions);
document.getElementById("ukBtn").addEventListener("click", updateSessions);
document.getElementById("europeBtn").addEventListener("click", updateSessions);
document.getElementById("usBtn").addEventListener("click", updateSessions);
document.getElementById("londonBtn").addEventListener("click", updateSessions);

// To store whether it's a "buy" or "sell" action
let actionType = "";

document.getElementById("buyBtn").addEventListener("click", function() {
    actionType = "buy";
    document.getElementById("confirmBtn").style.display = 'inline-block';
});

document.getElementById("sellBtn").addEventListener("click", function() {
    actionType = "sell";
    document.getElementById("confirmBtn").style.display = 'inline-block';
});

document.getElementById("confirmBtn").addEventListener("click", function() {
    if (actionType === "buy") {
        window.location.href = "your-buy-link-here"; // Replace with the actual buy link
    } else if (actionType === "sell") {
        window.location.href = "your-sell-link-here"; // Replace with the actual sell link
    } else {
        alert("Please select Buy or Sell first.");
    }
});
