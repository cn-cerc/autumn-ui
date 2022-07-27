import { DataRow } from "autumn-ui";
import React from "react";
import Message, { messageTypeProps, messageTypeState } from "./Message";
import styles from "./Message.css";

type DefaultMessageTypeProps = {
} & messageTypeProps

type DefaultMessageTypeState = {

} & messageTypeState

/** 订阅消息 */
export default class SubscribeMessage extends Message<DefaultMessageTypeProps, DefaultMessageTypeState> {
    constructor(props: DefaultMessageTypeProps) {
        super(props);
    }
    getMessage(): JSX.Element {
        let row = new DataRow();
        row.copyValues(this.props.row);
        return <React.Fragment>
            <div>
                <div className={styles.defaultMessage} dangerouslySetInnerHTML={{ __html: row.getString('Subject_') }}></div>
                <div className={styles.defaultMessage} dangerouslySetInnerHTML={{ __html: row.getString('Content_') }}></div>
            </div>
        </React.Fragment>
    }
}