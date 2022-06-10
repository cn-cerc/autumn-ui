import { DataRow } from "autumn-ui";
import React from "react";
import Message, { messageTypeProps } from "./Message";
import styles from "./Message.css";

type ExportMessageTypeProps = {
} & messageTypeProps

type ExportMessageTypeState = {

}

export default class ExportMessage extends Message<ExportMessageTypeProps, ExportMessageTypeState> {
    constructor(props: ExportMessageTypeProps) {
        super(props);
    }

    getMessage(): JSX.Element {
        let row = new DataRow();
        row.copyValues(this.props.row);
        return <div className={`${styles.signMessage, styles.defaultMessage}`}>
            <div dangerouslySetInnerHTML={{ __html: this.props.row.getString('Subject_') }}></div>
        </div>
    }
}