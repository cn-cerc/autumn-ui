import React from "react";

type propsType = {
    id: string;
    name: string;
}

export default class MenuItem extends React.Component<propsType> {
    constructor(props: propsType) {
        super(props);
    }

    render() {
        return (
            <span className="menuItem">
                <a href={this.props.id}>{this.props.name}</a>
            </span>
        )
    }

}