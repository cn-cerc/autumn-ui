import React from "react"
import { render } from "react-dom"
import { QueryService } from "../Autumn-UI";

type propsType = {
    token: string;
}

type stateType = {
    value: number;
}

export default class CheckDraftTB extends React.Component<propsType, stateType> {

    constructor(props: propsType) {
        super(props);
        this.state = {
            value: 0
        }
    }

    onClick = (el: any) => {
        location.href = "FrmMyGraftTB";
    }

    componentDidMount() {
        let host = window.location.protocol + "//" + window.location.hostname + "/services/";
        let query = new QueryService({ sid: this.props.token, host: host });
        query.add("select * from SvrCheckDraftTB.getDraftNum");
        query.open().then((dataOut) => {
            let value = dataOut.head.getNumber('draftNum')
            this.setState({ ...this.state, value: value });
        })
    }

    render() {
        return (
            <React.Fragment>
                <span>草稿单据</span>
                <span onClick={this.onClick} className="unread">
                    {this.state.value}
                </span>
            </React.Fragment>
        )
    }
}