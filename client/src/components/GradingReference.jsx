import { gradeOptions } from "../utils/grades"

export default function GradingReference() {
  return (
    <div className="mb-8 rounded-2xl glass-card p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <i className="fas fa-bookmark text-blue-400"></i>
            Grade Scale
          </h3>
          <p className="text-sm text-slate-400 mt-1">Marks and direct grade entries use the same grade points.</p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full bg-emerald-500/20 px-4 py-1.5 text-sm font-bold text-emerald-400 ring-1 ring-emerald-500/30 mt-2 sm:mt-0 shadow-sm">
          <i className="fas fa-star mr-2 text-xs"></i>
          10 point scale
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {gradeOptions.map((grade) => (
          <div key={grade.letter} className="rounded-xl border border-white/5 bg-slate-900/40 p-4 transition-all hover:bg-slate-800/60 hover:scale-105 hover:-translate-y-1 hover:shadow-lg hover:border-white/20 group">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-2xl font-bold text-white font-display group-hover:text-blue-400 transition-colors">{grade.letter}</span>
              <span className={`${grade.swatchClassName} h-3 w-3 rounded-full shadow-sm ring-1 ring-white/20`} />
            </div>
            <div className="font-bold text-slate-300 text-sm">{grade.marks}</div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">{grade.points} pts</div>
          </div>
        ))}
      </div>
    </div>
  )
}
