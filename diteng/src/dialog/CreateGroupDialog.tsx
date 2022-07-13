import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import ReactDOM from "react-dom";
import ImageConfig from "../ImageConfig";
import { imageColorArr } from "../page/FrmMessage";
import PageApi from "../page/PageApi";
import { showMsg } from "../tool/Summer";
import styles from "./CreateGroupDialog.css";

type CreateGroupDialogTypeProps = {
    onClose: Function
}

type CreateGroupDialogTypeState = {
    contactData: DataSet,
    userCodeArr: string[],
    userDataArr: DataRow[],
    groupName: string
}

export default class CreateGroupDialog extends WebControl<CreateGroupDialogTypeProps, CreateGroupDialogTypeState> {
    constructor(props: CreateGroupDialogTypeProps) {
        super(props);
        let contactData = new DataSet();
        this.state = {
            contactData,
            userCodeArr: [],
            userDataArr: [],
            groupName: ''
        }
    }

    componentDidMount(): void {
        this.init();
    }

    async init() {
        let row = new DataRow();
        row.setValue('type', 0).setValue('MaxRecord_', -1);
        let contactData = await PageApi.searchBook(row);
        contactData.first();
        contactData.records.forEach((row) => {
            row.setValue('Select_', false);
        })
        if (contactData.state <= 0) {
            showMsg(contactData.message);
        } else {
            this.setState({
                contactData
            })
        }
    }

    render(): React.ReactNode {
        return <div className={styles.main}>
            <div className={styles.mengCeng}></div>
            <div className={styles.content}>
                <div className={styles.title}>
                    <span>创建群组</span>
                    <span onClick={this.handleClose.bind(this)}>×</span>
                </div>
                <div className={styles.mainBox}>
                    {this.getContactList()}
                    {this.getRight()}
                </div>
            </div>
        </div>
    }

    // 关闭窗口事件
    handleClose() {
        this.props.onClose();
    }

    getContactList() {
        let list = [];
        let ds = new DataSet();
        ds.appendDataSet(this.state.contactData);
        ds.first();
        let index = 0;
        while (ds.fetch()) {
            let name = ds.getString('name_');
            let cropName = ds.getString('corp_name_');
            if (ds.getBoolean('user_code_')) {
                list.push(<li key={ds.recNo} onClick={this.handleCheck.bind(this, ds.recNo, 'click')} className={styles.contactBox}>
                    <img src={ds.getBoolean('Select_') ? ImageConfig.ICON_CHECKBOX_CHECKED : ImageConfig.ICON_CHECKBOX}></img>
                    <div className={styles.contactImage} style={{ 'backgroundColor': imageColorArr[(index++) % 7] }}>{name.substring(name.length - 2)}</div>
                    <div className={styles.contactInfo}>
                        <span>{name}</span>
                        {cropName ? <span>{cropName}</span> : ''}
                    </div>
                </li>)
            }
        }
        if (!list.length) {
            list.push(<li className={styles.noContact} key='noContact'>暂无联系人...</li>)
        }
        return <ul className={styles.contactList}>
            <li>所有联系人</li>
            {list}
        </ul>
    }

    getRight() {
        return <div className={styles.right}>
            {this.getChoseBox()}
            {this.getBtns()}
        </div>
    }

    // 获取选中联系人结构
    getChoseBox() {
        let list = this.state.userDataArr.map((row, index) => {
            return <li key={`chose${index}`}>
                <div>{row.getString('name_')}</div>
            </li>
        })
        return <div className={styles.choseBox}>
            <div>已选择</div>
            <ul className={styles.choseList}>{list}</ul>
        </div>
    }

    // 获取群名称以及操作按钮
    getBtns() {
        return <div className={styles.btnsBox}>
            <div>
                <label htmlFor="groupName">群名称：</label>
                <input type='text' value={this.state.groupName} id='groupName' onChange={(e) => {
                    this.setState({
                        groupName: e.target.value
                    })
                }} placeholder='取个群名称方便区分'></input>
            </div>
            <div className={styles.btns}>
                <button onClick={this.handleClose.bind(this)}>取消</button>
                <button className={(this.state.groupName && this.state.userCodeArr.length) ? '' : styles.diable} onClick={this.handleSubmit.bind(this)}>确定</button>
            </div>
        </div>
    }

    // 添加联系人
    handleCheck(recNo: number) {
        this.state.contactData.setRecNo(recNo);
        let row = this.state.contactData.current;
        row.setValue('Select_', !row.getBoolean('Select_'));
        let userCode = row.getString('user_code_');
        let index = this.state.userCodeArr.indexOf(userCode);
        if (index > -1) {
            this.state.userCodeArr.splice(index, 1);
            this.state.userDataArr.splice(index, 1);
        } else {
            this.state.userCodeArr.push(userCode);
            let dataRow = new DataRow();
            dataRow.copyValues(row);
            this.state.userDataArr.push(dataRow);
        }
        this.setState(this.state);
    }

    // 创建群组
    async handleSubmit() {
        if (this.state.groupName && this.state.userCodeArr.length) {
            let row = new DataRow();
            row.setValue('groupName', this.state.groupName).setValue('toUsers', this.state.userCodeArr.join(','));
            let ds = await PageApi.createGroup(row);
            if(ds.state <= 0) {
                showMsg(ds.message)
            } else {
                showMsg(`"${this.state.groupName}"群组创建成功。`);
                this.handleClose();
            }
        }

    }
}