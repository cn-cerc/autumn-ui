import React from "react";
import WebControl from "./WebControl";
import styles from "./OperatePanel.css";

type propsType = {
}

export default class OperatePanel extends WebControl {
    constructor(props: propsType) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <div className={styles.main}>
                {React.Children.map(this.props.children, child => child)}
            </div>
        )
    }
}