import React from "react";

export default class Panel extends React.Component {

    constructor(props: any = null) {
        super(props);
    }

    render() {
        return (
            <div className="TPanel">
                {React.Children.map(this.props.children, (child, index) => {
                    return child;
                })}
            </div>
        )
    }

}