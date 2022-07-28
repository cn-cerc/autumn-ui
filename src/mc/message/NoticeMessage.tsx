import React from "react";
import Message, { messageTypeProps, messageTypeState } from "./Message";
import styles from "./Message.css";

type DefaultMessageTypeProps = {
} & messageTypeProps

type DefaultMessageTypeState = {

} & messageTypeState

/** 需确认消息 */
export default class DefaultMessage extends Message<DefaultMessageTypeProps,DefaultMessageTypeState> {
    constructor(props: DefaultMessageTypeProps) {
        super(props);
    }
    getMessage(): JSX.Element {
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