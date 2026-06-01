import { useState } from "react"

import ChartsPanel from "./components/ChartsPanel"
import GradingReference from "./components/GradingReference"
import Results from "./components/Results"
import SemesterCard from "./components/SemesterCard"
import { getSubjectGradeData, gradeLetters } from "./utils/grades"

function clampNumber(value, min, max) {
  return Math.min(Math.max(parseInt(value) || min, min), max)
}

function createSubjects(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: `${Date.now()}-${index + 1}-${Math.random().toString(36).slice(2)}`,
    name: `Subject ${index + 1}`,
    credits: "",
    marks: "",
    grade: "",
    entryMode: "marks",
  }))
}

function createSemesters(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: `semester-${Date.now()}-${index + 1}-${Math.random().toString(36).slice(2)}`,
    subjectCount: "1",
    subjects: createSubjects(1),
  }))
}

function buildCalculation(semesters) {
  let totalPoints = 0
  let totalCredits = 0
  let totalSubjects = 0
  const gradeDistribution = Object.fromEntries(gradeLetters.map((grade) => [grade, 0]))

  const tgpaValues = semesters.map((semester, index) => {
    let semPoints = 0
    let semCredits = 0
    const semMarks = []

    semester.subjects.forEach((subject) => {
      const subjectName = subject.name || `Subject ${index + 1}`
      const gradeData = getSubjectGradeData(subject)

      if (gradeData.hasValidData) {
        semPoints += gradeData.gradePoint * gradeData.credit
        semCredits += gradeData.credit
        totalSubjects += 1
        semMarks.push({
          subject: subjectName,
          marks: gradeData.marks,
          grade: gradeData.grade,
          points: gradeData.gradePoint,
          credits: gradeData.credit,
          entryMode: gradeData.entryMode,
        })

        if (gradeData.grade && Object.prototype.hasOwnProperty.call(gradeDistribution, gradeData.grade)) {
          gradeDistribution[gradeData.grade] += 1
        }
      }
    })

    const tgpa = semCredits === 0 ? 0 : semPoints / semCredits
    totalPoints += semPoints
    totalCredits += semCredits

    return {
      semester: index + 1,
      tgpa: parseFloat(tgpa.toFixed(2)),
      credits: semCredits,
      subjects: semMarks,
      hasData: semCredits > 0,
    }
  })

  return {
    cgpa: totalCredits === 0 ? 0 : totalPoints / totalCredits,
    totalCredits,
    totalSubjects,
    tgpaValues,
    gradeDistribution,
  }
}

export default function App() {
  const [semesterCount, setSemesterCount] = useState("1")
  const [semesters, setSemesters] = useState(() => createSemesters(1))
  const [calculation, setCalculation] = useState(null)
  const [toast, setToast] = useState({ show: false, message: "", type: "success" })

  function showToast(message, type = "success") {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }))
    }, 2000)
  }

  function handleGenerateSemesters() {
    const count = clampNumber(semesterCount, 1, 8)
    setSemesterCount(String(count))
    setSemesters(createSemesters(count))
    showToast(`Set to ${count} semester(s)`, "info")
  }

  function handleSubjectCountChange(semesterId, value) {
    setSemesters((currentSemesters) =>
      currentSemesters.map((semester) =>
        semester.id === semesterId ? { ...semester, subjectCount: value } : semester,
      ),
    )
  }

  function handleGenerateSubjects(semesterId) {
    setSemesters((currentSemesters) =>
      currentSemesters.map((semester) => {
        if (semester.id !== semesterId) return semester

        const subjectCount = clampNumber(semester.subjectCount, 1, 10)
        return {
          ...semester,
          subjectCount: String(subjectCount),
          subjects: createSubjects(subjectCount),
        }
      }),
    )
    showToast("Subjects updated", "success")
  }

  function handleSubjectChange(semesterId, subjectId, field, value) {
    setSemesters((currentSemesters) =>
      currentSemesters.map((semester) => {
        if (semester.id !== semesterId) return semester

        return {
          ...semester,
          subjects: semester.subjects.map((subject) =>
            subject.id === subjectId ? { ...subject, [field]: value } : subject,
          ),
        }
      }),
    )
  }

  function handleCalculate() {
    setCalculation(buildCalculation(semesters))
    showToast("CGPA Calculated successfully!", "success")
  }

  function handleReset() {
    setSemesterCount("1")
    setSemesters(createSemesters(1))
    setCalculation(null)
    showToast("All data has been reset", "info")
  }

  return (
    <main className="mx-auto max-w-7xl relative z-10 font-sans">
      <header className="glass-panel p-6 sm:p-8 rounded-2xl mb-8 border-t border-white/20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 text-sm font-semibold text-blue-400 backdrop-blur-md">
              <i className="fas fa-chart-line text-blue-400" />
              Academic GPA Console
            </span>
            <h1 className="text-3xl font-bold text-white md:text-5xl font-display tracking-tight mb-2">LPU TGPA/CGPA Calculator</h1>
            <p className="max-w-2xl text-slate-400 text-lg">
              Calculate semester TGPA and overall CGPA using marks or direct grade entry.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-4 text-center">
            <div className="glass-card rounded-xl px-4 py-4 md:px-6 shadow-[0_4px_20px_rgba(59,130,246,0.1)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">CGPA</p>
              <p className="text-3xl font-bold text-white font-display">{calculation ? calculation.cgpa.toFixed(2) : "0.00"}</p>
            </div>
            <div className="glass-card rounded-xl px-4 py-4 md:px-6 shadow-[0_4px_20px_rgba(16,185,129,0.1)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">Credits</p>
              <p className="text-3xl font-bold text-white font-display">{calculation?.totalCredits || 0}</p>
            </div>
            <div className="glass-card rounded-xl px-4 py-4 md:px-6 shadow-[0_4px_20px_rgba(245,158,11,0.1)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">Subjects</p>
              <p className="text-3xl font-bold text-white font-display">{calculation?.totalSubjects || 0}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="surface-card p-6 sm:p-8">
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2 font-display">Academic Semesters</h2>
                  <p className="text-slate-400">Use marks or grade-only entries for each subject.</p>
                </div>
                <div className="flex items-center glass-card rounded-lg p-1">
                  <label htmlFor="semesterCount" className="font-semibold text-slate-300 ml-3 mr-3 text-sm uppercase tracking-wider">
                    Semesters
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      id="semesterCount"
                      min="1"
                      max="8"
                      value={semesterCount}
                      onChange={(event) => setSemesterCount(event.target.value)}
                      className="glass-input rounded-md px-3 py-2 w-16 text-center mr-1"
                    />
                    <button
                      type="button"
                      id="generateSem"
                      onClick={handleGenerateSemesters}
                      className="gradient-bg text-white px-4 py-2 rounded-md transition-all hover:scale-105 active:scale-95 flex items-center font-medium"
                    >
                      <i className="fas fa-layer-group mr-2" />
                      Set
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <GradingReference />

            <form id="cgpaForm" className="mt-8">
              <div id="semestersContainer" className="space-y-8">
                {semesters.map((semester, index) => (
                  <SemesterCard
                    key={semester.id}
                    semester={semester}
                    semesterIndex={index}
                    onSubjectCountChange={handleSubjectCountChange}
                    onGenerateSubjects={handleGenerateSubjects}
                    onSubjectChange={handleSubjectChange}
                  />
                ))}
              </div>

              <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                <button
                  type="button"
                  id="calculateBtn"
                  onClick={handleCalculate}
                  className="gradient-bg text-white px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center w-full sm:w-auto"
                >
                  <i className="fas fa-calculator mr-2" />
                  Calculate CGPA
                </button>
                <button
                  type="button"
                  id="resetBtn"
                  onClick={handleReset}
                  className="glass-card hover:bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center w-full sm:w-auto"
                >
                  <i className="fas fa-rotate-left mr-2" />
                  Reset All
                </button>
              </div>
            </form>
          </div>

          <div className="surface-card p-6 sm:p-8">
            <Results calculation={calculation} />
          </div>
        </div>

        <div className="xl:col-span-1">
          <ChartsPanel calculation={calculation} />
        </div>
      </div>

      <footer className="mt-12 mb-8 text-center text-sm text-slate-500 font-medium">
        <p>CGPA Calculator v4.0 | LPU Standards | 10-point scale</p>
      </footer>

      {/* Toast Notification */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95 pointer-events-none'}`}>
        <div className={`glass-card px-6 py-4 rounded-xl flex items-center gap-3 shadow-2xl border ${
          toast.type === "success" ? "border-emerald-500/30 bg-emerald-950/40" : "border-blue-500/30 bg-blue-950/40"
        }`}>
          <i className={`fas ${toast.type === "success" ? "fa-check-circle text-emerald-400" : "fa-info-circle text-blue-400"} text-xl`}></i>
          <span className="text-white font-medium">{toast.message}</span>
        </div>
      </div>
    </main>
  )
}
