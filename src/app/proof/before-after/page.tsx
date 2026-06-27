import Link from "next/link";
import { ArrowLeft, ClipboardCheck, FileText } from "lucide-react";
import { correctionSample } from "@/lib/correction-sample";

const categoryLabels: Record<string, string> = {
  "unsupported-claim": "Unsupported claim",
  "ai-like-wording": "AI-like wording",
  "duplicate-sentence": "Duplicate sentence",
  "inconsistent-number": "Inconsistent number",
  "missing-source-note": "Missing source note",
  "formatting-inconsistency": "Formatting inconsistency",
  "instruction-compliance": "Instruction compliance",
};

export default function BeforeAfterProofPage() {
  return (
    <div className="pageStack">
      <Link className="backLink" href="/reports">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to reports
      </Link>

      <section className="detailHero proofHero">
        <div>
          <p className="eyebrow">Proofreading proof / 校正サンプル / Corrección</p>
          <h1>Before and after, with the checks left visible.</h1>
          <p>{correctionSample.scope}</p>
          <p className="jp">{correctionSample.localizedNotes.ja}</p>
          <p className="es">{correctionSample.localizedNotes.es}</p>
        </div>
        <ClipboardCheck size={58} aria-hidden="true" />
      </section>

      <section className="proofFitGrid" aria-label="Relevant job types">
        {correctionSample.jobFit.map((item) => (
          <article className="proofFitCard" key={item}>
            <FileText size={19} aria-hidden="true" />
            <strong>{item}</strong>
          </article>
        ))}
      </section>

      <section className="beforeAfterGrid">
        <article className="draftPanel flawed">
          <p className="eyebrow">Before / 修正前 / Antes</p>
          <h2>Flawed draft</h2>
          <pre>{correctionSample.flawedDraft}</pre>
        </article>
        <article className="draftPanel corrected">
          <p className="eyebrow">After / 修正後 / Después</p>
          <h2>Corrected final</h2>
          <pre>{correctionSample.correctedFinal}</pre>
        </article>
      </section>

      <section className="tableShell">
        <table>
          <thead>
            <tr>
              <th>QA category</th>
              <th>Issue</th>
              <th>Original</th>
              <th>Correction</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {correctionSample.corrections.map((item) => (
              <tr key={item.id}>
                <td>
                  <span className="pill warning">{categoryLabels[item.category]}</span>
                </td>
                <td>{item.issue}</td>
                <td>{item.originalText}</td>
                <td>{item.correctedText}</td>
                <td>{item.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="qaStory proofStory">
        <div>
          <p className="eyebrow">Delivery note / 納品前チェック</p>
          <h2>This is a review artifact, not a fake client sample.</h2>
        </div>
        <div>
          <p>{correctionSample.localizedNotes.en}</p>
          <p className="jp">{correctionSample.localizedNotes.ja}</p>
          <p className="es">{correctionSample.localizedNotes.es}</p>
          <Link className="primaryAction" href="/reports">
            Use it in report room
          </Link>
        </div>
      </section>
    </div>
  );
}
