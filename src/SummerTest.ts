import * as sci from "./SummerCI";

let app = new sci.TApplication();
app.setTitle("summer-ci 应用示例")

let page = new sci.TPage(app);
let ds = new sci.DataSet();
let memo = new sci.TSpan(new sci.TDiv(page));

// 定义操作区
let tools = new sci.TPanel(page);
let edtCode = new sci.TEditText(tools);
edtCode.setId('edtCode');
edtCode.setLabel('搜索条件：').setDefaultValue('');

let button1 = new sci.TButton(tools).setText('查询');
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
        memo.setText(ds.getMessage())
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
let grid: sci.TGrid = new sci.TGrid(page).setDataSet(ds);
grid.setId('grid')

//定义数据源

let button2 = new sci.TButton(tools).setText('测试表格折叠行');
button2.setId('button2').addEventListener('click', () => {
    if (!grid) {
        grid = new sci.TGrid(page).setDataSet(ds);
        grid.setId('grid')
    }
    ds.clear();
    ds.append().setValue('code', 'a001').setValue('name', 'jason').setValue('remark', 'jason_remark').setValue("home", "shenzhen");
    ds.append().setValue('code', 'a002').setValue('name', 'itjun').setValue('remark', 'itjun_remark').setValue("home", "guangxi");
    ds.getFieldDefs().add("opera").setName('操作').onGetText = (row: sci.DataRow, meta: sci.FieldMeta) => {
        let recNo = row.getString('code');
        let html = new sci.HtmlWriter();
        new sci.TA(null).setText('展开').setHref(`javascript:displaySwitch('${recNo}')`).output(html);
        return html.getText();
    };

    grid.clear();
    grid.setDataSet(ds);
    new sci.TGridColumn(grid, 'code', '代码2').setWidth(3).setAlign("center");
    new sci.TGridColumn(grid, 'name', '名字2').setWidth(3);
    new sci.TGridColumn(grid, 'opera', '操作2').setWidth(3);

    let child = new sci.TGridGroupChild(grid);
    new sci.TGridColumn(child, "home", "备注2");
    new sci.TGridColumn(child, "remark", "备注1");

    page.render();
})

// @ts-ignore
window.displaySwitch = (recNo: string) => {
    let el = document.getElementById(`tr${recNo}_1`);
    let style = el.style;
    let value = style.getPropertyValue('display');
    if (value == "none")
        style.removeProperty('display');
    else
        style.setProperty('display', 'none');
}

// @ts-ignore
window.deleteRecord = (code: string) => {
    let ds = grid.getDataSet();
    if (ds.locate('code_', code))
        ds.delete();
    grid.render();
}

memo.setText("欢迎使用sci前端渲染框架!");

app.run();
