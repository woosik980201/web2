import React from "react";

// 사라 제에게서 빌려 온 생각: 이미지가 계속 조립되고 해체되는 상태.
// 기록 위에 서면 그 기록의 이미지들이 찢긴 조각으로 날아와 무대를 덮고,
// 내려오면 다시 흩어진다. 같은 기록이라도 들를 때마다(visit) 배치와 중심 장면이 바뀐다.

const FRAGMENT_COUNT = 6; // 바탕 1장 + 찢긴 조각 5장

// 같은 글자에서는 늘 같은 순서의 난수가 나오게 한다.
// 그래야 다시 그려도(렌더링) 조각이 제자리에서 튀지 않는다.
function seededRandom(text) {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) {
        h ^= text.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return () => {
        h += 0x6d2b79f5;
        let t = h;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// 종이를 손으로 찢은 것 같은 들쭉날쭉한 가장자리
function tornEdge(rand) {
    const steps = 7;
    const points = [];
    for (let i = 0; i <= steps; i++) points.push([(i / steps) * 100, rand() * 5]);          // 위
    for (let i = 1; i <= steps; i++) points.push([100 - rand() * 5, (i / steps) * 100]);    // 오른쪽
    for (let i = steps - 1; i >= 0; i--) points.push([(i / steps) * 100, 100 - rand() * 5]); // 아래
    for (let i = steps - 1; i >= 1; i--) points.push([rand() * 5, (i / steps) * 100]);      // 왼쪽
    return "polygon(" + points.map(([x, y]) => x.toFixed(1) + "% " + y.toFixed(1) + "%").join(", ") + ")";
}

function buildFragments(entry, scene, visit) {
    const rand = seededRandom(entry.id + "-" + visit);
    const images = entry.images;
    const fragments = [];

    for (let i = 0; i < FRAGMENT_COUNT; i++) {
        // 0번은 이번 방문의 중심 장면. 나머지는 그다음 이미지들을 차례로 쓴다
        const image = images[(scene + i) % images.length];
        const isBase = i === 0;
        const angle = rand() * Math.PI * 2;
        const rot = isBase ? 0 : (rand() - 0.5) * 16;

        fragments.push({
            key: i,
            isBase,
            src: image.src,
            x: isBase ? 50 : 12 + rand() * 76,
            y: isBase ? 50 : 12 + rand() * 76,
            w: isBase ? 120 : 28 + rand() * 30,
            h: isBase ? 120 : 30 + rand() * 35,
            rot,
            // 같은 이미지가 여러 조각에 쓰여도 다른 부분이 보이게 자르는 위치를 바꾼다
            cropX: Math.round(rand() * 100),
            cropY: Math.round(rand() * 100),
            // 흩어져 있을 때의 위치: 무대 밖 먼 곳
            scatterX: isBase ? 0 : Math.round(Math.cos(angle) * 700),
            scatterY: isBase ? 0 : Math.round(Math.sin(angle) * 500),
            scatterRot: isBase ? 0 : rot + (rand() - 0.5) * 90,
            delay: i * 70,
            clip: isBase ? "none" : tornEdge(rand),
        });
    }
    return fragments;
}

function SceneCollage({ entry, scene, visit, leaving }) {
    const fragments = buildFragments(entry, scene, visit);

    return (
        <div className={"sa-scene" + (leaving ? " leaving" : "")}>
            {fragments.map((f) => (
                <div
                    key={f.key}
                    className={"sa-frag" + (f.isBase ? " base" : "")}
                    style={{
                        left: f.x + "%",
                        top: f.y + "%",
                        width: f.w + "%",
                        height: f.h + "%",
                        backgroundImage: "url(" + f.src + ")",
                        backgroundPosition: f.cropX + "% " + f.cropY + "%",
                        clipPath: f.clip,
                        "--r": f.rot + "deg",
                        "--sx": f.scatterX + "px",
                        "--sy": f.scatterY + "px",
                        "--sr": f.scatterRot + "deg",
                        "--d": f.delay + "ms",
                    }}
                />
            ))}
        </div>
    );
}

export default SceneCollage;
