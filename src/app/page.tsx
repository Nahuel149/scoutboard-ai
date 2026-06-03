import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { players, teams } from "@/lib/sample-data";
import { getCompletenessScore, summarizeIssues, validateData } from "@/lib/validation";

export default function DashboardPage() {
  const issues = validateData(players, teams);
  const summary = summarizeIssues(issues);
  const completeness = getCompletenessScore(players.length + teams.length, issues.length);
  const topPlayers = [...players]
    .sort((a, b) => b.goals + b.assists - (a.goals + a.assists))
    .slice(0, 3);
  const featureCards = [
    {
      tone: "amber",
      kicker: "Research note / リサーチメモ",
      title: "A simple player note, with the source checks kept beside it.",
      titleJa: "選手メモと出典確認を同じ画面で見られるようにしました。",
      meta: "Mateo Alvarez / River Norte",
      href: "/players/p-001",
    },
    {
      tone: "blue",
      kicker: "QA finding / データ不備",
      title: "The messy sample row is there on purpose. The app catches it.",
      titleJa: "あえて不備のある行を入れ、チェック結果を見える形にしています。",
      meta: `${summary.total} open findings / 未対応 ${summary.total}件`,
      href: "/qa",
    },
    {
      tone: "green",
      kicker: "Report builder / レポート作成",
      title: "Draft first, then check the facts before it leaves the desk.",
      titleJa: "下書きを作ってから、事実と出典を人の目で確認します。",
      meta: "Markdown preview / Markdown下書き",
      href: "/reports",
    },
  ];

  return (
    <div className="pageStack">
      <section className="heroBand">
        <div>
          <p className="eyebrow">Portfolio MVP / ポートフォリオ</p>
          <h1>Football research, checked before it becomes a report.</h1>
          <p>
            ScoutBoard AI is a small portfolio app for football research work:
            collect the sample data, spot the weak fields, then write a report
            that still has a human review step.
          </p>
          <p className="jp">
            サッカーの選手データを整理し、不備を確認してからレポート下書きにするための
            自作ポートフォリオです。リサーチ、データ確認、納品前チェックの流れを見せています。
          </p>
        </div>
        <Link className="primaryAction" href="/qa">
          Check the data
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>

      <section className="featureRail" aria-label="Featured ScoutBoard workflows">
        {featureCards.map((card, index) => (
          <Link
            className={`featureCard ${card.tone}`}
            href={card.href}
            key={card.title}
            style={{ "--enter-d": `${index * 110}ms` } as CSSProperties & Record<"--enter-d", string>}
          >
            <div className="featureImage" aria-hidden="true">
              <span className="pitchLine one" />
              <span className="pitchLine two" />
              <span className="ballDot" />
            </div>
            <div className="featureCaption">
              <p className="eyebrow">{card.kicker}</p>
              <h2>{card.title}</h2>
              <p className="jp">{card.titleJa}</p>
              <span>{card.meta}</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="metricGrid" aria-label="Project metrics">
        <article className="metric">
          <Users size={20} aria-hidden="true" />
          <span>Players / 選手</span>
          <strong>{players.length}</strong>
        </article>
        <article className="metric">
          <TrendingUp size={20} aria-hidden="true" />
          <span>Teams / チーム</span>
          <strong>{teams.length}</strong>
        </article>
        <article className="metric">
          <ShieldCheck size={20} aria-hidden="true" />
          <span>Checked score / 確認スコア</span>
          <strong>{completeness}%</strong>
        </article>
        <article className="metric alert">
          <ShieldCheck size={20} aria-hidden="true" />
          <span>Open issues / 未対応</span>
          <strong>{summary.total}</strong>
        </article>
      </section>

      <section className="split">
        <div>
          <div className="sectionHeader">
            <p className="eyebrow">Player board / 選手ボード</p>
            <h2>Who is producing chances?</h2>
            <p className="jp">得点とアシストをまとめて、まず見るべき選手を絞ります。</p>
          </div>
          <div className="tableShell">
            <table>
              <thead>
                <tr>
                  <th>Name / 選手</th>
                  <th>Club / 所属</th>
                  <th>Pos / 位置</th>
                  <th>G+A</th>
                </tr>
              </thead>
              <tbody>
                {topPlayers.map((player) => (
                  <tr key={player.id}>
                    <td>
                      <Link href={`/players/${player.id}`}>{player.name}</Link>
                    </td>
                    <td>{player.club}</td>
                    <td>{player.position}</td>
                    <td>{player.goals + player.assists}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="qaPanel">
          <p className="eyebrow">QA summary / 確認結果</p>
          <h2>The data check finds the row a human would worry about.</h2>
          <div className="severityGrid">
            <span>Critical / 重要 <strong>{summary.critical}</strong></span>
            <span>Warning / 注意 <strong>{summary.warning}</strong></span>
            <span>Info / 確認 <strong>{summary.info}</strong></span>
          </div>
          <p>
            One sample player has bad values on purpose. That makes the QA
            behavior visible: missing sources, strange numbers, and stats that
            do not line up.
          </p>
          <p className="jp">
            不備のある選手データをあえて入れることで、出典不足、数値ミス、
            整合性の問題をどう見つけるかを見せています。
          </p>
        </div>
      </section>

      <section className="tagMarquee" aria-label="Portfolio proof tags">
        <span>Data QA / データ確認</span>
        <span>Research notes / リサーチメモ</span>
        <span>Source policy / 出典ルール</span>
        <span>Report drafts / 下書き</span>
        <span>Vitest checks / 自動テスト</span>
        <span>Portfolio proof / 実作例</span>
      </section>
    </div>
  );
}
