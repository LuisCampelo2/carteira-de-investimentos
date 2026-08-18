import { useState } from 'react'
import { Brain, Check, RotateCcw, X } from 'lucide-react'
import type { Quiz } from '../../data/types'

export function QuizView({ quiz, onComplete }: { quiz: Quiz; onComplete?: () => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [finished, setFinished] = useState(false)

  const allAnswered = Object.keys(answers).length === quiz.questions.length

  const score = quiz.questions.reduce((acc, q, i) => (answers[i] === q.correctIndex ? acc + 1 : acc), 0)

  const selectAnswer = (qIndex: number, optIndex: number) => {
    if (finished) return
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }))
  }

  const finish = () => {
    setFinished(true)
    onComplete?.()
  }

  const reset = () => {
    setAnswers({})
    setFinished(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
        <Brain size={16} className="text-violet-400" />
        Quiz da aula
      </div>

      {quiz.questions.map((q, qi) => {
        const selected = answers[qi]
        return (
          <div key={qi} className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
            <p className="mb-3 text-sm font-medium text-slate-200">{qi + 1}. {q.question}</p>
            <div className="space-y-1.5">
              {q.options.map((opt, oi) => {
                const isSelected = selected === oi
                const isCorrect = oi === q.correctIndex
                const showState = finished
                let stateClasses = 'border-slate-700 hover:border-slate-600'
                if (showState && isCorrect) stateClasses = 'border-emerald-500 bg-emerald-500/10'
                else if (showState && isSelected && !isCorrect) stateClasses = 'border-rose-500 bg-rose-500/10'
                else if (isSelected) stateClasses = 'border-sky-500 bg-sky-500/10'

                return (
                  <button
                    key={oi}
                    onClick={() => selectAnswer(qi, oi)}
                    disabled={finished}
                    className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm text-slate-300 transition-colors disabled:cursor-default ${stateClasses}`}
                  >
                    <span>{opt}</span>
                    {showState && isCorrect && <Check size={16} className="shrink-0 text-emerald-400" />}
                    {showState && isSelected && !isCorrect && <X size={16} className="shrink-0 text-rose-400" />}
                  </button>
                )
              })}
            </div>
            {finished && (
              <p className="mt-2.5 rounded-lg bg-slate-800/60 px-3 py-2 text-xs text-slate-400">{q.explanation}</p>
            )}
          </div>
        )
      })}

      {!finished ? (
        <button
          onClick={finish}
          disabled={!allAnswered}
          className="w-full rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
        >
          {allAnswered ? 'Corrigir respostas' : `Responda todas as perguntas (${Object.keys(answers).length}/${quiz.questions.length})`}
        </button>
      ) : (
        <div className="flex items-center justify-between rounded-lg border border-slate-700/60 bg-slate-900/40 px-4 py-3">
          <span className="text-sm text-slate-300">
            Você acertou <span className="font-semibold text-slate-100">{score}/{quiz.questions.length}</span>
          </span>
          <button onClick={reset} className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200">
            <RotateCcw size={14} /> Refazer
          </button>
        </div>
      )}
    </div>
  )
}
