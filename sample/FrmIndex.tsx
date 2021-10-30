import React from "react";
import Header from "../src/rcc/Header";

type PropsType = {
    title: string;
}

export default class FrmIndex extends React.Component<PropsType> {

    constructor(props: PropsType) {
        super(props)
    }

    render() {
        return <Header title='首页'/>
    }

}