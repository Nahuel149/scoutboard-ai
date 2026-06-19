import type { ForwardShotQualityPlayer } from "./statsbomb-forward-shot-quality";

export type ScoutingScore = {
  score: number;
  age: number | null;
  npxgPer90: number;
  shotsPer90: number;
  ageAdjustment: number;
  sampleReliability: number;
  competitionAdjustment: number;
};

export function ageAtDate(birthDate: string | null, referenceDate = "2024-06-20") {
  if (!birthDate) return null;
  const birth = new Date(`${birthDate}T00:00:00Z`);
  const reference = new Date(`${referenceDate}T00:00:00Z`);
  let age = reference.getUTCFullYear() - birth.getUTCFullYear();
  const birthdayPending =
    reference.getUTCMonth() < birth.getUTCMonth() ||
    (reference.getUTCMonth() === birth.getUTCMonth() &&
      reference.getUTCDate() < birth.getUTCDate());
  if (birthdayPending) age -= 1;
  return age;
}

export function calculateScoutingScore(player: ForwardShotQualityPlayer): ScoutingScore {
  const minutes = Math.max(player.minutes, 1);
  const npxgPer90 = (player.non_penalty_xg / minutes) * 90;
  const shotsPer90 = (player.open_play_shots / minutes) * 90;
  const age = ageAtDate(player.birth_date);
  const ageAdjustment = age === null
    ? 1
    : age <= 26
      ? Math.min(1.1, 1 + (26 - age) * 0.015)
      : Math.max(0.85, 1 - (age - 26) * 0.02);
  const sampleReliability = Math.min(1, minutes / 360);
  const competitionAdjustment = 1;
  const base =
    Math.min(npxgPer90 / 0.8, 1) * 40 +
    Math.min(shotsPer90 / 5, 1) * 25 +
    Math.min(player.avg_non_penalty_xg_per_shot / 0.25, 1) * 20 +
    player.shot_accuracy * 15;
  const score = base * ageAdjustment * competitionAdjustment * (0.65 + sampleReliability * 0.35);

  return {
    score: Math.round(Math.min(score, 100) * 10) / 10,
    age,
    npxgPer90: Math.round(npxgPer90 * 100) / 100,
    shotsPer90: Math.round(shotsPer90 * 100) / 100,
    ageAdjustment: Math.round(ageAdjustment * 1000) / 1000,
    sampleReliability: Math.round(sampleReliability * 1000) / 1000,
    competitionAdjustment,
  };
}

export function rankForwards(players: ForwardShotQualityPlayer[]) {
  return players
    .map((player) => ({ player, model: calculateScoutingScore(player) }))
    .sort((a, b) => b.model.score - a.model.score || b.player.non_penalty_xg - a.player.non_penalty_xg);
}
