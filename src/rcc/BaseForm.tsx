import React from "react";
import WebControl from "./WebControl";

export type BaseFormPropsType = {
    title: string;
}

export default class BaseForm<T extends BaseFormPropsType = { title: null }, S = {}> extends WebControl<T, S> {

    render() {
        document.title = this.props.title;
        return (
            <React.Fragment>
                {React.Children.map(this.props.children, item => item)}
            </React.Fragment>
        )
    }

}