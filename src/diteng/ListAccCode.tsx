import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import { ClientSite, ListGrid, OnListFilterEvent } from "../rcc/ComboBox";
import { Column, OnRowClickEvent } from "../rcc/DBGrid";
import { OnSelectDataRowEvent } from "../rcc/DialogComponent";
import styles from './ListAccCode.css';

type TypeProps = {
    site?: ClientSite;
    style?: object;
    filterText?: string;
    onSelect?: OnSelectDataRowEvent;
}

type TypeState = {
    dataSet: DataSet;
    active: boolean;
}

export default class ListAccCode extends React.Component<TypeProps, TypeState> {
    static defaultProps = { site: { top: -1, left: -1 } }

    constructor(props: TypeProps) {
        super(props);
        let dataSet = new DataSet();
        dataSet.append().setValue('code_', '1001').setValue('name_', '固定资产');
        dataSet.append().setValue('code_', '1001-001').setValue('name_', '固定资产-办公设备');
        dataSet.append().setValue('code_', '1002').setValue('name_', '流动资产');
        dataSet.append().setValue('code_', '1002-001').setValue('name_', '流动资产-现金');
        dataSet.append().setValue('code_', '1002-002').setValue('name_', '流动资产-银行存款');
        this.state = { dataSet, active: this.props.site.left > -1 }
    }

    render() {
        let style = { ...this.props.site };
        if (!this.state.active)
            return null;
        return (
            <div className={styles.main} style={style}>
                <ListGrid dataSource={this.state.dataSet} onFilter={this.onFilter} onRowClick={this.onRowClick}>
                    <Column code='code_' name='会计科目' width='10'></Column>
                    <Column code='name_' name='科目名称' width='20'></Column>
                </ListGrid>
            </div>
        )
    }

    onFilter: OnListFilterEvent = (row: DataRow) => {
        let value = row.getString('code_');
        let filter = this.props.filterText;
        if (value.length < filter.length)
            return false;

        return value.substr(0, filter.length) == filter;
    }

    onRowClick: OnRowClickEvent = (row: DataRow) => {
        if (this.props.onSelect)
            this.props.onSelect(row);
        this.setState({ ...this.state, active: false })
    }

}
