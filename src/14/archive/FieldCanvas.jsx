import React, { useEffect, useRef } from "react";

// 무대 바닥에 깔리는 생성형 그래픽: 인물을 중심으로 퍼지는 입자 선, 점으로 된 구, 궤도, 추적 상자, 파형.
// posRef(인물 위치 %)와 movingRef(걷는 중인지)를 매 프레임 읽는다.
const PARTICLE_COUNT = 260;

function newParticle(far) {
    return {
        angle: Math.random() * Math.PI * 2,
        radius: far ? Math.random() * 700 : 40 + Math.random() * 50,
        speed: 0.6 + Math.random() * 2.2,
        length: 8 + Math.random() * 46,
    };
}

function FieldCanvas({ posRef, movingRef }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const ratio = window.devicePixelRatio || 1;
        let width = 0;
        let height = 0;

        const resize = () => {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        };
        const observer = new ResizeObserver(resize);
        observer.observe(canvas);
        resize();

        const particles = Array.from({ length: PARTICLE_COUNT }, () => newParticle(true));
        const spherePoints = Array.from({ length: 150 }, () => ({ angle: Math.random() * Math.PI * 2, jitter: Math.random() }));
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let centerX = width / 2;
        let centerY = height / 2;
        let energy = 0;   // 걷는 동안 올라가는 값. 파형의 크기와 입자 속도에 쓴다
        let frame = 0;
        let ink = "#222";
        let frameId;

        const draw = () => {
            if (frame % 20 === 0) ink = getComputedStyle(canvas).color;
            frame += 1;
            const time = frame / 60;
            const targetX = (posRef.current.x / 100) * width;
            const targetY = (posRef.current.y / 100) * height - 78;
            centerX += (targetX - centerX) * 0.08;   // 중심이 인물을 조금 늦게 따라온다
            centerY += (targetY - centerY) * 0.08;
            energy += ((movingRef.current ? 1 : 0) - energy) * 0.06;

            // 이전 프레임을 조금씩 지워서 선이 꼬리를 남기게 한다
            ctx.globalCompositeOperation = "destination-out";
            ctx.fillStyle = "rgba(0,0,0,0.14)";
            ctx.fillRect(0, 0, width, height);
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = ink;
            ctx.fillStyle = ink;

            // 1) 바깥으로 퍼지는 입자 선
            const reach = Math.hypot(width, height);
            ctx.lineWidth = 0.7;
            particles.forEach((particle, index) => {
                particle.radius += particle.speed * (1 + energy * 2.4);
                particle.angle += 0.0015;
                if (particle.radius > reach) Object.assign(particle, newParticle(false));
                const cos = Math.cos(particle.angle);
                const sin = Math.sin(particle.angle);
                ctx.globalAlpha = 0.2 + 0.4 * (particle.speed / 2.8);
                ctx.beginPath();
                ctx.moveTo(centerX + cos * particle.radius, centerY + sin * particle.radius);
                ctx.lineTo(centerX + cos * (particle.radius + particle.length), centerY + sin * (particle.radius + particle.length));
                ctx.stroke();

                // 3) 입자 몇 개에는 추적 상자와 번호를 붙인다
                if (index < 4 && particle.radius < reach * 0.45) {
                    const boxX = Math.round(centerX + cos * particle.radius) + 0.5;
                    const boxY = Math.round(centerY + sin * particle.radius) + 0.5;
                    ctx.globalAlpha = 0.55;
                    ctx.strokeRect(boxX - 24, boxY - 11, 48 + index * 10, 22);
                    ctx.font = "9px Consolas, monospace";
                    ctx.fillText(String(2000 + index * 137 + Math.floor(particle.radius)), boxX - 20, boxY + 3);
                }
            });

            // 2) 점으로 된 구와 기울어진 궤도
            ctx.globalAlpha = 0.5;
            spherePoints.forEach((point) => {
                const angle = point.angle + time * 0.15;
                const radius = 72 + Math.sin(time * 2 + point.jitter * 20) * 2 + point.jitter * 5;
                ctx.fillRect(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius, 1.2, 1.2);
            });
            ctx.globalAlpha = 0.45;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, 170, 30, -0.16, 0, Math.PI * 2);
            ctx.stroke();
            const orbit = time * 0.8;
            ctx.globalAlpha = 0.9;
            ctx.fillRect(
                centerX + Math.cos(orbit) * 170 * Math.cos(-0.16) - Math.sin(orbit) * 30 * Math.sin(-0.16) - 2,
                centerY + Math.cos(orbit) * 170 * Math.sin(-0.16) + Math.sin(orbit) * 30 * Math.cos(-0.16) - 2,
                4, 4
            );

            // 4) 파형: 걸을수록 크게 흔들린다
            const waveLeft = width * 0.36;
            const waveRight = width * 0.74;
            const waveY = height - 30;
            ctx.globalAlpha = 0.75;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            for (let px = waveLeft; px <= waveRight; px += 3) {
                const k = (px - waveLeft) / (waveRight - waveLeft);
                const fade = Math.sin(k * Math.PI);
                const value = Math.sin(k * 18 + time * 6) * 0.6 + Math.sin(k * 41 - time * 9) * 0.4;
                const py = waveY + value * fade * (2 + energy * 11);
                if (px === waveLeft) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();
            ctx.globalAlpha = 0.5;
            for (let px = waveLeft; px <= waveRight; px += 6) {
                const level = Math.abs(Math.sin(px * 0.21 + time * 4)) * (1 + energy * 5);
                ctx.fillRect(px, waveY - 16 - level, 2, 1 + level);
            }
            ctx.globalAlpha = 1;

            if (!reduced) frameId = requestAnimationFrame(draw);
        };
        frameId = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
        };
    }, [posRef, movingRef]);

    return <canvas className="sa-field" ref={canvasRef} aria-hidden="true" />;
}

export default FieldCanvas;
