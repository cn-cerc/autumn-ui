import React from "react";

type PropsType = {
    title: string;
}

const headerStyle = {
    textAlign: 'center',
    padding: '0.5rem'
}

export default class Header extends React.Component<PropsType> {

    constructor(props: PropsType) {
        super(props)
    }

    render() {
        return (
            <div style={headerStyle} role="header">{this.props.title}</div>
        )
    }
}