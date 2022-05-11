import React, { ReactNode } from "react";
import WebControl from "./WebControl";

type propsType = {
    children?: ReactNode | undefined
}

export default class ToolPanel extends WebControl<propsType> {

    constructor(props: propsType) {
        super(props)
    }

    render() {
        return (
            <div className='aui-toolPanel-main'>
                {React.Children.map(this.props.children, child => child)}
            </div>
        )
    }
}

type itemPropsType = {
    title: string;
    children?: ReactNode | undefined
}

export class ToolItem extends WebControl<itemPropsType> {
    render() {
        return (
            <React.Fragment>
                <div className='aui-toolPanel-toolGroup'>
                    <div className='aui-toolPanel-toolTitle'>
                        {this.props.title}
                    </div>
                    <div className='aui-toolPanel-toolItems'>
                        {React.Children.map(this.props.children, child => child)}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}