import React from "react";
import {render} from "@testing-library/react"
function MapTest() {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8];

    const listItems = numbers.map((number) =>
        <li key={number}>{number}</li>
    );

    return (
        <ul>
            {listItems}
        </ul>
    );
}

export default MapTest;
