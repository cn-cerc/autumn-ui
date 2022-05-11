import React, { ReactNode } from "react";

type PropsType = {
    corpName?: string;
    year?: string;
    children?: ReactNode | undefined
}

const FooterStyle = {
    fontSize: '0.85rem',
    textAlign: 'center' as const,
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
