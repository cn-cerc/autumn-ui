import React from "react"
import { QueryService } from "../Autumn-UI";

type propsType = {
    token: string;
}

type stateType = {
    value: number;
}

// 获取待签单据数量
export default class CheckWorkflow extends React.Component<propsType, stateType> {

    constructor(props: propsType) {
        super(props);
        this.state = {
            value: 0
        }
    }

    onClick = (el: any) => {
        location.href = "FrmMyWorkFlow";
    }

    componentDidMount() {
        let query = new QueryService({ sid: this.props.token });
        query.dataIn.head.setValue('Status_', 0);
        query.add("select * from SvrMyWorkFlow.search");
        query.open().then((dataOut) => {
            let value = dataOut.size;
            this.setState({ ...this.state, value });
        })
    }

    render() {
        return (
            <React.Fragment>
                <span>待签单据</span>
                <span onClick={this.onClick} className="unread">
                    {this.state.value}
                </span>
            </React.Fragment>
        )
    }
}