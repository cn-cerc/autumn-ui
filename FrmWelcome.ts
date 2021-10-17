import Footer from "./sample/Footer";
import { app } from "./src/ext/TApplication";
import { DataSet, ServiceQuery, TButton, TComponent, TDBEdit, TDBNavigator, TDiv, TEdit, TGrid, TPage, TPanel, TSpan, TStatusBar } from "./src/SummerCI";

export default class FrmWelcome extends TPage {
    private grid: TGrid;

    constructor(owner: TComponent, props: any = null) {
        super(owner, props);
        this.setTitle('welcome');

        let msg = new TSpan(new TDiv(this).setCssStyle('background-color: aqua;height:1.5rem'));
        msg.setText("欢迎使用sci前端框架!");

        // 定义操作区
        let boxTitle = new TPanel(this).setCssStyle('height: 5rem; background-color: rgb(200,200,200);');
        this.grid = new TGrid(new TDiv(this, { id: 'auto', style: 'flex:1' }), { id: 'grid' });
        this.grid.setCssStyle('flex:1');
        let statusBar = new TStatusBar(this).setText('这里是状态栏');
        new Footer(this, { year: 2021, corp: '深圳市华软资讯科技有限公司' });
        
        let edtSearch = new TEdit(boxTitle, { label: '搜索条件：' });
        let button1 = new TButton(boxTitle).setText('查询');
        let dbn: TDBNavigator;
        this.grid.setDataSet(new DataSet());
        this.grid.getDataSet().getFieldDefs().add('opera').setName('操作').onGetText = (row, meta) => {
            let code = row.getString('code_');
            return new TButton(null).setText('删除').writeProperty('onclick', `deleteRecord('${code}')`).toString();
        };

        button1.addEventListener('click', () => {
            // 须启动summer-sample项目，配合提供后台数据服务
            let config = { sid: 'abc', host: 'http://127.0.0.1:80/services/' };
            let query = new ServiceQuery(config);
            // 服务前置过滤
            query.getDataIn().getHead().setValue('code_', edtSearch.getValue());
            query.add("select code_,name_,age_,createTime_ from SvrExample.search");
            // 服务后置过滤，适合于后台提供的是复合服务
            // query.add(`where code_='${edtCode.getValue()}'`);
            query.open(ds => {
                statusBar.setText(ds.getMessage() || '查询成功!');
                if (ds.getState() < 1)
                    return;

                let dataOut = this.grid.getDataSet();
                this.grid.clear();

                dataOut.close();
                dataOut.getFieldDefs().copy(ds.getFieldDefs());
                dataOut.appendDataSet(ds);
                this.grid.setDataSet(dataOut);

                this.grid.addColumns(dataOut.getFieldDefs());
                if (dbn == undefined) {
                    dbn = new TDBNavigator(this.grid.getOwner()).setDataSet(dataOut);
                    let edtCode = new TDBEdit(this.grid.getOwner(), { 'label': '工号：' });
                    edtCode.setDataSource(dataOut).setDataField('code_');
                    let edtName = new TDBEdit(this.grid.getOwner(), { 'label': '姓名：' });
                    edtName.setDataSource(dataOut).setDataField('name_');
                }
                this.grid.getOwner().render();
            });
        })
    }
}
// @ts-ignore
window.deleteRecord = (code: string) => {
    let grid = app.getActivePage().getComponent('grid') as TGrid;
    let ds = grid.getDataSet();
    if (ds.locate('code_', code))
        ds.delete();
    else
        alert(`没有找到code=${code}`);
}
