import { useEffect, useRef } from "react"

import { gradeChartColors, gradeChartLabels, gradeLetters } from "../utils/grades"

export default function ChartsPanel({ calculation }) {
  const cgpaCanvasRef = useRef(null)
  const gradeCanvasRef = useRef(null)
  const cgpaChartRef = useRef(null)
  const gradeChartRef = useRef(null)

  useEffect(() => {
    if (!window.Chart || !cgpaCanvasRef.current || !gradeCanvasRef.current) return

    // Update global defaults for dark mode
    window.Chart.defaults.color = 'rgba(255, 255, 255, 0.7)'
    window.Chart.defaults.font.family = 'Inter, sans-serif'

    cgpaChartRef.current = new window.Chart(cgpaCanvasRef.current.getContext("2d"), {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "TGPA",
            data: [],
            borderColor: "#60a5fa", // blue-400
            backgroundColor: "rgba(96, 165, 250, 0.15)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#3b82f6", // blue-500
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
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
              color: "rgba(255, 255, 255, 0.05)",
            },
            ticks: {
              stepSize: 2,
              color: "rgba(255, 255, 255, 0.6)",
            },
            title: {
              display: true,
              text: "TGPA Score",
              color: "rgba(255, 255, 255, 0.8)",
            },
          },
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.05)",
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.6)",
            },
            title: {
              display: true,
              text: "Semester",
              color: "rgba(255, 255, 255, 0.8)",
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
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            titleColor: "#ffffff",
            bodyColor: "#ffffff",
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderWidth: 1,
            padding: 10,
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
            data: new Array(gradeLetters.length).fill(0),
            backgroundColor: gradeChartColors,
            borderWidth: 2,
            borderColor: "#0f172a", // slate-900 to blend with background
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
              color: "rgba(255, 255, 255, 0.8)",
              font: {
                size: 11,
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            titleColor: "#ffffff",
            bodyColor: "#ffffff",
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderWidth: 1,
            padding: 10,
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
    <div className="space-y-8">
      <div className="surface-card p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-white mb-2 font-display flex items-center gap-2">
          <i className="fas fa-chart-line text-blue-400"></i>
          CGPA Progress
        </h2>
        <p className="text-slate-400 text-sm mb-6">Your semester-wise performance trend</p>
        <div className="h-64">
          <canvas ref={cgpaCanvasRef} id="cgpaChart" />
        </div>
      </div>

      <div className="surface-card p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-white mb-2 font-display flex items-center gap-2">
          <i className="fas fa-chart-pie text-purple-400"></i>
          Grade Distribution
        </h2>
        <p className="text-slate-400 text-sm mb-6">Distribution of grades across subjects</p>
        <div className="h-64">
          <canvas ref={gradeCanvasRef} id="gradeChart" />
        </div>
      </div>

      <div className="surface-card p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-white mb-6 font-display flex items-center gap-2">
          <i className="fas fa-bolt text-amber-400"></i>
          Academic Summary
        </h2>
        <div id="summaryStats" className="space-y-4">
          <div className="summary-panel bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20">
            <p className="text-xs font-bold tracking-widest uppercase text-blue-300/80 mb-1">Total Credits</p>
            <p className="text-4xl font-bold text-blue-400 font-display" id="totalCredits">
              {totalCredits}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="summary-panel bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20">
              <p className="text-xs font-bold tracking-widest uppercase text-emerald-300/80 mb-1">Highest TGPA</p>
              <p className="text-3xl font-bold text-emerald-400 font-display" id="highestTgpa">
                {highestTgpa}
              </p>
            </div>
            <div className="summary-panel bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20">
              <p className="text-xs font-bold tracking-widest uppercase text-rose-300/80 mb-1">Lowest TGPA</p>
              <p className="text-3xl font-bold text-rose-400 font-display" id="lowestTgpa">
                {lowestTgpa}
              </p>
            </div>
          </div>
          <div className="summary-panel bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20">
            <p className="text-xs font-bold tracking-widest uppercase text-purple-300/80 mb-1">Total Subjects</p>
            <p className="text-4xl font-bold text-purple-400 font-display" id="totalSubjects">
              {totalSubjects}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
