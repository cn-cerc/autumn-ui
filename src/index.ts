import DataRow from "./db/DataRow";
import DataSet from "./db/DataSet";
import Datetime from "./db/Datetime";
import QueryService from "./db/QueryService";
import RemoteService from "./db/RemoteService";
import Grid from "./rcc/Grid";
import TComponent from "./vcl/TComponent";
import TGrid, { TGridColumn, TGridConfig } from "./vcl/TGrid";
import TCustomComponent from "./vcl/TCustomComponent";

export default {
    //db
    Datetime,
    DataSet,
    DataRow,
    RemoteService,
    QueryService,
    //vcl
    TComponent,
    TGrid,
    TGridColumn,
    TGridConfig,
    //rcc
    Grid,
    //地藤jsp转java中js继承类
    TCustomComponent
}
