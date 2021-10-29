import React, { Component } from 'react';
import { DataRow } from '../Autumn-UI';
import DataSet from '../db/DataSet';
import FieldMeta from '../db/FieldMeta';

type PropType = {
    dataSet: DataSet;
};

export default class Grid extends React.Component<PropType> {

    constructor(props: PropType) {
        super(props)
    }

    getTitle(item: FieldMeta): React.ReactNode {
        return <th key={item.code}>{item.name ? item.name : item.code}</th>
    }

    getRows(): any[] {
        let items: any[] = [];
        let ds = this.props.dataSet;
        ds.first();
        while (ds.fetch())
            items.push(this.getRow(ds.getCurrent()));
        return items;
    }

    getRow(row: DataRow) {
        let items: any[] = [];
        for (let meta of this.props.dataSet.fieldDefs.fields)
            items.push(this.getColumn(row, meta));
        return <tr>{items}</tr>;
    }

    getColumn(row: DataRow, meta: FieldMeta) {
        let value = row.getText(meta.code);
        return <td>{value}</td>
    }

    render() {
        return (
            <table style={{ width: '100%', border: '2px solid #444;' }}>
                <tbody>
                    <tr>{this.props.dataSet.fieldDefs.fields.map(item => {
                        return this.getTitle(item);
                    })}
                    </tr>
                    {this.getRows().map(item => item)}
                </tbody>
            </table >
        )
    }

}

