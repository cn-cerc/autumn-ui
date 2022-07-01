import { DataRow } from "autumn-ui";
import React from "react";
import Message, { messageTypeProps } from "./Message";
import styles from "./Message.css";

export default class ImageMessage extends Message<messageTypeProps> {
    constructor(props: messageTypeProps) {
        super(props);
    }
    getMessage(): JSX.Element {
        let row = new DataRow();
        row.copyValues(this.props.row);
        return <div className={styles.imageMessage}><img src={row.getString('Content_')}/></div>
    }
}