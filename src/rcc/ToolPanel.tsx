import React from "react";
import TControl from "./Control";

type propsType = {
}

export default class ToolPanel extends TControl<propsType> {

    constructor(props: propsType) {
        super(props)
    }

    render() {
        return (
            <div className='toolPanel'>
                {React.Children.map(this.props.children, child => child)}
            </div>
        )
    }
}

type itemPropsType = {
    title: string;
}

export class ToolItem extends TControl<itemPropsType> {

    render() {
        return (
            <React.Fragment>
                <div className='toolGroup'>
                    {this.props.title}
                </div>
                <div className='toolItem'>
                    {React.Children.map(this.props.children, child => child)}
                </div>
            </React.Fragment>
        )
    }
}