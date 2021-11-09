import React, { ChangeEventHandler, MouseEventHandler } from 'react';
import DataSet from '../db/DataSet';
import styles from './SalesmanDialog.css';

type propsType = {
    inputId: string,
    viewId: string,
    items: string,
    groups: string
}

type stateType = {
    inputId: string,
    viewId: string,
    dataSet: DataSet,
    groups: string[],
    deptName: string
}

export default class SalesmanDialog extends React.Component<propsType, stateType> {
    constructor(props: propsType) {
        super(props);
        let dataSet: DataSet = new DataSet();
        dataSet.setJsonString(this.props.items);
        console.log(JSON.parse(this.props.items));
        console.log(dataSet)
        let str: string = this.props.groups.replace("[", "");
        let groups: string[] = str.replace("]", "").split(",");
        this.state = {
            inputId: this.props.inputId,
            viewId: this.props.viewId,
            dataSet,
            groups,
            deptName: ""
        }
    }

    getGroupList() {
        let groups = this.state.groups.map((group) => (<li key={group} onClick={() => this.setDeptName(group)}>{group}</li>));
        groups.unshift((<li key="所有部门" onClick={() => this.setDeptName("")}>所有部门</li>))
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
                        <li key={code} onClick={() => this.setBusiness(code, name)}><span>{name}</span></li>
                    ))
                }
            } else {
                businesses.push((
                    <li key={code} onClick={() => this.setBusiness(code, name)}><span>{name}</span></li>
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
        console.log($("#" + this.state.inputId, parent.document))
        let inputIds = this.props.inputId.split(",");
        $("#" + inputIds[0], parent.document).val(code);
        $("#" + inputIds[1], parent.document).val(business);
        //@ts-ignore
        top.deleteDialog(this.props.viewId);
    }

    render() {
        return (
            <div className={styles.salesmanDialog}>
                {this.getGroupList()}
                {this.getBusinessList()}
            </div>
        )
    }
}