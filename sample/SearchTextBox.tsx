import React, { MouseEventHandler } from "react";
import EditText from "./EditText";

type PropsType = {
    label: string;
    defaultValue?: string;
    onChanged?: (value: string) => void;
}

type StateType = {
    value: string;
}

export default class SearchTextBox extends React.Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            value: props.defaultValue ? props.defaultValue : ""
        }
    }

    render() {
        return (
            <div>
                <div>{this.props.label}
                    <input type="input" value={this.state.value} onChange={this.changeValue} />
                    <button id="btnSearch" onClick={this.onClick}>搜索</button>
                </div>
            </div>
        )
    }

    onClick = (el: Object) => {
        if (this.props.onChanged != undefined)
            this.props.onChanged(this.state.value);
    }

    changeValue = (event: any) => {
        let text = event.target.value;
        this.setState({ value: text })
    }

}