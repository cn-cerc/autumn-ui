import React, { ReactNode } from "react";
declare type propsType = {
    message: string;
    children?: ReactNode | undefined;
};
export default class MainMessage extends React.Component<propsType> {
    constructor(props: propsType);
    render(): JSX.Element;
}
export {};
