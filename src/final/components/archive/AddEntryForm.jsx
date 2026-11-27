import React, { useState, useEffect, useRef } from "react";
import { normalizeDomain } from "../../data/references";

// 레퍼런스 기록 폼. 새 기록을 적을 때와 있는 기록을 고칠 때 같은 폼을 쓴다.
// 구글 시트(References 탭)에 적던 칸을 그대로 옮겼다. 시트는 건드리지 않고, 내용은 이 브라우저(localStorage)에만 남는다.
//
// domains        : 지금 있는 분야 목록 (고르기용). 목록에 없는 분야를 직접 적으면 새 분야가 된다
// initial        : (선택) 고칠 기록. 넘겨주면 그 내용으로 칸을 채운 "수정" 폼이 되고, 없으면 "새 기록" 폼이다
// onSubmit(fields): 폼 내용을 부모에게 넘긴다. 부모가 저장하고, 성공하면 { id }, 실패하면 { error }를 돌려준다
// onReset        : (선택) 넘겨주면 "원래대로" 버튼이 생긴다 (기본 기록을 고친 적이 있을 때)
// onClose        : 폼 닫기

const MAX_IMAGES = 3;
const MAX_SIDE = 900; // 올린 사진은 긴 변 900px로 줄여서 저장한다 (브라우저 저장 공간이 작아서)

// 오늘 날짜를 시트와 같은 "2026.11.26" 꼴로
function today() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return now.getFullYear() + "." + pad(now.getMonth() + 1) + "." + pad(now.getDate());
}

// 파일 → 줄인 JPG 글자(data URL). 캔버스에 작게 다시 그려서 용량을 줄인다.
function shrinkImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
                const canvas = document.createElement("canvas");
                canvas.width = Math.round(img.width * scale);
                canvas.height = Math.round(img.height * scale);
                canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/jpeg", 0.78));
            };
            img.onerror = reject;
            img.src = reader.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

const emptyForm = { domain: "", title: "", credits: "", url: "", captured: today(), why: "", question: "" };

function AddEntryForm({ domains, initial, onSubmit, onReset, onClose }) {
    const editing = Boolean(initial);
    // 처음 값: 수정이면 그 기록의 내용, 새 기록이면 빈칸. (useState의 처음 값은 폼이 처음 그려질 때 한 번만 쓰인다)
    const [form, setForm] = useState(
        editing
            ? {
                  domain: initial.domain,
                  title: initial.title,
                  credits: initial.credits,
                  url: initial.url,
                  captured: initial.captured,
                  why: initial.why,
                  question: initial.question,
              }
            : emptyForm
    );
    const [images, setImages] = useState(editing ? initial.images : []); // [{ src, caption }]
    const [imageUrl, setImageUrl] = useState("");
    const [message, setMessage] = useState("");
    const [domainOpen, setDomainOpen] = useState(false); // 분야 목록이 열려 있는지

    // 여러 줄 칸의 높이를 내용에 딱 맞춘다. 고정 높이(rows)면 글 아래에 지울 수 없는 빈 줄처럼 보이는 공간이 남는다.
    // 높이를 잠깐 auto로 풀었다가, 내용 전체 높이(scrollHeight)만큼으로 다시 잡는다. 글이 바뀔 때마다 실행.
    const whyRef = useRef(null);
    const questionRef = useRef(null);
    useEffect(() => {
        [whyRef.current, questionRef.current].forEach((box) => {
            if (!box) return;
            box.style.height = "auto";
            box.style.height = box.scrollHeight + "px";
        });
    }, [form.why, form.question]);

    // 입력칸 하나를 바꾸는 함수 하나로 모든 칸을 다룬다 (name 속성 = form의 키)
    function handleChange(event) {
        const { name, value } = event.target;
        setForm((previous) => ({ ...previous, [name]: value }));
    }

    async function handleFiles(event) {
        const files = Array.from(event.target.files).slice(0, MAX_IMAGES - images.length);
        event.target.value = ""; // 같은 파일을 다시 골라도 동작하게 비운다
        try {
            const shrunk = await Promise.all(files.map(shrinkImage));
            setImages((previous) => [...previous, ...shrunk.map((src, i) => ({ src, caption: files[i].name }))]);
            setMessage("");
        } catch (error) {
            setMessage("이미지를 읽지 못했어요. 다른 파일을 골라 주세요.");
        }
    }

    function addImageUrl() {
        const url = imageUrl.trim();
        if (!/^https?:\/\//.test(url)) {
            setMessage("이미지 주소는 http:// 또는 https://로 시작해야 해요.");
            return;
        }
        setImages((previous) => [...previous, { src: url, caption: "이미지 주소로 추가" }]);
        setImageUrl("");
        setMessage("");
    }

    function removeImage(index) {
        setImages((previous) => previous.filter((_, i) => i !== index));
    }

    // 한 줄짜리 입력칸에서 Enter(Shift+Enter 포함)를 눌러도 폼이 저장되지 않게 막는다.
    // 브라우저는 원래 input에서 Enter를 누르면 폼을 제출한다 → 적는 도중에 실수로 저장되는 일이 생겼다.
    // 저장은 "Add / Save" 버튼으로만 한다. 여러 줄 칸(textarea)의 Enter는 줄바꿈이라 그대로 둔다.
    function handleKeyDown(event) {
        if (event.key === "Enter" && event.target.tagName === "INPUT") event.preventDefault();
        if (event.key === "Escape") setDomainOpen(false);
    }

    function handleSubmit(event) {
        event.preventDefault(); // 폼 제출 때 페이지가 새로고침되지 않게
        if (form.title.trim() === "" || form.why.trim() === "") {
            setMessage("제목과 '왜 끌렸나'는 꼭 적어 주세요 — 이 아카이브의 핵심이에요.");
            return;
        }
        // 분야: 목록에서 골랐든 직접 적었든 같은 꼴로 다듬는다. "all"은 필터의 "전체" 자리라 분야 이름으로 못 쓴다.
        const domain = normalizeDomain(form.domain);
        if (domain === "" || domain === "all") {
            setMessage("분야(Domain)를 적어 주세요. 목록에서 고르거나 새 이름을 적으면 돼요.");
            return;
        }
        const result = onSubmit({
            domain,
            title: form.title.trim(),
            credits: form.credits.trim() || "—",
            url: form.url.trim(),
            captured: form.captured.trim() || today(),
            why: form.why.trim(),
            question: form.question.trim(),
            images,
        });
        if (result.error) {
            setMessage(result.error);
            return;
        }
        setForm({ ...emptyForm, captured: today() });
        setImages([]);
        setMessage("");
        onClose();
    }

    const pickable = domains.filter((d) => d.value !== "all");
    // 지금 적은 분야가 목록에 없는 새 분야인지 (안내 문장용)
    const typedDomain = normalizeDomain(form.domain);
    // 목록에 보여 줄 분야: 적은 글자가 들어 있는 것만. 이미 정확히 고른 상태면 전부 다시 보여 준다(다른 걸로 바꾸기 쉽게)
    const exact = pickable.some((d) => d.value === typedDomain);
    const matching = typedDomain === "" || exact ? pickable : pickable.filter((d) => d.value.includes(typedDomain));

    function pickDomain(value) {
        setForm((previous) => ({ ...previous, domain: value }));
        setDomainOpen(false);
    }

    const isNewDomain = typedDomain !== "" && typedDomain !== "all" && !pickable.some((d) => d.value === typedDomain);
    const canAddImage = images.length < MAX_IMAGES;

    return (
        <form className="paper add-form" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            <div className="add-form-head">
                <h2>{editing ? "Edit " + initial.id : "New entry"}</h2>
                <p className="meta">
                    {editing ? "고친 내용은 이 브라우저에만 저장돼요" : "시트에 적던 칸 그대로 · 이 브라우저에만 저장돼요"}
                </p>
            </div>

            <div className="add-grid">
                <div className="field">
                    <label htmlFor="entry-domain">Domain — 고르거나 새로 적기</label>
                    {/* 고를 수도 있고 직접 적을 수도 있는 칸. 브라우저 기본 목록(datalist)은 모양을 바꿀 수 없어서
                        목록을 직접 그린다: 칸에 들어오면 열리고, 적는 글자로 걸러지고, 항목을 누르면 그 값이 들어간다. */}
                    <div className="combo">
                        <input
                            id="entry-domain"
                            name="domain"
                            value={form.domain}
                            onChange={(event) => {
                                handleChange(event);
                                setDomainOpen(true);
                            }}
                            onFocus={() => setDomainOpen(true)}
                            onBlur={() => setDomainOpen(false)}
                            placeholder="film, music, … 또는 새 분야"
                            autoComplete="off"
                            role="combobox"
                            aria-expanded={domainOpen && matching.length > 0}
                            aria-controls="domain-options"
                        />
                        {domainOpen && matching.length > 0 && (
                            <ul id="domain-options" className="combo-list" role="listbox">
                                {matching.map((d) => (
                                    <li key={d.value} role="option" aria-selected={d.value === typedDomain}>
                                        {/* onMouseDown을 막아야 누르는 순간 칸의 포커스가 풀려 목록이 먼저 닫히지 않는다 */}
                                        <button
                                            type="button"
                                            tabIndex={-1}
                                            onMouseDown={(event) => event.preventDefault()}
                                            onClick={() => pickDomain(d.value)}
                                        >
                                            {d.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {isNewDomain && <span className="field-hint">새 분야 "{typedDomain}" — 저장하면 필터에 추가돼요</span>}
                </div>
                <label className="field">
                    <span>Captured</span>
                    <input name="captured" value={form.captured} onChange={handleChange} placeholder="2026.11.26" />
                </label>
                <label className="field wide">
                    <span>Title *</span>
                    <input name="title" value={form.title} onChange={handleChange} placeholder="작품·곡·컬렉션 이름" />
                </label>
                <label className="field">
                    <span>Credits</span>
                    <input name="credits" value={form.credits} onChange={handleChange} placeholder="누가 만들었나" />
                </label>
                <label className="field">
                    <span>Link</span>
                    <input name="url" value={form.url} onChange={handleChange} placeholder="https://" />
                </label>
                <label className="field wide">
                    <span>Why it caught me *</span>
                    <textarea ref={whyRef} name="why" value={form.why} onChange={handleChange} rows={1} placeholder="왜 끌렸는지, 내 말로" />
                </label>
                <label className="field wide">
                    <span>Next question</span>
                    <textarea ref={questionRef} name="question" value={form.question} onChange={handleChange} rows={1} placeholder="다음에 파고들 질문" />
                </label>
            </div>

            <div className="field wide">
                <span>Images ({images.length}/{MAX_IMAGES})</span>
                {images.length > 0 && (
                    <ul className="add-thumbs">
                        {images.map((image, index) => (
                            <li key={index}>
                                <img src={image.src} alt={image.caption} />
                                <button type="button" onClick={() => removeImage(index)} aria-label={image.caption + " 빼기"}>×</button>
                            </li>
                        ))}
                    </ul>
                )}
                {canAddImage && (
                    <div className="add-image-row">
                        <label className="tab file-pick">
                            파일 고르기
                            <input type="file" accept="image/*" multiple onChange={handleFiles} />
                        </label>
                        <input
                            className="image-url"
                            value={imageUrl}
                            onChange={(event) => setImageUrl(event.target.value)}
                            placeholder="또는 이미지 주소 붙여넣기"
                            aria-label="이미지 주소"
                        />
                        <button type="button" className="tab" onClick={addImageUrl} disabled={imageUrl.trim() === ""}>
                            추가
                        </button>
                    </div>
                )}
            </div>

            {message && <p className="add-message" role="alert">{message}</p>}

            <div className="actions">
                <button type="submit" className="stamp">{editing ? "Save changes" : "Add to Digging Log ↓"}</button>
                <button type="button" className="tab" onClick={onClose}>취소</button>
                {onReset && (
                    <button type="button" className="tab danger" onClick={onReset}>원래대로</button>
                )}
            </div>
        </form>
    );
}

export default AddEntryForm;
