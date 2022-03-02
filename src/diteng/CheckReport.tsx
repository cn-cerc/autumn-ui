import React from "react"
import QueryService from "../db/QueryService";

type propsType = {
    token: string;
}

type stateType = {
    value: number;
}

// 获取订阅的智能报表数量
export default class CheckReport extends React.Component<propsType, stateType> {

    constructor(props: propsType) {
        super(props);
        this.state = {
            value: 0
        }
    }

    onClick = (el: any) => {
        location.href = "FrmReport";
    }

    componentDidMount() {
        let query = new QueryService({ sid: this.props.token });
        query.dataIn.head.setValue('Status_', 0);
        query.add("select * from SvrReport.getOrderedReportNum");
        query.open().then((dataOut) => {
            let value = dataOut.getHead().getInt("Num_");
            this.setState({ ...this.state, value });
        })
    }

    render() {
        return (
            <React.Fragment>
                <span>智能报表</span>
                <span onClick={this.onClick} className="unread">
                    {this.state.value}
                </span>
            </React.Fragment>
        )
    }
}