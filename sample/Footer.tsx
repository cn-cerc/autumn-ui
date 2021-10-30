import React from "react";

type PropsType = {
    corpName?: string;
    year?: string;
}

const FooterStyle = {
    fontSize: '0.85rem',
    textAlign: 'center',
    padding: '1rem'
}

export default class Footer extends React.Component<PropsType> {

    render() {
        return (
            <div style={FooterStyle} role="footer">
                开源管理：{this.props.corpName} copyright @{this.props.year}
            </div>
        )
    }

}
