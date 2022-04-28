import React from "react";

export default class TChildForm extends React.Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="TChildForm">
                {React.Children.map(this.props.children, (child, index) => {
                    return child;
                })}
            </div>
        )
    }

}