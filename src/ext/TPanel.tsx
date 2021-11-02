import React, { Children } from "react";
import TComponent from "../ui/TComponent";
import TDiv from "../ui/TDiv";

export default class TPanel extends React.Component {

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