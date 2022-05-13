import React from "react";
import { OnSelectDataRowEvent, DataSet, ListGrid, Column, OnListFilterEvent, DataRow, ClientSite, OnRowClickEvent } from "autumn-ui";
import AccCodeLists from "./AccCodeLists";
import styles from './ListAccCode.css';

type TypeProps = {
    site?: ClientSite;
    style?: object;
    filterText?: string;
    onSelect?: OnSelectDataRowEvent;
    showTable?: boolean
}

type TypeState = {
    dataSet: DataSet;
    active: boolean;
}

export default class ListAccCode extends React.Component<TypeProps, TypeState> {
    static defaultProps = { site: { top: -1, left: -1 } }

    constructor(props: TypeProps) {
        super(props);
        let lists = new AccCodeLists();
        this.state = { dataSet: lists.dataSet, active: this.props.site.left > -1 }
    }

    render() {
        console.log(this.props)
        let style = { ...this.props.site };
        if (!this.state.active)
            return null;
        return (
            <div className={styles.main} style={Object.assign({'display': this.props.showTable ? 'block' : 'none'}, style)}>
                <ListGrid dataSet={this.state.dataSet} onFilter={this.onFilter} onRowClick={this.onRowClick}>
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
