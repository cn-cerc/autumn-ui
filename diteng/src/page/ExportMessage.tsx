import { DataRow } from "autumn-ui";
import React from "react";
import Message, { messageTypeProps } from "./Message";
import styles from "./Message.css";

type ExportMessageTypeProps = {
} & messageTypeProps

type ExportMessageTypeState = {

}

/** 导出消息 */
export default class ExportMessage extends Message<ExportMessageTypeProps, ExportMessageTypeState> {
    private exportProcess = ['中止执行', '等待导出', '正在导出', '导出成功', '执行失败', '下载完成']
    constructor(props: ExportMessageTypeProps) {
        super(props);
    }
    getMessage(): JSX.Element {
        let row = new DataRow();
        row.copyValues(this.props.row);
        let process = row.getDouble('Process_');
        let content = '';
        if(process == 3 || process == 5) {
            content = row.getString('Content_')
        } else if(process == 4) {
            content = '导出失败，请联系客服'
        } else {
            content = this.exportProcess[process]
        }
        return <div className={`${styles.signMessage, styles.defaultMessage}`}>
            <div dangerouslySetInnerHTML={{ __html: row.getString('Subject_') }}></div>
            <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
    }
}