import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import DitengApi from "../api/DitengApi";
import ImageConfig from "../static/ImageConfig";
import StaticFile from "../static/StaticFile";
import { showMsg } from "../tool/Summer";
import Utils from "../tool/Utils";
import { timing } from "./FrmMessage";
import styles from "./FrmMessage.css";
import AcceptMessage from "./message/AcceptMessage";
import DefaultMessage from "./message/DefaultMessage";
import ExportMessage from "./message/ExportMessage";
import ImageMessage from "./message/ImageMessage";
import NoticeMessage from "./message/NoticeMessage";
import SignMessage from "./message/SignMessage";
import SubscribeMessage from "./message/SubscribeMessage";
import TaskMessage from "./message/TaskMessage";

type FrmMessageDetailsTypeProps = {
    fromUser: string,
    name: string,
    userCode: string,
    userName: string
}

type FrmMessageDetailsTypeState = {
    messageData: DataSet,
    hasHistory: boolean,
    lastMessageId: string,
    remarkText: string,
    remarkText_: string,
    messageText: string,
    quicReplyList: Array<{ text: string, uid: string }>,
    formBottom: number,
    timing: number,
}

export default class FrmMessageDetails extends WebControl<FrmMessageDetailsTypeProps, FrmMessageDetailsTypeState> {
    private timer: any = null;
    constructor(props: FrmMessageDetailsTypeProps) {
        super(props);
        this.state = {
            timing: timing,
            messageData: new DataSet(),
            hasHistory: true,
            lastMessageId: '',
            messageText: '',        //需要发送的消息
            quicReplyList: [],      // 快捷发送列表
            remarkText: '',
            remarkText_: '',
            formBottom: 0,
        }
    }

    componentDidMount(): void {
        this.getFirstMessageData();
        this.getUserInfo();
        this.startTimer();
        let remarkDOM = document.querySelector('#remark') as HTMLTextAreaElement;
        remarkDOM.addEventListener('input', this.changeRemark.bind(this));
        let saveBtn = document.querySelector('#saveBtn') as HTMLButtonElement;
        saveBtn.addEventListener('click', this.setUserRemarkFun.bind(this));
        document.querySelectorAll('.quickReply').forEach((dom) => {
            dom.addEventListener('click', this.quicReplySend.bind(this))
        })
    }

    changeRemark() {
        let textarea = event.target as HTMLTextAreaElement;
        let val = encodeURIComponent(textarea.value);
        let saveBtn = document.querySelector('#saveBtn') as HTMLButtonElement;
        if (this.state.remarkText_ == val) {
            saveBtn.classList.remove('change');
        } else {
            saveBtn.classList.add('change');
        }
        this.setState({
            remarkText: val
        });
    }


    async getUserInfo() {
        let remarkText = await this.getUserRemarkFun();
        let contactInfo = await this.fromDetailFun();
        let remark1 = this.state.remarkText || remarkText;
        let userName = document.querySelector('#userName') as HTMLSpanElement;
        userName.innerHTML = this.props.name;
        let belong = document.querySelector("#belong") as HTMLSpanElement;
        belong.innerHTML = contactInfo.getString('RoleName_');
        let contact = document.querySelector('#contact') as HTMLSpanElement;
        contact.innerHTML = contactInfo.getString('Mobile_');
        let remark = document.querySelector('#remark') as HTMLTextAreaElement;
        remark.value = decodeURIComponent(this.state.remarkText);
        let remarkDOM = document.querySelector('#remark') as HTMLTextAreaElement;
        remarkDOM.value = decodeURIComponent(remark1);
        this.setState({
            remarkText: remark1
        })
    }

    //获取备注信息
    async getUserRemarkFun() {
        let row = new DataRow();
        row.setValue('UserCode_', this.props.fromUser)
        let dataOut = await DitengApi.getUserRemark(row);
        if (this.closeServerFun(dataOut.state)) {
            return;
        }
        let ds = new DataSet();
        ds.appendDataSet(dataOut);
        ds.first();
        let remarkText = '';
        while (ds.fetch()) {
            if (ds.getString('remark_')) {
                remarkText = ds.getString('remark_')
            }
        }
        return remarkText
    }

    //获取对方资料
    async fromDetailFun() {
        let contactInfo = new DataSet();
        if (this.props.fromUser) {
            let row = new DataRow();
            row.setValue('FromUser_', this.props.fromUser);
            contactInfo = await DitengApi.fromDetail(row);
        } else {
            contactInfo.append().setValue('RoleName_', '系统').setValue('Mobile_', '暂无');
        }
        return contactInfo;
    }

    //设置备注信息
    async setUserRemarkFun() {
        if (this.state.remarkText != this.state.remarkText_) {
            let row = new DataRow();
            row.setValue('UserCode_', this.props.fromUser).setValue('Remark_', this.state.remarkText);
            let dataOut = await DitengApi.setUserRemark(row);
            if (dataOut.state < 0) {
                showMsg(dataOut.message);
            } else {
                this.setState({
                    remarkText_: this.state.remarkText
                });
                let saveBtn = document.querySelector('#saveBtn') as HTMLButtonElement;
                saveBtn.classList.remove('change');
            }
        }
    }

    componentWillUnmount(): void {
        clearInterval(this.timer);
    }

    async getFirstMessageData() {
        let row = new DataRow();
        row.setValue('FromUser_', this.props.fromUser);
        let messageData = new DataSet();
        let ds = await DitengApi.getMessageDetails(row);
        if (this.closeServerFun(ds.state)) {
            return;
        }
        messageData.appendDataSet(this.state.messageData);
        ds.first();
        while (ds.fetch()) {
            if (messageData.locate('UID_', ds.getString('UID_'))) {
                messageData.copyRecord(ds.current);
            } else {
                messageData.append();
                messageData.copyRecord(ds.current);
            }
        }
        if (messageData.size > 1)
            messageData.setSort('UID_');
        messageData.first();
        this.setState({
            messageData,
            lastMessageId: messageData.getString('UID_')
        }, () => {
            this.initMessageScroll();
        })
    }

    async getMessageData() {
        let row = new DataRow();
        row.setValue('FromUser_', this.props.fromUser);
        if (this.state.lastMessageId)
            row.setValue('offset', this.state.lastMessageId);
        let messageData = new DataSet();
        let ds = await DitengApi.getMessageDetails(row);
        if (this.closeServerFun(ds.state)) {
            return;
        }
        messageData.appendDataSet(this.state.messageData);
        ds.first();
        while (ds.fetch()) {
            if (messageData.locate('UID_', ds.getString('UID_'))) {
                messageData.copyRecord(ds.current);
            } else {
                messageData.append();
                messageData.copyRecord(ds.current);
            }
        }
        if (messageData.size > 1)
            messageData.setSort('UID_');
        messageData.first();
        this.setState({
            messageData,
            lastMessageId: messageData.getString('UID_')
        }, () => {
            this.initMessageScroll();
        })
    }

    render(): React.ReactNode {
        return <div className={styles.details}>
            {this.getMessageList()}
            {this.getForm()}
        </div>
    }

    getMessageList() {
        let list = [];
        let ds = new DataSet();
        let temp: number;
        ds.appendDataSet(this.state.messageData);
        ds.first();
        while (ds.fetch()) {
            let isSelf = false, systemMsg = false, msgStatus = ds.getString('Status_');
            let name = ds.getString('Name_') || this.props.name;
            if (ds.getString('FromUser_') == this.props.userCode) {
                isSelf = true;
                name = this.props.userName;
            }
            if (ds.getString('FromUser_') == '') { //目前FromUser_ 为空则判定为系统消息
                systemMsg = true;
            }
            let mvClass = ds.getString('MVClass_'); //消息类别
            temp = new Date(ds.getString('AppDate_')).getTime();
            let messageName;
            let uid = ds.getString('UID_');
            let key = uid;
            switch (mvClass) {
                case 'MVNotice':
                    messageName = NoticeMessage;
                    key = `${uid}-${ds.getDouble('Final_')}`
                    break;
                case 'MVTask':
                    messageName = TaskMessage;
                    key = `${uid}-${ds.getString('Content_')}`
                    break;
                case 'MVWorkflow':
                    messageName = SignMessage;
                    break;
                case 'MVExport':
                    messageName = ExportMessage;
                    key = `${uid}-${ds.getDouble('Process_')}`
                    break;
                case 'MVSubscribe':
                    messageName = SubscribeMessage;
                    break;
                case 'MVAcceptMessage':
                    messageName = AcceptMessage;
                    key = `${uid}-${ds.getString('Content_')}`;
                    break;
                // 图片类消息
                case 'MVImage':
                    messageName = ImageMessage;
                    break;
                default:
                    messageName = DefaultMessage;
                    break;
            }
            list.push(<li key={key}>
                {React.createElement(messageName, {
                    row: ds.current,
                    name,
                    time: ds.getString('AppDate_'),
                    hideName: false,
                    isSelf,
                    msgStatus,
                    reloadMessage: this.reloadMessage.bind(this)
                })}
            </li>)
        }
        return <ul className={styles.messageList} onScroll={(e) => {
            this.scrollEventFun(e);
        }}><li key="10-1" className={styles.historicalRecordsBox}>{this.getHistoryBtn()}</li>{list}</ul>
    }

    getForm() {
        if (this.props.fromUser)
            return <form className={styles.replyBox} onSubmit={(e) => this.handleSubmit(e)} onKeyDown={(e) => this.handleKeyDown(e)}>
                <textarea value={decodeURIComponent(this.state.messageText)} onChange={(e) => {
                    this.setState({
                        messageText: encodeURIComponent(e.target.value),
                    })
                }} placeholder='请输入消息...'></textarea>
                <div className={styles.uploadImage}>
                    <label htmlFor='uploadImage'>
                        <img src={StaticFile.getImage(ImageConfig.ICON_UPLOADIMAGE)} title='上传图片'></img>
                    </label>
                    <input type='file' id='uploadImage' accept="image/*" value='' onChange={(e) => this.handleUploadImage(e)} />
                </div>
                <div>
                    <button className={this.state.messageText != '' ? '' : styles.disEvents}>发送</button>
                </div>
            </form>
    }

    getHistoryBtn() {
        if (!this.state.hasHistory) {
            return <span className={styles.noHistory}>暂无更多历史消息</span>
        } else {
            return <span className={styles.historicalRecordsBtn} onClick={this.getHistoricalRecordsFun.bind(this)}>获取更多历史消息</span>;
        }
    }

    handleKeyDown(e: any) {
        let keyCode: number = e.keyCode;
        if (keyCode == 13) {
            e.preventDefault();
            this.handleSubmit(e);
        }
    }

    async handleSubmit(e: any) {
        if (this.state.messageText == '') return false;
        e.preventDefault();
        let row = new DataRow();
        row.setValue('ToUser_', this.props.fromUser).setValue('Content_', this.state.messageText);
        await DitengApi.replyMessage(row);
        this.setState({
            messageText: '',
        }, () => {
            this.getMessageData();
        })
    }

    // 设置聊天区域滚动到底部
    initMessageScroll() {
        let el = document.getElementsByClassName(styles.messageList)[0] as HTMLDivElement;
        el.scrollTop = el.scrollHeight - this.state.formBottom;
    }

    async quicReplySend(e: any) {
        // 系统消息不允许快捷回复
        if (this.props.fromUser) {
            let row = new DataRow();
            row.setValue('ToUser_', this.props.fromUser).setValue('Content_', e.target.innerText);
            await DitengApi.replyMessage(row);
            this.setState({
                messageText: '',
            }, () => {
                this.getMessageData();
            })
        }
    }

    //获取历史消息 每次点击都获取当前查询时间 前一天
    async getHistoricalRecordsFun() {
        let dataOut = await this.getHistoryData(this.state.lastMessageId);
        let ds = new DataSet();
        ds.appendDataSet(this.state.messageData);
        dataOut.first();
        while (dataOut.fetch()) {
            if (ds.locate('UID_', dataOut.getString('UID_'))) {
                ds.copyRecord(dataOut.current);
            } else {
                ds.append();
                ds.copyRecord(dataOut.current);
            }
        }
        ds.setSort('UID_');
        ds.first();
        if (dataOut.size < 100) {
            this.setState({
                messageData: ds,
                hasHistory: false,
                lastMessageId: ds.getString('UID_')
            }, () => {
                this.initMessageScroll();
            })
        } else {
            this.setState({
                messageData: ds,
                lastMessageId: ds.getString('UID_')
            }, () => {
                this.initMessageScroll();
            });
        }
    }

    // 获取历史消息
    async getHistoryData(id: string) {
        let row = new DataRow();
        row.setValue('FromUser_', this.props.fromUser).setValue('offset', id);
        let dataOut = await DitengApi.getMessageDetails(row);
        if (this.closeServerFun(dataOut.state)) {
            return;
        }
        return dataOut;
    }

    //自动滚动功能
    scrollEventFun(e: any) {
        let el = e.target as HTMLDivElement;
        this.setState({
            formBottom: el.scrollHeight - el.scrollTop
        })
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.getFirstMessageData();
            this.getUserInfo();
        }, this.state.timing * 1000)
    }

    // 关闭定时请求数据进程
    removeTimer() {
        clearInterval(this.timer);
    }

    //当前登录用户信息失效时关闭定时请求
    closeServerFun(state: number) {
        if (state <= 0) {
            this.removeTimer();
            return true;
        }
    }

    // 回复图片消息
    async handleUploadImage(e: any) {
        let formData = new FormData();
        formData.set('file', e.target.files[0]);
        formData.set('ToUser_', this.props.fromUser);
        let ds = await DitengApi.replyImageMessage(formData);
        if (ds.state > 0) {
            this.setState({
                messageText: '',
                formBottom: 0
            }, () => {
                this.getMessageData();
            })
        } else
            showMsg(ds.message);
    }

    reloadMessage() {
        this.getMessageData()
    }
}