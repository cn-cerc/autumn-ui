import { DataRow, DBEdit } from "autumn-ui";
import React from "react";
import DateDialog from "../dialog/DateDialog";

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