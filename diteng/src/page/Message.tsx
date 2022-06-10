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
        // let _html: any = this.getMessage();
        // let mvClassJson:any;
        // switch (this.props.mvClass) {
        //     case 'MVDefault': // 默认类 正常展示
        //         _html = this.getMessage();
        //         break;
        //     case 'MVNotice': // 通知类别 下方需要显示操作 已读 未读
        //             mvClassJson = this.getMessage().props.children;
        //             if(mvClassJson == null){
        //                 mvClassJson = '';
        //             }
        //         _html = <div className={`${_html.props.className}`}>
        //             <div dangerouslySetInnerHTML={{ __html: `${_html.props.children.Subject_}` }}></div>
        //             <div dangerouslySetInnerHTML={{ __html: `${_html.props.children.Content}` }}></div>
        //             <div className={styles.specialMsg}>
        //                 <button className={styles.agreeBtn} onClick={this.readMsgFun.bind(this,_html.props.children.UID_)}>已读</button>
        //             </div>
        //         </div>
        //         break;
        //     case 'MVWorkflow': // 签核类别 下方显示操作 同意，不同意，详情
        //         _html = <div className={`${_html.props.className}`}>
        //             <div dangerouslySetInnerHTML={{ __html: `${_html.props.children.Subject_}` }}></div>
        //             <div dangerouslySetInnerHTML={{ __html: `${_html.props.children.Content}` }}></div>
        //             <div className={styles.specialMsg}>
        //                 <button className={styles.agreeBtn} onClick={this.agreeFun.bind(this,_html.props.children.UID_)}>同意</button>
        //                 <button className={styles.noAgreeBtn} onClick={this.agreeFun.bind(this,_html.props.children.UID_)}>不同意</button>
        //                 {/* <button>详情</button> */}
        //             </div>
        //         </div>
        //         break;
        //     case 'MVTask': // 任务类别 显示出任务状态
        //         _html = <div className={`${_html.props.className}`}>
        //                 <div dangerouslySetInnerHTML={{ __html: `${_html.props.children.Subject_}` }}></div>
        //                 <div dangerouslySetInnerHTML={{ __html: `${_html.props.children.Content.dataOut._message_}` }}></div>
        //                 <div className={styles.specialMsg}>
        //                     <span>{_html.props.children.process==4?'完成':'任务进行中...'}</span>
        //                 </div>
        //             </div>
        //         break;
        //     case 'MVExport': // 导出消息 显示出导出状态
        //             _html = <div className={`${_html.props.className}`}>
        //                     <div dangerouslySetInnerHTML={{ __html: `${_html.props.children.Subject_}` }}></div>
        //                     <div dangerouslySetInnerHTML={{ __html: `${_html.props.children.Content.dataOut._message_}` }}></div>
        //                     <div className={styles.specialMsg}>
        //                         <span>{_html.props.children.process==4?'完成':'任务进行中...'}</span>
        //                     </div>
        //                 </div>
        //         break;
        //     default:
        //         if(this.props.mvClass == '' && this.getMessage().props.children){
        //             mvClassJson = this.getMessage().props.children;
        //             try {
        //                 mvClassJson = JSON.parse(this.getMessage().props.children);
        //                 if(typeof mvClassJson == 'object'){
        //                     mvClassJson = JSON.parse(JSON.parse(this.getMessage().props.children).dataIn).head._subject_;
        //                 }
        //             } catch(e) {
        //                 mvClassJson = this.getMessage().props.children;
        //             }
        //         }
        //         _html = <div className={`${_html.props.className}`}>
        //             <div dangerouslySetInnerHTML={{ __html: `${mvClassJson}` }}></div>
        //         </div>
        //         break;
        // }

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