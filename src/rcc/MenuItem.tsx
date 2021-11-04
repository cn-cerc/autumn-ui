import React from "react";
import TControl from "./Control";

type propsType = {
    code: string;
    name: string;
}

export default class MenuItem extends TControl<propsType> {

    render() {
        return (
            <div>
                <span>
                    <a href={this.props.code}>{this.props.name}</a>
                </span>
            </div>
        )
    }
}