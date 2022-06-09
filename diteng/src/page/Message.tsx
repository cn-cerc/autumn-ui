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
        let _html: any = this.getMessage();
        // if(this.props.mvClass){
        // _html = <div className={`${_html.props.className}`}>
        //     <div dangerouslySetInnerHTML={{ __html: `${_html.props.children}` }}></div>
        //     <div className={styles.specialMsg}>
        //         <button className={styles.rejectBtn}>拒收</button>
        //         <button>确认收货</button>
        //     </div>
        // </div>
        // }
        if(this.props.systemMsg){ //将后端返回的特殊消息 HTML字符串 转译成HTML输出
            _html = <div dangerouslySetInnerHTML={{__html:`${_html.props.children}`}} className={`${_html.props.className}`}></div>
        }else{
            _html = this.getMessage()
        }
        return <div className={`${styles.main} ${this.props.siteR ? styles.msgRight : styles.msgLeft}`}>
            <div className={styles.imageBox}>{this.props.name.substring(this.props.name.length - 2)}</div>
            <div className={styles.message}>
                {this.getName()}
                {_html}
                {this.props.siteR ? this.getReadMsg() : ''}
            </div>
        </div>
    }

    getName() {
        if (!this.props.hideName)
            return <div style={{ 'paddingBottom': '3px' }}>{this.props.name}</div>
    }
    getReadMsg() {
        return <div style={{marginTop:'4px'}}>
            <span className={styles.msgStatus}>{this.props.msgStatus == '1' ? '已读' : '未读'}</span>
        </div>
    }
    abstract getMessage(): JSX.Element;
}