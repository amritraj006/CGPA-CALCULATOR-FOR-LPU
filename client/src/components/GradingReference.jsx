const gradingCards = [
  {
    range: "90-100: O (10)",
    label: "Outstanding",
    className: "bg-green-50 border-green-200 text-green-800",
    textClassName: "text-green-700",
  },
  {
    range: "80-89: A+ (9)",
    label: "Excellent",
    className: "bg-blue-50 border-blue-200 text-blue-800",
    textClassName: "text-blue-700",
  },
  {
    range: "70-79: A (8)",
    label: "Very Good",
    className: "bg-indigo-50 border-indigo-200 text-indigo-800",
    textClassName: "text-indigo-700",
  },
  {
    range: "60-69: B+ (7)",
    label: "Good",
    className: "bg-purple-50 border-purple-200 text-purple-800",
    textClassName: "text-purple-700",
  },
  {
    range: "50-59: B (6)",
    label: "Above Average",
    className: "bg-yellow-50 border-yellow-200 text-yellow-800",
    textClassName: "text-yellow-700",
  },
  {
    range: "45-49: C (5)",
    label: "Average",
    className: "bg-orange-50 border-orange-200 text-orange-800",
    textClassName: "text-orange-700",
  },
  {
    range: "40-44: D (4)",
    label: "Pass",
    className: "bg-red-50 border-red-200 text-red-800",
    textClassName: "text-red-700",
  },
  {
    range: "Below 40: F (0)",
    label: "Fail",
    className: "bg-gray-100 border-gray-300 text-gray-800",
    textClassName: "text-gray-700",
  },
]

export default function GradingReference() {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
      <h3 className="font-bold text-gray-800 mb-3 text-lg">Grading System (Marks to Grade Points)</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {gradingCards.map((card) => (
          <div key={card.range} className={`${card.className} p-3 rounded-lg border`}>
            <div className="font-bold">{card.range}</div>
            <div className={`${card.textClassName} text-sm`}>{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
