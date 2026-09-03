import React from "react";
import Book from "./Book";
import "./Book.css";

function Library(props) {
    return (
        <div className="library">

            <div className="library-header">
                <p>DEVELOPMENT ARCHIVE / 2026</p>
                <h1>SELECTED BOOKS</h1>
            </div>

            <div className="library-container">
                <Book
                    name="처음 만난 파이썬"
                    numOfPage={300}
                    imgUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMaIQ3KumWiEo3vwW_-8OOY1yeiifn79OHg-XtZOo7VQ&s=10"
                />

                <Book
                    name="난생 처음 AWS"
                    numOfPage={400}
                    imgUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiSLLxecjcdZPjhhyZeo_k0P90o-_u4SVdy7swx9UtSg&s=10"
                />

                <Book
                    name="처음 만난 리액트"
                    numOfPage={500}
                    imgUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh8GieFzlG7PRPOyNyiJ_UBFamfwH4ItLPi-yFN58M0w&s=10"
                />

                <Book
                    name="처음 만난 자바스크립트"
                    numOfPage={250}
                    imgUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-3EzXxtbQ_3gK9I-c8-21Kn1Yp-TSVBcXDsnueaxYJw&s"
                />

                <Book
                    name="처음 만난 HTML/CSS"
                    numOfPage={180}
                    imgUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQn6FDgeoWbQyI_rXbgFjQtalgeq1OaBnFtyhjZlrw6w&s"
                />
            </div>

        </div>
    );
}

export default Library;