import React from "react";
import DataRow from "../db/DataRow";
import styles from './SearchPanel1.css'

type propsType = {
    dataRow: DataRow;
}

export default class SearchPanel1 extends React.Component<propsType> {
    constructor(props: propsType) {
        super(props);
    }

    render() {
        return (
            <div className={styles.main}>
                {React.Children.map(this.props.children, (child, index) => {
                    return child;
                })}
            </div>
        )
    }

}