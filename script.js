// script.js - CGPA Calculator with Marks Input Only

// Function to convert marks to grade points
function getGradePointFromMarks(marks) {
  marks = parseFloat(marks) || 0;
  if (marks >= 90 && marks <= 100) return 10;
  else if (marks >= 80 && marks <= 89) return 9;
  else if (marks >= 70 && marks <= 79) return 8;
  else if (marks >= 60 && marks <= 69) return 7;
  else if (marks >= 50 && marks <= 59) return 6;
  else if (marks >= 45 && marks <= 49) return 5;
  else if (marks >= 40 && marks <= 44) return 4;
  else return 0; // Below 40
}

// Function to convert marks to grade letter
function getGradeLetterFromMarks(marks) {
  marks = parseFloat(marks) || 0;
  if (marks >= 90 && marks <= 100) return "O";
  else if (marks >= 80 && marks <= 89) return "A+";
  else if (marks >= 70 && marks <= 79) return "A";
  else if (marks >= 60 && marks <= 69) return "B+";
  else if (marks >= 50 && marks <= 59) return "B";
  else if (marks >= 45 && marks <= 49) return "C";
  else if (marks >= 40 && marks <= 44) return "D";
  else return "F"; // Below 40
}

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
  
  // Generate initial semester with default values
  generateSemesters();
}

// Generate semesters based on user input
function generateSemesters() {
  const semesterCount = Math.min(Math.max(parseInt(semesterCountInput.value) || 1, 1), 8);
  semestersContainer.innerHTML = "";

  for(let i = 1; i <= semesterCount; i++) {
    const semDiv = document.createElement("div");
    semDiv.className = "semester border border-gray-200 p-6 mb-6 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:shadow-lg transition-all fade-in";
    semDiv.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800 flex items-center">
          <i class="fas fa-graduation-cap mr-3 text-blue-500"></i> Semester ${i}
        </h2>
        <span class="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1.5 rounded-full" id="tgpa-sem${i}">TGPA: --</span>
      </div>
      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div class="mb-3 md:mb-0">
          <label class="font-medium text-gray-700 text-lg">Number of Subjects:</label>
        </div>
        <div class="flex items-center">
          <input type="number" min="1" max="10" value="1" 
                 class="subjectCount border rounded-l-lg px-4 py-2 w-24 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg">
          <button type="button" class="addSubjectsBtn gradient-bg-3 text-white px-5 py-2.5 rounded-r-lg hover:opacity-90 transition-all font-medium">
            <i class="fas fa-plus mr-2"></i> Add Subjects
          </button>
        </div>
      </div>
      
      <div class="subjectsContainer mt-4 space-y-4"></div>
    `;
    semestersContainer.appendChild(semDiv);
  }
  
  // Add subjects for all semesters by default (empty fields)
  document.querySelectorAll(".semester").forEach(sem => {
    addSubjectsToSemester(sem);
  });
}

// Add subjects to a specific semester
function addSubjectsToSemester(semDiv) {
  const subjectsContainer = semDiv.querySelector(".subjectsContainer");
  subjectsContainer.innerHTML = "";

  const subjectCount = Math.min(Math.max(parseInt(semDiv.querySelector(".subjectCount").value) || 1, 1), 10);

  for(let j = 1; j <= subjectCount; j++) {
    const subDiv = document.createElement("div");
    subDiv.className = "subject-item flex flex-col md:flex-row md:items-center gap-4 p-4 border border-gray-200 rounded-xl bg-white hover:bg-blue-50 transition-colors fade-in";
    subDiv.innerHTML = `
      <div class="flex-grow">
        <input type="text" placeholder="Enter subject name" 
               class="subjectName border rounded-lg px-4 py-2.5 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg" 
               value="Subject ${j}">
      </div>
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
        <div class="w-full sm:w-auto">
          <label class="text-sm text-gray-600 font-medium">Credits</label>
          <input type="number" min="1" max="10" placeholder="Enter credits" 
                 class="credit border rounded-lg px-4 py-2.5 w-full sm:w-24 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg" 
                 value="">
        </div>
        <div class="w-full sm:w-auto">
          <label class="text-sm text-gray-600 font-medium">Marks (0-100)</label>
          <input type="number" min="0" max="100" placeholder="Enter marks" 
                 class="marks border rounded-lg px-4 py-2.5 w-full sm:w-32 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg marks-input" 
                 value="">
        </div>
        <div class="w-full sm:w-auto">
          <label class="text-sm text-gray-600 font-medium">Grade</label>
          <div class="flex items-center">
            <input type="text" readonly 
                   class="gradeDisplay border rounded-lg px-4 py-2.5 w-20 text-center font-bold text-lg bg-gray-100 text-gray-500" 
                   value="--">
          </div>
        </div>
      </div>
    `;
    subjectsContainer.appendChild(subDiv);
  }
  
  // Setup input listeners for this semester
  setupInputListeners(semDiv);
}

// Setup input listeners for a semester
function setupInputListeners(semDiv) {
  // Listen for marks input changes
  semDiv.querySelectorAll(".marks").forEach(input => {
    input.addEventListener("input", function() {
      updateGradeDisplay(this);
      calculateTGPAForSemester(semDiv);
    });
  });
  
  // Listen for credits input changes
  semDiv.querySelectorAll(".credit").forEach(input => {
    input.addEventListener("input", function() {
      calculateTGPAForSemester(semDiv);
    });
  });
}

// Update grade display for a single marks input
function updateGradeDisplay(marksInput) {
  const marks = parseFloat(marksInput.value) || 0;
  const gradeDisplay = marksInput.closest(".subject-item").querySelector(".gradeDisplay");
  const gradeLetter = getGradeLetterFromMarks(marks);
  
  if (marks === 0 || marks === "") {
    gradeDisplay.value = "--";
    gradeDisplay.className = "gradeDisplay border rounded-lg px-4 py-2.5 w-20 text-center font-bold text-lg bg-gray-100 text-gray-500";
    return;
  }
  
  gradeDisplay.value = gradeLetter;
  
  // Color code the grade display based on marks
  if (marks >= 90) {
    gradeDisplay.className = "gradeDisplay border rounded-lg px-4 py-2.5 w-20 bg-green-100 text-green-800 text-center font-bold text-lg";
  } else if (marks >= 80) {
    gradeDisplay.className = "gradeDisplay border rounded-lg px-4 py-2.5 w-20 bg-blue-100 text-blue-800 text-center font-bold text-lg";
  } else if (marks >= 70) {
    gradeDisplay.className = "gradeDisplay border rounded-lg px-4 py-2.5 w-20 bg-indigo-100 text-indigo-800 text-center font-bold text-lg";
  } else if (marks >= 60) {
    gradeDisplay.className = "gradeDisplay border rounded-lg px-4 py-2.5 w-20 bg-purple-100 text-purple-800 text-center font-bold text-lg";
  } else if (marks >= 50) {
    gradeDisplay.className = "gradeDisplay border rounded-lg px-4 py-2.5 w-20 bg-yellow-100 text-yellow-800 text-center font-bold text-lg";
  } else if (marks >= 45) {
    gradeDisplay.className = "gradeDisplay border rounded-lg px-4 py-2.5 w-20 bg-orange-100 text-orange-800 text-center font-bold text-lg";
  } else if (marks >= 40) {
    gradeDisplay.className = "gradeDisplay border rounded-lg px-4 py-2.5 w-20 bg-red-100 text-red-800 text-center font-bold text-lg";
  } else {
    gradeDisplay.className = "gradeDisplay border rounded-lg px-4 py-2.5 w-20 bg-gray-100 text-gray-800 text-center font-bold text-lg";
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

// Calculate TGPA for a single semester
function calculateTGPAForSemester(semDiv) {
  const subjects = semDiv.querySelectorAll(".subject-item");
  let semPoints = 0;
  let semCredits = 0;
  let hasValidData = false;

  subjects.forEach(sub => {
    const credit = parseFloat(sub.querySelector(".credit").value) || 0;
    const marks = parseFloat(sub.querySelector(".marks").value) || 0;
    
    if (credit > 0 && marks > 0) {
      const gp = getGradePointFromMarks(marks);
      semPoints += gp * credit;
      semCredits += credit;
      hasValidData = true;
    }
  });

  const tgpa = semCredits === 0 ? 0 : (semPoints / semCredits);
  
  // Update TGPA display for this semester
  const semIndex = Array.from(semestersContainer.children).indexOf(semDiv) + 1;
  const tgpaElement = semDiv.querySelector(`#tgpa-sem${semIndex}`);
  if (tgpaElement) {
    if (hasValidData) {
      tgpaElement.textContent = `TGPA: ${tgpa.toFixed(2)}`;
      // Color code based on performance
      if (tgpa >= 9) {
        tgpaElement.className = "bg-green-100 text-green-800 text-sm font-medium px-4 py-1.5 rounded-full";
      } else if (tgpa >= 8) {
        tgpaElement.className = "bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1.5 rounded-full";
      } else if (tgpa >= 7) {
        tgpaElement.className = "bg-yellow-100 text-yellow-800 text-sm font-medium px-4 py-1.5 rounded-full";
      } else if (tgpa >= 6) {
        tgpaElement.className = "bg-orange-100 text-orange-800 text-sm font-medium px-4 py-1.5 rounded-full";
      } else if (tgpa >= 5) {
        tgpaElement.className = "bg-red-100 text-red-800 text-sm font-medium px-4 py-1.5 rounded-full";
      } else {
        tgpaElement.className = "bg-gray-100 text-gray-800 text-sm font-medium px-4 py-1.5 rounded-full";
      }
    } else {
      tgpaElement.textContent = "TGPA: --";
      tgpaElement.className = "bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1.5 rounded-full";
    }
  }
  
  return { tgpa, credits: semCredits, hasValidData };
}

// Calculate CGPA and TGPA for all semesters
function calculateCGPA() {
  const semesters = document.querySelectorAll(".semester");
  let totalPoints = 0;
  let totalCredits = 0;
  let totalSubjects = 0;
  let tgpaValues = [];
  let gradeDistribution = {};
  
  // Initialize grade distribution
  const gradeLetters = ["O", "A+", "A", "B+", "B", "C", "D", "F"];
  gradeLetters.forEach(grade => {
    gradeDistribution[grade] = 0;
  });

  // Calculate for each semester
  semesters.forEach((sem, index) => {
    const subjects = sem.querySelectorAll(".subject-item");
    let semPoints = 0;
    let semCredits = 0;
    let semMarks = [];

    subjects.forEach(sub => {
      const subjectName = sub.querySelector(".subjectName").value || `Subject ${index + 1}`;
      const credit = parseFloat(sub.querySelector(".credit").value) || 0;
      const marks = parseFloat(sub.querySelector(".marks").value) || 0;
      const gp = getGradePointFromMarks(marks);
      const gradeLetter = getGradeLetterFromMarks(marks);

      if (credit > 0 && marks > 0) {
        semPoints += gp * credit;
        semCredits += credit;
        totalSubjects++;
        semMarks.push({
          subject: subjectName, 
          marks: marks, 
          grade: gradeLetter, 
          points: gp,
          credits: credit
        });
        
        // Count grade occurrences for distribution
        if (gradeLetter && gradeDistribution.hasOwnProperty(gradeLetter)) {
          gradeDistribution[gradeLetter]++;
        }
      }
    });

    const tgpa = semCredits === 0 ? 0 : (semPoints / semCredits);
    tgpaValues.push({
      semester: index + 1,
      tgpa: parseFloat(tgpa.toFixed(2)),
      credits: semCredits,
      subjects: semMarks,
      hasData: semCredits > 0
    });

    totalPoints += semPoints;
    totalCredits += semCredits;
  });

  const cgpa = totalCredits === 0 ? 0 : (totalPoints / totalCredits);
  
  // Update results display
  displayResults(cgpa, totalCredits, tgpaValues, totalSubjects);
  
  // Update charts
  updateCharts(tgpaValues, gradeDistribution);
  
  // Update summary statistics
  updateSummaryStats(tgpaValues, totalCredits, totalSubjects);
}

// Display results
function displayResults(cgpa, totalCredits, tgpaValues, totalSubjects) {
  let resultHTML = `
    <div class="fade-in">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Calculation Results</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="gradient-bg text-white p-6 rounded-xl text-center">
          <p class="text-xl font-semibold mb-2">Overall CGPA</p>
          <p class="text-5xl font-bold my-4">${cgpa.toFixed(2)}</p>
          <p class="text-lg">Out of 10.0</p>
        </div>
        <div class="gradient-bg-2 text-white p-6 rounded-xl text-center">
          <p class="text-xl font-semibold mb-2">Total Credits</p>
          <p class="text-5xl font-bold my-4">${totalCredits}</p>
          <p class="text-lg">Across ${tgpaValues.length} semesters</p>
        </div>
        <div class="gradient-bg-3 text-white p-6 rounded-xl text-center">
          <p class="text-xl font-semibold mb-2">Total Subjects</p>
          <p class="text-5xl font-bold my-4">${totalSubjects}</p>
          <p class="text-lg">Subjects completed</p>
        </div>
      </div>
    </div>
  `;
  
  // Add semester-wise breakdown if there's data
  const semestersWithData = tgpaValues.filter(sem => sem.hasData);
  
  if (semestersWithData.length > 0) {
    resultHTML += `
      <div class="fade-in">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Semester-wise Breakdown</h3>
        <div class="overflow-x-auto rounded-lg border">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-100">
                <th class="text-left p-4 border-b">Semester</th>
                <th class="text-left p-4 border-b">TGPA</th>
                <th class="text-left p-4 border-b">Credits</th>
                <th class="text-left p-4 border-b">Subjects</th>
                <th class="text-left p-4 border-b">Performance</th>
              </tr>
            </thead>
            <tbody>
    `;
    
    semestersWithData.forEach(sem => {
      let performance = "";
      let performanceClass = "";
      if (sem.tgpa >= 9) {
        performance = "Outstanding";
        performanceClass = "bg-green-100 text-green-800";
      } else if (sem.tgpa >= 8) {
        performance = "Excellent";
        performanceClass = "bg-blue-100 text-blue-800";
      } else if (sem.tgpa >= 7) {
        performance = "Very Good";
        performanceClass = "bg-yellow-100 text-yellow-800";
      } else if (sem.tgpa >= 6) {
        performance = "Good";
        performanceClass = "bg-orange-100 text-orange-800";
      } else if (sem.tgpa >= 5) {
        performance = "Average";
        performanceClass = "bg-red-100 text-red-800";
      } else {
        performance = "Needs Improvement";
        performanceClass = "bg-gray-100 text-gray-800";
      }
      
      resultHTML += `
        <tr class="hover:bg-gray-50">
          <td class="p-4 border-b font-medium">Semester ${sem.semester}</td>
          <td class="p-4 border-b font-bold text-lg">${sem.tgpa.toFixed(2)}</td>
          <td class="p-4 border-b">${sem.credits}</td>
          <td class="p-4 border-b">${sem.subjects.length}</td>
          <td class="p-4 border-b">
            <span class="px-4 py-1.5 rounded-full font-medium ${performanceClass}">${performance}</span>
          </td>
        </tr>
      `;
    });
    
    resultHTML += `
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else {
    resultHTML += `
      <div class="text-center py-6">
        <div class="inline-block p-4 bg-yellow-50 rounded-lg">
          <i class="fas fa-exclamation-triangle text-yellow-500 text-3xl mb-3"></i>
          <p class="text-yellow-700 font-medium">Please enter marks and credits for at least one subject to see detailed results.</p>
        </div>
      </div>
    `;
  }
  
  document.getElementById("result").innerHTML = resultHTML;
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
        tension: 0.4,
        pointBackgroundColor: '#3a56d5',
        pointRadius: 6,
        pointHoverRadius: 8
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
          },
          title: {
            display: true,
            text: 'TGPA Score'
          }
        },
        x: {
          grid: {
            color: 'rgba(0,0,0,0.05)'
          },
          title: {
            display: true,
            text: 'Semester'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      }
    }
  });

  // Grade Distribution Chart
  const gradeCtx = document.getElementById('gradeChart').getContext('2d');
  gradeChart = new Chart(gradeCtx, {
    type: 'doughnut',
    data: {
      labels: ['O (90-100)', 'A+ (80-89)', 'A (70-79)', 'B+ (60-69)', 'B (50-59)', 'C (45-49)', 'D (40-44)', 'F (<40)'],
      datasets: [{
        data: [0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: [
          '#10b981', '#34d399', '#60a5fa', '#8b5cf6', 
          '#f59e0b', '#f97316', '#ef4444', '#6b7280'
        ],
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 15
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
            pointStyle: 'circle',
            font: {
              size: 11
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.label || '';
              if (label) {
                label += ': ';
              }
              label += context.raw + ' subject(s)';
              return label;
            }
          }
        }
      }
    }
  });
}

// Update charts with new data
function updateCharts(tgpaValues, gradeDistribution) {
  // Update CGPA chart with only semesters that have data
  const validSemesters = tgpaValues.filter(sem => sem.hasData);
  cgpaChart.data.labels = validSemesters.map(sem => `Sem ${sem.semester}`);
  cgpaChart.data.datasets[0].data = validSemesters.map(sem => sem.tgpa);
  cgpaChart.update();
  
  // Update grade distribution chart
  const gradeOrder = ["O", "A+", "A", "B+", "B", "C", "D", "F"];
  gradeChart.data.datasets[0].data = gradeOrder.map(grade => gradeDistribution[grade] || 0);
  gradeChart.update();
}

// Update summary statistics
function updateSummaryStats(tgpaValues, totalCredits, totalSubjects) {
  document.getElementById('totalCredits').textContent = totalCredits;
  document.getElementById('totalSubjects').textContent = totalSubjects;
  
  const validSemesters = tgpaValues.filter(sem => sem.hasData);
  
  if (validSemesters.length > 0) {
    const tgpas = validSemesters.map(sem => sem.tgpa);
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
  document.getElementById("result").innerHTML = `
    <div class="text-center py-8">
      <i class="fas fa-calculator text-5xl text-gray-300 mb-4"></i>
      <p class="text-gray-500 text-lg">Enter your marks and click "Calculate CGPA" to see results</p>
    </div>
  `;
  
  // Reset charts
  cgpaChart.data.labels = [];
  cgpaChart.data.datasets[0].data = [];
  cgpaChart.update();
  
  gradeChart.data.datasets[0].data = new Array(8).fill(0);
  gradeChart.update();
  
  // Reset summary stats
  document.getElementById('totalCredits').textContent = "0";
  document.getElementById('highestTgpa').textContent = "0.00";
  document.getElementById('lowestTgpa').textContent = "0.00";
  document.getElementById('totalSubjects').textContent = "0";
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
