// 글자(id)마다 늘 같은 기울기를 돌려준다.
// Math.random()을 쓰면 다시 그릴 때마다 카드가 흔들리므로, id 글자로 숫자를 만들어 쓴다.
// 결과는 -max ~ +max 사이 (단위: deg)
export function tiltOf(id, max) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = (hash * 31 + id.charCodeAt(i)) % 1000;
    }
    return ((hash / 1000) * 2 - 1) * max;
}

// 같은 방식으로 위아래 어긋남(px)도 만든다. 콜라주처럼 줄이 딱 맞지 않게.
export function offsetOf(id, max) {
    return tiltOf(id + "-y", max);
}
