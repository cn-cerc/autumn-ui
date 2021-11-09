import React from "react";
import WebControl from "./WebControl";
import styles from "./MenuItem.css";

type propsType = {
    code: string;
    name: string;
}

export default class MenuItem extends WebControl<propsType> {

    render() {
        return (
            <span className={styles.menu}>
                <a href={this.props.code}>{this.props.name}</a>
            </span>
        )
    }
}