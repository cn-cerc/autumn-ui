import React from "react";
import styles from './MainMessage.css'

type propsType = {
    message: string;
}

export default class MainMessage extends React.Component<propsType> {

    constructor(props: propsType) {
        super(props)
    }

    render() {
        return (
            <div className={styles.main}></div>
        )
    }
}
