import DataBind from "./DataBind";
import DataRow from "./DataRow";

export default interface DataSource extends DataBind {

    get current(): DataRow;

}