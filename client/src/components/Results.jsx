import { getPerformance } from "../utils/grades"

export default function Results({ calculation }) {
  if (!calculation) {
    return (
      <div id="result">
        <div className="text-center py-8">
          <i className="fas fa-calculator text-5xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Enter your marks and click "Calculate CGPA" to see results</p>
        </div>
      </div>
    )
  }

  const { cgpa, totalCredits, tgpaValues, totalSubjects } = calculation
  const semestersWithData = tgpaValues.filter((semester) => semester.hasData)

  return (
    <div id="result">
      <div className="fade-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Calculation Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="gradient-bg text-white p-6 rounded-xl text-center">
            <p className="text-xl font-semibold mb-2">Overall CGPA</p>
            <p className="text-5xl font-bold my-4">{cgpa.toFixed(2)}</p>
            <p className="text-lg">Out of 10.0</p>
          </div>
          <div className="gradient-bg-2 text-white p-6 rounded-xl text-center">
            <p className="text-xl font-semibold mb-2">Total Credits</p>
            <p className="text-5xl font-bold my-4">{totalCredits}</p>
            <p className="text-lg">Across {tgpaValues.length} semesters</p>
          </div>
          <div className="gradient-bg-3 text-white p-6 rounded-xl text-center">
            <p className="text-xl font-semibold mb-2">Total Subjects</p>
            <p className="text-5xl font-bold my-4">{totalSubjects}</p>
            <p className="text-lg">Subjects completed</p>
          </div>
        </div>
      </div>

      {semestersWithData.length > 0 ? (
        <div className="fade-in">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Semester-wise Breakdown</h3>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-4 border-b">Semester</th>
                  <th className="text-left p-4 border-b">TGPA</th>
                  <th className="text-left p-4 border-b">Credits</th>
                  <th className="text-left p-4 border-b">Subjects</th>
                  <th className="text-left p-4 border-b">Performance</th>
                </tr>
              </thead>
              <tbody>
                {semestersWithData.map((semester) => {
                  const performance = getPerformance(semester.tgpa)

                  return (
                    <tr key={semester.semester} className="hover:bg-gray-50">
                      <td className="p-4 border-b font-medium">Semester {semester.semester}</td>
                      <td className="p-4 border-b font-bold text-lg">{semester.tgpa.toFixed(2)}</td>
                      <td className="p-4 border-b">{semester.credits}</td>
                      <td className="p-4 border-b">{semester.subjects.length}</td>
                      <td className="p-4 border-b">
                        <span className={`px-4 py-1.5 rounded-full font-medium ${performance.className}`}>
                          {performance.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="inline-block p-4 bg-yellow-50 rounded-lg">
            <i className="fas fa-exclamation-triangle text-yellow-500 text-3xl mb-3" />
            <p className="text-yellow-700 font-medium">
              Please enter marks and credits for at least one subject to see detailed results.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
