function MyButton() {
    // 전역변수로 이미 존재하는 React 객체에서 useState를 사용한다.
    const [isClicked, setIsClicked] = React.useState(false);

    // button 요소를 반환한다.
    return React.createElement(
        'button',
        {
            onClick: () => setIsClicked(!isClicked)
        },
        isClicked ? 'Clicked' : 'Click here'
    );
}


// index.html에 있는 <div id="root"></div> 요소 객체를 가져와
// domContainer 변수에 저장
const domContainer = document.querySelector('#root');


// ReactDOM 객체에 루트 요소 객체를 생성
const root = ReactDOM.createRoot(domContainer);


// MyButton 컴포넌트를 화면에 렌더링
root.render(React.createElement(MyButton));