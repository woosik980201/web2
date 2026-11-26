import React, { useEffect, useRef } from "react";

// 내가 발견한 순서를 잇는 실 다발.
// 조각에 닿는 점은 고정하고, 그 사이의 휘어짐만 천천히 바뀐다.
// 길이 계속 다시 엮이는 모습 — 사라 제의 "계속 조립되고 해체되는 상태"에서 빌려 온 생각.

// 가닥 목록. recent는 최근 몇 구간까지 그릴지 (null이면 처음부터 끝까지)
// 최근 길은 세 가닥으로 엮고, 오래된 길은 아주 흐린 한 가닥으로만 남긴다.
// 경로가 길어져도 무대가 거미줄로 덮이지 않게 하기 위해서다.
const RECENT = 5;
const STRANDS = [
    { name: "strand-old", recent: null, phase: 0 },
    { name: "strand-0", recent: RECENT, phase: 0 },
    { name: "strand-1", recent: RECENT, phase: 1 },
    { name: "strand-2", recent: RECENT, phase: 2 },
];
const PERIOD_A = 8;         // 휘어짐 주기(초). 두 손잡이를 다른 주기로 움직여 같은 모양이 반복돼 보이지 않게 한다
const PERIOD_B = 11;

// 점들을 지나는 곡선 경로. 구간마다 수직 방향으로 손잡이를 흔든다
function swayPath(points, time, energy, strand) {
    let d = "M " + points[0][0] + " " + points[0][1];
    for (let i = 1; i < points.length; i++) {
        const [x1, y1] = points[i - 1];
        const [x2, y2] = points[i];
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;              // 구간에 수직인 방향
        const ny = dx / len;
        const amp = len * (0.18 + 0.22 * energy); // 긴 구간일수록, 걷는 중일수록 크게 휜다
        const a = Math.sin((time * 2 * Math.PI) / PERIOD_A + i * 1.7 + strand * 0.9) * amp;
        const b = Math.sin((time * 2 * Math.PI) / PERIOD_B + i * 2.9 + 1 + strand * 1.3) * amp;
        d += " C " + (x1 + dx / 3 + nx * a) + " " + (y1 + dy / 3 + ny * a) +
             ", " + (x1 + (dx * 2) / 3 + nx * b) + " " + (y1 + (dy * 2) / 3 + ny * b) +
             ", " + x2 + " " + y2;
    }
    return d;
}

function PathThreads({ points, movingRef }) {
    const pathRefs = useRef([]);
    const pointsRef = useRef(points);

    // 매 프레임 그리는 쪽이 항상 최신 순서를 읽게 한다
    useEffect(() => {
        pointsRef.current = points;
    }, [points]);

    useEffect(() => {
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let energy = 0;
        let frameId;

        const draw = (now) => {
            energy += ((movingRef.current ? 1 : 0) - energy) * 0.05;
            const time = still ? 0 : now / 1000;
            const all = pointsRef.current;

            STRANDS.forEach((strand, index) => {
                const path = pathRefs.current[index];
                if (!path) return;
                const part = strand.recent === null ? all : all.slice(-(strand.recent + 1));
                path.setAttribute("d", part.length > 1 ? swayPath(part, time, still ? 0 : energy, strand.phase) : "");
            });
            frameId = requestAnimationFrame(draw);
        };

        frameId = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(frameId);
    }, [movingRef]);

    return (
        <svg className="sa-path-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {STRANDS.map((strand, index) => (
                <path
                    key={strand.name}
                    className={strand.name}
                    ref={(element) => { pathRefs.current[index] = element; }}
                />
            ))}
        </svg>
    );
}

export default PathThreads;
