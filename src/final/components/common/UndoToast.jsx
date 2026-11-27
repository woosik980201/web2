import React, { useEffect } from "react";

// 화면 아래에 잠깐 뜨는 안내. 기록을 지운 직후 "되돌리기"를 준다.
// message  : 보여 줄 문장
// onUndo   : 되돌리기를 눌렀을 때
// onDismiss: 시간이 지나 사라질 때 (부모가 안내를 치운다)
const SHOW_MS = 7000;

function UndoToast({ message, onUndo, onDismiss }) {
    // 7초 뒤 자동으로 사라진다. message가 바뀌면(다른 기록을 또 지우면) 시간을 다시 잰다.
    useEffect(() => {
        const id = setTimeout(onDismiss, SHOW_MS);
        return () => clearTimeout(id);
    }, [message]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="toast" role="status">
            <span>{message}</span>
            <button type="button" onClick={onUndo}>되돌리기</button>
        </div>
    );
}

export default UndoToast;
