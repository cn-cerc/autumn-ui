import React from "react";
import './TMainMenu.css';

export default class TMainMenu extends React.Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="TMainMenu">
                {React.Children.map(this.props.children, (child, index) => {
                    return child;
                })}
            </div>
        )
    }

}