import { TComponent } from "../SummerCI";

export default interface DataBind {

    bindClient(client: TComponent, register: boolean): void;

    bindRefresh(): void;

}