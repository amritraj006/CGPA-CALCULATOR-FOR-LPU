import {
  getGradeDisplayClasses,
  getGradeLetterFromMarks,
  getGradePointFromMarks,
  getTgpaBadgeClasses,
} from "../utils/grades"

function calculateSemesterTgpa(subjects) {
  let semPoints = 0
  let semCredits = 0
  let hasValidData = false

  subjects.forEach((subject) => {
    const credit = parseFloat(subject.credits) || 0
    const marks = parseFloat(subject.marks) || 0

    if (credit > 0 && marks > 0) {
      semPoints += getGradePointFromMarks(marks) * credit
      semCredits += credit
      hasValidData = true
    }
  })

  return {
    tgpa: semCredits === 0 ? 0 : semPoints / semCredits,
    hasValidData,
  }
}

export default function SemesterCard({
  semester,
  semesterIndex,
  onSubjectCountChange,
  onGenerateSubjects,
  onSubjectChange,
}) {
  const { tgpa, hasValidData } = calculateSemesterTgpa(semester.subjects)

  return (
    <div className="semester border border-gray-200 p-6 mb-6 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:shadow-lg transition-all fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <i className="fas fa-graduation-cap mr-3 text-blue-500" />
          Semester {semesterIndex + 1}
        </h2>
        <span className={getTgpaBadgeClasses(tgpa, hasValidData)}>
          {hasValidData ? `TGPA: ${tgpa.toFixed(2)}` : "TGPA: --"}
        </span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="mb-3 md:mb-0">
          <label className="font-medium text-gray-700 text-lg">Number of Subjects:</label>
        </div>
        <div className="flex items-center">
          <input
            type="number"
            min="1"
            max="10"
            value={semester.subjectCount}
            onChange={(event) => onSubjectCountChange(semester.id, event.target.value)}
            className="subjectCount border rounded-l-lg px-4 py-2 w-24 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
          <button
            type="button"
            onClick={() => onGenerateSubjects(semester.id)}
            className="addSubjectsBtn gradient-bg-3 text-white px-5 py-2.5 rounded-r-lg hover:opacity-90 transition-all font-medium"
          >
            <i className="fas fa-plus mr-2" />
            Add Subjects
          </button>
        </div>
      </div>

      <div className="subjectsContainer mt-4 space-y-4">
        {semester.subjects.map((subject, subjectIndex) => {
          const marks = parseFloat(subject.marks) || 0
          const gradeLetter = marks === 0 ? "--" : getGradeLetterFromMarks(marks)

          return (
            <div
              key={subject.id}
              className="subject-item flex flex-col md:flex-row md:items-center gap-4 p-4 border border-gray-200 rounded-xl bg-white hover:bg-blue-50 transition-colors fade-in"
            >
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Enter subject name"
                  value={subject.name}
                  onChange={(event) => onSubjectChange(semester.id, subject.id, "name", event.target.value)}
                  className="subjectName border rounded-lg px-4 py-2.5 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  aria-label={`Semester ${semesterIndex + 1} subject ${subjectIndex + 1} name`}
                />
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                <div className="w-full sm:w-auto">
                  <label className="text-sm text-gray-600 font-medium">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="Enter credits"
                    value={subject.credits}
                    onChange={(event) => onSubjectChange(semester.id, subject.id, "credits", event.target.value)}
                    className="credit border rounded-lg px-4 py-2.5 w-full sm:w-24 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <label className="text-sm text-gray-600 font-medium">Marks (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Enter marks"
                    value={subject.marks}
                    onChange={(event) => onSubjectChange(semester.id, subject.id, "marks", event.target.value)}
                    className="marks border rounded-lg px-4 py-2.5 w-full sm:w-32 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg marks-input"
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <label className="text-sm text-gray-600 font-medium">Grade</label>
                  <div className="flex items-center">
                    <input type="text" readOnly value={gradeLetter} className={getGradeDisplayClasses(marks)} />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
