import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import DefaultMessage from "./DefaultMessage";
import ExportMessage from "./ExportMessage";
import styles from "./FrmMessage.css";
import NoticeMessage from "./NoticeMessage";
import PageApi from "./PageApi";
import SignMessage from "./SignMessage";
import TaskMessage from "./TaskMessage";
import { timing } from "./FrmMessage";
import SubscribeMessage from "./SubscribeMessage";
import { showMsg } from "../tool/Summer";
import Utils from "../tool/Utils";
import AcceptMessage from "./AcceptMessage";
import ImageMessage from "./ImageMessage";
import StaticFile from "../StaticFile";
import ImageConfig from "../ImageConfig";

type FrmMessageDetailsTypeProps = {
    fromUser: string,
    date: string,
    name: string,
    userCode: string,
    userName: string
}

type FrmMessageDetailsTypeState = {
    messageData: DataSet,
    date: string,
    lastDate: string,
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
            messageText: '',        //需要发送的消息
            quicReplyList: [],      // 快捷发送列表
            remarkText: '',
            remarkText_: '',
            date: this.props.date,
            lastDate: this.props.date,
            formBottom: 0,
        }
    }

    componentDidMount(): void {
        this.getFirstMessageDate();
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
        let dataOut = await PageApi.getUserRemark(row);
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
            contactInfo = await PageApi.fromDetail(row);
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
            let dataOut = await PageApi.setUserRemark(row);
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

    async getFirstMessageDate() {
        let row = new DataRow();
        row.setValue('FromUser_', this.props.fromUser).setValue('Date_', this.state.lastDate);
        let messageData = new DataSet();
        let ds = await PageApi.getMessageDetails(row);
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
        messageData.setSort('AppDate_');
        this.setState({
            messageData
        }, () => {
            this.initMessageScroll();
        })
    }

    async getMessageData(date: string) {
        let row = new DataRow();
        row.setValue('FromUser_', this.props.fromUser).setValue('Date_', date);
        let messageData = new DataSet();
        let ds = await PageApi.getMessageDetails(row);
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
        messageData.setSort('AppDate_');
        this.setState({
            messageData,
            date
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
        if (this.moreThanOneMonth(this.state.date)) {
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
        await PageApi.replyMessage(row);
        this.setState({
            messageText: '',
        }, () => {
            this.getMessageData(Utils.getNowDate());
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
            await PageApi.replyMessage(row);
            this.setState({
                messageText: '',
            }, () => {
                this.getMessageData(Utils.getNowDate());
            })
        }
    }

    //获取历史消息 每次点击都获取当前查询时间 前一天
    async getHistoricalRecordsFun() {
        let beginTimer = new Date(this.state.date).getTime();
        let endTimer = beginTimer - (24 * 60 * 60 * 1000 * 7);
        let date = new Date(endTimer);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let date_ = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        let dataOut = await this.getHistoryData(date_);
        if (dataOut.size <= 0 && !this.moreThanOneMonth(date_)) {
            this.setState({
                date: date_
            }, () => {
                this.getHistoricalRecordsFun();
            })
        } else {
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
            ds.setSort('AppDate_');
            this.setState({
                messageData: ds,
                date: date_
            }, () => {
                this.initMessageScroll();
            });
        }
    }

    moreThanOneMonth(date: string) {
        let date_ = new Date(date);
        let year_ = date_.getFullYear();
        let month_ = date_.getMonth() + 1;
        let day_ = date_.getDate();
        let _date = new Date();
        let _year = _date.getFullYear();
        let _month = _date.getMonth() + 1;
        let _day = _date.getDate();
        let bool = true;
        if (year_ == _year && month_ == _month)
            bool = false;
        else if (year_ == year_ && month_ != _month && day_ >= _day)
            bool = false
        else if (year_ != year_ && month_ == 12 && _month == 1 && day_ >= _day)
            bool = false;
        return bool;
    }

    // 获取历史消息
    async getHistoryData(date: string) {
        let row = new DataRow();
        row.setValue('FromUser_', this.props.userCode).setValue('Date_', date);
        let dataOut = await PageApi.getMessageDetails(row);
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
            this.getFirstMessageDate();
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
        let ds = await PageApi.replyImageMessage(formData);
        if (ds.state > 0) {
            this.setState({
                messageText: '',
                formBottom: 0
            }, () => {
                this.getMessageData(Utils.getNowDate());
            })
        } else
            showMsg(ds.message);
    }

    reloadMessage() {
        this.getMessageData(Utils.getNowDate())
    }
}