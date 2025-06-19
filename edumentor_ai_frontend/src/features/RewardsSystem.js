import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Reward System - fully client-side (coins, streaks, unlockables demo).
 */
export function RewardsSystem() {
  const [coins, setCoins] = useState(20);
  const [streak, setStreak] = useState(3);
  const unlockables = [
    { name: "Dark Theme", cost: 15, unlocked: false },
    { name: "Wallpaper Pack", cost: 10, unlocked: false }
  ];

  function claimReward(cost) {
    if (coins >= cost) setCoins((c) => c - cost);
  }

  return (
    <div className="card" style={{ maxWidth: 420 }}>
      <h2 className="card-title">Rewards <span style={{ fontSize: "0.91em", color: "var(--muted)" }}>Demo</span></h2>
      <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 18 }}>
        <div>
          <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: "1.13em" }}>🪙 {coins}</span>
          <div style={{ color: "var(--muted)", fontSize: "0.98em" }}>Coins</div>
        </div>
        <div>
          <span style={{ color: "var(--secondary)", fontWeight: 700, fontSize: "1.13em" }}>🔥 {streak} day</span>
          <div style={{ color: "var(--muted)", fontSize: "0.98em" }}>Streak</div>
        </div>
      </div>
      <div style={{ fontWeight: 600, marginBottom: 7 }}>Unlockables</div>
      <ul style={{ paddingLeft: 0, listStyle: "none" }}>
        {unlockables.map((item, i) => (
          <li key={i} style={{ marginBottom: 8 }}>
            <span>{item.name}</span>
            <span style={{ marginLeft: 14, color: "var(--muted)", fontSize: "0.97em" }}>
              ({item.cost} coins)
            </span>
            <button
              className="btn btn-outline"
              style={{
                marginLeft: 14,
                fontSize: "0.93em",
                padding: "3px 14px"
              }}
              onClick={() => claimReward(item.cost)}
              type="button"
              disabled={coins < item.cost}
            >
              Claim
            </button>
          </li>
        ))}
      </ul>
      <div style={{ color: "var(--muted)", marginTop: 12, fontSize: "0.96em" }}>
        Earn coins & streaks by using Focus Mode and completing your daily goals!
      </div>
    </div>
  );
}
