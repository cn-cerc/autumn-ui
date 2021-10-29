import React from "react";

type PropsType = {
    label: string;
    value?: string;
}

export default class EditText extends React.Component<PropsType> {

    render() {
        return (
            <div>{this.props.label}
                <input type="input" value={this.props.value} />
            </div>
        )
    }
}