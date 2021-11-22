import React from "react";
import WebControl from "./WebControl";
import styles from "./MenuItem.css";

type propsType = {
    code: string;
    name: string;
    last?: boolean;
}

export default class MenuItem extends WebControl<propsType> {

    render() {
        return (
            <span className={styles.menu}>
                <a href={this.props.code}>{this.props.name}</a>
                {!this.props.last? <i style={{"padding": "0 .25rem"}}>{`->`}</i> : ''}
            </span>
        )
    }
}