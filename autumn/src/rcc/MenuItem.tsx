import React, { ReactNode } from "react";
import WebControl from "./WebControl";

type propsType = {
    code: string;
    name: string;
    last?: boolean;
    children?: ReactNode | undefined
}

export default class MenuItem extends WebControl<propsType> {

    render() {
        return (
            <span className='aui-menuItem-main'>
                <a href={this.props.code}>{this.props.name}</a>
                {!this.props.last? <i style={{"padding": "0 .25rem"}}>{`->`}</i> : ''}
            </span>
        )
    }
}