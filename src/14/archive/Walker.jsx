import React, { useEffect, useRef } from "react";

// 점 구름으로 그린 인물. 뼈대(관절 위치)를 먼저 계산하고, 그 뼈대를 따라 점을 뿌린다.
// 위치(x, y)는 무대 안의 % 좌표이고 발끝이 기준점이다.
// 그림은 96x150 좌표로 그리고, 화면에는 SCALE배로 키워서 보여 준다
const BASE_WIDTH = 96;
const BASE_HEIGHT = 150;
const SCALE = 1.3;
const WIDTH = BASE_WIDTH * SCALE;
const HEIGHT = BASE_HEIGHT * SCALE;

// [뼈 이름, 굵기, 점 개수, 뒤쪽 팔다리인지]
const BONES = [
    ["upperArmB", 4, 14, true], ["lowerArmB", 3.5, 12, true],
    ["upperLegB", 7, 30, true], ["lowerLegB", 5, 22, true],
    ["torso", 10, 110, false],
    ["footB", 2.5, 8, true], ["footF", 2.5, 10, false],
    ["upperLegF", 7, 40, false], ["lowerLegF", 5, 30, false],
    ["upperArmF", 4, 20, false], ["lowerArmF", 3.5, 18, false],
];

// 처음 한 번만 점들의 "뼈 위 위치"를 정해 둔다. 매 프레임 바뀌는 건 뼈의 위치뿐이다.
function makePoints() {
    const points = [];
    BONES.forEach(([bone, thickness, count, back]) => {
        for (let i = 0; i < count; i++) {
            points.push({ bone, back, t: Math.random(), offset: (Math.random() * 2 - 1) * thickness, seed: Math.random() });
        }
    });
    for (let i = 0; i < 70; i++) {
        // 머리: 가장자리에 점이 더 모이게 해서 구의 윤곽처럼 보이게
        const rim = Math.random() < 0.6;
        points.push({ bone: "head", back: false, angle: Math.random() * Math.PI * 2, radius: rim ? 10 : 10 * Math.sqrt(Math.random()), seed: Math.random() });
    }
    return points;
}

// 걷는 주기(phase)와 걷는 정도(amount, 0~1)로 관절 위치를 계산한다
function poseAt(phase, amount) {
    const lean = 3 * amount;
    const hip = { x: 46, y: 84 };
    const neck = { x: 46 + lean, y: 42 };
    const step = (from, angle, length) => ({ x: from.x + Math.sin(angle) * length, y: from.y + Math.cos(angle) * length });

    // side: 앞쪽 팔다리는 +1, 뒤쪽은 -1. 서 있을 때 다리와 팔이 살짝 벌어져 사람 윤곽이 읽히게 한다
    const leg = (shift, side) => {
        const thigh = Math.sin(phase + shift) * 0.55 * amount + side * 0.13 * (1 - amount);
        const bend = Math.max(0, Math.sin(phase + shift - 1.2)) * 0.9 * amount;
        const knee = step(hip, thigh, 27);
        const ankle = step(knee, thigh - bend, 27);
        return [knee, ankle, { x: ankle.x + 9, y: ankle.y + 1 }];
    };
    const arm = (shift, side) => {
        const shoulder = { x: neck.x + side * 3, y: neck.y + 3 };
        const upper = Math.sin(phase + shift) * 0.6 * amount + side * 0.2 * (1 - amount);
        const elbow = step(shoulder, upper, 20);
        return [shoulder, elbow, step(elbow, upper + 0.15 + 0.35 * amount, 18)];
    };
    const [kneeF, footF, toeF] = leg(0, 1);
    const [kneeB, footB, toeB] = leg(Math.PI, -1);
    const [shoulderF, elbowF, handF] = arm(Math.PI, 1);
    const [shoulderB, elbowB, handB] = arm(0, -1);

    return {
        head: { x: neck.x + lean * 0.5 + 1, y: 25 },
        footF: [footF, toeF], footB: [footB, toeB],
        torso: [neck, hip],
        upperLegF: [hip, kneeF], lowerLegF: [kneeF, footF],
        upperLegB: [hip, kneeB], lowerLegB: [kneeB, footB],
        upperArmF: [shoulderF, elbowF], lowerArmF: [elbowF, handF],
        upperArmB: [shoulderB, elbowB], lowerArmB: [elbowB, handB],
    };
}

function Walker({ x, y, isWalking, facing }) {
    const canvasRef = useRef(null);
    const walkingRef = useRef(isWalking);
    const facingRef = useRef(facing);
    walkingRef.current = isWalking;   // 그리기 반복문이 항상 최신 값을 읽도록
    facingRef.current = facing;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const ratio = window.devicePixelRatio || 1;
        canvas.width = WIDTH * ratio;
        canvas.height = HEIGHT * ratio;
        ctx.scale(ratio * SCALE, ratio * SCALE);

        const points = makePoints();
        let phase = 0;
        let amount = 0;
        let frame = 0;
        let ink = "#222";
        let frameId;

        const draw = () => {
            if (frame % 20 === 0) ink = getComputedStyle(canvas).color;
            frame += 1;
            amount += ((walkingRef.current ? 1 : 0) - amount) * 0.15;
            phase += 0.24 * amount;
            const pose = poseAt(phase, amount);
            const time = frame / 60;

            ctx.clearRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
            ctx.save();
            if (facingRef.current === "left") {
                ctx.translate(BASE_WIDTH, 0);
                ctx.scale(-1, 1);
            }

            // 관절을 잇는 가는 선
            ctx.strokeStyle = ink;
            ctx.globalAlpha = 0.3;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            BONES.forEach(([bone]) => {
                ctx.moveTo(pose[bone][0].x, pose[bone][0].y);
                ctx.lineTo(pose[bone][1].x, pose[bone][1].y);
            });
            ctx.stroke();

            // 점 구름: 빨강·파랑을 살짝 어긋나게 먼저 찍고 그 위에 본래 색을 찍는다
            const passes = [["rgba(255,60,90,.55)", 2], ["rgba(40,150,255,.55)", -2], [ink, 0]];
            passes.forEach(([color, shift]) => {
                ctx.fillStyle = color;
                points.forEach((point) => {
                    let px;
                    let py;
                    if (point.bone === "head") {
                        px = pose.head.x + Math.cos(point.angle) * point.radius;
                        py = pose.head.y + Math.sin(point.angle) * point.radius;
                    } else {
                        const [from, to] = pose[point.bone];
                        const length = Math.hypot(to.x - from.x, to.y - from.y) || 1;
                        // 몸통은 어깨 쪽이 넓고 허리 쪽이 좁다
                        const spread = point.bone === "torso" ? point.offset * (1.3 - 0.65 * point.t) : point.offset;
                        px = from.x + (to.x - from.x) * point.t - ((to.y - from.y) / length) * spread;
                        py = from.y + (to.y - from.y) * point.t + ((to.x - from.x) / length) * spread;
                    }
                    // 떨림 + 걸을 때 뒤로 흩날리는 점
                    px += Math.sin(time * 3 + point.seed * 40) * 0.8 - amount * Math.pow(point.seed, 4) * 22;
                    py += Math.cos(time * 2.3 + point.seed * 31) * 0.8;
                    ctx.globalAlpha = point.back ? 0.4 : 0.95;
                    ctx.fillRect(px + shift, py, 1.4, 1.4);
                });
            });
            ctx.restore();

            // 추적 상자와 번호
            ctx.globalAlpha = 0.7;
            ctx.strokeStyle = ink;
            ctx.fillStyle = ink;
            ctx.lineWidth = 0.8;
            ctx.strokeRect(12.5, 10.5, 70, 134);
            ctx.font = "9px Consolas, monospace";
            ctx.fillText(String(10000 + (frame % 90000)), 16, 9);
            ctx.globalAlpha = 1;

            frameId = requestAnimationFrame(draw);
        };
        frameId = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(frameId);
    }, []);

    return (
        <div className="sa-walker" style={{ left: x + "%", top: y + "%" }}>
            <canvas ref={canvasRef} style={{ width: WIDTH, height: HEIGHT }} aria-hidden="true" />
        </div>
    );
}

export default Walker;
