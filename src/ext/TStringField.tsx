import React from "react";

type propsType = {
    code: string;
    name: string;
}

export default class TStringField extends React.Component<propsType> {
    constructor(props: propsType) {
        super(props);
    }

    render() {
        return (
            <div className="TStringField">
                {React.Children.map(this.props.children, (child, index) => {
                    return child;
                })}
            </div>
        )
    }

}