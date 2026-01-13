// script.js - Enhanced CGPA Calculator with Visualizations

// Grade points mapping
const gradePoints = {
  "O": 10,
  "A+": 9,
  "A": 8,
  "B+": 7,
  "B": 6,
  "C": 5,
  "D": 4,
  "E": 0,
  "F": 0,
  "G": 0,
  "I": 0
};

// Chart instances
let cgpaChart = null;
let gradeChart = null;

// DOM Elements
const semestersContainer = document.getElementById("semestersContainer");
const generateSemBtn = document.getElementById("generateSem");
const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");
const semesterCountInput = document.getElementById("semesterCount");

// Initialize the app
function initApp() {
  // Set up event listeners
  generateSemBtn.addEventListener("click", generateSemesters);
  calculateBtn.addEventListener("click", calculateCGPA);
  resetBtn.addEventListener("click", resetCalculator);
  
  // Initialize charts
  initCharts();
  
  // Generate initial semester
  generateSemesters();
}

// Generate semesters based on user input
function generateSemesters() {
  const semesterCount = Math.min(Math.max(parseInt(semesterCountInput.value), 1), 8);
  semestersContainer.innerHTML = "";

  for(let i = 1; i <= semesterCount; i++) {
    const semDiv = document.createElement("div");
    semDiv.className = "semester border border-gray-200 p-5 mb-5 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-all";
    semDiv.innerHTML = `
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-xl font-bold text-gray-800 flex items-center">
          <i class="fas fa-graduation-cap mr-2 text-blue-500"></i> Semester ${i}
        </h2>
        <span class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full" id="tgpa-sem${i}">TGPA: --</span>
      </div>
      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div class="mb-2 md:mb-0">
          <label class="font-medium text-gray-700">Number of Subjects:</label>
        </div>
        <div class="flex items-center">
          <input type="number" min="1" max="10" value="3" 
                 class="subjectCount border rounded-l-lg px-3 py-2 w-20 text-center focus:outline-none focus:ring-2 focus:ring-blue-500">
          <button type="button" class="addSubjectsBtn gradient-bg text-white px-4 py-2 rounded-r-lg hover:opacity-90 transition-all">
            <i class="fas fa-plus mr-1"></i> Add Subjects
          </button>
        </div>
      </div>
      
      <div class="subjectsContainer mt-4 space-y-3"></div>
    `;
    semestersContainer.appendChild(semDiv);
  }
  
  // Add subjects for the first semester by default
  if (semesterCount > 0) {
    const firstSem = semestersContainer.querySelector(".semester");
    addSubjectsToSemester(firstSem);
  }
}

// Add subjects to a specific semester
function addSubjectsToSemester(semDiv) {
  const subjectsContainer = semDiv.querySelector(".subjectsContainer");
  subjectsContainer.innerHTML = "";

  const subjectCount = Math.min(Math.max(parseInt(semDiv.querySelector(".subjectCount").value), 1), 10);

  for(let j = 1; j <= subjectCount; j++) {
    const subDiv = document.createElement("div");
    subDiv.className = "subject-item flex flex-col md:flex-row md:items-center gap-3 p-3 border border-gray-100 rounded-lg bg-white hover:bg-blue-50 transition-colors";
    subDiv.innerHTML = `
      <div class="flex-grow">
        <span class="font-medium text-gray-800">Subject ${j}</span>
      </div>
      <div class="flex items-center gap-3">
        <div>
          <label class="text-sm text-gray-600">Credits</label>
          <input type="number" min="1" max="10" placeholder="Credit" 
                 class="credit border rounded px-3 py-2 w-20 focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div>
          <label class="text-sm text-gray-600">Grade</label>
          <select class="grade border rounded px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select Grade</option>
            <option>O</option>
            <option>A+</option>
            <option>A</option>
            <option>B+</option>
            <option>B</option>
            <option>C</option>
            <option>D</option>
            <option>E</option>
            <option>F</option>
            <option>G</option>
            <option>I</option>
          </select>
        </div>
      </div>
    `;
    subjectsContainer.appendChild(subDiv);
  }
}

// Event delegation for adding subjects
semestersContainer.addEventListener("click", function(e) {
  if (e.target.classList.contains("addSubjectsBtn") || 
      e.target.closest(".addSubjectsBtn")) {
    const semDiv = e.target.closest(".semester");
    addSubjectsToSemester(semDiv);
  }
});

// Calculate CGPA and TGPA
function calculateCGPA() {
  const semesters = document.querySelectorAll(".semester");
  let totalPoints = 0;
  let totalCredits = 0;
  let tgpaValues = [];
  let gradeDistribution = {};
  
  // Initialize grade distribution
  Object.keys(gradePoints).forEach(grade => {
    gradeDistribution[grade] = 0;
  });

  // Calculate for each semester
  semesters.forEach((sem, index) => {
    const subjects = sem.querySelectorAll(".subjectsContainer .subject-item");
    let semPoints = 0;
    let semCredits = 0;

    subjects.forEach(sub => {
      const credit = parseFloat(sub.querySelector(".credit").value) || 0;
      const grade = sub.querySelector(".grade").value;
      const gp = gradePoints[grade] || 0;

      semPoints += gp * credit;
      semCredits += credit;
      
      // Count grade occurrences for distribution
      if (grade && gradeDistribution.hasOwnProperty(grade)) {
        gradeDistribution[grade]++;
      }
    });

    const tgpa = semCredits === 0 ? 0 : (semPoints / semCredits);
    tgpaValues.push({
      semester: index + 1,
      tgpa: parseFloat(tgpa.toFixed(2)),
      credits: semCredits
    });

    // Update TGPA display for this semester
    const tgpaElement = sem.querySelector(`#tgpa-sem${index + 1}`);
    if (tgpaElement) {
      tgpaElement.textContent = `TGPA: ${tgpa.toFixed(2)}`;
      // Color code based on performance
      if (tgpa >= 9) tgpaElement.className = "bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full";
      else if (tgpa >= 8) tgpaElement.className = "bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full";
      else if (tgpa >= 7) tgpaElement.className = "bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full";
      else tgpaElement.className = "bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full";
    }

    totalPoints += semPoints;
    totalCredits += semCredits;
  });

  const cgpa = totalCredits === 0 ? 0 : (totalPoints / totalCredits);
  
  // Update results display
  displayResults(cgpa, totalCredits, tgpaValues);
  
  // Update charts
  updateCharts(tgpaValues, gradeDistribution);
  
  // Update summary statistics
  updateSummaryStats(tgpaValues, totalCredits);
}

// Display results
function displayResults(cgpa, totalCredits, tgpaValues) {
  let resultHTML = `
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Calculation Results</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="gradient-bg text-white p-5 rounded-xl text-center">
        <p class="text-lg font-semibold">Overall CGPA</p>
        <p class="text-5xl font-bold mt-2">${cgpa.toFixed(2)}</p>
        <p class="mt-2">Out of 10.0</p>
      </div>
      <div class="gradient-bg-2 text-white p-5 rounded-xl text-center">
        <p class="text-lg font-semibold">Total Credits</p>
        <p class="text-5xl font-bold mt-2">${totalCredits}</p>
        <p class="mt-2">Across all semesters</p>
      </div>
      <div class="bg-purple-500 text-white p-5 rounded-xl text-center">
        <p class="text-lg font-semibold">Total Grade Points</p>
        <p class="text-5xl font-bold mt-2">${(cgpa * totalCredits).toFixed(1)}</p>
        <p class="mt-2">Sum of (Grade × Credit)</p>
      </div>
    </div>
  `;
  
  // Add semester-wise breakdown
  if (tgpaValues.length > 0) {
    resultHTML += `<h3 class="text-xl font-bold text-gray-800 mb-3">Semester-wise Breakdown</h3>`;
    resultHTML += `<div class="overflow-x-auto"><table class="w-full border-collapse">`;
    resultHTML += `<thead><tr class="bg-gray-100">
                    <th class="text-left p-3 border-b">Semester</th>
                    <th class="text-left p-3 border-b">TGPA</th>
                    <th class="text-left p-3 border-b">Credits</th>
                    <th class="text-left p-3 border-b">Performance</th>
                  </tr></thead><tbody>`;
    
    tgpaValues.forEach(sem => {
      let performance = "";
      if (sem.tgpa >= 9) performance = "Excellent";
      else if (sem.tgpa >= 8) performance = "Very Good";
      else if (sem.tgpa >= 7) performance = "Good";
      else if (sem.tgpa >= 6) performance = "Average";
      else performance = "Needs Improvement";
      
      resultHTML += `<tr class="hover:bg-gray-50">
                      <td class="p-3 border-b">Semester ${sem.semester}</td>
                      <td class="p-3 border-b font-bold">${sem.tgpa.toFixed(2)}</td>
                      <td class="p-3 border-b">${sem.credits}</td>
                      <td class="p-3 border-b">
                        <span class="px-3 py-1 rounded-full text-sm ${getPerformanceClass(sem.tgpa)}">${performance}</span>
                      </td>
                    </tr>`;
    });
    
    resultHTML += `</tbody></table></div>`;
  }
  
  document.getElementById("result").innerHTML = resultHTML;
}

// Get performance class for styling
function getPerformanceClass(tgpa) {
  if (tgpa >= 9) return "bg-green-100 text-green-800";
  else if (tgpa >= 8) return "bg-blue-100 text-blue-800";
  else if (tgpa >= 7) return "bg-yellow-100 text-yellow-800";
  else return "bg-red-100 text-red-800";
}

// Initialize charts
function initCharts() {
  // CGPA Progress Chart
  const cgpaCtx = document.getElementById('cgpaChart').getContext('2d');
  cgpaChart = new Chart(cgpaCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'TGPA',
        data: [],
        borderColor: '#3a56d5',
        backgroundColor: 'rgba(58, 86, 213, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 10,
          grid: {
            color: 'rgba(0,0,0,0.05)'
          },
          ticks: {
            stepSize: 2
          }
        },
        x: {
          grid: {
            color: 'rgba(0,0,0,0.05)'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });

  // Grade Distribution Chart
  const gradeCtx = document.getElementById('gradeChart').getContext('2d');
  gradeChart = new Chart(gradeCtx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(gradePoints),
      datasets: [{
        data: new Array(Object.keys(gradePoints).length).fill(0),
        backgroundColor: [
          '#10b981', '#34d399', '#60a5fa', '#8b5cf6', 
          '#f59e0b', '#f97316', '#ef4444', '#7c3aed',
          '#6b7280', '#6b7280', '#6b7280'
        ],
        borderWidth: 1,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        }
      }
    }
  });
}

// Update charts with new data
function updateCharts(tgpaValues, gradeDistribution) {
  // Update CGPA chart
  cgpaChart.data.labels = tgpaValues.map(sem => `Sem ${sem.semester}`);
  cgpaChart.data.datasets[0].data = tgpaValues.map(sem => sem.tgpa);
  cgpaChart.update();
  
  // Update grade distribution chart
  gradeChart.data.datasets[0].data = Object.keys(gradePoints).map(grade => gradeDistribution[grade]);
  gradeChart.update();
}

// Update summary statistics
function updateSummaryStats(tgpaValues, totalCredits) {
  document.getElementById('totalCredits').textContent = totalCredits;
  
  if (tgpaValues.length > 0) {
    const tgpas = tgpaValues.map(sem => sem.tgpa);
    const highestTgpa = Math.max(...tgpas);
    const lowestTgpa = Math.min(...tgpas);
    
    document.getElementById('highestTgpa').textContent = highestTgpa.toFixed(2);
    document.getElementById('lowestTgpa').textContent = lowestTgpa.toFixed(2);
  } else {
    document.getElementById('highestTgpa').textContent = "0.00";
    document.getElementById('lowestTgpa').textContent = "0.00";
  }
}

// Reset the calculator
function resetCalculator() {
  semesterCountInput.value = 1;
  generateSemesters();
  document.getElementById("result").innerHTML = "";
  
  // Reset charts
  cgpaChart.data.labels = [];
  cgpaChart.data.datasets[0].data = [];
  cgpaChart.update();
  
  gradeChart.data.datasets[0].data = new Array(Object.keys(gradePoints).length).fill(0);
  gradeChart.update();
  
  // Reset summary stats
  document.getElementById('totalCredits').textContent = "0";
  document.getElementById('highestTgpa').textContent = "0.00";
  document.getElementById('lowestTgpa').textContent = "0.00";
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);