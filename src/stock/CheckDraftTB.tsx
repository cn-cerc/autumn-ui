import { QueryService } from "autumn-ui";
import React from "react";
import StaticFile from "../static/StaticFile";

type propsType = {
    token: string;
}

type stateType = {
    value: number;
}

// 获取草稿单据数量
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
        let query = new QueryService({ sid: this.props.token });
        query.add("select * from SvrCheckDraftTB.getDraftNum");
        query.open().then((dataOut) => {
            let value = dataOut.head.getNumber('draftNum')
            this.setState({ ...this.state, value });
        })
    }

    render() {
        return (
            <React.Fragment>
                <img src={StaticFile.getImage('images/webdefault/icon_cgdj.png')} />
                <div>
                    <span>草稿单据</span>
                    <span onClick={this.onClick} className="unread">
                        {this.state.value}
                    </span>
                </div>
            </React.Fragment>
        )
    }
}