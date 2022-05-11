import React, { ReactNode } from "react";

type propsType = {
    onClick: (sender: any) => void;
    children?: ReactNode | undefined
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