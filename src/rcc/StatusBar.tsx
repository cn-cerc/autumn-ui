import React from "react";
import TControl from "./Control";
import './StatusBar.css'

export default class StatusBar extends TControl {

    render() {
        return (
            <div className="statusBar">
                {React.Children.map(this.props.children, child => child)}
            </div>
        )
    }
}
