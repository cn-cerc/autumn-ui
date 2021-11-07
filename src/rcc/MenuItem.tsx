import React from "react";
import WebControl from "./WebControl";

type propsType = {
    code: string;
    name: string;
}

export default class MenuItem extends WebControl<propsType> {

    render() {
        return (
            <span>
                <a href={this.props.code}>{this.props.name}</a>
            </span>
        )
    }
}