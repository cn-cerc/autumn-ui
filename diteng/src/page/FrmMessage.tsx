import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import CreateGroupDialog from "../dialog/CreateGroupDialog";
import DialogDOM from "../dialog/DialogDOM";
import ImageConfig from "../ImageConfig";
import StaticFile from "../StaticFile";
import { showMsg } from "../tool/Summer";
import Utils from "../tool/Utils";
import AcceptMessage from "./AcceptMessage";
import DefaultMessage from "./DefaultMessage";
import ExportMessage from "./ExportMessage";
import styles from "./FrmMessage.css";
import ImageMessage from "./ImageMessage";
import NoticeMessage from "./NoticeMessage";
import PageApi from "./PageApi";
import SignMessage from "./SignMessage";
import SubscribeMessage from "./SubscribeMessage";
import TaskMessage from "./TaskMessage";

type FrmMessageTypeProps = {
    fromUser?: string,
    userCode: string,
    userName: string
    toUser?: string
}

type FrmMessageTypeState = {
    timing: number,
    contactData: DataSet,
    messageDataList: messageDetail[],
    currentUserId: string,
    showMessage: boolean,
    quicReplyList: Array<{ text: string, uid: string }>
    msgTypeStuteFlag: boolean,
    uploadImage: Blob | ''
}

type messageDetail = {
    data: DataSet,
    latestDate: string,
    latestMessage: string,
    cropName: string,
    date: string,
    fromBottom: number,
    fromUser: string,
    name: string,
    unReadNum: number,
    messageText: string,
    remarkText: string,
    remarkText_: string
};

export const timing = 5;
export const imageColorArr = ['#d57f10', '#0755aa', '#0755aa', '#3fba0c', '#0755aa', '#d00c89', '#0755aa'];

export default class FrmMessage extends WebControl<FrmMessageTypeProps, FrmMessageTypeState> {
    private mousedownTime: number = 0;
    private timer: any = null;
    constructor(props: FrmMessageTypeProps) {
        super(props);
        let showMessage = this.isPhone ? false : true;
        let contactInfo = new DataSet();
        contactInfo.append().setValue('RoleName_', '系统').setValue('Mobile_', '暂无');
        this.state = {
            timing,
            contactData: new DataSet(),     //联系人DataSet
            messageDataList: [{
                data: new DataSet(),
                latestDate: '',
                latestMessage: '',
                date: '',
                fromBottom: 0,
                fromUser: '',
                name: '',
                unReadNum: 0,
                messageText: '',
                cropName: '',
                remarkText_: '',        //默认备注字段，用来判断备注是否有修改
                remarkText: '',     //备注字段
            }],     //消息列表DataSet
            currentUserId: null,
            showMessage,        //是否展示消息列表
            quicReplyList: [],   //保存获取的快捷回复list
            msgTypeStuteFlag: true,      //切换所有消息和未读消息
            uploadImage: ''
        }
    }

    componentDidMount(): void {
        this.initData();
        this.startTimer();
        if (!this.isPhone) {
            let remarkDOM = document.querySelector('#remark') as HTMLTextAreaElement;
            remarkDOM.addEventListener('input', this.changeRemark.bind(this));
            let saveBtn = document.querySelector('#saveBtn') as HTMLButtonElement;
            saveBtn.addEventListener('click', this.setUserRemarkFun.bind(this));
            document.querySelectorAll('.quickReply').forEach((dom) => {
                dom.addEventListener('click', this.quicReplySend.bind(this))
            })
        }
    }

    changeRemark() {
        let textarea = event.target as HTMLTextAreaElement;
        let val = encodeURIComponent(textarea.value);
        let messageData = this.getMessageDataByCode(this.state.currentUserId);
        let saveBtn = document.querySelector('#saveBtn') as HTMLButtonElement;
        if (messageData.remarkText_ == val) {
            saveBtn.classList.remove('change');
        } else {
            saveBtn.classList.add('change');
        }
        messageData.remarkText = val;
        this.setState(this.state);
    }

    componentWillUnmount(): void {
        this.removeTimer();
    }

    render(): React.ReactNode {
        return <div className={styles.main}>
            {/* {this.getUserInfoDOM()} */}
            {this.getContactList()}
            {this.getMessageBox()}
        </div>
    }

    // 初始化页面数据加载
    async initData() {
        let messageDataList = await this.getContactFirstData();
        if (messageDataList.length == 0) { return }
        let currentUserId = messageDataList[0].fromUser;
        if (this.props.toUser) {
            currentUserId = this.props.toUser
        }
        currentUserId = currentUserId;
        this.setState({
            messageDataList,
            currentUserId
        }, () => {
            if (!this.isPhone) {
                this.getMessageData(this.state.currentUserId);
                this.getUserInfo();
            }
        })
    }

    // 通过联系人ID获取下标
    getMessageDataByCode(id: string) {
        let messageData = null;
        for (let i = 0; i < this.state.messageDataList.length; i++) {
            if (this.state.messageDataList[i].fromUser == id) {
                messageData = this.state.messageDataList[i];
                break;
            }
        }
        if (messageData == null)
            messageData = this.state.messageDataList[0];
        return messageData
    }

    // 第一次获取联系人列表数据
    async getContactFirstData() {
        let dataOut = await PageApi.getContactList();
        if (this.closeServerFun(dataOut.state)) {
            return;
        }
        if (dataOut.state > 1) {
            dataOut.setSort('LatestDate_ DESC');
        }
        dataOut.first();
        let messageDataList: messageDetail[] = [];
        let allUnReadNum = 0;
        while (dataOut.fetch()) {
            let latestDate = dataOut.getString('LatestDate_');
            let date_ = new Date(latestDate);
            let year_ = date_.getFullYear();
            let month_ = date_.getMonth() + 1;
            let day_ = date_.getDate();
            let unReadNum = dataOut.getDouble('UnReadNum_');
            messageDataList.push({
                data: new DataSet(),
                latestDate,
                latestMessage: dataOut.getString('LatestMessage_'),
                date: `${year_}-${month_ < 10 ? '0' + month_ : month_}-${day_ < 10 ? '0' + day_ : day_}`,
                fromBottom: 0,
                fromUser: dataOut.getString('FromUser_'),
                name: dataOut.getString('Name_'),
                unReadNum,
                cropName: dataOut.getString('FromCorp_'),
                messageText: '',
                remarkText: '',
                remarkText_: ''
            })
            allUnReadNum += unReadNum;
        }
        this.setHeaderMessageNum(allUnReadNum);
        return messageDataList;
    }

    // 获取联系人列表数据
    async getContactData() {
        let messageDataList = this.state.messageDataList;
        let dataOut = await PageApi.getContactList();
        if (this.closeServerFun(dataOut.state)) {
            return;
        }
        if (dataOut.state > 1) {
            dataOut.setSort('LatestDate_ DESC');
        }
        dataOut.first();
        let allUnReadNum = 0;
        while (dataOut.fetch()) {
            let bool = false;
            let num = 0;
            let latestDate = '';
            let latestMessage = '';
            let date_, year_, month_, day_, unReadNum;
            for (let i = 0; i < messageDataList.length; i++) {
                if (messageDataList[i].fromUser == dataOut.getString('FromUser_')) {
                    bool = true;
                    num = i;
                    latestDate = dataOut.getString('LatestDate_');
                    latestMessage = dataOut.getString('LatestMessage_');
                    unReadNum = dataOut.getDouble('UnReadNum_');
                    date_ = new Date(latestDate);
                    year_ = date_.getFullYear();
                    month_ = date_.getMonth() + 1;
                    day_ = date_.getDate();
                    break;
                }
            }
            if (bool) {
                messageDataList[num] = {
                    data: messageDataList[num].data,
                    latestDate,
                    latestMessage,
                    date: messageDataList[num].date,
                    fromBottom: messageDataList[num].fromBottom,
                    fromUser: messageDataList[num].fromUser,
                    name: messageDataList[num].name,
                    unReadNum,
                    cropName: messageDataList[num].cropName,
                    messageText: messageDataList[num].messageText,
                    remarkText: messageDataList[num].remarkText,
                    remarkText_: messageDataList[num].remarkText_
                }
            } else {
                unReadNum = dataOut.getDouble('UnReadNum_');
                date_ = new Date(latestDate);
                year_ = date_.getFullYear();
                month_ = date_.getMonth() + 1;
                day_ = date_.getDate();
                messageDataList.unshift({
                    data: new DataSet(),
                    latestDate: dataOut.getString('LatestDate_'),
                    latestMessage: dataOut.getString('LatestMessage_'),
                    date: `${year_}-${month_ < 10 ? '0' + month_ : month_}-${day_ < 10 ? '0' + day_ : day_}`,
                    fromBottom: 0,
                    fromUser: dataOut.getString('FromUser_'),
                    name: dataOut.getString('Name_'),
                    cropName: dataOut.getString('FromCorp_'),
                    unReadNum,
                    messageText: '',
                    remarkText: '',
                    remarkText_: ''
                })
            }
            allUnReadNum += unReadNum;
        }
        this.setHeaderMessageNum(allUnReadNum);
        return messageDataList;
    }

    setHeaderMessageNum(num: number) {
        //@ts-ignore
        setHeaderMessageNum(num);
    }

    async getUserInfo() {
        let remarkText = await this.getUserRemarkFun();
        let contactInfo = await this.fromDetailFun();
        let messageData = this.getMessageDataByCode(this.state.currentUserId);
        messageData.remarkText = messageData.remarkText || remarkText;
        messageData.remarkText_ = remarkText;
        let userName = document.querySelector('#userName') as HTMLSpanElement;
        userName.innerHTML = messageData.name;
        let belong = document.querySelector("#belong") as HTMLSpanElement;
        belong.innerHTML = contactInfo.getString('RoleName_');
        let contact = document.querySelector('#contact') as HTMLSpanElement;
        contact.innerHTML = contactInfo.getString('Mobile_');
        let remark = document.querySelector('#remark') as HTMLTextAreaElement;
        remark.value = decodeURIComponent(messageData.remarkText);
        let saveBtn = document.querySelector('#saveBtn') as HTMLButtonElement;
        if (messageData.remarkText == messageData.remarkText_) {
            saveBtn.classList.remove('change');
        } else {
            saveBtn.classList.add('change');
        }
    }

    // 获取单个联系人消息详情
    async getMessageData(id: string, date?: string) {
        let messageData = this.getMessageDataByCode(id);
        let date_ = date ? date : messageData.latestDate;
        let row = new DataRow();
        row.setValue('FromUser_', messageData.fromUser).setValue('Date_', date_);
        let dataOut = await PageApi.getMessageDetails(row);
        if (this.closeServerFun(dataOut.state)) {
            return;
        }
        let ds = new DataSet();
        ds.appendDataSet(messageData.data);
        dataOut.first();
        while (dataOut.fetch()) {
            if (ds.locate('UID_', dataOut.getString('UID_'))) {
                ds.copyRecord(dataOut.current);
            } else {
                ds.append();
                ds.copyRecord(dataOut.current);
            }
        }
        if (ds.size > 1) {
            ds.setSort('AppDate_');
        }
        messageData.data = ds;
        messageData.latestDate = date_;
        this.setState({
            currentUserId: id,
        });
        this.initMessageScroll();
    }

    // 获取历史消息
    async getHistoryData(date: string) {
        let messageData = this.getMessageDataByCode(this.state.currentUserId);
        let row = new DataRow();
        row.setValue('FromUser_', messageData.fromUser).setValue('Date_', date);
        let dataOut = await PageApi.getMessageDetails(row);
        if (this.closeServerFun(dataOut.state)) {
            return;
        }
        return dataOut;
    }

    // 获取联系人JSX结构
    getContactList() {
        if (!this.isPhone || !this.state.showMessage) {
            let list = [];
            for (let i = 0; i < this.state.messageDataList.length; i++) {
                let messageData = this.state.messageDataList[i];
                let name = messageData.name || '系统消息';
                let cropName = messageData.cropName;
                let date, hour, minut: string | number, timeText: string = '';
                if (messageData.latestDate) {
                    date = new Date(messageData.latestDate);
                    hour = date.getHours();
                    minut = date.getMinutes();
                    if (minut < 10) minut = '0' + minut;
                    timeText = `${hour}:${minut}`;
                }
                let num = i;
                let unread = 0;
                if (!this.state.msgTypeStuteFlag) {
                    unread = messageData.unReadNum > 99 ? 99 : messageData.unReadNum;
                    if (unread == 0) {
                        continue;
                    }
                }
                list.push(<li key={num} className={messageData.fromUser == this.state.currentUserId ? styles.selectContact : ''} onClick={this.handleClick.bind(this, messageData.latestDate, messageData.fromUser)}>
                    <div className={styles.contactImage} style={{ 'backgroundColor': imageColorArr[i % 7] }}>{name == '系统消息' ? '系统' : name.substring(name.length - 2)}</div>
                    <div>
                        {unread ? <span className={styles.UnReadNum}>{unread}</span> : ''}
                        <div className={styles.contactTitle}>
                            <span>{name}{cropName ? `@${cropName}` : ''}</span>
                            <span>{timeText}</span>
                        </div>
                        {messageData.latestMessage ? <div>{messageData.latestMessage}</div> : ''}

                    </div>
                </li>);
            }
            if (!list.length) {
                list.push(<li key='noMessage' className={styles.noMessage}>{this.state.msgTypeStuteFlag ? '您暂时没有消息...' : '您暂时没有未读消息...'}</li>)
            }
            return <ul className={`${styles.contactList} ${list.length ? styles.contactListPadding : ''}`}>
                <li className={styles.msgTypeStatusBox} key="1-1">
                    <span className={this.state.msgTypeStuteFlag ? styles.msgTypeStute : ''} onClick={this.msgTypeStuteFun.bind(this)}>所有消息</span>
                    <span className={this.state.msgTypeStuteFlag ? '' : styles.msgTypeStute} onClick={this.msgTypeStuteFun.bind(this)}>未读消息</span>
                </li>
                {list}
            </ul>

        }
    }

    // 获取消息详情JSX结构
    getMessageBox() {
        let messageData = this.getMessageDataByCode(this.state.currentUserId);
        if (this.state.showMessage) {
            return <div className={styles.messageBox}>
                <div className={styles.messageTitle}>
                    <span>{messageData.name}</span>
                    <div title='创建群组' onClick={this.showCreateGroup.bind(this)}>
                        <img src={StaticFile.getImage(ImageConfig.ICON_CREATE)} />
                        <span>创建群组</span>
                    </div>
                </div>
                {this.getMessageList()}
                {this.getForm(messageData)}
            </div>
        }
    }

    // 获取具体的消息体结构
    getMessageList() {
        let list = [];
        let ds = new DataSet();
        let messageData = this.getMessageDataByCode(this.state.currentUserId);
        list.push(<li key="10-1" className={styles.historicalRecordsBox}>
            {this.getHistoryBtn(messageData)}
        </li>)
        ds.appendDataSet(messageData.data);
        ds.first();
        while (ds.fetch()) {
            let siteR = false, systemMsg = false, msgStatus = ds.getString('Status_');
            let name = ds.getString('Name_') || messageData.name;
            if (ds.getString('FromUser_') == this.props.userCode) { //判定是否是自己发出的消息
                siteR = true;
                name = this.props.userName;
            }
            if (ds.getString('FromUser_') == '') { //目前FromUser_ 为空则判定为系统消息
                systemMsg = true;
            }
            let mvClass = ds.getString('MVClass_'); //消息类别
            let messageName;
            switch (mvClass) {
                case 'MVNotice':
                    messageName = NoticeMessage;
                    break;
                case 'MVTask':
                    messageName = TaskMessage;
                    break;
                case 'MVWorkflow':
                    messageName = SignMessage;
                    break;
                case 'MVExport':
                    messageName = ExportMessage;
                    break;
                case 'MVSubscribe':
                    messageName = SubscribeMessage;
                    break;
                case 'MVAcceptMessage':
                    messageName = AcceptMessage;
                    break;
                // 图片类消息
                case 'MVImage':
                    messageName = ImageMessage;
                    break;
                default:
                    messageName = DefaultMessage;
                    break;
            }
            list.push(<li key={ds.recNo}>
                {React.createElement(messageName, {
                    row: ds.current,
                    name,
                    hideName: false,
                    siteR,
                    time: ds.getString('AppDate_'),
                    msgStatus,
                    reloadMessage: this.reloadMessage.bind(this)
                })}
            </li>)
        }
        return <ul className={styles.messageList} onScroll={(e) => {
            this.scrollEventFun(e);
        }} key={messageData.data.json}>{list}</ul>
    }

    getForm(messageData: messageDetail) {
        if (messageData.fromUser)
            return <form className={styles.replyBox} onSubmit={(e) => this.handleSubmit(e)} onKeyDown={(e) => this.handleKeyDown(e)}>
                <div className={styles.statusBar}>
                    <div className={styles.statu}>
                        <label htmlFor='uploadImage'>
                            <img src={ImageConfig.ICON_UPLOADIMAGE} title='上传图片'></img>
                        </label>
                        <input type='file' id='uploadImage' accept="image/png" value='' onChange={(e) => this.handleUploadImage(e)} />
                    </div>
                </div>
                <textarea value={decodeURIComponent(messageData.messageText)} onChange={(e) => {
                    messageData.messageText = encodeURIComponent(e.target.value);
                    this.setState(this.state)
                }} placeholder='请输入消息...'></textarea>
                <div>
                    <button className={messageData.messageText != '' ? '' : styles.disEvents}>发送(S)</button>
                </div>
            </form>
    }

    reloadMessage() {
        this.getMessageData(this.state.currentUserId, Utils.getNowDate())
    }

    getHistoryBtn(messageData: messageDetail) {
        if (this.moreThanOneMonth(messageData.date)) {
            return <span className={styles.noHistory}>暂无更多历史消息</span>
        } else {
            return <span className={styles.historicalRecordsBtn} onClick={this.getHistoricalRecordsFun.bind(this)}>获取更多历史消息</span>;
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

    // 点击联系人触发的事件
    async handleClick(date: string, id: string) {
        let messageData = this.getMessageDataByCode(id);
        if (!this.isPhone) {
            await this.getMessageData(id, date);
            this.getUserInfo();
        } else {
            this.setState({
                currentUserId: id
            }, () => {
                location.href = `./FrmMyMessage.details?fromUser=${messageData.fromUser}&date=${date}&name=${messageData.name}`
            })
        }

    }

    // 开始定时请求数据进程
    startTimer() {
        this.timer = setInterval(async () => {
            let messageDataList = await this.getContactData();
            this.setState({
                messageDataList,
            }, () => {
                if (!this.isPhone) {
                    this.getMessageData(this.state.currentUserId);
                }
            })
        }, this.state.timing * 1000)
    }

    // 关闭定时请求数据进程
    removeTimer() {
        clearInterval(this.timer);
    }

    // form表单键盘事件监听
    handleKeyDown(e: any) {
        let keyCode: number = e.keyCode;
        if (keyCode == 13 && !e.ctrlKey) {
            e.preventDefault();
            this.handleSubmit(e);
        }
    }

    // 消息回复
    async handleSubmit(e: any) {
        e.preventDefault();
        let messageData = this.getMessageDataByCode(this.state.currentUserId);
        if (messageData.messageText == '') return false;
        let row = new DataRow();
        row.setValue('ToUser_', messageData.fromUser).setValue('Content_', messageData.messageText);
        await PageApi.replyMessage(row);
        messageData.messageText = '';
        messageData.fromBottom = 0;
        let messageDataList = await this.getContactData();
        this.setState({
            messageDataList,
            currentUserId: messageData.fromUser
        }, () => {
            this.getMessageData(messageData.fromUser, Utils.getNowDate());
        })
    }

    // 回复图片消息
    async handleUploadImage(e: any) {
        let messageData = this.getMessageDataByCode(this.state.currentUserId);
        let formData = new FormData();
        formData.set('file', e.target.files[0]);
        formData.set('ToUser_', messageData.fromUser);
        let ds = await PageApi.replyImageMessage(formData);
        if (ds.state > 0) {
            this.getMessageData(messageData.fromUser, Utils.getNowDate());
        } else
            showMsg(ds.message);
    }

    // 设置聊天区域滚动到底部
    initMessageScroll() {
        let el = document.getElementsByClassName(styles.messageList)[0] as HTMLDivElement;
        let messageData = this.getMessageDataByCode(this.state.currentUserId);
        el.scrollTop = el.scrollHeight - messageData.fromBottom;
    }

    // 消息区域滚动事件
    scrollEventFun(e: any) {
        let el = e.target as HTMLDivElement;
        let messageData = this.getMessageDataByCode(this.state.currentUserId);
        messageData.fromBottom = el.scrollHeight - el.scrollTop;
        this.setState(this.state)
    }

    //快捷回复 发送
    async quicReplySend() {
        let messageData = this.getMessageDataByCode(this.state.currentUserId);
        // 系统消息不允许快捷回复
        if (messageData.fromUser) {
            let spanDom = event.target as HTMLSpanElement;
            let row = new DataRow();
            row.setValue('ToUser_', messageData.fromUser).setValue('Content_', spanDom.innerText);
            await PageApi.replyMessage(row);
            messageData.fromBottom = 0;
            let messageDataList = await this.getContactData();
            this.setState({
                messageDataList,
                currentUserId: messageData.fromUser
            }, () => {
                this.getMessageData(messageData.fromUser, Utils.getNowDate());
            })
        }
    }

    //设置备注信息
    async setUserRemarkFun() {
        let messageData = this.getMessageDataByCode(this.state.currentUserId);
        if (messageData.remarkText != messageData.remarkText_) {
            let row = new DataRow();
            row.setValue('UserCode_', messageData.fromUser).setValue('Remark_', messageData.remarkText);
            let dataOut = await PageApi.setUserRemark(row);
            if (dataOut.state < 0) {
                showMsg(dataOut.message);
            } else {
                messageData.remarkText_ = messageData.remarkText
                this.setState(this.state);
                let saveBtn = document.querySelector('#saveBtn') as HTMLButtonElement;
                saveBtn.classList.remove('change');
            }
        }
    }

    //获取备注信息
    async getUserRemarkFun() {
        let row = new DataRow();
        let messageData = this.getMessageDataByCode(this.state.currentUserId);
        row.setValue('UserCode_', messageData.fromUser)
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

    //获取历史消息 每次点击都获取当前查询时间 前一天
    async getHistoricalRecordsFun() {
        let messageData = this.getMessageDataByCode(this.state.currentUserId);
        let beginTimer = new Date(messageData.date).getTime();
        let endTimer = beginTimer - (24 * 60 * 60 * 1000 * 7);
        let date = new Date(endTimer);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let date_ = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        let dataOut = await this.getHistoryData(date_);
        if (dataOut.size <= 0 && !this.moreThanOneMonth(date_)) {
            messageData.date = date_;
            this.setState(this.state, () => {
                this.getHistoricalRecordsFun();
            })
        } else {
            let ds = new DataSet();
            ds.appendDataSet(messageData.data);
            dataOut.first();
            while (dataOut.fetch()) {
                if (ds.locate('UID_', dataOut.getString('UID_'))) {
                    ds.copyRecord(dataOut.current);
                } else {
                    ds.append();
                    ds.copyRecord(dataOut.current);
                }
            }
            if (ds.size > 1) {
                ds.setSort('AppDate_');
            }
            messageData.data = ds;
            messageData.date = date_;
            this.setState(this.state, () => {
                this.initMessageScroll();
            });
        }
    }

    //切换消息类型
    msgTypeStuteFun() {
        this.setState({
            msgTypeStuteFlag: !this.state.msgTypeStuteFlag
        }, () => {
            this.getContactList();
        })
    }

    //获取对方资料
    async fromDetailFun() {
        let messageData = this.getMessageDataByCode(this.state.currentUserId);
        let contactInfo = new DataSet();
        if (messageData.fromUser) {
            let row = new DataRow();
            row.setValue('FromUser_', messageData.fromUser);
            contactInfo = await PageApi.fromDetail(row);
            if (this.closeServerFun(contactInfo.state)) {
                return;
            }
        } else {
            contactInfo.append().setValue('RoleName_', '系统').setValue('Mobile_', '暂无');
        }
        return contactInfo;
    }

    //展示创建群组
    showCreateGroup() {
        DialogDOM.render(React.createElement(CreateGroupDialog));
    }
    //当前登录用户信息失效时关闭定时请求
    closeServerFun(state: number) {
        if (state <= 0) {
            this.removeTimer();
            return true;
        }
    }
}