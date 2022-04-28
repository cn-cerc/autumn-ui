import React, { ReactNode } from "react";
import KeyValue from "../db/KeyValue";
declare type propsType = {
    menus: KeyValue[];
    children?: ReactNode | undefined;
};
export default class MenuPath extends React.Component<propsType> {
    constructor(props: propsType);
    getItems(): ReactNode[];
    render(): JSX.Element;
}
export {};
