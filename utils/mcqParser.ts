import { MCQItem } from '../types';

/**
 * Parses a raw text containing MCQ questions formatted with specific emojis and headers
 * into an array of MCQItem objects.
 *
 * Expected Format:
 * **Question X**
 * 📖 Topic: ...
 * ❓ Question: ...
 * Options:
 * A) ...
 * B) ...
 * C) ...
 * D) ...
 * ✅ Correct Answer: X) ...
 * 💡 Concept: ...
 * 🔎 Explanation: ...
 * 🎯 Exam Tip: ...
 * ⚠ Common Mistake: ...
 * 🧠 Memory Trick: ...
 * 📊 Difficulty Level: ...
 */
export function parseMCQText(text: string): MCQItem[] {
  const questions: MCQItem[] = [];
  // Split by Question markers, handling variations like **Question 1** or Question 1: or Question (प्रश्न): ❓ Question:
  const blocks = text.split(/(?:\*\*Question \d+\*\*|Question \d+:?)/g).filter(b => b.trim().length > 10);

  blocks.forEach(block => {
    let q: Partial<MCQItem> = {};

    // Extract PYQ Inspired
    const pyqMatch = block.match(/(?:🔥\s*)?PYQ Inspired:\s*(.+)/i);
    if (pyqMatch) q.pyqInspired = pyqMatch[1].trim();

    // Extract Topic (supports English/Hindi dual headings)
    const topicMatch = block.match(/(?:📖\s*)?(?:Topic|विषय).*?:\s*(.+)/i);
    if (topicMatch) q.topic = topicMatch[1].trim();

    // Extract Question text (multiline support before Options)
    // We stop at "Options:" or "A)" or "A." to be safe.
    const questionMatch = block.match(/(?:❓\s*)?(?:\*\*)?Question(?:\s*\(प्रश्न\))?:?(?:\*\*)?(?:\s*❓\s*Question:?)?\s*([\s\S]*?)(?=(?:Options(?:\s*\(विकल्प\))?:|विकल्प:|A\)|A\.|1\)|1\.))/i);
    if (questionMatch) {
      q.question = questionMatch[1].trim();
      // Remove any leading numbers like "1. " or "Q1. " just in case they slipped in
      q.question = q.question.replace(/^(?:Q?\d+[\.\)\-]\s*)/i, '');
    }

    // Extract Options
    // We look for block starting with "Options:" or just the options directly, ending at Correct Answer
    const optionsMatch = block.match(/(?:(?:Options(?:\s*\(विकल्प\))?:|विकल्प:)\s*)?([\s\S]*?)(?=✅|(?:Correct Answer(?:\s*\(सही उत्तर\))?:))/i);
    if (optionsMatch) {
      const optionsText = optionsMatch[1].trim();
      // Only keep lines that look like valid options to filter out noise
      const optionLines = optionsText.split(/\n/).map(line => line.trim()).filter(line => /^(?:[A-D]|[1-4])[\)\.]/i.test(line));

      if (optionLines.length >= 2) {
          q.options = optionLines.map(opt => opt.replace(/^(?:[A-D]|[1-4])[\)\.]\s*/i, '').trim());
      }
    }

    // Extract Correct Answer
    // Look for explicit letter A) or A. or just text.
    const answerMatch = block.match(/(?:✅\s*)?(?:\*\*)?Correct Answer(?:\s*\(सही उत्तर\))?:?(?:\*\*)?(?:\s*✅\s*Correct Answer:?)?\s*([\s\S]*?)(?=💡|🔎|🎯|⚠|🧠|📊|Concept|Explanation|Exam Tip|Common Mistake|Memory Trick|Difficulty Level|$)/i);
    if (answerMatch) {
        const rawAns = answerMatch[1].trim();

        // 1. Try to extract a clean letter (A, B, C, D) from the start of the string
        const letterMatch = rawAns.match(/^([A-D])[\)\.]/i);
        if (letterMatch) {
            const letter = letterMatch[1].toUpperCase();
            q.correctAnswer = ['A', 'B', 'C', 'D'].indexOf(letter);
        } else if (q.options) {
            // 2. Fallback: try matching the text against options
            const ansTextClean = rawAns.replace(/^(?:[A-D])[\)\.]\s*/i, '').trim();
            const index = q.options.findIndex(opt => ansTextClean.includes(opt) || opt.includes(ansTextClean));
            if (index !== -1) {
                q.correctAnswer = index;
            }
        }
    }

    // Extract Concept
    const conceptMatch = block.match(/(?:💡\s*)?(?:\*\*)?Concept(?:\s*\(अवधारणा\))?:?(?:\*\*)?(?:\s*💡\s*Concept:?)?\s*([\s\S]*?)(?=🔎|🎯|⚠|🧠|📊|Explanation|Exam Tip|Common Mistake|Memory Trick|Difficulty Level|$)/i);
    if (conceptMatch) q.concept = conceptMatch[1].trim();

    // Extract Explanation
    const explanationMatch = block.match(/(?:🔎\s*)?(?:\*\*)?Explanation(?:\s*\(व्याख्या\))?:?(?:\*\*)?(?:\s*🔎\s*Explanation:?)?\s*([\s\S]*?)(?=🎯|⚠|🧠|📊|Exam Tip|Common Mistake|Memory Trick|Difficulty Level|$)/i);
    if (explanationMatch) q.explanation = explanationMatch[1].trim();

    // Extract Exam Tip
    const examTipMatch = block.match(/(?:🎯\s*)?(?:\*\*)?Exam Tip(?:\s*\(परीक्षा टिप\))?:?(?:\*\*)?(?:\s*🎯\s*Exam Tip:?)?\s*([\s\S]*?)(?=⚠|🧠|📊|Common Mistake|Memory Trick|Difficulty Level|$)/i);
    if (examTipMatch) q.examTip = examTipMatch[1].trim();

    // Extract Common Mistake
    const commonMistakeMatch = block.match(/(?:⚠\s*)?(?:\*\*)?Common Mistake(?:\s*\(सामान्य गलती\))?:?(?:\*\*)?(?:\s*⚠\s*Common Mistake:?)?\s*([\s\S]*?)(?=🧠|📊|Memory Trick|Difficulty Level|$)/i);
    if (commonMistakeMatch) q.commonMistake = commonMistakeMatch[1].trim();

    // Extract Memory Trick
    const memoryTrickMatch = block.match(/(?:🧠\s*)?(?:\*\*)?Memory Trick(?:\s*\(याद रखने का तरीका\))?:?(?:\*\*)?(?:\s*🧠\s*Memory Trick:?)?\s*([\s\S]*?)(?=📊|Difficulty Level|$)/i);
    if (memoryTrickMatch) q.mnemonic = memoryTrickMatch[1].trim();

    // Extract Difficulty
    const difficultyMatch = block.match(/(?:📊\s*)?(?:\*\*)?Difficulty Level(?:\s*\(कठिनाई\))?:?(?:\*\*)?(?:\s*📊\s*Difficulty Level:?)?\s*(?:[🔴🟢🟡]\s*)?(.+)/i);
    if (difficultyMatch) {
      const diffStr = difficultyMatch[1].trim().toLowerCase();
      if(diffStr.includes("easy")) q.difficultyLevel = "Easy";
      else if(diffStr.includes("medium")) q.difficultyLevel = "Medium";
      else if(diffStr.includes("hard")) q.difficultyLevel = "Hard";
      else q.difficultyLevel = diffStr; // fallback
    }

    // Add if valid
    if (q.question && q.options && q.options.length > 0 && q.correctAnswer !== undefined) {
      questions.push(q as MCQItem);
    }
  });

  return questions;
}
