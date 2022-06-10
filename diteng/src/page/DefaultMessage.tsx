import { DataRow } from "autumn-ui";
import React from "react";
import Message, { messageTypeProps } from "./Message";
import styles from "./Message.css";

type DefaultMessageTypeProps = {
} & messageTypeProps

type DefaultMessageTypeState = {

}

export default class DefaultMessage extends Message<DefaultMessageTypeProps,DefaultMessageTypeState> {
    constructor(props: DefaultMessageTypeProps) {
        super(props);
    }
    getMessage(): JSX.Element {
        let row = new DataRow();
        row.copyValues(this.props.row);
        return <div className={styles.defaultMessage}>{row.getString('Content_')}</div>
    }
}