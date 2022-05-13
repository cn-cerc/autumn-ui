import React, { ReactNode } from "react";

type PropsType = {
    title: string;
    children?: ReactNode | undefined
}

export default function Header(props: PropsType) {
    return (
        <div role="header">{this.props.title}</div>
    )
}
