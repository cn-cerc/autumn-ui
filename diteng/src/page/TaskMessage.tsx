import { DataRow } from "autumn-ui";
import React from "react";
import Message, { messageTypeProps } from "./Message";
import styles from "./Message.css";

type TaskMessageTypeProps = {
    systemMsg?: boolean,
} & messageTypeProps

type TaskMessageTypeState = {

}

/** 任务类型消息 */
export default class TaskMessage extends Message<TaskMessageTypeProps, TaskMessageTypeState> {
    private taskProcess = ['中止执行', '排队中', '正在执行中', '执行成功', '执行失败', '下载完成']
    constructor(props: TaskMessageTypeProps) {
        super(props);
    }

    getMessage(): JSX.Element {
        let row = new DataRow();
        row.copyValues(this.props.row);
        let task = JSON.parse(row.getString('Content_'));
        return <div className={`${styles.TaskMessage, styles.defaultMessage}`}>
            <div dangerouslySetInnerHTML={{ __html: this.props.row.getString('Subject_') }}></div>
            <div>
                <span>预约时间:</span>
                <span>{task.timer == 'null' ? '立即执行' : task.timer}</span>
            </div>
            <div>
                <span>任务状态:</span>
                <span>{this.taskProcess[row.getDouble('Process_')]}</span>
            </div>
            <div>
                <span>处理时间:</span>
                <span>{task.processTime}</span>
            </div>
            {this.getResult(row)}
            <div>
                <span>任务代码:</span>
                <span>{task.service}</span>
            </div>
            <div>
                <span>调用参数:</span>
                <span>{task.dataIn || '（空）'}</span>
            </div>
        </div>
    }

    getResult(row: DataRow) {
        if (row.getDouble('Process_') < 3) {
            let task = JSON.parse(row.getString('Content_'));
            let data = JSON.parse(task.dataOut);
            return <div>
                <span>执行结果:</span>
                <span>{`${data?.head?.msg || ''}${data?.head?._message_ || ''}` || '(空)'}</span>
            </div>
        }
    }
}