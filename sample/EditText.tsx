import React from "react";

type PropsType = {
    label: string;
}

export default class EditText extends React.Component<PropsType> {

    render() {
        return (
            <div>{this.props.label}<a type="input" /></div>
        )
    }
}