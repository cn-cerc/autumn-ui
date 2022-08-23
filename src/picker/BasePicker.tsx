import { WebControl } from "autumn-ui";
import React from "react";
import { ReactNode } from "react";
import styles from "./BasePicker.css";

type BasePickerTypeProps = {

}

type BasePickerTypeState = {

}

export default abstract class BasePicker<P extends BasePickerTypeProps = BasePickerTypeProps, S extends BasePickerTypeState = BasePickerTypeState> extends WebControl<P, S> {
    state = {

    } as S;
    constructor(props: P) {
        super(props);
    }

    abstract content(): JSX.Element;

    render(): ReactNode {
        return <div className={styles.main}>
            {this.content()}
        </div>
    }

    componentWillMount() {
        console.log(event.target);
    }
}