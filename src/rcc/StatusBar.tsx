import React from "react";

type PropsType = {
    message: string;
}

const StatusBarStyle = {
    padding: '0.5rem'
}

export default class StatusBar extends React.Component<PropsType> {

    constructor(props: PropsType) {
        super(props)
    }

    render() {
        return (
            <div style={StatusBarStyle} role="statusBar">{this.props.message}</div>
        )
    }
}
