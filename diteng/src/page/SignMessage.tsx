import { DataRow } from "autumn-ui";
import React from "react";
import Message, { messageTypeProps } from "./Message";
import styles from "./Message.css";

type SignMessageTypeProps = {
} & messageTypeProps

type SignMessageTypeState = {

}

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
                <button>确认</button>
                {/* <button>不同意</button> */}
            </div>
        </div>
    }
}