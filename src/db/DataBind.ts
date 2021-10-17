import DataControl from "./DataControl";

export default interface DataBind {

    registerBind(client: DataControl, register: boolean): void;

    refreshBind(): void;

}