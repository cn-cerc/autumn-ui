import React from 'react';
import { DataSet, BaseDialogStateType, BaseDialog } from 'autumn-ui';
import DialogApi from './DialogApi';
import styles from './SalesmanDialog.css';

type SalesmanTypeProps = {
    inputId: string,
}

type SalesmanTypeState = {
    dataSet: DataSet,
    groups: Map<string, string>,
    deptName: string
} & Partial<BaseDialogStateType>

export default class SalesmanDialog extends BaseDialog<SalesmanTypeProps, SalesmanTypeState> {
    constructor(props: SalesmanTypeProps) {
        super(props);
        this.state = {
            ...this.state,
            dataSet: new DataSet(),
            groups: new Map(),
            deptName: "",
            width: '25rem',
            height: '25rem'
        }
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setLoad(true);
        let dataSet = await DialogApi.getUserList();
        dataSet.first();
        let groups = new Map();
        groups.set('所有部门', '');
        while (dataSet.fetch()) {
            let deptName = dataSet.getString('DeptName_');
            if (deptName)
                groups.set(deptName, deptName);
        }
        this.setLoad(false);
        this.setState({
            dataSet,
            groups
        })
    }

    getGroupList() {
        let groups: any[] = [];
        this.state.groups.forEach((value, key) => {
            groups.push(<li key={key} onClick={this.setDeptName.bind(this, value)}>{key}</li>)
        })
        return ((<ul className={styles.groupList}>{groups}</ul>))
    }

    getBusinessList() {
        let businesses = [];
        this.state.dataSet.first();
        while (this.state.dataSet.fetch()) {
            let name = this.state.dataSet.getString("Name_");
            let code = this.state.dataSet.getString("Code_");
            if (this.state.deptName) {
                if (this.state.deptName == this.state.dataSet.getString("DeptName_")) {
                    businesses.push((
                        <li key={code} onClick={this.setBusiness.bind(this, code, name)}><span>{name}</span></li>
                    ))
                }
            } else {
                businesses.push((
                    <li key={code} onClick={this.setBusiness.bind(this, code, name)}><span>{name}</span></li>
                ))
            }
        }
        return ((<ul className={styles.businessList}>{businesses}</ul>))
    }

    setDeptName(deptName: string) {
        this.setState({
            deptName: deptName.trim()
        });
    }

    setBusiness(code: string, business: string) {
        let inputIds = this.props.inputId.split(",");
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        input1.value = code;
        if (inputIds.length > 1) {
            let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
            input2.value = business;
        }
        this.handleSelect();
    }

    content() {
        return (
            <div className={styles.main}>
                {this.getGroupList()}
                {this.getBusinessList()}
            </div>
        )
    }
}