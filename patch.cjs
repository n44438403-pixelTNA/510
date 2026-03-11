const fs = require('fs');
const content = fs.readFileSync('components/MarksheetCard.tsx', 'utf-8');

const search = `<div className="mt-2 text-slate-800 font-bold mb-2" dangerouslySetInnerHTML={{__html: renderMathInHtml(q.question)}} />
                                                      <div className="space-y-1 mb-2">
                                                          {q.options?.map((opt, optIdx) => {
                                                              const isAns = optIdx === q.correctAnswer;
                                                              const isSel = optIdx === userSelected;
                                                              let cls = "text-slate-500";
                                                              if (isAns) cls = "text-green-700 font-bold";
                                                              if (isSel && !isAns) cls = "text-red-700 font-bold line-through decoration-red-500";

                                                              return (
                                                                  <div key={optIdx} className={\`flex gap-2 \${cls}\`}>
                                                                      <span className="w-4 shrink-0">{String.fromCharCode(65+optIdx)}.</span>
                                                                      <span dangerouslySetInnerHTML={{__html: renderMathInHtml(opt)}} />
                                                                      {isAns && <CheckCircle size={12} className="ml-1 text-green-600 inline" />}
                                                                      {isSel && !isAns && <XCircle size={12} className="ml-1 text-red-600 inline" />}
                                                                  </div>
                                                              );
                                                          })}
                                                      </div>
                                                      <div className="p-2 bg-blue-50 rounded text-blue-800 italic text-[10px]">
                                                          <span className="font-bold not-italic">Explanation: </span>
                                                          <span dangerouslySetInnerHTML={{__html: renderMathInHtml(q.explanation || 'Not available')}} />
                                                      </div>`;

const replace = `<div className="mt-2 text-slate-800 font-bold mb-3" dangerouslySetInnerHTML={{__html: renderMathInHtml(q.question)}} />

                                                      {q.options && (
                                                          <div className="space-y-1.5 mb-4 pl-1">
                                                              {q.options.map((opt, optIdx) => {
                                                                  const isAns = optIdx === q.correctAnswer;
                                                                  const isSel = optIdx === userSelected;
                                                                  let textCls = "text-slate-600";
                                                                  let letterCls = "text-slate-500";
                                                                  if (isAns) {
                                                                      textCls = "text-green-700 font-bold";
                                                                      letterCls = "text-green-700 font-bold";
                                                                  } else if (isSel && !isAns) {
                                                                      textCls = "text-red-700 font-bold line-through decoration-red-500";
                                                                      letterCls = "text-red-700 font-bold line-through decoration-red-500";
                                                                  }

                                                                  return (
                                                                      <div key={optIdx} className={\`flex gap-2 text-xs items-start \${textCls}\`}>
                                                                          <span className={\`w-4 shrink-0 pt-0.5 \${letterCls}\`}>{String.fromCharCode(65+optIdx)}.</span>
                                                                          <span className="flex-1" dangerouslySetInnerHTML={{__html: renderMathInHtml(opt)}} />
                                                                          {isAns && <CheckCircle size={14} className="ml-1 text-green-600 shrink-0 mt-0.5" />}
                                                                          {isSel && !isAns && <XCircle size={14} className="ml-1 text-red-600 shrink-0 mt-0.5" />}
                                                                      </div>
                                                                  );
                                                              })}
                                                          </div>
                                                      )}

                                                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs text-slate-700 shadow-sm">
                                                          {q.concept && (
                                                              <div>
                                                                  <span className="font-bold text-blue-800">💡 Concept: </span>
                                                                  <span dangerouslySetInnerHTML={{__html: renderMathInHtml(q.concept)}} />
                                                              </div>
                                                          )}
                                                          {q.explanation && (
                                                              <div>
                                                                  <span className="font-bold text-indigo-800">🔎 Explanation: </span>
                                                                  <span dangerouslySetInnerHTML={{__html: renderMathInHtml(q.explanation)}} />
                                                              </div>
                                                          )}
                                                          {q.examTip && (
                                                              <div>
                                                                  <span className="font-bold text-amber-700">🎯 Exam Tip: </span>
                                                                  <span dangerouslySetInnerHTML={{__html: renderMathInHtml(q.examTip)}} />
                                                              </div>
                                                          )}
                                                          {q.commonMistake && (
                                                              <div>
                                                                  <span className="font-bold text-red-700">⚠ Common Mistake: </span>
                                                                  <span dangerouslySetInnerHTML={{__html: renderMathInHtml(q.commonMistake)}} />
                                                              </div>
                                                          )}
                                                          {q.mnemonic && (
                                                              <div>
                                                                  <span className="font-bold text-purple-700">🧠 Memory Trick: </span>
                                                                  <span dangerouslySetInnerHTML={{__html: renderMathInHtml(q.mnemonic)}} />
                                                              </div>
                                                          )}
                                                          {q.difficultyLevel && (
                                                              <div>
                                                                  <span className="font-bold text-slate-600">📊 Difficulty: </span>
                                                                  <span>{q.difficultyLevel}</span>
                                                              </div>
                                                          )}
                                                          {!q.concept && !q.explanation && (
                                                              <div className="text-slate-500 italic">No detailed explanation available for this question.</div>
                                                          )}
                                                      </div>`;

if (content.includes(search)) {
    fs.writeFileSync('components/MarksheetCard.tsx', content.replace(search, replace), 'utf-8');
    console.log("Replaced successfully!");
} else {
    console.log("Search string not found!");
}
