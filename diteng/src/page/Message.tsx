import { DataRow } from "autumn-ui";
import React from "react";
import styles from "./Message.css"

export type messageTypeState = {
    showReport?: boolean
}

export type messageTypeProps = {
    row: DataRow;
    hideName?: boolean;
    name: string,
    siteR?: boolean,
    systemMsg?: boolean,
    msgStatus?: string,
    mvClass?: string
    time?: string,
    reloadMessage?: Function
}

export default abstract class Message<T extends messageTypeProps = messageTypeProps, S extends messageTypeState = messageTypeState> extends React.Component<T, S> {
    state = {
        showReport: false
    } as S
    private touchEvent: any = null;
    constructor(props: T) {
        super(props);
    }

    render(): React.ReactNode {
        return <div className={`${styles.main} ${this.props.siteR ? styles.msgRight : styles.msgLeft}`}>
            <div className={styles.personBox}>
                <div className={styles.imageBox}>{this.props.name == '系统消息' ? '系统' : this.props.name.substring(this.props.name.length - 2)}</div>
                <div className={styles.person}>
                    <div>{this.props.name}</div>
                    <div style={{ 'paddingTop': '6px' }}>{this.props.time}</div>
                </div>
            </div>
            <div className={styles.message}>
                <div className={styles.messageBox} onTouchStart={this.handleTouchStart.bind(this)} onTouchEnd={this.handleClear.bind(this)} onTouchMove={this.handleClear.bind(this)} onMouseDown={this.handleTouchStart.bind(this)} onMouseMove={this.handleClear.bind(this)} onMouseUp={this.handleClear.bind(this)}>
                    {this.getMessage()}
                </div>
                {this.props.siteR ? this.getReadMsg() : ''}
            </div>
            {this.getToastBox()}
        </div>
    }

    getToastBox() {
        if (this.state.showReport)
            return <div className={styles.toastBox}>
                <div className={styles.toast}>
                    <p>是否举报该条消息</p>
                    <div>
                        <button>取消</button>
                        <button>确定</button>
                    </div>
                </div>
            </div>
    }

    handleTouchStart() {
        this.touchEvent = setTimeout(() => {
            this.touchEvent = 0;
            this.setState({
                showReport: true
            })
        }, 500);
    }

    handleClear() {
        clearTimeout(this.touchEvent);
        this.touchEvent = null;
    }

    //标记是否已读
    getReadMsg() {
        return <div style={{ marginTop: '4px', 'lineHeight': '1em' }}>
            <span className={styles.msgStatus}>{this.props.msgStatus == '1' ? '已读' : '未读'}</span>
        </div>
    }

    // 同意按钮
    agreeFun() {

    }

    //已读按钮
    readMsgFun() {

    }

    //刷新当前消息数据
    reload() {
        this.props.reloadMessage();
    }

    abstract getMessage(): JSX.Element;
}