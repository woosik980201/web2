
const scaleNames = {
    c: "섭씨",
    f: "화씨"
};

function TemperatureInput(props) {
    const handleChange = (event) => {
        props.onTemperatureChange(event.target.value);
    };

    return (
        <fieldset>
            <legend>{scaleNames[props.scale]} 온도를 입력하세요.</legend>
            <input
                value={props.temperature}
                onChange={handleChange}
            />
        </fieldset>
    );
}

export default TemperatureInput;
