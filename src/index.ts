import DataRow from "./db/DataRow";
import DataSet from "./db/DataSet";
import Datetime from "./db/Datetime";
import QueryService from "./db/QueryService";
import RemoteService from "./db/RemoteService";
import Grid from "./rcc/Grid";
import GridConfig from "./rcc/GridConfig";
import TComponent from "./vcl/TComponent";
import TGrid from "./vcl/TGrid";
import TGridColumn from "./vcl/TGridColumn";

export default {
    //db
    Datetime,
    DataSet,
    DataRow,
    RemoteService,
    QueryService,
    //vcl
    TComponent,
    TGridColumn,
    TGrid,
    //rcc
    Grid,
    GridConfig,
}
