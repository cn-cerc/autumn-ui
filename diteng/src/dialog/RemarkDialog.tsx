import React from "react";
import { DataSet, BaseDialogStateType, BaseDialog, BaseDialogPropsType, Block, Line, ColumnIt, Column, DataRow, DBGrid } from "autumn-ui";
import styles from "./StaffDialog.css";

type RemarkTypeState = {
    dataSet: DataSet
} & Partial<BaseDialogStateType>

export default class RemarkDialog extends BaseDialog<BaseDialogPropsType, RemarkTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props);
        let dataSet = new DataSet();
        dataSet.append().setValue('Remark_', '公司促销或优惠活动--如每周一拍、五一、十一,产品促销等/关联促销包会自动带出备注)');
        dataSet.append().setValue('Remark_', '钓鱼比赛赞助--XX年XX月XX日,XX省第X场（**市第*届-**站）狼王杯钓鱼比赛赞助(详述核准邮件主旨)');
        dataSet.append().setValue('Remark_', '新店加盟赞助--XX新加盟专卖店挂牌或开张赞助(详述核准邮件主旨)');
        dataSet.append().setValue('Remark_', '俱乐部赞助--江西-大余县-XX渔具狼王钓鱼俱乐部-XX年XX月XX日成立赞助(详述核准邮件主旨)');
        dataSet.append().setValue('Remark_', '公司营销活动赞助--(指每月定期营销活如六一亲子活动,八一建军节等)');
        dataSet.append().setValue('Remark_', '政策性免费配节--XXXXX（详注加入钓友姓名与电话）');
        dataSet.append().setValue('Remark_', '营销用品免送--XXX（如海报、季刊、目录、钥匙扣、车贴、小毛等)');
        dataSet.append().setValue('Remark_', '店面升级赞助--XX店家由XX升级为XX');
        dataSet.append().setValue('Remark_', '店家活动赞助--XX专卖店XX促销活动赞助,店庆,周年庆等');
        dataSet.append().setValue('Remark_', '招牌更换赞助--XX店家更换招牌');
        dataSet.append().setValue('Remark_', '品质异常公司承担免费--核准异常报告主旨');
        dataSet.append().setValue('Remark_', '渔轮配件免送--易损件千分之一XX至XX成品销售XX元,配件赠送XX元');
        dataSet.append().setValue('Remark_', '钓竿配件免送--易损件千分之-XX至XX成品销售XX元,配件赠送XX元');
        dataSet.append().setValue('Remark_', '市场拜访--赠送XX钓友或店家(详述核准邮件主旨)');
        dataSet.append().setValue('Remark_', '市场开拓试用品--如饵料/线等(详述核准邮件主旨)');
        dataSet.append().setValue('Remark_', '品牌大使赠品1--公司年度预算XX元赞助');
        dataSet.append().setValue('Remark_', '品牌大使赠品2--公司营销活动赠送');
        dataSet.append().setValue('Remark_', '魔术师展架赠送--XX店家购买钩线太空豆等满1万元赠送(除竿轮外订单满10000元赠送)');
        dataSet.append().setValue('Remark_', '营销活动奖品类--XXX(如一家亲抽奖等)');
        dataSet.append().setValue('Remark_', '钓场赞助--辽宁-丹东-振兴区-金城垂钓园-张翔-钓场合作案设计申请20160803(详述核准邮件主旨)');
        dataSet.append().setValue('Remark_', '展会营销用品需用--XX展领用销用品');
        dataSet.append().setValue('Remark_', '返修品免收配件费用--详情申请邮件主旨(100元/单及以上邮件申请,100元/单以下免邮件申请)');
        dataSet.append().setValue('Remark_', '回娘家活动赞助--2018年回娘家活动赠送衣服与布袋(第N场)');
        dataSet.append().setValue('Remark_', '特案赠送--如客户回公司要求赠送/礼品赠送等且经权限<总经理>核准,(详述核准邮件主旨)');
        dataSet.append().setValue('Remark_', '返修品无配件需拆成品申请--返修品型号【】-数量【】-申请拆卸成品【】-数量【】-区域【】-店名【】-或钓友【】');
        dataSet.append().setValue('Remark_', '公司福利--新员工转正服装配发-员工【】');
        dataSet.append().setValue('Remark_', '客户生日礼品赠送-XXX店老板娘/老板/店长等生日');
        dataSet.append().setValue('Remark_', '直播抽奖奖品-20210719直播抽奖奖品');
        this.state = {
            ...this.state,
            dataSet,
            width: '50rem',
            height: this.isPhone ? '25rem' : '30rem'
        }
        this.setTitle('请选择原因备注');
    }

    content(): JSX.Element {
        return (
            <div className={styles.main} role='content'>
                {this.getTable()}
            </div>
        )
    }

    getTable() {
        if (this.isPhone) {
            return (
                <Block dataSet={this.state.dataSet}>
                    <Line>
                        <ColumnIt width='80' name='序号' />
                        <Column code='opera' textAlign='right' width='20' customText={(row: DataRow) => {
                            return <span role='auiOpera' onClick={this.handleClick.bind(this, row)}>选择</span>
                        }}></Column>
                    </Line>
                    <Line>
                        <Column name='原因备注项' code='Remark_' width='100'></Column>
                    </Line>
                </Block>
            )
        } else {
            return (
                <DBGrid dataSet={this.state.dataSet} onRowClick={this.handleClick.bind(this)} openPage={false}>
                    <ColumnIt width='10'/>
                    <Column name='原因备注项' code='Remark_' width='70'></Column>
                    <Column name='选择' textAlign='center' code='opera' width='10' customText={(row: DataRow) => {
                        return <span role='auiOpera'>选择</span>
                    }}></Column>
                </DBGrid>
            )
        }
    }

    handleClick(row: DataRow) {
        let input = document.getElementById(this.props.inputId) as HTMLInputElement;
        input.value = row.getString('Remark_');
        this.handleSelect();
    }
}