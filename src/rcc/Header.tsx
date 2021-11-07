import React from "react";
import './Header.css'

type PropsType = {
    title: string;
}

export default function Header(props: PropsType) {
    return (
        <div role="header">{this.props.title}</div>
    )
}
