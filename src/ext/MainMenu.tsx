import React from "react";
import './MainMenu.css';

export default class MainMenu extends React.Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <span className="mainMenu">
                {React.Children.map(this.props.children, (child, index) => {
                    return child;
                })}
            </span>
        )
    }

}