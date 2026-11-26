import React, { useState } from "react";
import { domains } from "../../data/references";

// 새 레퍼런스 기록 폼. 구글 시트(References 탭)에 적던 칸을 그대로 옮겼다.
// 시트는 건드리지 않고, 적은 기록은 이 브라우저(localStorage)에만 남는다.
//
// onAdd(entry) : 폼 내용을 App에 넘긴다. App이 번호(SA-010…)와 무대 위치를 붙여 저장하고,
//                성공하면 { id }, 저장 공간이 부족하면 { error }를 돌려준다.
// onClose      : 폼 닫기

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

const emptyForm = { domain: "film", title: "", credits: "", url: "", captured: today(), why: "", question: "" };

function AddEntryForm({ onAdd, onClose }) {
    const [form, setForm] = useState(emptyForm);
    const [images, setImages] = useState([]); // [{ src, caption }]
    const [imageUrl, setImageUrl] = useState("");
    const [message, setMessage] = useState("");

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

    function handleSubmit(event) {
        event.preventDefault(); // 폼 제출 때 페이지가 새로고침되지 않게
        if (form.title.trim() === "" || form.why.trim() === "") {
            setMessage("제목과 '왜 끌렸나'는 꼭 적어 주세요 — 이 아카이브의 핵심이에요.");
            return;
        }
        const result = onAdd({
            domain: form.domain,
            title: form.title.trim(),
            credits: form.credits.trim() || "—",
            url: form.url.trim(),
            captured: form.captured.trim() || today(),
            why: form.why.trim(),
            question: form.question.trim(),
            rights: "권리 미확인 (직접 추가)",
            images,
            custom: true,
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
    const canAddImage = images.length < MAX_IMAGES;

    return (
        <form className="paper add-form" onSubmit={handleSubmit}>
            <div className="add-form-head">
                <h2>New entry</h2>
                <p className="meta">시트에 적던 칸 그대로 · 이 브라우저에만 저장돼요</p>
            </div>

            <div className="add-grid">
                <label className="field">
                    <span>Domain</span>
                    <select name="domain" value={form.domain} onChange={handleChange}>
                        {pickable.map((d) => (
                            <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                    </select>
                </label>
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
                    <textarea name="why" value={form.why} onChange={handleChange} rows={3} placeholder="왜 끌렸는지, 내 말로" />
                </label>
                <label className="field wide">
                    <span>Next question</span>
                    <input name="question" value={form.question} onChange={handleChange} placeholder="다음에 파고들 질문" />
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
                <button type="submit" className="stamp">Add to Digging Log ↓</button>
                <button type="button" className="tab" onClick={onClose}>취소</button>
            </div>
        </form>
    );
}

export default AddEntryForm;
