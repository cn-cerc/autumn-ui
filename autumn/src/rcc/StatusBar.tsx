import React from "react";
import WebControl from "./WebControl";

export default class StatusBar extends WebControl {

    render() {
        return (
            <div className="aui-clearBoth">
                {React.Children.map(this.props.children, child => child)}
            </div>
        )
    }
}
