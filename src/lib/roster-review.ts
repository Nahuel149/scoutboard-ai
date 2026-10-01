import evidence from "../../data/reviewed/club-evidence.json";
export type MembershipStatus = "confirmed" | "unverified" | "excluded";
export type CurrentnessMetadata = { birth: string | null; death: string | null; gender?: string | null; sports?: string[]; latestMemberships?: string[] };
export type RosterReview = { status: MembershipStatus; reason: "club-confirmed" | "deceased" | "historical-age" | "different-category" | "different-sport" | "ended-membership" | "contradicted" | "needs-review" | "stale-evidence"; checkedAt: string | null; sourceUrl: string | null };
export function reviewMembership(playerId: string, clubId: string, birth: string | null, metadata?: CurrentnessMetadata, checkedAt = "2026-10-01", asOf = checkedAt): RosterReview {
  const result = (status: MembershipStatus, reason: RosterReview["reason"], sourceUrl: string | null = null): RosterReview => ({ status, reason, checkedAt: status === "unverified" && !metadata ? null : checkedAt, sourceUrl });
  if (metadata?.death) return result("excluded", "deceased", `https://www.wikidata.org/wiki/${playerId}`);
  const birthYear = Number((metadata?.birth ?? birth)?.match(/^\+?(\d{4})/)?.[1]);
  if (birthYear && Number(checkedAt.slice(0, 4)) - birthYear > 50) return result("excluded", "historical-age", `https://www.wikidata.org/wiki/${playerId}`);
  if (metadata?.gender === "Q6581072") return result("excluded", "different-category", `https://www.wikidata.org/wiki/${playerId}`);
  if (metadata?.sports?.length && !metadata.sports.includes("Q2736")) return result("excluded", "different-sport", `https://www.wikidata.org/wiki/${playerId}`);
  const match = evidence.memberships.find(item => item.playerId === playerId && item.clubId === clubId);
  if (match && match.status === "confirmed" && new Date(asOf).getTime() - new Date(evidence.checkedAt).getTime() > 30 * 86400000) return { status: "unverified", reason: "stale-evidence", checkedAt: evidence.checkedAt, sourceUrl: match.url };
  if (match) return { status: match.status === "confirmed" ? "confirmed" : "excluded", reason: match.status === "confirmed" ? "club-confirmed" : "contradicted", checkedAt: evidence.checkedAt, sourceUrl: match.url };
  if (metadata?.latestMemberships && !metadata.latestMemberships.includes(clubId)) return result("excluded", "ended-membership", `https://www.wikidata.org/wiki/${playerId}`);
  return result("unverified", "needs-review");
}
export function clubEvidence(clubId: string) { return evidence.clubPages.find(item => item.clubId === clubId) ?? null; }
