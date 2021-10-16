import * as sci from "./SummerCI";

let app = new sci.TApplication();
app.setTitle("summer-ci 应用示例")

let ds = new sci.DataSet();

let page = new sci.TPage(app);
let msg = new sci.TSpan(new sci.TDiv(page).setCssStyle('background-color: aqua;height:1.5rem'));
msg.setText("欢迎使用sci前端框架!");

// 定义操作区
let boxTitle = new sci.TPanel(page).setCssStyle('height: 5rem; background-color: rgb(200,200,200);');
let edtCode = new sci.TEditText(boxTitle);
edtCode.setId('edtCode');
edtCode.setLabel('搜索条件：').setDefaultValue('');

let grid: sci.TGrid = new sci.TGrid(new sci.TDiv(page).setCssStyle('flex:1')).setDataSet(ds);
grid.setId('grid').setCssStyle("width:100%");

let button1 = new sci.TButton(boxTitle).setText('查询');
// 可启动summer-sample提供后台服务
let serviceConfig = { sid: 'abc', host: 'http://127.0.0.1:80/services/' };

button1.setId('button1').addEventListener('click', () => {
    let query = new sci.ServiceQuery(serviceConfig);
    // 服务前置过滤
    query.getDataIn().getHead().setValue('code_', edtCode.getValue());
    query.add("select code_,name_,age_,createTime_ from SvrExample.search");
    // 服务后置过滤，适合于后台提供的是复合服务
    // query.add(`where code_='${edtCode.getValue()}'`);
    query.open(ds => {
        bar.setText(ds.getMessage() || '.');
        if (ds.getState() < 1)
            return;

        grid.clear();
        grid.setDataSet(ds);
        ds.getFieldDefs().add('opera').setName('操作').onGetText = (row, meta) => {
            let code = row.getString('code_');
            return new sci.TButton(null).setText('删除').writeProperty('onclick', `deleteRecord('${code}')`).toString();
        };
        grid.addColumns(ds.getFieldDefs());
        grid.render();
    });
})

// @ts-ignore
window.deleteRecord = (code: string) => {
    let ds = grid.getDataSet();
    if (ds.locate('code_', code))
        ds.delete();
    grid.render();
}

let bar = new sci.TStatusBar(page).setText('这里是状态栏');
app.run();
