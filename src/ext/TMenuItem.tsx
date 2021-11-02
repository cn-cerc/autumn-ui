import React from "react";

type propsType = {
    id: string;
    name: string;
}

export default class TMainItem extends React.Component<propsType> {
    constructor(props: propsType) {
        super(props);
    }

    render() {
        return (
            <span className="TMainItem">
                <a href={this.props.id}>{this.props.name}</a>
            </span>
        )
    }

}