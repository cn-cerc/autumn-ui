import React from "react";
import ReactDOM from "react-dom";
import { TGridColumn, TGridGroupChild, TGridGroupMaster } from "../src/Autumn-UI";
import DataSet from "../src/db/DataSet";
import KeyValue from "../src/db/KeyValue";
import Grid from "../src/rcc/Grid";
let dataSet = new DataSet();
dataSet.append();
dataSet.setValue('a', 1);
dataSet.setValue('b', 2);
dataSet.setValue('c', 3);

dataSet.append();
dataSet.setValue('a', 11);
dataSet.setValue('b', 21);
dataSet.setValue('c', 31);

let master = new TGridGroupMaster(null);
new TGridColumn(master, 'a', 'A栏');
new TGridColumn(master, 'b', 'B栏');
let child = new TGridGroupChild(null);
new TGridColumn(child, 'c', 'C栏');

child.onOutput = (child: TGridGroupChild, display: KeyValue) => {
    if (child.current.getNumber('a') == 11){
        display.value = true;
    }
}

ReactDOM.render(<Grid dataSet={dataSet} master={master} child={child} />, document.getElementById('app'));
