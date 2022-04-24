import React from "react";
import { Column, ColumnIt, DataSet, DBGrid } from "autumn-ui";
import "autumn-ui/assets/autumn-ui.css";

type pageTypeProps = {

}

type pageTypeState = {
    dataSet: DataSet
}

export default class newPage extends React.Component<pageTypeProps, pageTypeState> {
    constructor(props: pageTypeProps) {
        super(props);
        let dataSet = new DataSet();
        dataSet.append().setValue('name', '张三').setValue('sex', '男').setValue('age', 18);
        dataSet.append().setValue('name', '张三').setValue('sex', '男').setValue('age', 18);
        dataSet.append().setValue('name', '张三').setValue('sex', '男').setValue('age', 18);
        dataSet.append().setValue('name', '张三').setValue('sex', '男').setValue('age', 18);
        this.state = {
            dataSet
        }
    }

    render(): React.ReactNode {
        return <DBGrid dataSet={this.state.dataSet}>
            <ColumnIt></ColumnIt>
            <Column code='name' width='10' name='姓名'></Column>
            <Column code='sex' width='10' name='性别'></Column>
            <Column code='age' width='10' name='年龄'></Column>
        </DBGrid>
    }
}