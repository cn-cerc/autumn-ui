import React from "react";

type PropsType = {
    message: string;
}

export default class StatusBar extends React.Component<PropsType> {

    constructor(props: PropsType) {
        super(props)
    }


    render() {
        return (
            <div role="statusBar">${this.props.message}</div>
        )
    }
}
