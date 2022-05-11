import React, { ReactNode } from "react";
import WebControl from "./WebControl";

type propsType = {
    children?: ReactNode | undefined
}

export default class OperatePanel extends WebControl {
    constructor(props: propsType) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <div className='aui-operatePanel-main'>
                {React.Children.map(this.props.children, child => child)}
            </div>
        )
    }
}