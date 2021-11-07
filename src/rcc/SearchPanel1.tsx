import React from "react";
import DataSource from "../db/DataSource";

type propsType = {
    dataSource: DataSource;
}

export default class TSearchPanel extends React.Component<propsType> {
    constructor(props: propsType) {
        super(props);
    }

    render() {
        return (
            <div className="TSearchPanel">
                {React.Children.map(this.props.children, (child, index) => {
                    return child;
                })}
            </div>
        )
    }

}