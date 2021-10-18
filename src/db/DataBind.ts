import DataControl from "./DataControl";

export default interface DataBind {

    registerBind(client: DataControl, register: boolean): void;

    refreshBind(content: any): void;

    set bindEnabled(value: boolean);
    
    get bindEnabled(): boolean;
}