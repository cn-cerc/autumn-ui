import { DataRow } from "autumn-ui";
import React from "react";
import Message, { messageTypeProps, messageTypeState } from "./Message";
import styles from "./Message.css";

type SignMessageTypeProps = {
    systemMsg?: boolean,
} & messageTypeProps

type SignMessageTypeState = {

} & messageTypeState

export default class SignMessage extends Message<SignMessageTypeProps, SignMessageTypeState> {
    constructor(props: SignMessageTypeProps) {
        super(props);
    }

    getMessage(): JSX.Element {
        let row = new DataRow();
        row.copyValues(this.props.row);
        return <div className={`${styles.signMessage, styles.defaultMessage}`}>
            <div dangerouslySetInnerHTML={{ __html: this.props.row.getString('Subject_') }}></div>
            <div dangerouslySetInnerHTML={{ __html: this.props.row.getString('Content_') }}></div>
            <div className={styles.specialMsg}>
                {/*  Final_ 状态待完善 */}
                <button className={this.props.row.getDouble('Final_')==0?styles.disEvents:''}>确认</button>
            </div>
        </div>
    }
}