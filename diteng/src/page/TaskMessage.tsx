import { DataRow } from "autumn-ui";
import React from "react";
import Message, { messageTypeProps } from "./Message";
import styles from "./Message.css";

type TaskMessageTypeProps = {
    systemMsg?: boolean,
} & messageTypeProps

type TaskMessageTypeState = {

}

export default class TaskMessage extends Message<TaskMessageTypeProps, TaskMessageTypeState> {
    constructor(props: TaskMessageTypeProps) {
        super(props);
    }

    getMessage(): JSX.Element {
        let row = new DataRow();
        row.copyValues(this.props.row);
        return <div className={`${styles.TaskMessage, styles.defaultMessage}`}>
            <div dangerouslySetInnerHTML={{ __html: this.props.row.getString('Subject_') }}></div>
            <div dangerouslySetInnerHTML={{ __html: JSON.parse(JSON.parse(this.props.row.getString('Content_')).dataOut).head._message_ }}></div>
        </div>
    }
}