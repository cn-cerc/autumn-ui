import React, { ReactNode } from "react";
import KeyValue from "../db/KeyValue";

type propsType = {
    menus: KeyValue[];
}

const divStyle = {
    padding: '0.25rem'
}

export default class MenuPath extends React.Component<propsType> {

    constructor(props: propsType) {
        super(props)
    }

    getItems(): ReactNode[] {
        let count = 1;
        let items: ReactNode[] = [];
        for (let kv of this.props.menus) {
            items.push(<span><a href={kv.key}>{kv.value}</a></span>);
            if (count < this.props.menus.length)
                items.push(<span> 》</span>)
            count++;
        }
        return items;
    }

    render() {
        return (
            <div style={divStyle}>{this.getItems().map(item => item)}</div>
        )
    }
}

