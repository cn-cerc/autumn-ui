import * as sci from "./SummerCI";

let mainform = new sci.TWinForm();
mainform.setTitle("hello world!")

// 定义操作区
let tools = new sci.TPanel(mainform);
let edtCode = new sci.TEditText(tools);
edtCode.setId('edtCode');
edtCode.setLabel('搜索条件：').setDefaultValue('');

let button1 = new sci.TButton(tools).setText('查询');
// 可启动summer-sample提供后台服务
let serviceConfig = { sid: 'abc', host: 'http://127.0.0.1:80/services/' };

button1.setId('button1').addEventListener('click', () => {
    let query = new sci.ServiceQuery(serviceConfig);
    // 服务前置过滤
    query.getDataIn().getHead().setValue('code_', edtCode.getInputValue());
    query.add("select code_,name_,age_,createTime_ from SvrExample.search");
    // 服务后置过滤，适合于后台提供的是复合服务
    // query.add(`where code_='${edtCode.getInputValue()}'`);
    query.open(ds => {
        grid.clear();
        memo.setText("dataset: " + ds.getJson())
        if (ds.getState() > 0)
            grid.setDataSet(ds).addColumns(ds.getFieldDefs());
        mainform.render();
    });
})

//定义数据源
let ds = new sci.DataSet();
let grid = new sci.TGrid(mainform).setDataSet(ds);
let memo = new sci.TSpan(mainform);

let button2 = new sci.TButton(tools).setText('删除');
button2.setId('button2').addEventListener('click', () => {
    let rs = new sci.RemoteService(serviceConfig);
    rs.setService('SvrExample.search')
    rs.getDataIn().getHead().setValue('code_', edtCode.getInputValue());
    rs.exec(dataOut => {
        grid.clear();
        memo.setText("dataset: " + dataOut.getJson())
        if (dataOut.getState() > 0)
            grid.setDataSet(dataOut).addColumns(dataOut.getFieldDefs());
        mainform.render();
    });
});

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

ds.append().setValue('code', 'a001').setValue('name', 'jason').setValue('remark', 'jason_remark').setValue("home", "shenzhen");
ds.append().setValue('code', 'a002').setValue('name', 'itjun').setValue('remark', 'itjun_remark').setValue("home", "guangxi");
ds.getFieldDefs().add("opera").setName('操作').onGetText = (row: sci.DataRow, meta: sci.FieldMeta) => {
    let recNo = row.getDataSet().getRecNo();
    let html = new sci.HtmlWriter();
    new sci.TA(null).setText('展开').setHref(`javascript:displaySwitch('${recNo}')`).output(html);
    return html.getText();
};

// <td align="center" role="expend"><a href="javascript:displaySwitch('1')">展开</a></td>

new sci.TGridColumn(grid, 'code', '代码2').setWidth(3).setAlign("center");
new sci.TGridColumn(grid, 'name', '名字2').setWidth(3);
new sci.TGridColumn(grid, 'opera', '操作2').setWidth(3);

let child = new sci.TGridGroupChild(grid);
new sci.TGridColumn(child, "home", "备注2");
new sci.TGridColumn(child, "remark", "备注1");

memo.setText("dataset: " + ds.getJson())

mainform.render();
