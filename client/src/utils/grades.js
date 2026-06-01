export const gradeLetters = ["O", "A+", "A", "B+", "B", "C", "D", "F"]

export const gradeChartLabels = [
  "O (90-100)",
  "A+ (80-89)",
  "A (70-79)",
  "B+ (60-69)",
  "B (50-59)",
  "C (45-49)",
  "D (40-44)",
  "F (<40)",
]

export const gradeChartColors = [
  "#10b981",
  "#34d399",
  "#60a5fa",
  "#8b5cf6",
  "#f59e0b",
  "#f97316",
  "#ef4444",
  "#6b7280",
]

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
  return "F"
}

export function getGradeDisplayClasses(marks) {
  const parsedMarks = parseFloat(marks) || 0
  const baseClasses = "gradeDisplay border rounded-lg px-4 py-2.5 w-20 text-center font-bold text-lg"

  if (parsedMarks === 0) {
    return `${baseClasses} bg-gray-100 text-gray-500`
  }

  if (parsedMarks >= 90) return `${baseClasses} bg-green-100 text-green-800`
  if (parsedMarks >= 80) return `${baseClasses} bg-blue-100 text-blue-800`
  if (parsedMarks >= 70) return `${baseClasses} bg-indigo-100 text-indigo-800`
  if (parsedMarks >= 60) return `${baseClasses} bg-purple-100 text-purple-800`
  if (parsedMarks >= 50) return `${baseClasses} bg-yellow-100 text-yellow-800`
  if (parsedMarks >= 45) return `${baseClasses} bg-orange-100 text-orange-800`
  if (parsedMarks >= 40) return `${baseClasses} bg-red-100 text-red-800`
  return `${baseClasses} bg-gray-100 text-gray-800`
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
