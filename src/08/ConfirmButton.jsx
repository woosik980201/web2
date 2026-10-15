import React from "react";

class ConfirmButton extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            isConfirmed: false,
        };

        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }
    handleConfirm(){
        this.setState((prevState)=>({
            isConfirmed: !prevState.isConfirmed,
        }
        ));
    }
    handleReset() {
        this.setState({
            isConfirmed: false,
        });
    }
    render() {
        return (
            <div>
            <button
                onClick={this.handleConfirm}
                disabled={this.state.isConfirmed}
            >
                {this.state.isConfirmed ? "확인됨" : "확인하기"}
            </button>

        <button
            onClick={this.handleReset}
            >
            초기화
        </button>
            </div>
        );
    }
}
export default ConfirmButton;