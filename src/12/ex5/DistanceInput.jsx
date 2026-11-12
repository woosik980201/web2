
const scaleNames = {
    km: "킬로미터",
    mi: "마일"
};

function DistanceInput(props) {
    const handleChange = (event) => {
        props.onDistanceChange(event.target.value);
    };

    return (
        <div className="distance-input">
            <label>{scaleNames[props.scale]} 입력:</label>
            <input
                type="number"
                value={props.distance}
                onChange={handleChange}
            />
        </div>
    );
}

export default DistanceInput;
