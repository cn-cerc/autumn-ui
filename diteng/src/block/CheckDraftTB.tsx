import React from "react";
import { QueryService } from "autumn-ui";
import StaticPath from "../StaticPath";

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
                <img src={StaticPath.getImage('images/webdefault/icon_cgdj.png')} />
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