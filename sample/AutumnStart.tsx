import React from "react";
import ReactDOM from "react-dom";
import DataSet from "../src/db/DataSet";
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

ReactDOM.render(<Grid dataSet={dataSet} />, document.getElementById('app'));
