import {
  getGradeDisplayClasses,
  getGradeInfoFromGrade,
  getSubjectGradeData,
  getTgpaBadgeClasses,
  gradeOptions,
} from "../utils/grades"

function calculateSemesterTgpa(subjects) {
  let semPoints = 0
  let semCredits = 0
  let hasValidData = false

  subjects.forEach((subject) => {
    const gradeData = getSubjectGradeData(subject)

    if (gradeData.hasValidData) {
      semPoints += gradeData.gradePoint * gradeData.credit
      semCredits += gradeData.credit
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

  // A helper function to tweak default badge classes to fit dark mode better
  // (Assuming utils/grades.js provides some default classes, we might override them with our gradient bg)
  const tgpaBadge = hasValidData
    ? "gradient-bg text-white px-4 py-1.5 rounded-full font-bold shadow-lg"
    : "glass-card text-slate-400 px-4 py-1.5 rounded-full font-bold border border-slate-700"

  return (
    <div className="semester fade-in glass-card rounded-2xl p-6 md:p-8 hover:-translate-y-1">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
        <h2 className="flex items-center text-2xl font-bold text-white font-display tracking-wide">
          <span className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-bg shadow-lg">
            <i className="fas fa-graduation-cap text-white text-xl" />
          </span>
          Semester {semesterIndex + 1}
        </h2>
        <span className={tgpaBadge}>
          {hasValidData ? `TGPA: ${tgpa.toFixed(2)}` : "TGPA: --"}
        </span>
      </div>

      <div className="mb-8 flex flex-col gap-4 rounded-xl glass-card p-4 md:flex-row md:items-center md:justify-between border border-white/5">
        <div>
          <label className="text-xs font-bold tracking-widest uppercase text-blue-400">Subjects Setup</label>
          <p className="text-sm text-slate-400 mt-1">Configure 1 to 10 subjects</p>
        </div>
        <div className="flex items-center">
          <input
            type="number"
            min="1"
            max="10"
            value={semester.subjectCount}
            onChange={(event) => onSubjectCountChange(semester.id, event.target.value)}
            className="glass-input w-20 rounded-l-lg px-4 py-2.5 text-center text-lg mr-1 font-semibold"
          />
          <button
            type="button"
            onClick={() => onGenerateSubjects(semester.id)}
            className="gradient-bg-3 rounded-r-lg px-6 py-2.5 font-bold text-white transition-all hover:scale-105 active:scale-95"
          >
            <i className="fas fa-magic mr-2" />
            Apply
          </button>
        </div>
      </div>

      <div className="subjectsContainer space-y-4">
        {semester.subjects.map((subject, subjectIndex) => {
          const gradeData = getSubjectGradeData(subject)
          const gradeLetter = gradeData.grade || "--"
          const gradeInfo = getGradeInfoFromGrade(gradeData.grade)

          return (
            <div
              key={subject.id}
              className="subject-item fade-in rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm transition-colors hover:border-blue-500/30 hover:bg-white/10"
            >
              <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-sm font-bold text-blue-400 ring-1 ring-blue-500/30">
                    {subjectIndex + 1}
                  </span>
                  <input
                    type="text"
                    placeholder="Enter subject name"
                    value={subject.name}
                    onChange={(event) => onSubjectChange(semester.id, subject.id, "name", event.target.value)}
                    className="glass-input w-full rounded-lg px-4 py-2.5 text-lg font-medium xl:max-w-md"
                    aria-label={`Semester ${semesterIndex + 1} subject ${subjectIndex + 1} name`}
                  />
                </div>

                <div className="inline-flex w-fit rounded-lg bg-slate-900/50 p-1.5 ring-1 ring-white/10 shrink-0 mt-4 xl:mt-0">
                  <button
                    type="button"
                    onClick={() => onSubjectChange(semester.id, subject.id, "entryMode", "marks")}
                    className={`rounded-md px-5 py-2 text-sm font-bold transition-all ${
                      subject.entryMode !== "grade"
                        ? "bg-slate-700 text-white shadow-md ring-1 ring-white/20"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Marks
                  </button>
                  <button
                    type="button"
                    onClick={() => onSubjectChange(semester.id, subject.id, "entryMode", "grade")}
                    className={`rounded-md px-5 py-2 text-sm font-bold transition-all ${
                      subject.entryMode === "grade"
                        ? "bg-slate-700 text-white shadow-md ring-1 ring-white/20"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Grade
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(8rem,0.7fr)_minmax(12rem,1fr)_minmax(8rem,0.7fr)]">
                <div>
                  <label className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2 block">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="E.g. 4"
                    value={subject.credits}
                    onChange={(event) => onSubjectChange(semester.id, subject.id, "credits", event.target.value)}
                    className="glass-input w-full rounded-lg px-4 py-3 text-lg font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2 block">
                    {subject.entryMode === "grade" ? "Letter Grade" : "Marks (0-100)"}
                  </label>
                  {subject.entryMode === "grade" ? (
                    <select
                      value={subject.grade}
                      onChange={(event) => onSubjectChange(semester.id, subject.id, "grade", event.target.value)}
                      className="glass-input w-full rounded-lg px-4 py-3 text-lg font-medium appearance-none bg-slate-800"
                    >
                      <option value="">Select...</option>
                      {gradeOptions.map((grade) => (
                        <option key={grade.letter} value={grade.letter}>
                          {grade.letter} ({grade.points} pts)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="E.g. 85"
                      value={subject.marks}
                      onChange={(event) => onSubjectChange(semester.id, subject.id, "marks", event.target.value)}
                      className="glass-input w-full rounded-lg px-4 py-3 text-lg font-medium"
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2 block">
                    {subject.entryMode === "grade" ? "Grade Points" : "Grade"}
                  </label>
                  <div className="flex items-center h-[52px]">
                    {subject.entryMode === "grade" ? (
                      <div className="flex h-full w-full items-center justify-center rounded-lg bg-slate-800/50 border border-white/5 font-bold text-xl text-white">
                        {gradeInfo ? gradeInfo.points : "--"}
                      </div>
                    ) : (
                      <div className={`flex h-full w-full items-center justify-center rounded-lg font-bold text-xl ${
                        gradeLetter !== "--" ? `grade-${gradeLetter.replace('+', 'p')}` : 'bg-slate-800/50 text-slate-500 border-white/5'
                      }`}>
                        {gradeLetter}
                      </div>
                    )}
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
