import DataControl from "./DataControl";

export default interface DataBind {

    bindClient(client: DataControl, register: boolean): void;

    bindRefresh(): void;

}