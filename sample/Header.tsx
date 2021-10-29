import React from "react";

type PropsType = {
    title: string;
}

export default class Header extends React.Component<PropsType> {

    constructor(props: PropsType) {
        super(props)
    }

    render() {
        return (
        <div role="header">${this.props.title}</div>
        )
    }
}