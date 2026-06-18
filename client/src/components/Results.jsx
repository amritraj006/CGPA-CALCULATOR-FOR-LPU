import { getPerformance } from "../utils/grades"

export default function Results({ calculation }) {
  if (!calculation) {
    return (
      <div id="result" className="h-full flex items-center justify-center">
        <div className="text-center py-16 px-6 glass-card rounded-2xl w-full max-w-md mx-auto border-dashed border-2 border-white/20">
          <div className="w-20 h-20 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/10">
            <i className="fas fa-calculator text-4xl text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-display">Ready to Calculate</h3>
          <p className="text-slate-400">Enter credits and expected grades, then click "Calculate CGPA" to estimate your result.</p>
        </div>
      </div>
    )
  }

  const { cgpa, totalCredits, tgpaValues, totalSubjects } = calculation
  const semestersWithData = tgpaValues.filter((semester) => semester.hasData)

  return (
    <div id="result">
      <div className="fade-in">
        <h2 className="text-3xl font-bold text-white mb-8 font-display flex items-center gap-3">
          <i className="fas fa-chart-pie text-blue-400" />
          Calculation Results
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="gradient-bg rounded-2xl p-6 md:p-8 text-center text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-100 mb-3 opacity-90">Overall CGPA</p>
            <p className="text-6xl font-black my-2 font-display drop-shadow-lg">{cgpa.toFixed(2)}</p>
            <p className="text-sm font-medium text-blue-100/80">Out of 10.0</p>
          </div>
          <div className="gradient-bg-2 rounded-2xl p-6 md:p-8 text-center text-white shadow-[0_0_30px_rgba(225,29,72,0.3)] relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
            <p className="text-sm font-bold uppercase tracking-widest text-rose-100 mb-3 opacity-90">Total Credits</p>
            <p className="text-6xl font-black my-2 font-display drop-shadow-lg">{totalCredits}</p>
            <p className="text-sm font-medium text-rose-100/80">Across {tgpaValues.length} semesters</p>
          </div>
          <div className="gradient-bg-3 rounded-2xl p-6 md:p-8 text-center text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] relative overflow-hidden group">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-100 mb-3 opacity-90">Total Subjects</p>
            <p className="text-6xl font-black my-2 font-display drop-shadow-lg">{totalSubjects}</p>
            <p className="text-sm font-medium text-emerald-100/80">Successfully completed</p>
          </div>
        </div>
      </div>

      {semestersWithData.length > 0 ? (
        <div className="fade-in">
          <h3 className="text-xl font-bold text-white mb-6 font-display flex items-center gap-3">
            <i className="fas fa-list-ol text-blue-400" />
            Semester-wise Breakdown
          </h3>
          <div className="overflow-x-auto rounded-2xl glass-card border border-white/10 shadow-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/60 text-slate-300 text-sm tracking-wider uppercase">
                  <th className="p-5 font-bold border-b border-white/10">Semester</th>
                  <th className="p-5 font-bold border-b border-white/10">TGPA</th>
                  <th className="p-5 font-bold border-b border-white/10">Credits</th>
                  <th className="p-5 font-bold border-b border-white/10">Subjects</th>
                  <th className="p-5 font-bold border-b border-white/10">Performance</th>
                </tr>
              </thead>
              <tbody className="text-slate-200">
                {semestersWithData.map((semester) => {
                  const performance = getPerformance(semester.tgpa)

                  return (
                    <tr key={semester.semester} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                      <td className="p-5 font-medium flex items-center gap-3">
                         <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                           {semester.semester}
                         </span>
                         Semester {semester.semester}
                      </td>
                      <td className="p-5 font-bold text-xl text-white font-display">{semester.tgpa.toFixed(2)}</td>
                      <td className="p-5 font-medium">{semester.credits}</td>
                      <td className="p-5 font-medium">{semester.subjects.length}</td>
                      <td className="p-5">
                        <span className={`px-4 py-1.5 rounded-full font-bold text-xs tracking-wider uppercase shadow-sm ${
                           performance.className.includes("emerald") ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                           performance.className.includes("blue") ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                           performance.className.includes("yellow") || performance.className.includes("orange") ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                           "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        }`}>
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
        <div className="text-center py-8">
          <div className="inline-flex flex-col items-center p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
            <i className="fas fa-exclamation-circle text-amber-400 text-4xl mb-4 shadow-sm" />
            <p className="text-amber-200 font-medium">
              Please enter credits and expected grades for at least one subject to see detailed results.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
