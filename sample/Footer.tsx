import React from "react";

type PropsType = {
    corpName?: string;
    year?: string;
}

export default class Footer extends React.Component<PropsType> {

    render() {
        return (
            <div role="footer">
                开源管理：${this.props.corpName} copyright @{this.props.year}
            </div>
        )
    }

}
