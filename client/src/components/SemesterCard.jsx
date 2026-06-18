import {
  getGradeInfoFromGrade,
  getSubjectGradeData,
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

      <div className="mb-8 flex flex-col gap-4 rounded-xl glass-card p-4 sm:flex-row sm:items-center sm:justify-between border border-white/5">
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
            className="glass-input w-16 rounded-l-xl px-3 py-2.5 text-center text-lg font-semibold border-r-0"
          />
          <button
            type="button"
            onClick={() => onGenerateSubjects(semester.id)}
            className="gradient-bg-3 rounded-r-xl px-5 py-2.5 font-bold text-white transition-all hover:scale-105 active:scale-95 flex items-center shrink-0"
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
                    className="glass-input w-full rounded-lg px-4 py-2.5 text-lg font-medium xl:max-w-2xl"
                    aria-label={`Semester ${semesterIndex + 1} subject ${subjectIndex + 1} name`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                <div>
                  <label className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2 block">Credits</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="E.g. 4"
                    value={subject.credits}
                    onChange={(event) => {
                      const val = event.target.value
                      if (val === "" || /^\d*\.?\d*$/.test(val)) {
                        onSubjectChange(semester.id, subject.id, "credits", val)
                      }
                    }}
                    className="glass-input w-full rounded-lg px-4 py-3 text-lg font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2 block">
                    {subject.entryMode === "grade" ? "Expected Grade" : "Estimated Marks"}
                  </label>
                  {subject.entryMode === "grade" ? (
                    <div className="relative">
                      <select
                        value={subject.grade}
                        onChange={(event) => onSubjectChange(semester.id, subject.id, "grade", event.target.value)}
                        className="glass-input w-full rounded-lg pl-4 pr-10 py-3 text-lg font-medium appearance-none bg-slate-800"
                      >
                        <option value="">Select...</option>
                        {gradeOptions.map((grade) => (
                          <option key={grade.letter} value={grade.letter}>
                            {grade.letter} - {grade.label} ({grade.points} pts)
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                        <i className="fas fa-chevron-down text-sm" />
                      </div>
                    </div>
                  ) : (
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="E.g. 85"
                      value={subject.marks}
                      onChange={(event) => {
                        const val = event.target.value
                        if (val === "" || /^\d*\.?\d*$/.test(val)) {
                          onSubjectChange(semester.id, subject.id, "marks", val)
                        }
                      }}
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
