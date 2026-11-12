import { useState } from "react";
import DistanceInput from "./DistanceInput";
import "./DistanceConverter.css";

const FACTOR = 1.60934;
function convert(value, factor) {
  if (value.trim() === "") return "";
  const n = Number(value);
  return Number.isFinite(n) ? String(Math.round(n * factor * 1000) / 1000) : "";
}

export default function DistanceConverter() {
  const [distance, setDistance] = useState("100");
  const [scale, setScale] = useState("mi");
  const [running, setRunning] = useState(true);
  const kilometers = scale === "km" ? distance : convert(distance, FACTOR);
  const miles = scale === "mi" ? distance : convert(distance, 1 / FACTOR);
  const valid = kilometers !== "" && miles !== "";

  return (
    <main className="converter">
      <header className="race-header"><span className="race-dot" /> RACE CONTROL <span className="race-tag">DISTANCE TELEMETRY</span></header>
      <h2>DISTANCE <em>CONVERTER</em></h2>
      <div className={`race-stage ${running ? "is-running" : "is-paused"}`} aria-label="CSS로 만든 레이싱카 주행 애니메이션">
        <div className="race-glow" />
        <div className="race-road"><div className="race-line" /></div>
        <div className="race-car">
          <div className="car-shadow" />
          <div className="rear-wing" /><div className="front-wing" />
          <div className="wheel wheel-rear" /><div className="wheel wheel-front" />
          <div className="car-body" /><div className="car-cockpit" /><div className="car-helmet" />
          <div className="car-nose" /><div className="car-stripe" />
        </div>
        <div className="race-caption">TRACK MODE <span>{running ? "● ACTIVE" : "Ⅱ PAUSED"}</span></div>
      </div>
      <div className="race-controls"><span>PURE CSS / NO 3D LIBRARY</span><button type="button" onClick={() => setRunning(v => !v)}>{running ? "PAUSE MOTION" : "RESUME MOTION"}</button></div>
      <div className="input-container">
        <DistanceInput scale="km" distance={kilometers} onDistanceChange={v => { setDistance(v); setScale("km"); }} />
        <DistanceInput scale="mi" distance={miles} onDistanceChange={v => { setDistance(v); setScale("mi"); }} />
      </div>
      <div className="result"><small>CONVERSION COMPLETE</small>{valid ? `${kilometers}km는 ${miles}마일입니다.` : "거리를 입력하세요."}</div>
      <footer className="race-footer">PRECISION / 0.001 <span>RACING DATA SYSTEM</span></footer>
    </main>
  );
}
