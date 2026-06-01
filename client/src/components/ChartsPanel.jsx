import { useEffect, useRef } from "react"

import { gradeChartColors, gradeChartLabels, gradeLetters } from "../utils/grades"

export default function ChartsPanel({ calculation }) {
  const cgpaCanvasRef = useRef(null)
  const gradeCanvasRef = useRef(null)
  const cgpaChartRef = useRef(null)
  const gradeChartRef = useRef(null)

  useEffect(() => {
    if (!window.Chart || !cgpaCanvasRef.current || !gradeCanvasRef.current) return

    cgpaChartRef.current = new window.Chart(cgpaCanvasRef.current.getContext("2d"), {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "TGPA",
            data: [],
            borderColor: "#3a56d5",
            backgroundColor: "rgba(58, 86, 213, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#3a56d5",
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
            grid: {
              color: "rgba(0,0,0,0.05)",
            },
            ticks: {
              stepSize: 2,
            },
            title: {
              display: true,
              text: "TGPA Score",
            },
          },
          x: {
            grid: {
              color: "rgba(0,0,0,0.05)",
            },
            title: {
              display: true,
              text: "Semester",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
      },
    })

    gradeChartRef.current = new window.Chart(gradeCanvasRef.current.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: gradeChartLabels,
        datasets: [
          {
            data: new Array(8).fill(0),
            backgroundColor: gradeChartColors,
            borderWidth: 2,
            borderColor: "#fff",
            hoverOffset: 15,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyle: "circle",
              font: {
                size: 11,
              },
            },
          },
          tooltip: {
            callbacks: {
              label(context) {
                let label = context.label || ""
                if (label) {
                  label += ": "
                }
                label += `${context.raw} subject(s)`
                return label
              },
            },
          },
        },
      },
    })

    return () => {
      cgpaChartRef.current?.destroy()
      gradeChartRef.current?.destroy()
      cgpaChartRef.current = null
      gradeChartRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!cgpaChartRef.current || !gradeChartRef.current) return

    const validSemesters = calculation ? calculation.tgpaValues.filter((semester) => semester.hasData) : []
    cgpaChartRef.current.data.labels = validSemesters.map((semester) => `Sem ${semester.semester}`)
    cgpaChartRef.current.data.datasets[0].data = validSemesters.map((semester) => semester.tgpa)
    cgpaChartRef.current.update()

    const gradeDistribution = calculation?.gradeDistribution || {}
    gradeChartRef.current.data.datasets[0].data = gradeLetters.map((grade) => gradeDistribution[grade] || 0)
    gradeChartRef.current.update()
  }, [calculation])

  const validSemesters = calculation?.tgpaValues.filter((semester) => semester.hasData) || []
  const tgpas = validSemesters.map((semester) => semester.tgpa)
  const totalCredits = calculation?.totalCredits || 0
  const totalSubjects = calculation?.totalSubjects || 0
  const highestTgpa = tgpas.length > 0 ? Math.max(...tgpas).toFixed(2) : "0.00"
  const lowestTgpa = tgpas.length > 0 ? Math.min(...tgpas).toFixed(2) : "0.00"

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl card-shadow p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">CGPA Progress</h2>
        <div className="h-64">
          <canvas ref={cgpaCanvasRef} id="cgpaChart" />
        </div>
        <p className="text-gray-600 text-sm mt-4 text-center">Your semester-wise performance trend</p>
      </div>

      <div className="bg-white rounded-xl card-shadow p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Grade Distribution</h2>
        <div className="h-64">
          <canvas ref={gradeCanvasRef} id="gradeChart" />
        </div>
        <p className="text-gray-600 text-sm mt-4 text-center">Distribution of grades across subjects</p>
      </div>

      <div className="bg-white rounded-xl card-shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Academic Summary</h2>
        <div id="summaryStats" className="space-y-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Credits</p>
            <p className="text-3xl font-bold text-blue-600" id="totalCredits">
              {totalCredits}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Highest TGPA</p>
              <p className="text-2xl font-bold text-green-600" id="highestTgpa">
                {highestTgpa}
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Lowest TGPA</p>
              <p className="text-2xl font-bold text-red-600" id="lowestTgpa">
                {lowestTgpa}
              </p>
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Subjects</p>
            <p className="text-2xl font-bold text-purple-600" id="totalSubjects">
              {totalSubjects}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
