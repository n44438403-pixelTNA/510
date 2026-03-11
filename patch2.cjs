const fs = require('fs');
const content = fs.readFileSync('components/MarksheetCard.tsx', 'utf-8');

const search = `<div className="mt-2 text-slate-800 font-bold mb-3" dangerouslySetInnerHTML={{__html: renderMathInHtml(q.question)}} />

                                                      {q.options && (
                                                          <div className="space-y-1.5 mb-4 pl-1">
                                                              {q.options.map((opt, optIdx) => {`;

const replace = `<div className="mt-4">
                                                          <p className="text-[10px] font-black text-blue-600 mb-2 uppercase tracking-widest flex items-center gap-1">Question (प्रश्न): ❓ Question:</p>
                                                          <div className="text-sm text-slate-800 font-bold mb-3" dangerouslySetInnerHTML={{__html: renderMathInHtml(q.question)}} />
                                                      </div>

                                                      {q.options && (
                                                          <div className="mb-4">
                                                              <p className="text-[10px] font-black text-blue-600 mb-2 uppercase tracking-widest flex items-center gap-1">Options (विकल्प): Options: A), B), C), D)</p>
                                                              <div className="space-y-1.5 pl-1">
                                                              {q.options.map((opt, optIdx) => {`;

const search2 = `                                                              })}
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

const replace2 = `                                                              })}
                                                              </div>
                                                          </div>
                                                      )}

                                                      <div className="mb-4">
                                                           <p className="text-[10px] font-black text-blue-600 mb-2 uppercase tracking-widest flex items-center gap-1">Correct Answer (सही उत्तर): ✅ Correct Answer:</p>
                                                           <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs font-bold text-green-800 shadow-sm flex items-start gap-3">
                                                               <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">{String.fromCharCode(65 + q.correctAnswer)}</span>
                                                               <div dangerouslySetInnerHTML={{ __html: renderMathInHtml(q.options ? q.options[q.correctAnswer] : '') }} />
                                                           </div>
                                                      </div>

                                                      {q.concept && (
                                                          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl relative overflow-hidden">
                                                              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                                                              <p className="text-[10px] font-black text-emerald-700 mb-2 uppercase tracking-widest flex items-center gap-1">Concept (अवधारणा): 💡 Concept:</p>
                                                              <div className="text-xs text-emerald-900 leading-relaxed font-medium" dangerouslySetInnerHTML={{__html: renderMathInHtml(q.concept)}} />
                                                          </div>
                                                      )}

                                                      {q.explanation && (
                                                          <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-xl relative overflow-hidden">
                                                              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                                              <p className="text-[10px] font-black text-blue-600 mb-2 uppercase tracking-widest flex items-center gap-1">Explanation (व्याख्या): 🔎 Explanation:</p>
                                                              <div className="text-xs text-slate-700 leading-relaxed font-medium" dangerouslySetInnerHTML={{__html: renderMathInHtml(q.explanation)}} />
                                                          </div>
                                                      )}

                                                      {q.examTip && (
                                                          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl relative overflow-hidden">
                                                              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                                                              <p className="text-[10px] font-black text-amber-700 mb-2 uppercase tracking-widest flex items-center gap-1">Exam Tip (परीक्षा टिप): 🎯 Exam Tip:</p>
                                                              <div className="text-xs text-amber-900 leading-relaxed font-medium" dangerouslySetInnerHTML={{__html: renderMathInHtml(q.examTip)}} />
                                                          </div>
                                                      )}

                                                      {q.commonMistake && (
                                                          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl relative overflow-hidden">
                                                              <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                                                              <p className="text-[10px] font-black text-red-700 mb-2 uppercase tracking-widest flex items-center gap-1">Common Mistake (सामान्य गलती): ⚠ Common Mistake:</p>
                                                              <div className="text-xs text-red-900 leading-relaxed font-medium" dangerouslySetInnerHTML={{__html: renderMathInHtml(q.commonMistake)}} />
                                                          </div>
                                                      )}

                                                      {q.mnemonic && (
                                                          <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-xl relative overflow-hidden">
                                                              <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                                                              <p className="text-[10px] font-black text-purple-700 mb-2 uppercase tracking-widest flex items-center gap-1">Memory Trick (याद रखने का तरीका): 🧠 Memory Trick:</p>
                                                              <div className="text-xs text-purple-900 leading-relaxed font-medium" dangerouslySetInnerHTML={{__html: renderMathInHtml(q.mnemonic)}} />
                                                          </div>
                                                      )}

                                                      {(q.topic || q.difficultyLevel) && (
                                                          <div className="mb-4 flex flex-wrap gap-2">
                                                              {q.difficultyLevel && (
                                                                  <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                                                                       <p className="text-[10px] font-black text-slate-500 mb-1 uppercase tracking-widest flex items-center gap-1">Difficulty Level (कठिनाई): 📊 Difficulty Level:</p>
                                                                       <span className="text-xs font-bold text-slate-700">{q.difficultyLevel}</span>
                                                                  </div>
                                                              )}
                                                              {q.topic && (
                                                                  <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl flex-1">
                                                                       <p className="text-[10px] font-black text-slate-500 mb-1 uppercase tracking-widest flex items-center gap-1">Topic (विषय): 📖 Topic:</p>
                                                                       <span className="text-xs font-bold text-slate-700">{q.topic}</span>
                                                                  </div>
                                                              )}
                                                          </div>
                                                      )}`;

let newContent = content.replace(search, replace).replace(search2, replace2);

if (newContent !== content) {
    fs.writeFileSync('components/MarksheetCard.tsx', newContent, 'utf-8');
    console.log("Replaced successfully!");
} else {
    console.log("Search string not found!");
}
