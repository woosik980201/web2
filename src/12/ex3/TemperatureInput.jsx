
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
            <legend>
                {scaleNames[props.scale]} 온도 입력
            </legend>

            <input
                value={props.temperature}
                onChange={handleChange}
            />
        </fieldset>
    );
}

export default TemperatureInput;
