import React from "react";

type propsType = {
    message: string;
}

export default class MainMessage extends React.Component<propsType> {

    constructor(props: propsType) {
        super(props)
    }

    render() {
        return (
            <div className='mainMessage'></div>
        )
    }
}
