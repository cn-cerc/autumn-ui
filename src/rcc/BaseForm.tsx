import React from "react";
import TControl from "./Control";

export type BaseFormPropsType = {
    title: string;
}

export default class BaseForm<T extends BaseFormPropsType = { title: null }, S = {}> extends TControl<T, S> {

    render() {
        document.title = this.props.title;
        return (
            <React.Fragment>
                {React.Children.map(this.props.children, item => item)}
            </React.Fragment>
        )
    }

}