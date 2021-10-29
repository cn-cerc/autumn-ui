import React from "react";
import DataSet from "../src/db/DataSet";
import KeyValue from "../src/db/KeyValue";
import TGridColumn from "../src/ext/TGridColumn";
import TGridGroupChild from "../src/ext/TGridGroupChild";
import TGridGroupMaster from "../src/ext/TGridGroupMaster";
import Grid from "../src/rcc/Grid";

export default class FrmGridTest extends React.Component {
    dataSet: DataSet;
    master: TGridGroupMaster;
    child: TGridGroupChild;

    constructor(props: any) {
        super(props)
        this.dataSet = new DataSet();
        this.dataSet.append();
        this.dataSet.setValue('a', 1);
        this.dataSet.setValue('b', 2);
        this.dataSet.setValue('c', 3);

        this.dataSet.append();
        this.dataSet.setValue('a', 11);
        this.dataSet.setValue('b', 21);
        this.dataSet.setValue('c', 31);

        this.master = new TGridGroupMaster(null);
        new TGridColumn(this.master, 'a', 'A栏');
        new TGridColumn(this.master, 'b', 'B栏');
        this.child = new TGridGroupChild(null);
        new TGridColumn(this.child, 'c', 'C栏');

        this.child.onOutput = (child: TGridGroupChild, display: KeyValue) => {
            if (child.current.getNumber('a') == 11) {
                display.value = true;
            }
        }
    }

    render() {
        return (<div><Grid dataSet={this.dataSet} master={this.master} child={this.child} /></div>)
    }

}
