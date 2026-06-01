import { useState } from "react"

import ChartsPanel from "./components/ChartsPanel"
import GradingReference from "./components/GradingReference"
import Results from "./components/Results"
import SemesterCard from "./components/SemesterCard"
import { getGradeLetterFromMarks, getGradePointFromMarks, gradeLetters } from "./utils/grades"

function clampNumber(value, min, max) {
  return Math.min(Math.max(parseInt(value) || min, min), max)
}

function createSubjects(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: `${Date.now()}-${index + 1}-${Math.random().toString(36).slice(2)}`,
    name: `Subject ${index + 1}`,
    credits: "",
    marks: "",
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
      const credit = parseFloat(subject.credits) || 0
      const marks = parseFloat(subject.marks) || 0
      const gradePoint = getGradePointFromMarks(marks)
      const gradeLetter = getGradeLetterFromMarks(marks)

      if (credit > 0 && marks > 0) {
        semPoints += gradePoint * credit
        semCredits += credit
        totalSubjects += 1
        semMarks.push({
          subject: subjectName,
          marks,
          grade: gradeLetter,
          points: gradePoint,
          credits: credit,
        })

        if (gradeLetter && Object.prototype.hasOwnProperty.call(gradeDistribution, gradeLetter)) {
          gradeDistribution[gradeLetter] += 1
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

  function handleGenerateSemesters() {
    const count = clampNumber(semesterCount, 1, 8)
    setSemesterCount(String(count))
    setSemesters(createSemesters(count))
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
  }

  function handleReset() {
    setSemesterCount("1")
    setSemesters(createSemesters(1))
    setCalculation(null)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-6">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">LPU TGPA/CGPA Calculator</h1>
          <p className="text-gray-600">Enter your marks and credits to calculate CGPA automatically</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl card-shadow p-6 mb-6">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">Academic Semesters</h2>
                  <p className="text-gray-600">Add semesters and input subject marks (0-100)</p>
                </div>
                <div className="flex items-center">
                  <label htmlFor="semesterCount" className="font-semibold text-gray-700 mr-3">
                    Semesters:
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="semesterCount"
                      min="1"
                      max="8"
                      value={semesterCount}
                      onChange={(event) => setSemesterCount(event.target.value)}
                      className="border rounded-l-lg px-3 py-2 w-20 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      id="generateSem"
                      onClick={handleGenerateSemesters}
                      className="gradient-bg text-white px-4 py-2 rounded-r-lg hover:opacity-90 transition-all"
                    >
                      <i className="fas fa-plus mr-2" />
                      Generate
                    </button>
                  </div>
                </div>
              </div>

              <GradingReference />
            </div>

            <form id="cgpaForm">
              <div id="semestersContainer" className="space-y-6">
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

              <div className="mt-8 text-center flex flex-col sm:flex-row justify-center gap-4">
                <button
                  type="button"
                  id="calculateBtn"
                  onClick={handleCalculate}
                  className="gradient-bg-2 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-all hover:-translate-y-1"
                >
                  <i className="fas fa-calculator mr-2" />
                  Calculate CGPA
                </button>
                <button
                  type="button"
                  id="resetBtn"
                  onClick={handleReset}
                  className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  <i className="fas fa-redo mr-2" />
                  Reset All
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-xl card-shadow p-6">
            <Results calculation={calculation} />
          </div>
        </div>

        <ChartsPanel calculation={calculation} />
      </div>

      <footer className="mt-8 text-center text-gray-600 text-sm">
        <p>CGPA Calculator v3.0 | Enter marks (0-100) and credits | Grades are calculated automatically</p>
      </footer>
    </div>
  )
}
