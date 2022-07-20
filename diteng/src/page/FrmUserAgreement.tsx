//@ts-nocheck
import React from "react";
import StaticFile from "../StaticFile";
import styles from "./AgreementPolicy.css";

function UserAgreement() {
    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <img src={StaticFile.getImage('images/left-crow.png')} id="back" onClick={() => window.history.go(-1)} />
                <span><i>4PL管家</i></span>
            </div>
            <div className={styles.isNode}><h1><span>用户协议</span></h1>
                <p><span>欢迎您使用4PL管家（以下简称“本服务”），4PL管家是由恒凯昌（深圳）数字供应链有限公司（以下简称“本公司”）向4PL管家用户提供的社区平台。为保证您的权益，便于更好地使用4PL管家及相应的配套服务，请您务必在注册前认真阅读本协议，若您阅读并接受本协议，使用4PL管家提供的产品和服务，即视为您受本协议的约束，若您不同意本协议，请勿使用本网站任何产品和服务。</span>
                </p>
                <h2><span>一、服务内容</span></h2>
                <p><span> 4PL管家运用自己的系统通过互联网络为用户提供社交、直播服务等服务。用户使用本服务需要下载4PL管家客户端软件，同时，用户必须：</span></p>
                <p><span>1、提供详尽、准确的个人资料。</span></p>
                <p><span>2、不断更新注册资料，符合及时、详尽、准确的要求，如果您提供的注册资料不合法、不真实的，需自行承担由此引起的责任及后果，本公司保留终止您使用4PL管家各项服务的权利。</span></p>
                <p><span>为防止他人冒用您的身份注册、使用本服务，4PL管家可能会给您的手机发送短信进行验证，由此产生的短信费用由本公司支付，您不需支付任何费用。</span></p>
                <h2><span>二、服务的提供、修改及终止</span></h2>
                <p><span>1、您保证在您同意接受本协议并注册成为4PL管家用户时，您已经年满18周岁，您是具备完全民事权利能力和完全民事行为能力的自然人。</span></p>
                <p><span>2、在接受本公司各项服务的同时，您同意接受本公司提供的各类信息服务，并在此授权本公司可以向您电子邮件、手机等发送商业信息。</span></p>
                <p><span>3、4PL管家有权在必要时修改服务条款，若您对本协议的修改有异议，您可以停止使用4PL管家的网络服务，在此情况下，4PL管家没有义务传送任何未处理的信息或未完成的服务给您或任何无直接关联的第三方。</span></p>
                <h2><span>三、用户隐私制度</span></h2>
                <p><span>1、本公司将会采取合法、合理的措施保护用户的个人信息，非经法定原因或用户事先许可，本公司不会向任何第三方透露您的密码、姓名、手机号码等非公开信息。以下情况除外：</span></p>
                <p><span>1.1、用户授权4PL管家透露这些信息。</span></p>
                <p><span>1.2、相关的法律法规或监管机构、司法机构要求4PL管家提供您的个人资料；国家司法机关符合法律规定并经法定程序的检查及其他操作。</span></p>
                <p><span>1.3、任何第三方盗用、冒用或未经许可擅自披露、使用或对外公开您的个人隐私资料。</span></p>
                <p><span>1.4、由您要求网站提供特定服务时，需要把您的姓名和地址提供给第三方的。</span></p>
                <p><span>1.5、您在使用本服务、参加网站活动或访问网站网页时，自动接收并记录的浏览器端或手机客户端数据，包括但不限于IP地址、网站Cookie中的资料及您要求取用的网页记录。</span></p>
                <p><span>1.6、4PL管家从商业伙伴处合法获取的个人信息。</span></p>
                <p><span>2、在适合的情况下，并在您同意的前提下，我们会利用您的信息来联络您，为您发送信息。</span></p>
                <p><span>3、您应当妥善保管您的设备和密码及身份信息，对于因密码泄露、身份信息泄露、设备丢失所致的损失，由您自行承担。</span></p>
                <h2><span>四、用户行为规范</span></h2>
                <p><span>除非法律允许或本公司书面许可，您使用本软件过程中不得从事下列行为：</span></p>
                <p><span>1、删除本软件及其副本上关于著作权的信息。</span></p>
                <p><span>2、对本软件进行反向工程、反向汇编、反向编译，或者以其他方式尝试发现本软件的源代码。</span></p>
                <p><span>3、对本公司拥有知识产权的内容进行使用、出租、出借、复制、修改、链接、转载、汇编、发表、出版、建立镜像站点等。</span></p>
                <p><span>4、对本软件或者本软件运行过程中释放到任何终端内存中的数据、软件运行过程中客户端与服务器端的交互数据，以及本软件运行所必需的系统数据，进行复制、修改、增加、删除、挂接运行或创作任何衍生作品，形式包括但不限于使用插件、外挂或非本公司经授权的第三方工具/服务接入本软件和相关系统。</span>
                </p>
                <p><span>5、通过修改或伪造软件运行中的指令、数据，增加、删减、变动软件的功能或运行效果，或者将用于上述用途的软件、方法进行运营或向公众传播，无论这些行为是否为商业目的。</span></p>
                <p><span>6、自行或者授权他人、第三方软件对本软件及其组件、模块、数据进行干扰。</span></p>
                <p><span>7、其他未经本公司明示授权的行为。</span></p>
                <h2><span>五、适用法律和管辖权</span></h2>
                <p><span>1、4PL管家注册所在地法律、法规应规范本协议以及本协议各方之间引起的争议，除非存在法律指定适用其他管辖法律。</span></p>
                <p><span>2、在合约一方寻求实现本协议下的权利，或寻求宣告本协议下的任何权利或义务的任何民事诉讼或其他诉讼过程中，各合约方应承担其代理律师的费用和支出。</span></p>
                <p><span>3、本协议的解释语言应为中文。</span></p>
                <p><span>4、本公司可能通过多种语言将本协议或任何其他文件、信息和消息提供给合作方。本协议规定，合作方应当承认及确认本公司工作语言为中文。如果任何文件、信息和消息的非中文表述和中文表述之间出现矛盾和不一致的情况下，双方将以中文文件、信息和消息为标准。</span>
                </p>
                <h2><span>六、免责条款</span></h2>
                <p><span>1、4PL管家旨在为客户提供交易和资讯服务，平台不提供任何形式的投资建议。</span></p>
                <p><span>2、本软件所提供的信息全部来自网络资源，信息内容仅供参考，不能作为单一依据，建议网友根据实际情况结合信息内容，选择性采纳使用。</span></p>
                <p><span>3、页面中存在部分内容为一般营养科普知识，仅供消费者参考学习，相关内容不代表产品功效或宣传内容，请理性阅读。 </span></p>
                <p><span>4、为了配合相关法律法规，本公司于2019年5月对全部内容进行筛查，部分词汇采用***号代替过滤，望用户谅解。 </span></p>
                <p><span>5、任何由于黑客攻击、计算机病毒侵入或发作、因政府管制而造成的暂时性关闭等影响网络正常经营的不可抗力而造成的个人资料泄露、丢失、被盗用或被窜改等，平台应及时采取补救措施，不承担任何责任。</span></p>
                <p>&nbsp;</p>
            </div>
        </div>
    )
}

export default class FrmUserAgreement extends React.Component {
    constructor() {
        super();
    }

    render(): React.ReactNode {
        return <UserAgreement />
    }

    componentDidMount() {
        if (window.ApiCloud.isApiCloud()) {
            window.ApiCloudExec.exec(function () {
                api.execScript({
                    script: "hideHeader(false, 'main');"
                })
            })
            window.ApiCloudExec.exec(function () {
                if (api.frameName == 'agreement') {
                    api.execScript({
                        script: "showCloseIcon();"
                    })
                }
            })
            if (document.querySelector(`.${styles.header}`))
                document.querySelector(`.${styles.header}`).remove();
            if (document.querySelector(`.${styles.isNode}`))
                document.querySelector(`.${styles.isNode}`).style.paddingTop = 0;
        }
    }
}