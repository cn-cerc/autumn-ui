import React from "react";
import WebControl from "./WebControl";
import './StatusBar.css'

export default class StatusBar extends WebControl {

    render() {
        return (
            <div className="statusBar">
                {React.Children.map(this.props.children, child => child)}
            </div>
        )
    }
}
