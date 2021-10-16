import Footer from "../sample/Footer";
import * as sci from "./SummerCI";

let app = new sci.TApplication().setTitle("summer-ci 应用示例")

let page = new sci.TPage(app);

let msg = new sci.TSpan(new sci.TDiv(page).setCssStyle('background-color: aqua;height:1.5rem'));
msg.setText("欢迎使用sci前端框架!");

// 定义操作区
let boxTitle = new sci.TPanel(page).setCssStyle('height: 5rem; background-color: rgb(200,200,200);');
let grid = new sci.TGrid(new sci.TDiv(page, { id: 'grid' }).setCssStyle('flex:1'));
let statusBar = new sci.TStatusBar(page).setText('这里是状态栏');
new Footer(page, { year: 2021, corp: '深圳市华软资讯科技有限公司' });

let edtSearch = new sci.TEdit(boxTitle, { id: 'edtSearch', label: '搜索条件：' });
let button1 = new sci.TButton(boxTitle, { id: 'button1' }).setText('查询');
let dbn: sci.TDBNavigator;
let dataOut = new sci.DataSet();
dataOut.getFieldDefs().add('opera').setName('操作').onGetText = (row, meta) => {
    let code = row.getString('code_');
    return new sci.TButton(null).setText('删除').writeProperty('onclick', `deleteRecord('${code}')`).toString();
};

button1.addEventListener('click', () => {
    // 须启动summer-sample项目，配合提供后台数据服务
    let config = { sid: 'abc', host: 'http://127.0.0.1:80/services/' };
    let query = new sci.ServiceQuery(config);
    // 服务前置过滤
    query.getDataIn().getHead().setValue('code_', edtSearch.getValue());
    query.add("select code_,name_,age_,createTime_ from SvrExample.search");
    // 服务后置过滤，适合于后台提供的是复合服务
    // query.add(`where code_='${edtCode.getValue()}'`);
    query.open(ds => {
        statusBar.setText(ds.getMessage() || '.');
        if (ds.getState() < 1)
            return;
        
        dataOut.clear();
        dataOut.appendDataSet(ds);

        grid.clear();
        grid.setDataSet(dataOut);
        grid.addColumns(dataOut.getFieldDefs());
        if (dbn == undefined) {
            dbn = new sci.TDBNavigator(grid.getOwner(), { id: 'dbn' }).setDataSet(dataOut);
            let edtCode = new sci.TDBEdit(grid.getOwner(), { id: "edtCode", 'label': '工号：' });
            edtCode.setDataSource(dataOut).setDataField('code_');
            let edtName = new sci.TDBEdit(grid.getOwner(), { id: "edtName", 'label': '姓名：' });
            edtName.setDataSource(dataOut).setDataField('name_');
        }
        grid.getOwner().render();
    });
})


// @ts-ignore
window.deleteRecord = (code: string) => {
    let ds = grid.getDataSet();
    if (ds.locate('code_', code))
        ds.delete();
    grid.render();
}

let row = new sci.DataRow();
edtSearch.setRecord(row);

app.run();
