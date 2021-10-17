import DataControl from "./DataControl";

export default interface DataBind {

    registerBind(client: DataControl, register: boolean): void;

    refreshBind(content: any): void;

    setBindEnabled(value: boolean): object;
    
    getBindEnabled(): boolean;
}