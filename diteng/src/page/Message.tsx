import { DataRow } from "autumn-ui";
import React from "react";
import styles from "./Message.css"

export type messageTypeProps = {
    row: DataRow;
    hideName?: boolean;
    name: string,
    siteR?: boolean,
    systemMsg?: boolean,
    msgStatus?: string,
    mvClass?: string
}

export default abstract class Message<T extends messageTypeProps = messageTypeProps, S = {}> extends React.Component<T, S> {
    constructor(props: T) {
        super(props);
    }

    render(): React.ReactNode {
        return <div className={`${styles.main} ${this.props.siteR ? styles.msgRight : styles.msgLeft}`}>
            <div className={styles.imageBox}>{this.props.name.substring(this.props.name.length - 2)}</div>
            <div className={styles.message}>
                {this.getName()}
                {this.getMessage()}
                {this.props.siteR ? this.getReadMsg() : ''}
            </div>
        </div>
    }
    //获取自己的名称HTML
    getName() {
        if (!this.props.hideName)
            return <div style={{ 'paddingBottom': '3px' }}>{this.props.name}</div>
    }
    //标记是否已读
    getReadMsg() {
        return <div style={{ marginTop: '4px' }}>
            <span className={styles.msgStatus}>{this.props.msgStatus == '1' ? '已读' : '未读'}</span>
        </div>
    }
    // 同意按钮
    agreeFun(){
        
    }
    //已读按钮
    readMsgFun(){
        
    }
    abstract getMessage(): JSX.Element;
}