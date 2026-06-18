export const gradeOptions = [
  {
    letter: "O",
    points: 10,
    label: "Outstanding",
    status: "Outstanding",
    chartLabel: "O (10 pts)",
    color: "#0f9f6e",
    swatchClassName: "bg-emerald-500",
    displayClassName: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    letter: "A+",
    points: 9,
    label: "Excellent",
    status: "Excellent",
    chartLabel: "A+ (9 pts)",
    color: "#2563eb",
    swatchClassName: "bg-blue-600",
    displayClassName: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    letter: "A",
    points: 8,
    label: "Very Good",
    status: "Very Good",
    chartLabel: "A (8 pts)",
    color: "#4f46e5",
    swatchClassName: "bg-indigo-600",
    displayClassName: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    letter: "B+",
    points: 7,
    label: "Good",
    status: "Good",
    chartLabel: "B+ (7 pts)",
    color: "#7c3aed",
    swatchClassName: "bg-violet-600",
    displayClassName: "bg-violet-50 text-violet-700 border-violet-200",
  },
  {
    letter: "B",
    points: 6,
    label: "Above Average",
    status: "Above Average",
    chartLabel: "B (6 pts)",
    color: "#ca8a04",
    swatchClassName: "bg-yellow-600",
    displayClassName: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  {
    letter: "C",
    points: 5,
    label: "Average",
    status: "Average",
    chartLabel: "C (5 pts)",
    color: "#ea580c",
    swatchClassName: "bg-orange-600",
    displayClassName: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    letter: "D",
    points: 4,
    label: "Pass",
    status: "Pass",
    chartLabel: "D (4 pts)",
    color: "#dc2626",
    swatchClassName: "bg-red-600",
    displayClassName: "bg-red-50 text-red-700 border-red-200",
  },
  {
    letter: "E",
    points: 0,
    label: "Reappear",
    status: "Reappear",
    chartLabel: "E (0 pts)",
    color: "#64748b",
    swatchClassName: "bg-slate-500",
    displayClassName: "bg-slate-100 text-slate-700 border-slate-300",
  },
  {
    letter: "F",
    points: 0,
    label: "Fail",
    status: "Fail",
    chartLabel: "F (0 pts)",
    color: "#475569",
    swatchClassName: "bg-slate-600",
    displayClassName: "bg-slate-100 text-slate-700 border-slate-300",
  },
  {
    letter: "G",
    points: 0,
    label: "Backlog",
    status: "Backlog",
    chartLabel: "G (0 pts)",
    color: "#334155",
    swatchClassName: "bg-slate-700",
    displayClassName: "bg-slate-100 text-slate-700 border-slate-300",
  },
  {
    letter: "I",
    points: 0,
    label: "Result Incomplete",
    status: "Incomplete",
    chartLabel: "I (0 pts)",
    color: "#1e293b",
    swatchClassName: "bg-slate-800",
    displayClassName: "bg-slate-100 text-slate-700 border-slate-300",
  },
]

export const gradeLetters = gradeOptions.map((grade) => grade.letter)

export const gradeChartLabels = gradeOptions.map((grade) => grade.chartLabel)

export const gradeChartColors = gradeOptions.map((grade) => grade.color)

const gradeByLetter = Object.fromEntries(gradeOptions.map((grade) => [grade.letter, grade]))

export function getGradePointFromMarks(marks) {
  const parsedMarks = parseFloat(marks) || 0

  if (parsedMarks > 89) return 10
  if (parsedMarks > 79) return 9
  if (parsedMarks > 69) return 8
  if (parsedMarks > 59) return 7
  if (parsedMarks > 49) return 6
  if (parsedMarks > 44) return 5
  if (parsedMarks >= 40) return 4
  return 0
}

export function getGradeLetterFromMarks(marks) {
  const parsedMarks = parseFloat(marks) || 0

  if (parsedMarks > 89) return "O"
  if (parsedMarks > 79) return "A+"
  if (parsedMarks > 69) return "A"
  if (parsedMarks > 59) return "B+"
  if (parsedMarks > 49) return "B"
  if (parsedMarks > 44) return "C"
  if (parsedMarks >= 40) return "D"
  return "E"
}

export function normalizeGrade(grade) {
  return String(grade || "")
    .trim()
    .toUpperCase()
    .replace("AP", "A+")
    .replace("BP", "B+")
}

export function getGradePointFromGrade(grade) {
  return gradeByLetter[normalizeGrade(grade)]?.points ?? 0
}

export function getGradeInfoFromGrade(grade) {
  return gradeByLetter[normalizeGrade(grade)] || null
}

export function getGradeDisplayClasses(grade) {
  const baseClasses = "gradeDisplay border rounded-lg px-4 py-2.5 w-20 text-center font-bold text-lg"
  const gradeInfo = getGradeInfoFromGrade(grade)

  if (!gradeInfo) {
    return `${baseClasses} bg-gray-100 text-gray-500`
  }

  return `${baseClasses} ${gradeInfo.displayClassName}`
}

export function getSubjectGradeData(subject) {
  const credit = parseFloat(subject.credits) || 0
  const usesGradeEntry = subject.entryMode === "grade"

  if (usesGradeEntry) {
    const gradeInfo = getGradeInfoFromGrade(subject.grade)
    const hasValidData = credit > 0 && Boolean(gradeInfo)

    return {
      credit,
      marks: null,
      grade: gradeInfo?.letter || "",
      gradePoint: gradeInfo?.points ?? 0,
      hasValidData,
      entryMode: "grade",
    }
  }

  const marks = parseFloat(subject.marks) || 0
  const hasValidData = credit > 0 && subject.marks !== "" && !isNaN(marks) && marks >= 0
  const grade = hasValidData ? getGradeLetterFromMarks(marks) : ""

  return {
    credit,
    marks,
    grade,
    gradePoint: hasValidData ? getGradePointFromMarks(marks) : 0,
    hasValidData,
    entryMode: "marks",
  }
}

export function getTgpaBadgeClasses(tgpa, hasValidData) {
  const baseClasses = "text-sm font-medium px-4 py-1.5 rounded-full"

  if (!hasValidData) return `bg-blue-100 text-blue-800 ${baseClasses}`
  if (tgpa >= 9) return `bg-green-100 text-green-800 ${baseClasses}`
  if (tgpa >= 8) return `bg-blue-100 text-blue-800 ${baseClasses}`
  if (tgpa >= 7) return `bg-yellow-100 text-yellow-800 ${baseClasses}`
  if (tgpa >= 6) return `bg-orange-100 text-orange-800 ${baseClasses}`
  if (tgpa >= 5) return `bg-red-100 text-red-800 ${baseClasses}`
  return `bg-gray-100 text-gray-800 ${baseClasses}`
}

export function getPerformance(tgpa) {
  if (tgpa >= 9) {
    return { label: "Outstanding", className: "bg-green-100 text-green-800" }
  }

  if (tgpa >= 8) {
    return { label: "Excellent", className: "bg-blue-100 text-blue-800" }
  }

  if (tgpa >= 7) {
    return { label: "Very Good", className: "bg-yellow-100 text-yellow-800" }
  }

  if (tgpa >= 6) {
    return { label: "Good", className: "bg-orange-100 text-orange-800" }
  }

  if (tgpa >= 5) {
    return { label: "Average", className: "bg-red-100 text-red-800" }
  }

  return { label: "Needs Improvement", className: "bg-gray-100 text-gray-800" }
}
