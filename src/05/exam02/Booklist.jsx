import React from "react";
import Book from "./Book";
import "./Booklist.css";

// 데이터 배열
const books = [
    {
        title: "처음 만난 리액트",
        author: "김소플",
        coverImage: "https://image.yes24.com/goods/172506733/XL"
    },
    {
        title: "데이터베이스실습",
        author: "박우창",
        coverImage: "https://image.yes24.com/goods/97538787/XL"
    },
    {
        title: "처음 만난 자바",
        author: "우재남",
        coverImage: "https://image.yes24.com/goods/119842978/XL"
    },
    {
        title: "챗GPT · 제미나이 · 클로드까지 모두를 위한 AI ",
        author: "지현이",
        coverImage: "https://image.yes24.com/goods/192877325/XL"
    },
    {
        title: "클로드 코드 제대로 시작하기",
        author: "주홍철",
        coverImage: "https://image.yes24.com/goods/194483933/XL"
    }
];

function Booklist() {
    return (
        <div className={"bookListWrapper"}>
            {books.map((book)=>{
                return (
                    <Book
                        title={book.title}
                        author={book.author}
                        coverImage={book.coverImage}
                    />
                );
            })}
        </div>
    );
}

export default Booklist;