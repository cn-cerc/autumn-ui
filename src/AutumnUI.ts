import DataRow from "./db/DataRow";
import DataSet from "./db/DataSet";
import Datetime from "./db/Datetime";
import RemoteService from "./db/RemoteService";
import TGrid from "./ext/TGrid";
import TGridColumn from "./ext/TGridColumn";
import Grid from "./rcc/Grid";
import GridConfig from "./rcc/GridConfig";
import TComponent from "./ui/TComponent";

export default class AutumnUI {
    //db
    static Datetime = Datetime;
    static DataSet = DataSet;
    static DataRow = DataRow;
    static RemoteService = RemoteService;
    static QueryService = DataRow;
    //vcl
    static TComponent = TComponent;
    static TGridColumn = TGridColumn;
    static TGrid = TGrid;
    //rcc
    static Grid = Grid;
    static GridConfig = GridConfig;
}
