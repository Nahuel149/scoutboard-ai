import { UI } from "@/app/components/ui-text";
import { T } from "@/app/components/language";
import { pageTitles } from "@/lib/copy";
import { LocalizedContent } from "@/app/components/language";
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
        <UI text="Back to reports" /></Link>

      <section className="detailHero proofHero">
        <div>
          <p className="eyebrow"><UI text="Proofreading proof / 校正サンプル / Corrección" /></p>
          <h1><T text={pageTitles["/proof/before-after"]} /></h1>
          <p><LocalizedContent en={<>{correctionSample.scope}</>} ja={<>{correctionSample.localizedNotes.ja}</>} es={<>{correctionSample.localizedNotes.es}</>} /></p>
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
          <p className="eyebrow"><UI text="Before / 修正前 / Antes" /></p>
          <h2><UI text="Flawed draft" /></h2>
          <pre>{correctionSample.flawedDraft}</pre>
        </article>
        <article className="draftPanel corrected">
          <p className="eyebrow"><UI text="After / 修正後 / Después" /></p>
          <h2><UI text="Corrected final" /></h2>
          <pre>{correctionSample.correctedFinal}</pre>
        </article>
      </section>

      <section className="tableShell">
        <table>
          <thead>
            <tr>
              <th><UI text="QA category" /></th>
              <th><UI text="Issue" /></th>
              <th><UI text="Original" /></th>
              <th><UI text="Correction" /></th>
              <th><UI text="Reason" /></th>
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
          <p className="eyebrow"><UI text="Delivery note / 納品前チェック" /></p>
          <h2><UI text="This is a review artifact, not a fake client sample." /></h2>
        </div>
        <div>
          <p><LocalizedContent en={<>{correctionSample.localizedNotes.en}</>} ja={<>{correctionSample.localizedNotes.ja}</>} es={<>{correctionSample.localizedNotes.es}</>} /></p>
          <Link className="primaryAction" href="/reports">
            <UI text="Use it in report room" /></Link>
        </div>
      </section>
    </div>
  );
}
