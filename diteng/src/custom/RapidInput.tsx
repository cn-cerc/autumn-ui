import React from "react";
import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Column, ColumnIt, DataRow, DataSet, DBDrop, DBEdit, DBGrid, MainRow, SearchPanel } from "autumn-ui";
import Tree, { dataType, treeIcons, treeType } from "../block/Tree";
import DialogApi from "../dialog/DialogApi";
import Datetime from "../tool/Datetime";
import { AuiMath, showMsg } from "../tool/Summer";
import { ClientStorage } from "../tool/Utils";
import styles from "./RapidInput.css";
import StaticFile from "../StaticFile";

type RapidInputTypeProps = {
    objCode: string,
    tb: string,
    showFlag: Boolean
} & Partial<BaseDialogPropsType>

type executeInfo = {
    time: string,
    msg: string
}

type RapidInputTypeStates = {
    dataSet: DataSet,
    data: DataSet,
    dataIn: DataRow,
    showMenus: boolean,
    shopBrands: Map<string, string>,
    records: Map<string, number>,
    searchTimes: Map<string, number>,
    executeInfos: executeInfo[],
    showShopCar: boolean,
    defaultLines: number,
    copyLines: number,
    lineHieght: number,
    showLineProps: boolean,
    showEnterInput: boolean,
    enterData: DataRow,
    isFullScreen: boolean,
    currentShop: number, // 用于标识在商品列表中选中的当前商品
    currentShoped: number, // 用于标识在购物车列表中当前选中的商品
    scrollTopHeight: number,
    treeData: treeType[],
    treeIcons: treeIcons,
    isInput: boolean, // 用于键盘事件监听时与输入框输入时区别开来
    timer: any, // 用于执行自动查询的定时器
    openFlag: boolean,
    productsMsg: string
} & Partial<BaseDialogStateType>

export default class RapidInput extends BaseDialog<RapidInputTypeProps, RapidInputTypeStates> {
    private _client: ClientStorage = new ClientStorage('Popup');
    private _keyClient: ClientStorage = new ClientStorage('ErpKey');
    private _gridOneH: number;
    private _gridTwoH: number;
    private _listener: any // 键盘事件监听;
    private _click: any // 点击事件监听;
    private _keyup: any // 按键松开事件监听;
    private _girdTwo: any;
    private _currentShop: number = 0;
    private _currentShoped: number = 0;
    constructor(props: RapidInputTypeProps) {
        super(props);
        let shopBrands = new Map();
        shopBrands.set('所有品牌', '');
        let dataIn = new DataRow();
        dataIn.setValue('searchTime', 3);
        if (this._client.get('searchTime'))
            dataIn.setValue('searchTime', Number(this._client.get('searchTime')));
        dataIn.setValue('MaxRecord', 100);
        if (this._client.get('maxRecord'))
            dataIn.setValue('MaxRecord', Number(this._client.get('maxRecord')));
        if (this._client.get('enterInput') == 'true')
            dataIn.setValue('enterInput', this._client.get('enterInput'));
        if (this._client.get('Stock_') == 'true')
            dataIn.setValue('Stock_', true);
        dataIn.setValue('ObjCode_', this.props.objCode);
        dataIn.setValue('TB_', this.props.tb);
        if (document.querySelector('#WHCode_')) {
            let input = document.querySelector('#WHCode_') as HTMLInputElement;
            dataIn.setValue('CWCode_', input.value);
        }
        let fontSize: string = getComputedStyle(document.querySelector('html'))['fontSize'];
        let isFullScreen = this._keyClient.get(`popupScreen_${this._keyClient.get('Account1')}`) === 'true';
        let lineKey = `${isFullScreen ? 'fullSearchLines_' : 'searchLines_'}${this._keyClient.get('Account1')}`;
        let showEnterInput = this._keyClient.get(`enterInput`) === 'true';
        this.state = {
            ...this.state,
            dataSet: new DataSet(),
            data: new DataSet(),
            dataIn,
            showMenus: true,
            shopBrands,
            isInput: false,
            records: new Map([['100', 100], ['200', 200], ['500', 500]]),
            searchTimes: new Map([['停止', 0], ['1S', 1], ['2S', 2], ['3S', 3]]),
            executeInfos: [{
                time: new Datetime().format('hh:mm:ss'),
                msg: '请输入查询条件，并执行查询'
            }],
            showShopCar: true,
            defaultLines: this._client.get(lineKey) || (isFullScreen ? 10 : 8), //全屏默认为10
            copyLines: this._client.get(lineKey) || 8, //全屏默认为10
            lineHieght: Number(fontSize.slice(0, -2)) * 1.5,
            showLineProps: false,
            showEnterInput,
            enterData: new DataRow(),
            isFullScreen,
            currentShoped: 0,
            width: isFullScreen ? '100vw' : '970px',
            height: isFullScreen ? '100vh' : '636px',
            treeData: [
                {
                    title: '所有商品',
                    value: '*'
                }
            ],
            treeIcons: {
                expendIcon: 'iconExpend',
                shrinkIcon: 'iconShrink',
            },
            timer: null,
            openFlag: false,
            productsMsg: ''
        }
        this.setTitle('商品快速录入');
    }

    content(): JSX.Element {
        return (
            <div className={`${styles.rapidInput} ${this.state.isFullScreen ? styles.fullBox : styles.noFullBox}`}>
                <div className={styles.main}>
                    <div className={styles.mainLeft}>
                        <div className={styles.leftTop}>
                            <div className={this.state.showMenus ? styles.bold : ''} onClick={() => this.setState({ showMenus: true })}>常用菜单</div>
                            <div className={this.state.showMenus ? '' : styles.bold} style={{ 'marginLeft': '1.5rem' }} onClick={() => this.setState({ showMenus: false })}>快捷操作</div>
                        </div>
                        <div className={styles.leftBottom}>
                            <div className={styles.menus}></div>
                            <div className={styles.tips}>
                                {this.getMenus()}
                            </div>
                        </div>
                    </div>
                    <div className={styles.mainRight}>
                        <div className={styles.search}>
                            <SearchPanel dataRow={this.state.dataIn} onExecute={this.handleSearch.bind(this)}>
                                <DBDrop options={this.state.shopBrands} dataField='Brand_' dataName='商品品牌' className={styles.brand}></DBDrop>
                                <DBDrop options={this.state.records} dataField='MaxRecord' dataName='载入笔数' className={styles.maxRecord} onChanged={this.handleChange.bind(this, 'MaxRecord', 'maxRecord')}></DBDrop>
                                <DBDrop options={this.state.searchTimes} dataField='searchTime' dataName='自动搜索' className={styles.searchTime} onChanged={this.handleChange.bind(this, 'searchTime')}></DBDrop>
                                <div className={styles.setLine} onClick={this.setLine.bind(this)}>显示购物车行数<br /></div>
                                <DBEdit dataField='SearchText' dataName='搜索商品' className={styles.searchText} onChanged={this.initTimer.bind(this)} onFocus={() => this.setState({ isInput: true })} onBlur={() => this.setState({ isInput: false })} autoFocus></DBEdit>
                                <div className={styles.enterInput}>
                                    <input type='checkbox' name='enterInput' id='enterInput' checked={this.state.dataIn.getBoolean('enterInput')} onChange={this.changeEnterInput.bind(this)} />
                                    <span onClick={this.changeEnterInput.bind(this)}></span>
                                    <label htmlFor='enterInput'>选择商品时，同时输入数量</label>
                                </div>
                                <div className={styles.stockInput}>
                                    <input type='checkbox' name='Stock_' id='Stock_' checked={this.state.dataIn.getBoolean('Stock_')} onChange={this.changeStockInput.bind(this)} />
                                    <span onClick={this.changeStockInput.bind(this)}></span>
                                    <label htmlFor='Stock_'>库存不等于0</label>
                                </div>
                            </SearchPanel>
                        </div>
                        <DBGrid dataSet={this.state.dataSet} className={styles.grid1} onRowClick={this.addShop.bind(this)} openPage={false}>
                            <MainRow dynamicClass={this.dynamicClass.bind(this)}>
                                <Column name='选中' code='_select_' width='6' textAlign='center' customText={(row: DataRow) => {
                                    return <div className={styles.enterInput}>
                                        <input type='checkbox' name='enterInput' id='enterInput' checked={row.getBoolean('_select_')} />
                                        <span></span>
                                    </div>
                                }}>
                                </Column>
                                <Column name='品牌' code='Brand_' width='12' textAlign='center'></Column>
                                <Column name='商品类别' code='PartClass_' width='20' textAlign='center'></Column>
                                <Column name='品名规格' code='DescSpec_' width='34'></Column>
                                <Column name='单位' code='Unit_' width='7' textAlign='center'></Column>
                                <Column name='库存量' code='Stock_' width='9' textAlign='center'></Column>
                                <Column name='单价' code='OriUP_' width='7' textAlign='center'></Column>
                                <Column name='赠品' code='Free_' width='6' textAlign='center' customText={(row: DataRow) => {
                                    return <React.Fragment>{row.getBoolean('Free_') ? 'Yes' : ''}</React.Fragment>
                                }}></Column>
                            </MainRow>
                        </DBGrid>
                        <div className={styles.stockTitle}>
                            <span className={this.state.showShopCar ? styles.bold : ''} onClick={() => this.setState({ showShopCar: true })}>购物车</span>
                            <span className={this.state.showShopCar ? '' : styles.bold} onClick={() => this.setState({ showShopCar: false })}>执行讯息</span>
                        </div>
                        <div className={styles.stock} style={{ 'height': `${((Number(this.state.defaultLines) + 1) * this.state.lineHieght) + 3}px` }}>{this.getShopCar()}</div>
                    </div>
                </div>
                <div className={styles.footer}>
                    <div className={styles.footerLeft}>{this.state.executeInfos[this.state.executeInfos.length - 1].msg}</div>
                    <div className={styles.footerRight}>
                        <button onClick={this.handleClick.bind(this)}>确定</button>
                        <button onClick={this.handleClose.bind(this)}>取消</button>
                    </div>
                </div>
                {this.getLineProps()}
                {this.getEnterInputProps()}
                {this.state.openFlag ? this.openWindow() : ''}
            </div>

        )
    }

    getOperate(): JSX.Element {
        let url = location.origin;
        return <div className={styles.operates}>
            <img src={StaticFile.getImage(`images/icon/${this.state.isFullScreen ? 'cancelFullScreen' : 'fullScreen'}.png`)} onClick={this.changeFullScreen.bind(this)} style={{ 'width': this.state.isFullScreen ? '1.25em' : '.85em' }}></img>
            <img src={StaticFile.getImage('images/icon/close.png')} onClick={this.handleClose.bind(this)} style={{ 'width': '1rem', 'marginLeft': '.5rem' }} />
        </div>
    }

    componentDidMount(): void {
        super.componentDidMount();
        this.initGridHeight();
        this._listener = this.handleKeyDown.bind(this);
        document.addEventListener('keydown', this._listener);
        this._click = this.documentClick.bind(this);
        document.addEventListener('click', this._click);
        this._keyup = this.handleKeyUp.bind(this);
        document.addEventListener('keyup', this._keyup);
        this.getBrand();
    }

    componentWillUnmount(): void {
        document.removeEventListener('keydown', this._listener);
        document.removeEventListener('click', this._click);
        document.removeEventListener('keyup', this._keyup);
    }

    initGridHeight() {
        let grid1 = document.querySelector(`.${styles.grid1}`) as HTMLElement;
        if (grid1) this._gridOneH = grid1.offsetHeight;
        let grid2 = document.querySelector(`.${styles.grid2}`) as HTMLElement;
        if (grid2) this._gridTwoH = grid2.offsetHeight;
    }

    getMenus() {
        if (this.state.showMenus)
            return <Tree data={this.state.treeData} showChild={this.getTreeData.bind(this)} treeIcons={this.state.treeIcons} selectClass={styles.treeSelect} handleClick={this.setClass.bind(this)} handleDbClick={this.treeDbClick.bind(this)}></Tree>
        else
            return <React.Fragment>
                <ul className={styles.category}>
                    <li>在输入搜索条件后：</li>
                    <li>Enter：自动查询</li>
                    <li>Space：回到搜索条件</li>
                    <li>Esc：取消</li>
                    <li>Alt + Enter：确定</li>
                    <li>在商品查询表格中：</li>
                </ul>
                <ul className={styles.category}>
                    <li>W/S：光标上下移动</li>
                    <li>方向键上/下：光标上下移动</li>
                    <li>Enter：增加商品数量</li>
                    <li>D：回到选中商品表格</li>
                    <li>Delete：删除选中商品</li>
                </ul>
                <ul className={styles.category}>
                    <li>在选中商品表格中：</li>
                </ul>
                <ul className="mask_left_category">
                    <li>Enter：光标定位数量显示更改数量</li>
                    <li>Enter：光标定位赠品是否需要赠品</li>
                    <li>Enter：光标定位备注显示更改备注</li>
                    <li>A：回到商品查询表格中</li>
                    <li>方向键左/右(只在选中商品中生效)：光标左右移动</li>
                    <li>W/S：光标上下移动</li>
                    <li>方向键上/下：光标上下移动</li>
                    <li>1-9：更改录入数量</li>
                    <li>0：当前录入数量乘10</li>
                    <li>Delete：删除选中商品</li>
                </ul>
            </React.Fragment>

    }

    async getBrand() {
        let dataSet = await DialogApi.getBrandList();
        dataSet.first();
        while (dataSet.fetch()) {
            this.state.shopBrands.set(dataSet.getString('Brand_'), dataSet.getString('Brand_'));
        }
        this.setState(this.state)
    }

    async handleSearch() {
        this.setLoad(true);
        let dataSet = await DialogApi.getGatherProducts(this.state.dataIn);
        if (dataSet.state <= 0) {
            showMsg(dataSet.message);
            this.setLoad(false);
            return;
        }
        dataSet.first();
        while (dataSet.fetch()) {
            this.state.data.first();
            dataSet.setValue('_select_', false).setValue('Free_', false);
            while (this.state.data.fetch()) {
                if (this.state.data.getValue('Code_') == dataSet.getValue('Code_')) {
                    dataSet.setValue('_select_', true);
                    if (this.state.data.getBoolean('Free_'))
                        dataSet.setValue('Free_', true);
                }
            }
        }
        this.setLoad(false);
        this.state.executeInfos.push({
            time: new Datetime().format('hh:mm:ss'),
            msg: '执行自动搜索'
        })
        if (this.state.timer)
            clearTimeout(this.state.timer);
        this.setState({
            dataSet,
            currentShop: 1,
            currentShoped: 0,
            isInput: false,
            timer: null
        }, () => {
            let grid1 = document.querySelector(`.${styles.grid1}`) as HTMLElement;
            grid1.scrollTop = 0;
            this._currentShop = 1;
            this._currentShoped = 0;
            grid1.focus();
        })
    }

    setClass(vArr: any[]) {
        let arr: string[] = vArr.slice(1, vArr.length);
        this.state.dataIn.setValue('Class1_', arr[0] ? arr[0] : '');
        this.state.dataIn.setValue('Class2_', arr[1] ? arr[1] : '');
        this.state.dataIn.setValue('Class3_', arr[2] ? arr[2] : '');
    }

    handleChange(field: string, key?: string) {
        let fieldKey = key ? key : field;
        this._client.set(fieldKey, this.state.dataIn.getValue(field));
    }

    changeFullScreen() {
        let isFullScreen = !this.state.isFullScreen;
        this._keyClient.set(`popupScreen_${this._keyClient.get('Account1')}`, isFullScreen);
        let lineKey = `${isFullScreen ? 'fullSearchLines_' : 'searchLines_'}${this._keyClient.get('Account1')}`;
        this.setState({
            isFullScreen,

            width: isFullScreen ? '100vw' : '970px',
            height: isFullScreen ? '100vh' : '636px',
            defaultLines: this._client.get(lineKey) || (isFullScreen ? 10 : 8), //全屏默认为10
            copyLines: this._client.get(lineKey) || 8, //全屏默认为10
        }, () => {
            this.initSite();
            this.initGridHeight();
        })
    }

    allowDrag(): boolean {
        return !this.state.isFullScreen
    }

    changeEnterInput() {
        this.state.dataIn.setValue('enterInput', !this.state.dataIn.getBoolean('enterInput'));
        this.handleChange('enterInput');
        this.setState(this.state);
    }

    changeStockInput() {
        this.state.dataIn.setValue('Stock_', !this.state.dataIn.getBoolean('Stock_'));
        this.handleChange('Stock_');
        this.setState(this.state);
    }

    getShopCar() {
        if (this.state.showShopCar) {
            return <DBGrid dataSet={this.state.data} className={styles.grid2} allowCheck={true} openPage={false} ref={self => this._girdTwo = self} onRowClick={this.gridTwoRowClick.bind(this)}>
                <ColumnIt width='6'></ColumnIt>
                <Column name='品名规格' code='DescSpec_' width='27'></Column>
                <Column name='单位' code='Unit_' width='5' textAlign='center'></Column>
                <Column name='数量' code='Num_' width='5' textAlign='center' allowCheck={true}></Column>
                <Column name='单价' code='OriUP_' width='5' textAlign='center' allowCheck={true}></Column>
                <Column name='赠品' code='Free_' width='5' textAlign='center' customText={(row: DataRow) => {
                    return <React.Fragment>{row.getBoolean('Free_') ? 'Yes' : ''}</React.Fragment>
                }}></Column>
                <Column name='备注' code='Remark_' width='14' textAlign='center' allowCheck={true}></Column>
                <Column name='操作' code='opera' width='5' textAlign='center' customText={(row: DataRow) => {
                    return <img src={StaticFile.getImage('js/rapidInput/image/delete.png')} onClick={this.removeShop.bind(this, row)} />
                }}></Column>
            </DBGrid>
        } else {
            let list = this.state.executeInfos.map((executeInfo: executeInfo) => {
                return <div style={{ 'padding': '0 .25rem' }} key={executeInfo.time}>
                    <span>{executeInfo.time}</span><span style={{ 'paddingLeft': '.75rem' }}>{executeInfo.msg}</span>
                </div>
            })
            return <div style={{ 'padding': '.25rem 0', 'lineHeight': this.state.isFullScreen ? '1.3125em' : '1.05em' }}>{list}</div>
        }
    }

    setLine(e: any) {
        e.preventDefault();
        this.setState({
            showLineProps: true
        })
    }

    addShop(row: DataRow, e: any) {
        let enterInput: boolean = this.state.dataIn.getBoolean('enterInput');
        let isFree = e.target.getAttribute('data-field') == 'Free_';
        if (!enterInput) {
            row.setValue('_select_', true);
            if (isFree)
                row.setValue('Free_', true);
            let bool = true;
            let code = row.getValue('Code_');
            this.state.data.first();
            while (this.state.data.fetch()) {
                if (code == this.state.data.getValue('Code_') && isFree == this.state.data.getBoolean('Free_')) {
                    this.state.data.setValue('Num_', this.state.data.getDouble('Num_') + 1);
                    bool = false;
                }
            }
            let data = new DataSet();
            data.appendDataSet(this.state.data);
            if (bool) {
                let dataSet: DataSet = data.append();
                dataSet.setValue('Code_', code);
                dataSet.setValue('DescSpec_', row.getValue('DescSpec_'));
                dataSet.setValue('Unit_', row.getValue('Unit_'));
                dataSet.setValue('Num_', 1);
                dataSet.setValue('OriUP_', row.getValue('OriUP_'));
                dataSet.setValue('Free_', isFree);
                dataSet.setValue('Remark_', '');
            }
            let recNo = row.dataSet.recNo;
            this.setState({
                currentShop: recNo,
                currentShoped: 0,
                data
            }, () => {
                this._currentShop = recNo;
                this._currentShoped = 0;
            });
        } else {
            this.initEnterData(row, isFree, row.dataSet.recNo);
        }
    }

    async initEnterData(row: DataRow, isFree: boolean, recNo?: number) {
        let dataIn = new DataRow();
        dataIn.setValue('Code_', row.getString('Code_'));
        dataIn.setValue('ObjCode', this.props.objCode);
        this.props.objCode.startsWith("C") ? dataIn.setValue("ObjField", 'CusCode') : dataIn.setValue("ObjField", 'SupCode');
        let dataOut = await DialogApi.getPartStock(dataIn);
        dataOut.first();
        let enterData: DataRow = dataOut.current;
        enterData.setValue('OriUP_', row.getValue('OriUP_'));
        enterData.setValue('DescSpec_', row.getValue('DescSpec_'));
        enterData.setValue('IsFree_', isFree);
        enterData.setValue('Stock_', dataOut.head.getValue('Msg_'));
        enterData.setValue('Remark_', '');
        enterData.setValue('Number_', 1);
        this.setState({
            enterData,
            showEnterInput: true,
            isInput: false,
            currentShoped: 0,
            currentShop: recNo ? recNo : this.state.currentShop,
        }, () => {
            this._currentShop = recNo ? recNo : this.state.currentShop;
            this._currentShoped = 0;
        })
    }

    gridTwoRowClick(row: DataRow, e: any) {
        let dataField = e.target.getAttribute('data-field');
        if (dataField == 'Num_' || dataField == 'OriUP_' || dataField == 'Remark_') {
            let recNo = row.dataSet.recNo
            this.setState({
                currentShop: 0,
                currentShoped: recNo
            }, () => {
                this._currentShop = 0;
                this._currentShoped = recNo
            })
        }
    }

    addShopByRow(row: DataRow) {
        let bool = true;
        let code = row.getValue('Code_');
        let isFree = row.getBoolean('IsFree_');
        this.state.dataSet.records.forEach((value, index) => {
            if (value.getString('Code_') === row.getString('Code_')) {
                value.setValue('_select_', true);
                if (isFree)
                    value.setValue('Free_', true);
            }
        })
        this.state.data.first();
        let num = row.has('Number_') ? row.getNumber('Number_') : 1;
        while (this.state.data.fetch()) {
            if (code == this.state.data.getValue('Code_') && isFree == this.state.data.getBoolean('Free_')) {
                this.state.data.setValue('Num_', this.state.data.getDouble('Num_') + num);
                bool = false;
            }
        }
        let data = new DataSet();
        data.appendDataSet(this.state.data);
        if (bool) {
            let dataSet: DataSet = data.append();
            dataSet.setValue('Code_', code);
            dataSet.setValue('DescSpec_', row.getValue('DescSpec_'));
            dataSet.setValue('Unit_', row.getValue('Unit_'));
            dataSet.setValue('Num_', num);
            dataSet.setValue('OriUP_', row.getValue('OriUP_'));
            dataSet.setValue('Free_', isFree);
            dataSet.setValue('Remark_', row.getString('Remark_'));
        }
        this._currentShoped = 0;
        this.setState({
            showEnterInput: false,
            isInput: false,
            currentShoped: 0,
            data
        })
    }

    getLineProps() {
        if (this.state.showLineProps) {
            return <div className={styles.opacity}>
                <div className={styles.lineProps}>
                    <div className={styles.maskLine}>
                        <label htmlFor='lines'>购物车显示行数：</label>
                        <input type='number' id='lines' name='lines' value={this.state.copyLines} autoFocus={true} onChange={this.setCopyLines.bind(this)} onFocus={this.selectInput.bind(this, 'lines')} />
                    </div>
                    <div className={styles.maskTips}>注：设置的显示行数值仅限于表格不折行的场景</div>
                    <div className={styles.enterBtns}>
                        <div className={styles.maskBtn}>
                            <span onClick={this.setLineSure.bind(this)}>确定(<span style={{ 'textDecoration': 'underline' }}>Y</span>)</span>
                        </div>
                        <div className={styles.maskBtn}>
                            <span onClick={this.setLineCancel.bind(this)}>取消(<span style={{ 'textDecoration': 'underline' }}>N</span>)</span>
                        </div>
                    </div>
                </div>
            </div>
        }
    }

    getEnterInputProps() {
        if (this.state.showEnterInput) {
            let math = new AuiMath();
            return <div className={styles.opacity} onKeyDown={this.enterPropKeyDown.bind(this)}>
                <div className={`${styles.lineProps} ${styles.enterProps}`}>
                    <div className={styles.maskLine}>
                        <div className={styles.maskBlock} style={{ 'flex': '4' }}>
                            <label htmlFor='Code_'>商品料号：</label>
                            <input type='text' id='Code_' name='Code_' value={this.state.enterData.getString('Code_')} readOnly />
                        </div>
                        <div className={styles.maskBlock} style={{ 'flex': '3', 'paddingLeft': '1rem' }}>
                            <label htmlFor='Unit_'>单位：</label>
                            <input type='text' id='Unit_' name='Unit_' value={this.state.enterData.getString('Unit_')} readOnly />
                        </div>
                    </div>
                    <div className={styles.maskLine}>
                        <div className={styles.maskBlock}>
                            <label htmlFor='Class1_'>商品类别：</label>
                            <input type='text' id='Class1_' name='Class1_' value={this.state.enterData.getString('Class1_')} readOnly />
                        </div>
                    </div>
                    <div className={styles.maskLine}>
                        <div className={styles.maskBlock}>
                            <label htmlFor='Desc_'>品名规格：</label>
                            <input type='text' id='Desc_' name='Desc_' value={this.state.enterData.getString('Desc_')} readOnly />
                        </div>
                    </div>
                    <div className={styles.maskLine}>
                        <div className={styles.maskBlock}>
                            <label htmlFor='Price_'>销货单价：</label>
                            <input type='text' id='Price_' name='Price_' value={this.getPrice()} readOnly />
                        </div>
                    </div>
                    <div className={styles.maskLine}>
                        <div className={styles.maskBlock}>
                            <label htmlFor='LastUP_'>上次交易：</label>
                            <input type='text' id='LastUP_' name='LastUP_' value={this.state.enterData.dataSet.head.getValue('LastUP_') ? `${this.state.enterData.dataSet.head.getValue('LastDate')} ：${this.state.enterData.dataSet.head.getValue('LastUP_')}元` : '没有找到上次交易价或者上次交易价为0！'} readOnly />
                        </div>
                    </div>
                    <div className={styles.maskLine}>
                        <div className={styles.maskBlock} style={{ 'flex': '10' }}>
                            <label htmlFor='Number_'>商品数量：</label>
                            <input type='number' id='Number_' name='Number_' value={this.state.enterData.getString('Number_')} onChange={this.setEnterInputVal.bind(this)} autoFocus onFocus={this.selectInput.bind(this, 'Number_')} />
                        </div>
                        <div className={styles.maskBlock} style={{ 'flex': '8', 'paddingLeft': '1rem' }}>
                            <label htmlFor='OriUP_'>单价：</label>
                            <input type='number' id='OriUP_' name='OriUP_' value={math.toFixed(this.state.enterData.getNumber('OriUP_'), 2)} onChange={this.setEnterInputVal.bind(this)} />
                        </div>
                        <div className={styles.maskBlock} style={{ 'flex': '7', 'paddingLeft': '1rem' }}>
                            <label htmlFor='IsFree_'>赠品：</label>
                            <input type='text' id='IsFree_' name='IsFree_' value={this.state.enterData.getBoolean('IsFree_') ? '是' : '否'} readOnly />
                        </div>
                    </div>
                    <div className={styles.maskLine}>
                        <div className={styles.maskBlock}>
                            <label htmlFor='Remark_'>备注说明：</label>
                            <input type='text' id='Remark_' name='Remark_' value={this.state.enterData.getString('Remark_')} onChange={this.setEnterInputVal.bind(this)} />
                        </div>
                    </div>
                    <div className={styles.maskLine}>
                        <div className={styles.maskBlock}>
                            <label htmlFor='Stock_'>库存数量：</label>
                            <input type='text' id='Stock_' name='Stock_' value={this.state.enterData.getString('Stock_')} readOnly />
                        </div>
                    </div>
                    <div className={styles.enterBtns}>
                        <div className={styles.maskBtn}>
                            <span onClick={this.enterPropAddShop.bind(this)}>确定(<span style={{ 'textDecoration': 'underline' }}>Y</span>)</span>
                        </div>
                        <div className={styles.maskBtn}>
                            <span onClick={() => this.setState({ showEnterInput: false, currentShoped: 0 })}>取消(<span style={{ 'textDecoration': 'underline' }}>N</span>)</span>
                        </div>
                    </div>
                </div>
            </div>
        }
    }

    getPrice() {
        let outUp = this.state.enterData.has('OutUP_') ? this.state.enterData.getNumber('OutUP_') : '暂无';
        let outUp2 = this.state.enterData.has('OutUP2_') ? this.state.enterData.getNumber('OutUP2_') : '暂无';
        let listUp = this.state.enterData.has('ListUP_') ? this.state.enterData.getNumber('ListUP_') : '暂无';
        return `出厂价：${outUp} 批发价：${outUp2} 零售价：${listUp}`
    }

    setCopyLines(e: any) {
        let copyLines = Number(e.target.value);
        if (copyLines < 3) copyLines = 3;
        if (copyLines > 10) copyLines = 10;
        this.setState({
            copyLines
        })
    }

    setEnterInputVal(e: any) {
        let name = e.target.name;
        let value = e.target.value;
        this.state.enterData.setValue(name, value);
        this.setState(this.state);
    }

    selectInput(id: string) {
        let input = document.querySelector(`#${id}`) as HTMLInputElement;
        input.select();
    }

    setLineSure() {
        if (this.state.isFullScreen)
            this._client.set(`fullSearchLines_${this._keyClient.get('Account1')}`, this.state.copyLines);
        else
            this._client.set(`searchLines_${this._keyClient.get('Account1')}`, this.state.copyLines);
        this.setState({
            defaultLines: this.state.copyLines,
            showLineProps: false,
            isInput: false
        }, () => {
            this.initGridHeight();
        })
    }

    setLineCancel() {
        this.setState({
            copyLines: this.state.defaultLines,
            showLineProps: false
        })
    }

    dynamicClass(row: DataRow) {
        let className = '';
        if (row.getBoolean('_select_'))
            className = styles.select;
        if (row.dataSet.recNo == this.state.currentShop)
            className += ` ${styles.currentShop}`
        return className;
    }

    scrollPrev() {
        if (this.state.currentShop || this.state.currentShoped) {
            let currentShop: number;
            let grid;
            let dom;
            if (this.state.currentShop) {
                grid = document.querySelector(`.${styles.grid1}`);
                currentShop = this._currentShop - 1;
                dom = document.querySelectorAll(`.${styles.grid1} tr`)[currentShop] as HTMLTableRowElement;
            } else {
                grid = document.querySelector(`.${styles.grid2}`);
                currentShop = this._currentShoped - 1;
                dom = document.querySelectorAll(`.${styles.grid2} tr`)[currentShop] as HTMLTableRowElement;
            }
            if (dom) {
                let scrollTop = dom.offsetTop - this.state.lineHieght + 1;
                if (scrollTop - grid.scrollTop < 0) {
                    grid.scrollTop = scrollTop;
                }
                this._currentShop = this._currentShop ? currentShop || 1 : 0;
                this._currentShoped = this._currentShoped ? currentShop || 1 : 0;

                if (this._currentShop) {
                    let currentDom = document.querySelector(`.${styles.currentShop}`) as HTMLTableRowElement;
                    if (currentDom.previousSibling) {
                        let lastDom = currentDom.previousSibling as HTMLTableRowElement;
                        if (lastDom.getAttribute('data-key')) {
                            currentDom.classList.remove(styles.currentShop);
                            lastDom.classList.add(styles.currentShop);
                        }
                    }
                }
            }
        }
    }

    scrollNext() {
        if (this.state.currentShop || this.state.currentShoped) {
            let currentShop: number;
            let grid: Element;
            let dom;
            let scrollTop: number;
            if (this._currentShop) {
                grid = document.querySelector(`.${styles.grid1}`);
                currentShop = this._currentShop + 1;
                dom = document.querySelectorAll(`.${styles.grid1} tr`)[currentShop] as HTMLTableRowElement;
            } else {
                grid = document.querySelector(`.${styles.grid2}`);
                currentShop = this._currentShoped + 1;
                dom = document.querySelectorAll(`.${styles.grid2} tr`)[currentShop] as HTMLTableRowElement;
            }
            if (dom) {
                if (this._currentShop)
                    scrollTop = dom.offsetTop - this._gridOneH + dom.offsetHeight + 3;
                else
                    scrollTop = dom.offsetTop - this._gridTwoH + dom.offsetHeight + 3;
                if (scrollTop - grid.scrollTop > 0) {
                    grid.scrollTop = scrollTop;
                }
                currentShop = currentShop > this.state.dataSet.size ? this.state.dataSet.size : currentShop;
                this._currentShop = this._currentShop ? currentShop : 0;
                this._currentShoped = this._currentShoped ? currentShop : 0;

                if (this._currentShop) {
                    let currentDom = document.querySelector(`.${styles.currentShop}`) as HTMLTableRowElement;
                    let nextDom = currentDom.nextSibling as HTMLTableRowElement;
                    currentDom.classList.remove(styles.currentShop);
                    nextDom.classList.add(styles.currentShop);
                }
            }
        }
    }

    handleKeyDown(e: any) {
        if (this.state.isInput)
            return;
        let keyCode: number = e.keyCode;
        switch (keyCode) {
            // Enter
            case 13:
                if (this.state.showLineProps)
                    this.setLineSure();
                else if (this.state.showEnterInput)
                    this.enterPropAddShop();
                else if (e.altKey)
                    this.handleClick();
                else if (this.state.currentShop) {
                    if (this.state.dataIn.getBoolean('enterInput')) {
                        this.initEnterData(this.state.dataSet.records[this.state.currentShop - 1], false);
                    } else
                        this.addShopByRow(this.state.dataSet.records[this.state.currentShop - 1]);
                }
                break;
            // Esc
            case 27:
                this.handleClose();
                break;
            // Y
            case 89:
                if (e.altKey) {
                    if (this.state.showLineProps)
                        this.setLineSure();
                    else if (this.state.showEnterInput)
                        this.enterPropAddShop();
                }
                break;
        }
        if (this.state.showLineProps || this.state.showEnterInput)
            return;
        switch (keyCode) {
            // Space
            case 32:
                if (!this._girdTwo.state.isInput) {
                    this.setState({
                        currentShop: 0,
                        currentShoped: 0
                    }, () => {
                        let input = document.querySelector('#SearchText') as HTMLInputElement;
                        this._currentShop = 0;
                        this._currentShoped = 0;
                        input.select();
                        e.preventDefault();
                    })
                }
                break;
            // ↑
            case 38:
                e.preventDefault();
                this.scrollPrev();
                break;
            // ↓
            case 40:
                e.preventDefault();
                this.scrollNext();
                break;
            // Del
            case 46:
                this.delShop();
                break;
            // A
            case 65:
                if (!this.state.currentShop && !this._girdTwo.state.isInput) {
                    document.querySelector(`.${styles.grid1}`).scrollTop = 0;
                    this._girdTwo.resetDirection();
                    this.setState({
                        currentShop: 1,
                        currentShoped: 0
                    }, () => {
                        this._currentShop = 1;
                        this._currentShoped = 0;
                        let grid1 = document.querySelector(`.${styles.grid1}`) as HTMLElement;
                        grid1.focus();
                        let grid2 = document.querySelector(`.${styles.grid2}`) as HTMLElement;
                        grid2.blur();
                    })
                }
                break;
            // D
            case 68:
                if (!this.state.currentShoped) {
                    document.querySelector(`.${styles.grid2}`).scrollTop = 0;
                    this._girdTwo.state.direction = [1, 1];
                    this.setState({
                        currentShop: 0,
                        currentShoped: 1
                    }, () => {
                        this._currentShop = 0;
                        this._currentShoped = 1;
                        let grid1 = document.querySelector(`.${styles.grid1}`) as HTMLElement;
                        grid1.blur();
                        let grid2 = document.querySelector(`.${styles.grid2}`) as HTMLElement;
                        grid2.focus();
                    })
                }
                break;
            // N
            case 78:
                if (e.altKey) {
                    this.setState({
                        showLineProps: false,
                        showEnterInput: false
                    });
                }
                break;
            // S
            case 83:
                e.preventDefault();
                this.scrollNext();
                break;
            // W
            case 87:
                e.preventDefault();
                this.scrollPrev();
                break;
            // 0
            case 96:
                if (this.state.currentShoped && this._girdTwo.state.direction[1] == 1 && !this._girdTwo.state.isInput)
                    this.changeShopNumByKey(this.state.data.records[this.state.currentShoped - 1].getNumber('Num_') * 10)
                break;
            // 1
            case 97:
                if (this.state.currentShoped && this._girdTwo.state.direction[1] == 1 && !this._girdTwo.state.isInput)
                    this.changeShopNumByKey(1)
                break;
            // 2
            case 98:
                if (this.state.currentShoped && this._girdTwo.state.direction[1] == 1 && !this._girdTwo.state.isInput)
                    this.changeShopNumByKey(2)
                break;
            // 3
            case 99:
                if (this.state.currentShoped && this._girdTwo.state.direction[1] == 1 && !this._girdTwo.state.isInput)
                    this.changeShopNumByKey(3)
                break;
            // 4
            case 100:
                if (this.state.currentShoped && this._girdTwo.state.direction[1] == 1 && !this._girdTwo.state.isInput)
                    this.changeShopNumByKey(4)
                break;
            // 5
            case 101:
                if (this.state.currentShoped && this._girdTwo.state.direction[1] == 1 && !this._girdTwo.state.isInput)
                    this.changeShopNumByKey(5)
                break;
            // 6
            case 102:
                if (this.state.currentShoped && this._girdTwo.state.direction[1] == 1 && !this._girdTwo.state.isInput)
                    this.changeShopNumByKey(6)
                break;
            // 7
            case 103:
                if (this.state.currentShoped && this._girdTwo.state.direction[1] == 1 && !this._girdTwo.state.isInput)
                    this.changeShopNumByKey(7)
                break;
            // 8
            case 104:
                if (this.state.currentShoped && this._girdTwo.state.direction[1] == 1 && !this._girdTwo.state.isInput)
                    this.changeShopNumByKey(8)
                break;
            // 9
            case 105:
                if (this.state.currentShoped && this._girdTwo.state.direction[1] == 1 && !this._girdTwo.state.isInput)
                    this.changeShopNumByKey(9)
                break;
        }
    }

    handleKeyUp() {
        if (this.state.currentShop != this._currentShop || this.state.currentShoped != this._currentShoped) {
            this.setState({
                currentShop: this._currentShop,
                currentShoped: this._currentShoped
            })
        }
    }

    documentClick(e: any) {
        if (!e.target.closest(`.${styles.grid2}`) && this._girdTwo && (this._girdTwo.state.direction[0] || this._girdTwo.state.direction[1]))
            this._girdTwo.resetDirection();
    }

    removeShop(row: DataRow) {
        this.state.dataSet.first();
        this.state.data.first();
        let isFree = false;
        let type = 0;
        let recNo = 0;
        while (this.state.data.fetch()) {
            if (this.state.data.getValue('Code_') == row.getValue('Code_')) {
                type++;
                if (this.state.data.getBoolean('Free_') == row.getBoolean('Free_'))
                    recNo = this.state.data.recNo;
                if (row.getBoolean('Free_'))
                    isFree = true;
            }
        }
        while (this.state.dataSet.fetch()) {
            if (row.getValue('Code_') == this.state.dataSet.getValue('Code_')) {
                if (isFree)
                    this.state.dataSet.setValue('Free_', false);
                if (type == 1)
                    this.state.dataSet.setValue('_select_', false);
            }
        }
        this.state.data.setRecNo(recNo);
        this.state.data.delete();
        this.setState({
            currentShop: 0
        }, () => {
            this._currentShop = 0;
        });
    }

    async getTreeData(data: dataType, dataArr: any[]) {
        let dataOut: DataSet;
        let keyArr = ['Name_', 'Class2_', 'Class3_'];
        if ((!data.children || !data.children.length)) {
            if (dataArr.length == 1)
                dataOut = await DialogApi.getClass1();
            else if (dataArr.length == 2) {
                dataOut = await DialogApi.getClass2({
                    Brand_: '',
                    Class1_: dataArr[1],
                });
            } else if (dataArr.length == 3) {
                dataOut = await DialogApi.getClass3({
                    Brand_: '',
                    Class1_: dataArr[1],
                    Class2_: dataArr[2],
                });
            } else {
                data.hideIcon = true;
                this.setState(this.state);
                return;
            }
            if (!dataOut || !dataOut.size) {
                data.hideIcon = true;
                this.setState(this.state);
                return;
            }
            let arr = [];
            dataOut.first();
            while (dataOut.fetch()) {
                arr.push({
                    title: dataOut.getString(keyArr[dataArr.length - 1]),
                    value: dataOut.getString(keyArr[dataArr.length - 1])
                })
            }
            data.children = arr;
        }
        this.setState(this.state)
    }

    async handleClick() {
        this._girdTwo.state.allowInput = false;
        if (this.state.data.size > 20)
            this.customLoad('系统正在分批处理中,请稍后...');
        else
            this.customLoad('系统正在处理中,请稍后...');
        this.setState(this.state);
        if (this.props.showFlag) {
            this.isBodyExists();
        } else {
            this.handleSubmit(1);
        }
    }

    isBodyExists() {
        let partCodes = [];
        for (let i = 0; i < this.state.data.records.length; i++) {
            partCodes.push(this.state.data.records[i].getString('Code_'));
        }
        let url = 'TFrmTranBC.isBodyExists';
        if ('OD' == this.props.tb) {
            url = 'TFrmTranOD.isBodyExists';
        }
        fetch(`${url}?products=${partCodes}&flag=true`).then(response => response.json()).then((data: any) => {
            if (data.result) {
                this.handleSubmit(1);
            } else {
                this.setState({
                    productsMsg: data.message,
                    openFlag: true
                })
            }
        })
    }

    handleSubmit(num: number) {
        this.setState({
            openFlag: false
        })
        let items = [];
        let startIndex = (num - 1) * 20;
        let endIndex = num * 20;
        if (this.state.data.records.length < endIndex)
            endIndex = this.state.data.records.length;
        for (let i = startIndex; i < endIndex; i++) {
            items.push({
                partCode: this.state.data.records[i].getString('Code_'),
                remark: this.state.data.records[i].getString('Remark_'),
                num: this.state.data.records[i].getDouble('Num_'),
                oriup: this.state.data.records[i].getDouble('OriUP_'),
                spare: this.state.data.records[i].getBoolean('Free_')
            })
        }
        fetch(`TWebShopping.addDetail?tb=${this.props.tb}&rapidInput=${encodeURIComponent(JSON.stringify(items))}`).then(response => response.json()).then((data: any) => {
            if (data.ok) {
                if (endIndex < this.state.data.size)
                    this.handleSubmit(++num);
                else {
                    showMsg(data.msg);
                    this.setLoad(false);
                    this.handleClose();
                    if (/#$/.test(window.location.href)) {
                        window.location.href = window.location.href.replace('#', '');
                    } else {
                        window.location.href = window.location.href;
                    }
                }
            } else {
                showMsg(data.msg);
                let ds = new DataSet();
                ds.appendDataSet(this.state.data);
                for (let i = 0; i < (num - 1) * 20; i++) {
                    this.removeShop(ds.records[i]);
                }
                this.setLoad(false);
            }
        })
    }

    treeDbClick(data: any[]) {
        let arr: string[] = data.slice(1, data.length);
        this.state.dataIn.setValue('Class1_', arr[0] ? arr[0] : '');
        this.state.dataIn.setValue('Class2_', arr[1] ? arr[1] : '');
        this.state.dataIn.setValue('Class3_', arr[2] ? arr[2] : '');
        this.handleSearch();
    }

    enterPropAddShop() {
        if (this.state.enterData.getNumber('Number_') > 0)
            this.addShopByRow(this.state.enterData);
        else
            this.setState({
                showEnterInput: false,
                currentShoped: 0,
                isInput: false
            }, () => {
                this._currentShoped = 0;
            });
    }

    enterPropKeyDown(e: any) {
        let keyCode: number = e.keyCode;
        switch (keyCode) {
            //Enter
            case 13:
                if (!this.state.currentShop && !this.state.currentShoped)
                    this.enterPropAddShop();
                break
        }
    }

    initTimer() {
        let time = this.state.dataIn.getNumber('searchTime') * 1000;
        if (time) {
            if (this.state.timer)
                clearTimeout(this.state.timer);
            let timer = setTimeout(() => {
                this.handleSearch();
            }, time);
            this.setState({
                timer
            })
        }
    }

    delShop() {
        if (this.state.currentShop) {
            let row: DataRow = this.state.dataSet.records[this.state.currentShop - 1];
            row.setValue('_select_', false).setValue('Free_', false);
            this.state.data.first();
            while (this.state.data.fetch()) {
                if (row.getValue('Code_') == this.state.data.getValue('Code_')) {
                    this.state.data.delete();
                }
            }
        }
        if (this.state.currentShoped) {
            this.removeShop(this.state.data.records[this.state.currentShoped - 1])
        }
        this._girdTwo.resetDirection();
        this.setState({
            currentShoped: 0
        }, () => {
            this._currentShoped = 0;
        })
    }

    changeShopNumByKey(num: number) {
        let row: DataRow = this.state.data.records[this.state.currentShoped - 1];
        row.setValue('Num_', num);
        this.setState(this.state)
    }

    openWindow() {
        return <div className={styles.alertShadow}>
            <div className={styles.alertBox}>
                <div>
                    <h1 className={styles.alertTitle}>操作提示</h1>
                    <p className={styles.alertCon} dangerouslySetInnerHTML={{ __html: this.state.productsMsg }}></p>
                    <ul>
                        <li className={styles.alertCancel} style={{ 'width': '50%', 'borderRight': '1px solid rgb(230, 230, 230)' }} onClick={(e) => {
                            this.setLoad(false);
                            this.setState({
                                openFlag: false
                            });
                        }}>取消</li>
                        <li className={styles.alertConfirm} style={{ 'width': '50%' }} onClick={this.handleSubmit.bind(this, 1)}>确认</li>
                    </ul>
                </div>
            </div>
        </div>;
    }
}