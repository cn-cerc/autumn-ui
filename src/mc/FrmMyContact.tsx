import { DataRow, DataSet, DBEdit, SearchPanel, WebControl } from "autumn-ui";
import React from "react";
import DitengApi from "../api/DitengApi";
import StaticFile from "../static/StaticFile";
import { imageColorArr } from "./FrmMessage";
import styles from "./FrmMyContact.css";


type FrmMyContactTypeProps = {

}

type FrmMyContactTypeState = {
    searchType: Array<string>,
    searchTypeIndex: number,
    messageDataList: messageDetail[],
    AllMessageDetail: AllMessageDetail[],
    currentUserId: string,
    AllContactList: DataSet,
    searchRow: DataRow
}

type messageDetail = {
    data: DataSet,
    latestDate: string,
    latestMessage: string,
    date: string,
    fromBottom: number,
    fromUser: string,
    name: string,
};

type AllMessageDetail = {
    data: DataSet,
    copyData: DataSet,
    fromBottom: number,
    fromUser: string,
    name: string,
};

export default class FrmMyContact extends WebControl<FrmMyContactTypeProps, FrmMyContactTypeState>{
    constructor(props: FrmMyContactTypeProps) {
        super(props);
        this.state = {
            searchType: ['公司同事', '客户清单', '厂商清单', '其他人员'],
            searchTypeIndex: null,
            messageDataList: [{
                data: new DataSet(),
                latestDate: '',
                latestMessage: '',
                date: '',
                fromBottom: 0,
                fromUser: '',
                name: '',
            }],     //消息列表DataSet
            AllMessageDetail: [{
                data: new DataSet(),
                copyData: new DataSet(),
                fromBottom: 0,
                fromUser: '',
                name: '',
            }],     //消息列表DataSet
            currentUserId: null,
            AllContactList: new DataSet(),
            searchRow: new DataRow(),
        }
    }

    componentDidMount(): void {
        this.initGroup();
        this.initData();
    }

    loopIndex(index: number) {
        return (index + 1) % 7;
    }

    initGroup() {
        let AllMessageDetail: AllMessageDetail[] = [];
        this.state.searchType.forEach((item, index) => {
            AllMessageDetail.push({
                data: new DataSet(),
                copyData: new DataSet(),
                fromBottom: 0,
                fromUser: '',
                name: ''
            })
        })
        if (!this.isPhone) {
            this.setState({
                AllMessageDetail,
                searchTypeIndex: 0
            }, () => {
                this.handleClickGroup(0);
            })
        }
    }

    render(): React.ReactNode {
        return <div className={styles.main}>
            {this.getContactListDOM()}
            {this.getRightBox()}
        </div>
    }

    // 初始化页面数据加载
    async initData() {
        let messageDataList = await this.getContactFirstData();
        if (messageDataList.length == 0) { return }
        let currentUserId = messageDataList[0].fromUser;
        this.setState({
            messageDataList,
        })
    }

    // 第一次获取联系人列表数据
    async getContactFirstData() {
        let dataOut = await DitengApi.getContactList();
        if (dataOut.state > 1) {
            dataOut.setSort('LatestDate_ DESC');
        }
        dataOut.first();
        let messageDataList: messageDetail[] = [];
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
            })
        }
        return messageDataList;
    }

    // 获取联系人JSX结构
    getContactListDOM() {
        let list = [];
        let colorIndex = 0;
        for (let i = 0; i < this.state.searchType.length; i++) {
            let name = this.state.searchType[i];
            let num = i;
            list.push(<li key={num} className={`${i == this.state.searchTypeIndex ? styles.selectContact : ''} ${styles.contactLiItem} ${styles.contactLiItemCenter} ${i == this.state.searchType.length - 1 ? styles.paddingBottom : ''}`} onClick={this.handleClickGroup.bind(this, num)}>
                <div className={styles.contactImage} style={{ 'backgroundColor': imageColorArr[colorIndex] }}>{name.substring(name.length - 2)}</div>
                <div>
                    <div className={styles.contactTitle}>
                        <span>{name}</span>
                        {this.isPhone ? <span><img src={StaticFile.getImage('images/icon/arrow-right.png')} /></span> : ''}
                    </div>
                </div>
            </li>);
            colorIndex = this.loopIndex(colorIndex);
        }
        return <ul className={styles.contactList}>
            <li className={styles.addContact}>
                <div onClick={this.handleClickToAdd.bind(this)} className={styles.addContactBtn}>
                    <i>+</i>
                    <span>新增联系人</span>
                </div>
            </li>
            <li className={styles.titleBox}>
                <div className={styles.title}>所有联系人</div>
            </li>
            {list}
            <li className={styles.titleBox}>
                <div className={styles.title}>最近联系人</div>
            </li>
            {this.getNearestContactList()}
        </ul >
    }

    // 获取最近联系人JSX结构
    getNearestContactList() {
        let list = [];
        let colorIndex = this.state.searchType.length;
        for (let i = 0; i < this.state.messageDataList.length; i++) {
            let messageData = this.state.messageDataList[i];
            let name = messageData.name || '系统消息';
            let num = i;
            if (name == '系统消息' || messageData.fromUser.startsWith('g_')) continue;
            list.push(<li key={num} className={`${messageData.fromUser == this.state.currentUserId ? styles.selectContact : ''} ${styles.contactLiItem}`} onClick={this.handleClick.bind(this, messageData.latestDate, messageData.fromUser, name)}>
                <div className={styles.contactImage} style={{ 'backgroundColor': imageColorArr[colorIndex % 7] }}>{name == '系统消息' ? '系统' : name.substring(name.length - 2)}</div>
                <div className={styles.alignItem}>
                    <div className={styles.contactTitle}>
                        <span>{name}</span>
                    </div>
                    {messageData.latestMessage ? <div>{messageData.latestMessage}</div> : ''}
                </div>
            </li>);
            colorIndex = this.loopIndex(colorIndex);
        }
        return list
    }

    //点击所有联系人分组事件
    async handleClickGroup(num: number) {
        if (num === null) return;
        if (!this.isPhone) {
            let AllMessageDetail = this.state.AllMessageDetail;
            let row = new DataRow();
            row.setValue('type', num).setValue('MaxRecord_', 100);
            let dataOut = await DitengApi.searchBook(row);
            AllMessageDetail[num].data = dataOut;
            let copyData = new DataSet();
            copyData.appendDataSet(dataOut);
            AllMessageDetail[num].copyData = copyData;
            this.setState({
                currentUserId: null,
                searchTypeIndex: num,
                AllMessageDetail,
                searchRow: num == this.state.searchTypeIndex ? this.state.searchRow : new DataRow()
            })
            this.initMessageScroll();
        } else {
            location.href = `./FrmMyContact.AllDetails?searchType=${encodeURIComponent(num)}`;
        }
    }

    // 点击最近联系人触发的事件
    async handleClick(date: string, id: string, name: string) {
        this.setState({
            currentUserId: id,
            searchTypeIndex: null
        })
        let messageData = this.getMessageDataByCode(id);
        if (!this.isPhone) {
            location.href = `./FrmMyMessage?toUser=${encodeURIComponent(id)}&date=${encodeURIComponent(date)}&name=${encodeURIComponent(name)}`;
        } else {
            location.href = `./FrmMyMessage.details?$fromUser=${encodeURIComponent(messageData.fromUser)}&toUser=${encodeURIComponent(messageData.fromUser)}&date=${encodeURIComponent(date)}&name=${encodeURIComponent(name)}`;
        }

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

    //获取右边分组联系人列表
    getRightBox() {
        if (!this.isPhone && this.state.searchTypeIndex != null) {
            let ds = new DataSet();
            ds = this.state.AllMessageDetail[this.state.searchTypeIndex].copyData;
            let list = [];
            ds.first();
            let colorIndex = 0;
            while (ds.fetch()) {
                let name = ds.getString('name_');
                let userCode = ds.getString('user_code_');
                let text = ds.getString('corp_name_');
                list.push(<li key={userCode}>
                    <div className={`${styles.contactImage} ${userCode == '' ? styles.hover : ''}`} style={{ 'backgroundColor': imageColorArr[colorIndex] }} onClick={this.toModify.bind(this, ds.current)}>{name.substring(name.length - 2)}</div>
                    <div className={styles.alignItem}>
                        <div className={styles.contactTitle}>
                            <span>{name}</span>
                        </div>
                        {text ? <div>{text}</div> : ''}
                    </div>
                    {userCode == '' ? '' : <div className={styles.rightBtnContent}>
                        <button className={styles.rightBoxSendBtn} onClick={this.handleClick.bind(this, ds.getString('update_time_'), userCode, name)}>发送消息</button>
                    </div>}
                </li>);
                colorIndex = this.loopIndex(colorIndex);
            }
            if (!list.length) {
                list.push(<li className={styles.noContact} key='noContact'>暂无当前分类的联系人...</li>)
            }
            return <div className={styles.rightBox}>
                <form onSubmit={(e) => { e.preventDefault(); this.handleSearch(); }} className={styles.search}>
                    <input type='text' value={this.state.searchRow.getString('searchText_')} onChange={this.handleChange.bind(this)} placeholder='请输入查询条件' />
                    <button type='submit'>查询</button>
                </form>
                <ul className={styles.AllContactList} onScroll={(e) => {
                    this.scrollEventFun(e);
                }} key={this.state.searchRow.getString('searchText_')}>
                    {list}
                </ul>
            </div >
        }
    }

    // 查询条件改变触发事件
    handleChange(e: any) {
        let oldSearchText = this.state.searchRow.getString('searchText_');
        let newText = e.target.value;
        this.state.searchRow.setValue('searchText_', newText);
        if (newText.trim() != oldSearchText.trim()) {
            this.state.searchRow.setValue('searchText_', newText);
            this.setState(this.state, () => {
                this.handleSearch();
            })
        } else {
            this.setState(this.state);
        }
    }

    // 过滤联系人列表
    handleSearch() {
        let searchText_ = this.state.searchRow.getString('searchText_').trim();
        let data = new DataSet();
        let copyData = new DataSet();
        data.appendDataSet(this.state.AllMessageDetail[this.state.searchTypeIndex].data);
        data.first();
        data.records.forEach((row) => {
            if (row.getString('name_').indexOf(searchText_) > -1 || row.getString('corp_name_').indexOf(searchText_) > -1)
                copyData.append().copyRecord(row);
        })
        this.state.AllMessageDetail[this.state.searchTypeIndex].copyData = copyData;
        this.setState(this.state);
    }

    handleClickToAdd() {
        location.href = `./FrmMyContact.append`
    }

    // 跳转至联系人详情页面
    toModify(row: DataRow) {
        if (!row.getBoolean('user_code_')) {
            location.href = `FrmMyContact.modify?uid=${encodeURIComponent(row.getString('UID_'))}`;
        }
    }

    // 设置右边区域滚动到底部
    initMessageScroll() {
        let el = document.getElementsByClassName(styles.AllContactList)[0] as HTMLDivElement;
        let AllMessageDetail = this.state.AllMessageDetail[this.state.searchTypeIndex];
        el.scrollTop = AllMessageDetail.fromBottom;
    }

    // 右边区域滚动事件
    scrollEventFun(e: any) {
        let el = e.target as HTMLDivElement;
        let AllMessageDetail = this.state.AllMessageDetail[this.state.searchTypeIndex];
        AllMessageDetail.fromBottom = el.scrollTop;
        this.setState(this.state);
    }
}