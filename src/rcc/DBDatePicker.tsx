import React from "react";
import DataRow from "../db/DataRow";
import DateDialog from "../diteng/DateDialog";
import DBEdit from "./DBEdit";

type DatePickerTypeProps = {
    dataField: string,
    dataName: string,
    dataRow?: DataRow,
    onChanged?: Function
}

export default class DBDatePicker extends React.Component<DatePickerTypeProps> {
    constructor(props: DatePickerTypeProps) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <React.Fragment>
                <DBEdit dataField={this.props.dataField} dataName={this.props.dataName} dataRow={this.props.dataRow}>
                    <DateDialog isChild={true} dataRow={this.props.dataRow} dataField={this.props.dataField} handleSelect={this.props.onChanged} />
                </DBEdit>
            </React.Fragment>
        )
    }
}