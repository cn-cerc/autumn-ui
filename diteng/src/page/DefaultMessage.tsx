import { DataRow } from "autumn-ui";
import React from "react";
import Message, { messageTypeProps } from "./Message";
import styles from "./Message.css";

type DefaultMessageTypeProps = {
    code: string
} & messageTypeProps

export default class DefaultMessage extends Message<DefaultMessageTypeProps> {
    getMessage(): JSX.Element {
        let row = new DataRow();
        row.copyValues(this.props.row);
        return <div className={styles.defaultMessage}>{row.getString(this.props.code)}</div>
    }
}