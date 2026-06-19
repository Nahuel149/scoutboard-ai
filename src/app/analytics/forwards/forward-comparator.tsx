"use client";

import { useMemo, useState } from "react";
import type { ForwardShotQualityPlayer } from "@/lib/statsbomb-forward-shot-quality";
import { ageAtDate, rankForwards } from "@/lib/scouting-model";

function n(value: number, digits = 2) {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

function ShotMap({ player }: { player: ForwardShotQualityPlayer }) {
  const shots = player.shots_detail.filter((shot) => shot.x !== null && shot.y !== null);
  return (
    <div className="shotMap" aria-label={`Shot map for ${player.player}`}>
      <span className="shotGoal" aria-hidden="true" />
      <span className="shotBox" aria-hidden="true" />
      {shots.map((shot, index) => (
        <span
          className={`shotDot ${shot.outcome === "Goal" ? "goal" : ""}`}
          key={`${shot.match_id}-${index}`}
          style={{
            left: `${Math.max(2, Math.min(98, ((shot.y ?? 40) / 80) * 100))}%`,
            top: `${Math.max(3, Math.min(94, ((120 - (shot.x ?? 90)) / 40) * 100))}%`,
            width: `${Math.max(9, 8 + shot.xg * 28)}px`,
          }}
          title={`${shot.outcome}, xG ${n(shot.xg, 3)}`}
        />
      ))}
    </div>
  );
}

function PlayerPanel({ player }: { player: ForwardShotQualityPlayer }) {
  const model = rankForwards([player])[0].model;
  return (
    <article className="comparisonPanel">
      <div className="comparisonHeading">
        <div>
          <p className="eyebrow">{player.team} · {player.positions}</p>
          <h2>{player.player}</h2>
        </div>
        <strong className="modelScore">{model.score}</strong>
      </div>
      <ShotMap player={player} />
      <div className="comparisonMetrics">
        <span><small>Age / Edad / 年齢</small><strong>{model.age ?? "N/A"}</strong></span>
        <span><small>Minutes / Minutos</small><strong>{player.minutes}</strong></span>
        <span><small>NP xG</small><strong>{n(player.non_penalty_xg)}</strong></span>
        <span><small>NP xG / 90</small><strong>{n(model.npxgPer90)}</strong></span>
        <span><small>Shots / Tiros</small><strong>{player.shots}</strong></span>
        <span><small>xG / shot</small><strong>{n(player.avg_non_penalty_xg_per_shot, 3)}</strong></span>
      </div>
      <p className="dataFootnote">
        Age match: {player.age_match_status.replaceAll("_", " ")}. Sample reliability: {n(model.sampleReliability * 100, 0)}%.
      </p>
    </article>
  );
}

export default function ForwardComparator({ players }: { players: ForwardShotQualityPlayer[] }) {
  const [team, setTeam] = useState("all");
  const [position, setPosition] = useState("all");
  const [ageBand, setAgeBand] = useState("all");
  const [leftName, setLeftName] = useState(players[0]?.player ?? "");
  const [rightName, setRightName] = useState(players[1]?.player ?? "");

  const teams = useMemo(() => [...new Set(players.map((player) => player.team))].sort(), [players]);
  const filtered = useMemo(() => players.filter((player) => {
    const age = ageAtDate(player.birth_date);
    const teamMatch = team === "all" || player.team === team;
    const positionMatch = position === "all" ||
      (position === "center" ? player.positions.includes("Forward") : player.positions.includes("Wing"));
    const ageMatch = ageBand === "all" ||
      (ageBand === "u23" ? age !== null && age <= 23 :
        ageBand === "24-28" ? age !== null && age >= 24 && age <= 28 :
          age !== null && age >= 29);
    return teamMatch && positionMatch && ageMatch;
  }), [players, team, position, ageBand]);
  const ranked = useMemo(() => rankForwards(filtered), [filtered]);
  const left = players.find((player) => player.player === leftName) ?? players[0];
  const right = players.find((player) => player.player === rightName) ?? players[1] ?? players[0];

  return (
    <>
      <section className="controlDeck" aria-label="Forward filters">
        <label>League / Liga / リーグ<select disabled><option>Copa America 2024</option></select></label>
        <label>Team / País / 国<select value={team} onChange={(event) => setTeam(event.target.value)}><option value="all">All teams</option>{teams.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Position / Posición / 位置<select value={position} onChange={(event) => setPosition(event.target.value)}><option value="all">All attacking roles</option><option value="center">Centre forwards</option><option value="wing">Wingers</option></select></label>
        <label>Age / Edad / 年齢<select value={ageBand} onChange={(event) => setAgeBand(event.target.value)}><option value="all">All known ages</option><option value="u23">23 or younger</option><option value="24-28">24 to 28</option><option value="29+">29 or older</option></select></label>
      </section>

      <section className="comparisonPicker">
        <label>Player A<select value={leftName} onChange={(event) => setLeftName(event.target.value)}>{players.map((player) => <option key={`a-${player.player}`} value={player.player}>{player.player}</option>)}</select></label>
        <span>VS</span>
        <label>Player B<select value={rightName} onChange={(event) => setRightName(event.target.value)}>{players.map((player) => <option key={`b-${player.player}`} value={player.player}>{player.player}</option>)}</select></label>
      </section>

      <section className="comparisonGrid">
        <PlayerPanel player={left} />
        <PlayerPanel player={right} />
      </section>

      <section className="tableShell">
        <table>
          <thead><tr><th>Rank</th><th>Player</th><th>Age</th><th>Role</th><th>Min</th><th>NP xG/90</th><th>Shots/90</th><th>xG/shot</th><th>Scout score</th></tr></thead>
          <tbody>{ranked.map(({ player, model }, index) => (
            <tr key={`${player.player}-${player.team}`}>
              <td>{index + 1}</td><td><strong>{player.player}</strong><span className="tableSubline">{player.team}</span></td>
              <td>{model.age ?? "N/A"}</td><td>{player.positions}</td><td>{player.minutes}</td><td>{n(model.npxgPer90)}</td><td>{n(model.shotsPer90)}</td><td>{n(player.avg_non_penalty_xg_per_shot, 3)}</td><td><strong>{model.score}</strong></td>
            </tr>
          ))}</tbody>
        </table>
        {ranked.length === 0 && <p className="emptyState">No players match these filters.</p>}
      </section>
    </>
  );
}
