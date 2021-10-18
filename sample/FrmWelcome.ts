import Footer from "./Footer";
import { app } from "../src/ext/TApplication";
import { DataSet, QueryService, TButton, TComponent, TDBEdit, TDBNavigator, TDiv, TEdit, TGrid, TPage, TPanel, TSpan, TStatusBar } from "../src/SummerCI";

export default class FrmWelcome extends TPage {
    private _grid: TGrid;

    constructor(owner: TComponent, props: any = null) {
        super(owner, props);
        this.title = 'welcome';

        let msg = new TSpan(new TDiv(this).setCssStyle('background-color: aqua;height:1.5rem'));
        msg.text = "欢迎使用sci前端框架!";

        // 定义操作区
        let boxTitle = new TPanel(this).setCssStyle('height: 5rem; background-color: rgb(200,200,200);');
        this._grid = new TGrid(new TDiv(this, { id: 'auto', style: 'flex:1' }), { id: 'grid' });
        this._grid.setCssStyle('flex:1');
        let statusBar = new TStatusBar(this);
        statusBar.text = '这里是状态栏';
        new Footer(this, { year: 2021, corp: '深圳市华软资讯科技有限公司' });

        let edtSearch = new TEdit(boxTitle, { label: '搜索条件：' });
        let button1 = new TButton(boxTitle, { text: '查询' });
        let dbn: TDBNavigator;
        this._grid.dataSet = new DataSet();
        let opera = this._grid.dataSet.fieldDefs.add('opera');
        opera.name = '操作';
        opera.onGetText = (row, meta) => {
            let code = row.getString('code_');
            return new TButton(null, { text: '删除' }).writeProperty('onclick', `deleteRecord('${code}')`).toString();
        };

        button1.addEventListener('click', () => {
            // 须启动summer-sample项目，配合提供后台数据服务
            let config = { sid: 'abc', host: 'http://127.0.0.1:80/services/' };
            let query = new QueryService(config);
            // 服务前置过滤
            query.dataIn.head.setValue('code_', edtSearch.value);
            query.add("select * from SvrExample.search");
            query.open(ds => {
                statusBar.text = ds.message || '查询成功!';
                if (ds.state < 1)
                    return;

                let dataOut = this._grid.dataSet;
                this._grid.clear();

                dataOut.close();
                dataOut.fieldDefs.copy(ds.fieldDefs);
                dataOut.appendDataSet(ds);
                this._grid.dataSet = dataOut;

                this._grid.addColumns(dataOut.fieldDefs);
                if (dbn == undefined) {
                    dbn = new TDBNavigator(this._grid.owner);
                    dbn.dataSet = dataOut;
                    let edtCode = new TDBEdit(this._grid.owner, { 'label': '工号：' });
                    edtCode.dataSource = dataOut;
                    edtCode.dataField = 'code_';
                    let edtName = new TDBEdit(this._grid.owner, { 'label': '姓名：' });
                    edtName.dataSource = dataOut;
                    edtName.dataField = 'name_';
                }
                this._grid.owner.render();
                dataOut.first();
            });
        })
    }
}
// @ts-ignore
window.deleteRecord = (code: string) => {
    let grid = app.getActivePage().getComponent('grid') as TGrid;
    if (grid.dataSet.locate('code_', code))
        grid.dataSet.delete();
    else
        alert(`没有找到code=${code}`);
}
