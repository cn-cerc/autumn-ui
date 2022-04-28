import React, { ReactNode } from "react";

type propsType = {
    message: string;
    children?: ReactNode | undefined
}

export default class MainMessage extends React.Component<propsType> {

    constructor(props: propsType) {
        super(props)
    }

    render() {
        return (
            <div></div>
        )
    }
}
