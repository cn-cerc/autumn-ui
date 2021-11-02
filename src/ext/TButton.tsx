import React from "react";

type propsType = {
    onClick: (sender: any) => void;
}

export default class TButton extends React.Component<propsType>{

    constructor(props: propsType) {
        super(props);
    }

    render() {
        return (
            <button onClick={this.props.onClick}>
                {React.Children.map(this.props.children, (child) => child)}
            </button>
        )
    }
}