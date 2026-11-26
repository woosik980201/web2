import React, { useState, useEffect, useRef } from "react";
import Walker from "./Walker";
import FieldCanvas from "./FieldCanvas";
import SceneCollage from "./SceneCollage";
import PathThreads from "./PathThreads";

const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
const SPEED = 4; // 한 프레임에 움직이는 거리(px)
const START = { x: 50, y: 92 };
const LEAVE_MS = 1200;   // 흩어지는 조각이 다 사라질 때까지 기다리는 시간
const PATH_SHOWN = 7;    // 화면에 글자로 보여 줄 최근 순서 개수

// 터치디자이너의 오퍼레이터 종류처럼 이름표를 붙인다: 소리는 CHOP, 이미지는 TOP
function operatorOf(domain) {
    return domain === "music" ? "CHOP" : "TOP";
}

// 같은 분야의 기록끼리 순서대로 잇는 선 목록
function buildLinks(entries) {
    const links = [];
    const lastByDomain = {};
    entries.forEach((entry) => {
        const previous = lastByDomain[entry.domain];
        if (previous) links.push({ from: previous, to: entry });
        lastByDomain[entry.domain] = entry;
    });
    return links;
}

// 두 점을 잇는 부드러운 곡선(노드 사이의 와이어 모양)
function wirePath(x1, y1, x2, y2) {
    const middle = (x1 + x2) / 2;
    return "M " + x1 + " " + y1 + " C " + middle + " " + y1 + ", " + middle + " " + y2 + ", " + x2 + " " + y2;
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function CollageStage({ entries, selectedDomain, paused, onEnter }) {
    const stageRef = useRef(null);
    const keysRef = useRef({});        // 지금 눌려 있는 방향키
    const posRef = useRef(START);      // 매 프레임 계산에 쓰는 최신 위치
    const activeRef = useRef(null);    // 지금 인물이 올라가 있는 조각 id
    const movingRef = useRef(false);   // 걷는 중인지 (배경 그래픽이 읽는다)

    const [pos, setPos] = useState(START);
    const [isWalking, setIsWalking] = useState(false);
    const [facing, setFacing] = useState("right");
    const [activeId, setActiveId] = useState(null);

    const visitsRef = useRef({});                // 기록마다 몇 번 들렀는지
    const [scenes, setScenes] = useState([]);    // 무대에 깔린 콜라주 (흩어지는 중인 것 포함)
    const [path, setPath] = useState([]);        // 내가 들른 기록의 순서

    // 올라선 기록이 바뀔 때마다: 지금 공간은 해체하고, 새 기록의 공간을 조립한다
    useEffect(() => {
        setScenes((prev) => prev.map((s) => ({ ...s, leaving: true })));

        if (activeId !== null) {
            const entry = entries.find((e) => e.id === activeId);
            if (entry && entry.images.length > 0) {
                const visit = (visitsRef.current[activeId] || 0) + 1;
                visitsRef.current[activeId] = visit;
                // 들를 때마다 중심 장면이 그 기록의 다음 이미지로 넘어간다
                const scene = (visit - 1) % entry.images.length;
                setScenes((prev) => [...prev, { key: activeId + "-" + visit, entry, scene, visit, leaving: false }]);
            }
            setPath((prev) => (prev[prev.length - 1] === activeId ? prev : [...prev, activeId]));
        }

        const timer = setTimeout(() => {
            setScenes((prev) => prev.filter((s) => !s.leaving));
        }, LEAVE_MS);
        return () => clearTimeout(timer);
    }, [activeId, entries]);

    useEffect(() => {
        if (paused) {
            keysRef.current = {};
            setIsWalking(false);
            return;
        }

        const handleKeyDown = (e) => {
            if (ARROW_KEYS.includes(e.key)) {
                e.preventDefault(); // 방향키로 페이지가 스크롤되지 않게
                keysRef.current[e.key] = true;
                stageRef.current.scrollIntoView({ block: "nearest" });
            } else if (e.key === "Enter" && activeRef.current !== null) {
                // 헤더의 버튼에 포커스가 있을 때는 그 버튼이 Enter를 쓰게 둔다
                const onOtherButton = e.target.tagName === "BUTTON" && !stageRef.current.contains(e.target);
                if (onOtherButton) return;
                e.preventDefault();
                onEnter(activeRef.current);
            }
        };
        const handleKeyUp = (e) => {
            keysRef.current[e.key] = false;
        };

        let frameId;
        const step = () => {
            const stage = stageRef.current;
            const keys = keysRef.current;
            const dx = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0);
            const dy = (keys.ArrowDown ? 1 : 0) - (keys.ArrowUp ? 1 : 0);

            if (dx !== 0 || dy !== 0) {
                const next = {
                    x: clamp(posRef.current.x + (dx * SPEED / stage.clientWidth) * 100, 3, 97),
                    y: clamp(posRef.current.y + (dy * SPEED / stage.clientHeight) * 100, 13, 99),
                };
                posRef.current = next;
                setPos(next);
                if (dx !== 0) setFacing(dx > 0 ? "right" : "left");
            }
            setIsWalking(dx !== 0 || dy !== 0);

            movingRef.current = dx !== 0 || dy !== 0;

            // 인물의 몸통이 어느 조각 위에 있는지 찾는다
            const bodyX = (posRef.current.x / 100) * stage.clientWidth;
            const bodyY = (posRef.current.y / 100) * stage.clientHeight - 72;
            let found = null;
            let best = Infinity;
            stage.querySelectorAll("[data-entry-id]").forEach((piece) => {
                if (piece.dataset.dimmed === "true") return;
                const gapX = Math.abs(bodyX - piece.offsetLeft);
                const gapY = Math.abs(bodyY - piece.offsetTop);
                const inside = gapX < piece.offsetWidth / 2 + 10 && gapY < piece.offsetHeight / 2 + 10;
                if (inside && gapX + gapY < best) {
                    best = gapX + gapY;
                    found = piece.dataset.entryId;
                }
            });
            if (found !== activeRef.current) {
                activeRef.current = found;
                setActiveId(found);
            }

            frameId = requestAnimationFrame(step);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        frameId = requestAnimationFrame(step);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            cancelAnimationFrame(frameId);
        };
    }, [paused, onEnter]);

    const activeEntry = entries.find((entry) => entry.id === activeId);
    const links = buildLinks(entries);
    // 이미지가 있는 기록 위에 서면 무대가 그 기록의 공간으로 바뀐다
    const immersed = activeEntry !== undefined && activeEntry.images.length > 0;
    const currentScene = scenes.find((s) => !s.leaving);

    // 내가 들른 순서대로 조각 중심을 잇는 선
    const pathPoints = path
        .map((id) => entries.find((e) => e.id === id))
        .filter((e) => e !== undefined);
    const pathCoords = pathPoints.map((e) => [e.x, e.y]);
    const pathText = (path.length > PATH_SHOWN ? "… " : "") + path.slice(-PATH_SHOWN).join(" → ");

    return (
        <section className={"sa-stage" + (immersed ? " immersed" : "")} ref={stageRef} aria-label="콜라주 아카이브">
            {/* 무대 배경: 올라선 기록의 이미지들이 조각으로 조립되고, 떠나면 해체된다 (SceneCollage.jsx) */}
            <div className="sa-backdrop" aria-hidden="true">
                {scenes.map((s) => (
                    <SceneCollage key={s.key} entry={s.entry} scene={s.scene} visit={s.visit} leaving={s.leaving} />
                ))}
                <div className="sa-veil" />
                <div className="sa-grid" />
            </div>

            <FieldCanvas posRef={posRef} movingRef={movingRef} />

            {/* 같은 분야의 기록을 잇는 네트워크 선. 조각보다 아래에 깔린다 */}
            <svg className="sa-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {links.map((link) => {
                    const dimmed = selectedDomain !== "전체" && link.from.domain !== selectedDomain;
                    return (
                        <path
                            key={link.from.id + link.to.id}
                            className={dimmed ? "dimmed" : ""}
                            d={wirePath(link.from.x, link.from.y, link.to.x, link.to.y)}
                        />
                    );
                })}
            </svg>

            {/* 내가 발견한 순서: 걸어서 들른 기록을 차례로 잇는다 */}
            <PathThreads points={pathCoords} movingRef={movingRef} />

            {entries.map((entry) => {
                const dimmed = selectedDomain !== "전체" && entry.domain !== selectedDomain;
                let pieceClass = "sa-piece";
                if (entry.images.length === 0) pieceClass += " slip";
                if (entry.id === activeId) pieceClass += " active";
                if (dimmed) pieceClass += " dimmed";
                return (
                    <button
                        key={entry.id}
                        className={pieceClass}
                        data-entry-id={entry.id}
                        data-dimmed={dimmed}
                        style={{
                            left: entry.x + "%",
                            top: entry.y + "%",
                            width: entry.w + "%",
                            transform: "translate(-50%, -50%) rotate(" + entry.rot + "deg)",
                        }}
                        onClick={() => onEnter(entry.id)}
                        disabled={dimmed}
                    >
                        {entry.images.length > 0
                            ? <img src={entry.images[0].src} alt={entry.title} />
                            : <span className="slip-text">{entry.title}</span>}
                        <span className="piece-label">
                            <b className={"op " + operatorOf(entry.domain)}>{operatorOf(entry.domain)}</b>
                            {entry.id} · {entry.domain}
                        </span>
                        <span className="track" aria-hidden="true">
                            {entry.id} {(entry.x / 100).toFixed(2)} {(entry.y / 100).toFixed(2)}
                        </span>
                        <span className="port in" aria-hidden="true" />
                        <span className="port out" aria-hidden="true" />
                    </button>
                );
            })}

            {/* 인물과 조각을 잇는 선: 노드와 노드를 잇는 와이어처럼 */}
            {activeEntry && (
                <svg className="sa-wire" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    <path d={
                        "M " + pos.x + " " + (pos.y - 9) +
                        " C " + pos.x + " " + activeEntry.y +
                        ", " + activeEntry.x + " " + (pos.y - 9) +
                        ", " + activeEntry.x + " " + activeEntry.y
                    } />
                </svg>
            )}

            <Walker x={pos.x} y={pos.y} isWalking={isWalking} facing={facing} />

            {activeEntry && (
                <div className="sa-node" style={{ left: pos.x + "%", top: pos.y + "%" }}>
                    <strong>{activeEntry.id}</strong> {activeEntry.title}
                    <span>ENTER ↵</span>
                </div>
            )}

            {path.length > 0 && (
                <p className="sa-path">
                    <span>내 순서</span> {pathText}
                </p>
            )}

            <p className="sa-hud">
                ← ↑ ↓ → 이동 · ENTER 들어가기 · 조각을 눌러도 열려요
            </p>

            {/* 파라미터 창: 인물의 현재 값을 숫자로 보여 준다 */}
            <dl className="sa-params" aria-hidden="true">
                <dt>walker1</dt><dd>{isWalking ? "cooking" : "idle"}</dd>
                <dt>tx</dt><dd>{(pos.x / 100).toFixed(3)}</dd>
                <dt>ty</dt><dd>{(pos.y / 100).toFixed(3)}</dd>
                <dt>speed</dt><dd>{SPEED}</dd>
                <dt>target</dt><dd>{activeEntry ? activeEntry.id : "—"}</dd>
                <dt>scene</dt><dd>{currentScene ? (currentScene.scene + 1) + "/" + currentScene.entry.images.length : "—"}</dd>
                <dt>visit</dt><dd>{currentScene ? currentScene.visit : "—"}</dd>
            </dl>
        </section>
    );
}

export default CollageStage;
