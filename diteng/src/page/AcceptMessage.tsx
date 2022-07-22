import { DataRow, DBEdit } from "autumn-ui";
import React from "react";
import Message, { messageTypeProps, messageTypeState } from "./Message";
import styles from "./Message.css";
import PageApi from "./PageApi";

type TypeProps = {
} & messageTypeProps

type TypeState = {
    messageData: DataRow,
    status: number,
    remark: string,
    errorMessage: string
} & messageTypeState
enum MessageStatus {
    未接受, 已接受, 已拒绝
}

/** 需确认消息 */
export default class AcceptMessage extends Message<TypeProps, TypeState> {
    constructor(props: TypeProps) {
        super(props);
        this.state = {
            messageData: new DataRow().setJson(props.row.getString('Content_')),
            status: props.row.getNumber('Status_'),
            remark: '',
            errorMessage: ''
        }
    }

    // 同意按钮
    async agreeFun() {
        let dataIn = new DataRow();
        dataIn.setValue('uid', this.props.row.getString('UID_'));
        dataIn.setValue('remark', this.state.messageData.getString('remark'));
        dataIn.setValue('status', MessageStatus.已接受);
        let dataOut = await PageApi.acknowledge(this.state.messageData.getString('serviceCode'), dataIn);
        this.setState({ ...this.state, errorMessage: dataOut.state <= 0 ? dataOut.message : '' })
        this.reload();
    }

    // 拒绝
    async rejected() {
        let dataIn = new DataRow();
        dataIn.setValue('uid', this.props.row.getString('UID_'));
        dataIn.setValue('remark', this.state.messageData.getString('remark'));
        dataIn.setValue('status', MessageStatus.已拒绝);
        let dataOut = await PageApi.acknowledge(this.state.messageData.getString('serviceCode'), dataIn);
        this.setState({ ...this.state, errorMessage: dataOut.state <= 0 ? dataOut.message : '' })
        this.reload();
    }

    getMessage(): JSX.Element {
        let opera, remark;
        if (this.state.messageData.getDouble('status') == 0) {
            opera = <React.Fragment>
                <a href={this.state.messageData.getString('detailUrl')}>详情</a>
                {this.getButton()}
            </React.Fragment>
            remark = <DBEdit dataField='remark' dataRow={this.state.messageData}></DBEdit>;
        } else {
            opera = <React.Fragment>
                <a href={this.state.messageData.getString('detailUrl')}>详情</a>
                <span style={{ 'marginLeft': '16px' }}>{MessageStatus[this.state.messageData.getDouble('status')]}</span>
            </React.Fragment>
            remark = <span>{this.state.messageData.getString('remark')}</span>
        }
        return <div className={`${styles.signMessage, styles.defaultMessage}`}>
            <div dangerouslySetInnerHTML={{ __html: this.props.row.getString('Subject_') }}></div>
            <div dangerouslySetInnerHTML={{ __html: this.state.messageData.getString('content') }}></div>
            {this.props.isSelf ? '' : <div>备注：{remark} </div>}
            {this.state.errorMessage ? <span style={{ color: 'red' }}>{this.state.errorMessage}</span> : ''}
            <div className={styles.specialMsg}>
                {opera}
            </div>
        </div>
    }

    getButton() {
        if (!this.props.isSelf)
            return <React.Fragment>
                <button onClick={this.agreeFun.bind(this)}>接受</button>
                <button onClick={this.rejected.bind(this)} hidden={!this.state.messageData.getBoolean('showRejected')}>拒绝</button>
            </React.Fragment>
    }
}