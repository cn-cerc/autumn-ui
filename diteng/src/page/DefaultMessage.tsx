import { DataRow } from "autumn-ui";
import React from "react";
import Message, { messageTypeProps } from "./Message";
import styles from "./Message.css";

export default class DefaultMessage extends Message<messageTypeProps> {
    getMessage(): JSX.Element {
        let row = new DataRow();
        row.copyValues(this.props.row);
        return <div className={styles.defaultMessage}>{row.getString('Content_')}</div>
    }
}