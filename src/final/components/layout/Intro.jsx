import React, { useEffect, useState } from "react";
import introVideo from "../../assets/intro.mp4";
import ParamsPanel from "../common/ParamsPanel";

// 첫 방문 때 한 번 나오는 인트로: 검은 화면 위로 영상이 깔리고, 문장이 한 글자씩 타이핑된다.
// (참고: Future Bless Studio 워크숍 페이지의 인트로 방식)
// 영상: Hero 이미지를 첫 장면으로 Higgsfield(Seedance 2.5)로 만든 6초 무음 영상, 2026-11-26.
// 실물 재료(필름·파형·꽃·사진 틀)가 제자리에서 선과 와이어프레임으로 바뀌고 바탕이 어두워진다
// → "The same material, a different shape"를 그대로 보여 주고, 아날로그 Hero와 노드 화면인 Stage를 잇는다.
// 영상 위에는 Stage와 같은 점 격자와 파라미터 창(ParamsPanel)만 얹는다. 선과 점은 영상 안에 이미 있다.
// SKIP 버튼이나 ESC로 건너뛸 수 있다.
// 사이트를 새로 열 때마다(새 탭·새 창) 한 번 나온다. 같은 탭에서 새로고침하거나 페이지를 오갈 때는 다시 나오지 않는다.
// → 본 적을 sessionStorage에 적어 둔다. sessionStorage는 탭을 닫으면 지워지고, localStorage는 계속 남는다.
//   (처음에는 localStorage를 썼더니 한 번 본 뒤로는 영영 안 나와서 바꿨다)
// 주소 끝에 ?intro를 붙이면 다시 볼 수 있다(발표용).
const SEEN_KEY = "ssikhive-intro-seen";
const lines = [
    "The same material, a different shape.",
    "Visual and sound references, kept with the reason they stayed with me.",
];
const fullText = lines.join("\n");

function shouldShow() {
    try {
        if (window.location.search.includes("intro")) return true;
        return sessionStorage.getItem(SEEN_KEY) === null;
    } catch (e) {
        return false;
    }
}

// 움직임 줄이기를 켠 사용자에게는 영상과 타이핑을 생략한다
const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Intro() {
    const [visible, setVisible] = useState(shouldShow);
    const [count, setCount] = useState(reduceMotion ? fullText.length : 0); // 지금까지 보이는 글자 수
    const [leaving, setLeaving] = useState(false);

    const close = () => {
        try {
            sessionStorage.setItem(SEEN_KEY, "1");
        } catch (e) {}
        setLeaving(true);
        setTimeout(() => setVisible(false), 600); // 사라지는 애니메이션 시간과 맞춤
    };

    // 한 글자씩 늘린다. 다 쓰면 잠깐 멈췄다가 닫는다.
    useEffect(() => {
        if (!visible || leaving) return;
        if (count < fullText.length) {
            const id = setTimeout(() => setCount(count + 1), 38);
            return () => clearTimeout(id);
        }
        const id = setTimeout(close, 1600);
        return () => clearTimeout(id);
    }, [visible, leaving, count]); // eslint-disable-line react-hooks/exhaustive-deps

    // 인트로가 떠 있는 동안 키보드: ESC는 건너뛰기, 나머지 키(방향키·Enter)는 뒤에 있는 Stage 무대로 가지 않게 막는다.
    // capture(세 번째 인자 true)로 걸어서 무대의 키보드 이벤트보다 먼저 받는다.
    useEffect(() => {
        if (!visible) return;
        const handleKey = (event) => {
            if (event.key === "Escape") close();
            if (event.key !== "Tab") {
                event.stopImmediatePropagation();
                if (event.key !== "Enter" && event.key !== " ") event.preventDefault();
            }
        };
        window.addEventListener("keydown", handleKey, true);
        return () => window.removeEventListener("keydown", handleKey, true);
    }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!visible) return null;

    // "\n" 앞뒤로 나눠 두 줄로 보여 준다
    const shown = fullText.slice(0, count).split("\n");

    return (
        <div className={"intro" + (leaving ? " leaving" : "")} role="dialog" aria-modal="true" aria-label="소개">
            {!reduceMotion && (
                <video className="intro-video" src={introVideo} autoPlay muted playsInline aria-hidden="true" />
            )}
            <div className="intro-grid" aria-hidden="true" />
            <div className="intro-params" aria-hidden="true">
                <ParamsPanel
                    title="intro"
                    rows={[
                        { key: "in", value: "material" },
                        { key: "op", value: "collage" },
                        { key: "out", value: "shape" },
                        { key: "t", value: (count / fullText.length).toFixed(2), live: true },
                    ]}
                />
            </div>
            <p className="intro-text">
                {shown.map((line, index) => (
                    <span key={index} className="intro-line">
                        {line}
                        {index === shown.length - 1 && <span className="intro-cursor" aria-hidden="true" />}
                    </span>
                ))}
            </p>
            <button type="button" className="intro-skip" onClick={close}>
                SKIP <span aria-hidden="true">(esc)</span>
            </button>
        </div>
    );
}

export default Intro;
