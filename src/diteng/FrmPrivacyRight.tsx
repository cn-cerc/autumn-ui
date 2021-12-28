//@ts-nocheck
import React from "react";
import styles from "./AgreementPolicy.css";

function PrivacyRight() {
    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <img src="images/left-crow.png" id="back" onClick={() => window.history.go(-1)} />
                <span><i>地藤管家</i></span>
            </div>
            <div className={styles.isNode}><h1><span>隐私协议</span></h1>
                <p><span>生效时间：2020-01-01</span></p>
                <p><span>更新时间：2021-10-24</span></p>
                <p><span>本协议适用于我公司旗下的地藤管家和地藤商城产品。</span></p>
                <p><span>深圳市华软资讯科技有限公司（以下称“地藤管家”或“我们”）非常重视用户（以下简称“您”）的隐私和信息安全，不管您是个人用户还是企业用户。</span></p>
                <p><span>我们深知个人信息对您的重要性，您使用我们的服务，即表示您信赖我们对您信息的处理方式，故我们自知地藤管家的责任重大，并将尽全力保护您的个人信息的安全可靠。</span></p>
                <p><span>本隐私权政策旨在尽量以通俗易懂的方式，协助您了解我们会收集哪些信息，为什么要收集这些信息，如何使用、保障这类信息，以及您如何管理并控制自己的信息权利等内容。</span></p>
                <p><span>在注册、浏览或使用地藤管家服务前，您确认您已审慎阅读、充分理解并接受本政策各条款内容(未成年人应在法定监护人陪同下阅读），特别是限制或者免除责任的条款（包括管辖条款），该类条款将以加粗和 / 或加下划线等显著形式提示您注意。</span>
                </p>
                <p><span>如果您有任何疑惑、意见或建议，我们非常乐于听取并欢迎您通过本政策载明的联系方式与我们取得联系，我们将为您解答。</span></p>
                <p><span>本政策将帮助您了解以下内容：</span></p>
                <p><span>1、定义</span></p>
                <p><span>2、我们如何收集和使用您的个人信息</span></p>
                <p><span>3、我们如何使用 Cookie 和同类技术</span></p>
                <p><span>4、我们如何披露 / 共享、转让您的个人信息</span></p>
                <p><span>5、我们如何保护您的个人信息</span></p>
                <p><span>6、您的权利</span></p>
                <p><span>7、我们如何处理儿童的个人信息</span></p>
                <p><span>8、适用范围</span></p>
                <p><span>9、本政策如何更新</span></p>
                <p><span>10、联系方式</span></p>
                <h2><span>1、定义</span></h2>
                <p><span>1.1</span></p>
                <p><span>“地藤管家”或“我们”：除非另有特别说明，在本政策中指深圳市华软资讯科技有限公司。</span></p>
                <p><span>1.2</span></p>
                <p><span>“第三方”：指并非因为和我们有共同所有权或控制权而存在相关关系的公司或人（即非关联公司）或者其他非相关的个人。</span></p>
                <p><span>1.3</span></p>
                <p><span>“个人信息”：个人信息：指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。本隐私政策所指个人信息请见“我们如何收集和使用您的个人信息”这一条款中的所一一列明的类型。</span>
                </p>
                <p><span>1.4</span></p>
                <p><span>“个人敏感信息”：指一旦泄露、非法提供或滥用可能危害人身和财产安全，极易导致个人名誉、身心健康受到损害或歧视性待遇等的个人信息。本隐私政策中涉及的个人敏感信息可能包括：您的财产信息（包括银行帐号及充值信息等虚拟财产信息）；个人身份信息（包括身份证）；网络身份识别信息（包括账户名、账户昵称、邮箱地址及与前述有关的密码）；其他信息（包括通讯录、个人电话号码、手机号码、行程信息、网页浏览记录、住宿信息、精准定位信息）。对于本隐私政策中列示的如上个人敏感信息，为便于您在阅读时有所警觉，我们除在此统一定义并列示外，另仍然会在本隐私政策中以字体加粗、加下划线，或单独指出等突出显示的方式再行提示您注意。</span>
                </p>
                <p><span>1.5</span></p>
                <p><span>“非个人信息”：指不能识别或关联个人的信息。包括匿名化信息（不可复原），以及作为企业用户中业已由相关主管部门公示披露的全部非个人信息（例如企业联系地址、联系方式、营业年限、企业规模、从事行业、主营业务、主要产品、网站域名等）。</span>
                </p>
                <h2><span>2、我们如何收集和使用您的个人信息</span></h2>
                <p><span>我们仅会出于本政策所述的以下目的，收集和使用您的个人信息：</span></p>
                <p><span>2.1 帮助您注册成为地藤管家用户</span></p>
                <p><span>为助您成为地藤管家用户，以便我们为您提供注册用户服务（例如成为注册用户后即可登陆个人中心查看各类信息，或有资格参与优惠政策等用户活动），您将通过地藤管家中的注册页面注册帐号。您在注册帐号的过程中，您会向我们直接提供电子邮箱地址、手机号码、您设定的帐号密码（加密）、手机验证码之个人敏感信息，您提供的电子邮箱在注册成功后将作为您之后登陆我们服务的登录帐号，并且我们使用电子邮箱地址、手机号码这类个人信息发送验证码信息以供您提交验证身份是否有效以及进行密码找回。</span>
                </p>
                <p><span>您知悉，我们收集手机号码、电子邮箱地址信息是为了满足相关法律法规的网络实名制要求，若您不提供这类信息，将无法正常使用我们的注册用户服务。当然，在注册过程中，您也可以选择提供您的现居省份和现居城市信息，以便于我们向您提供更为优质的服务，您若不提供该类信息并不会影响您的注册流程并使用我们的注册用户服务。</span>
                </p>
                <p><span>如果您已经登录了自己的地藤管家帐号，则您可以在登陆帐号后向我们提供并完善您的昵称、联系地址、QQ 号、个人网址信息，您可选择拒绝提供该类信息，这不影响您正常使用地藤管家注册用户功能，如果您选择提供，我们均视为可关联的个人信息予以保护。</span>
                </p>
                <p><span>我们亦友情提示您，即使您不向我们提供任何个人信息，您也能够完全浏览我们官方网站的所有公开信息。</span></p>
                <p><span>2.2 为您提供地藤管家技术服务</span></p>
                <p><span>2.2.1</span></p>
                <p><span>您直接向我们提供的信息</span></p>
                <p><span>为向您提供我们的基础核心技术服务（包括对象存储、云主机、云数据库、CDN、内容审核等，具体请详见地藤管家官方网站所实时展示的服务内容），我们向您提供了多种实名认证形式。</span></p>
                <p><span>当您选择使用支付宝认证方式时，您需要向我们提供您的真实姓名、身份证号、身份证正反面照片、个人网址（选填）信息，并授权第三方授权我们通过“支付宝”服务验证您的个人信息。当您选择使用银行转账验证认证方式时，您需要向我们提供您的真实姓名、身份证号、身份证正反面照片、个人网址（选填）信息，并同时向我们提交包括开户银行帐号、开户银行以及支行信息之财务信息，以便我们通过向该开户银行帐号转账部分零钱以验证您的真实信息。您知悉，我们可能将该类非文字身份证明信息转化为文字类个人信息（姓名、性别、身份证号、民族、地址）保存。</span>
                </p>
                <p><span>您应当知悉，地藤管家各类技术服务均属于我们的基础核心业务功能，如果您不提供上述列示的个人信息并通过实名认证，您将无法享受我们提供的基础核心技术服务。</span></p>
                <p><span>2.2.2</span></p>
                <p><span>在您使用服务过程中我们收集的信息</span></p>
                <p><span>为实现我们的核心技术服务，我们另可能会在您使用服务过程中，收集您的如下信息，我们可能收集：</span></p>
                <p><span>1) 设备信息：包括设备名称、设备型号、设备设置、识标符、地区和语言设置、使用习惯、操作系统版本以及用于访问服务的设备的设置、设备异常信息；</span></p>
                <p><span>2) 日志信息：当您使用我们的网站或相关客户端提供的服务时，我们会自动收集您对我们服务的详细使用情况，作为有关网络日志保存。包括您的搜索查询内容、IP 地址、浏览器的类型、电信运营商、使用的语言、访问日期和时间及您访问的网页记录；</span>
                </p>
                <p><span>3) 位置信息：包括设备的 GPS 信号或附近的 WiFi 接入点的相关信息、设备定位所在区域 ID、网络服务提供商 ID。</span></p>
                <p><span>请注意，单独的设备信息、日志信息等是无法识别特定自然人身份的信息。但是，如果我们将这类非个人信息与其他信息结合用于识别特定自然人身份，或者将其与个人信息结合使用，例如将以上信息和您的帐号相关联时，则在结合使用期间，这类非个人信息将被视为个人信息，除取得您授权或法律法规另有规定外，我们会将该类个人信息做匿名化、去标识化处理。</span>
                </p>
                <p><span>2.3 为您提供互动功能和发出业务通知</span></p>
                <p><span>当您通过地藤管家与我们或其他用户进行通信、反馈、分享等互动时，我们将收集并使用您提交的姓名（昵称）、手机号码、电子邮箱地址等联系信息。您在使用我们提供的技术指导或技术支持服务时，您需要向我们提交工单信息和我们反馈互动；您可以通过我们的“问答社区”栏目进行评论、互动；</span>
                </p>
                <p><span>我们向您提供好友邀请服务，您提供您好友的电子邮箱地址并自行选择发送邮件邀请活动或分享相关活动至您的其它帐号平台以作共享互动等。</span></p>
                <p>
                    <span>我们将在用户协议或隐私权政策更新后及时向您发出通知以保障您的权益。另外，我们将通过您的联系信息告知您和其它用户之间的互动回复结果，告知您帐号实名认证结果反馈、权利人或用户的投诉举报通知以及解决您反馈的问题等。</span>
                </p>
                <p><span>2.4 改善我们的产品或服务</span></p>
                <p><span>为了改善我们的产品、服务并开发给您更好的服务，我们将会使用您的个人信息。但您应当知悉的是，一般情况下，我们为此目的仅使用采用匿名化处理后的综合信息和统计性信息，并不会识别到您个人，我们将会利用此类信息进行数据分析和研究及开展审计。</span>
                </p>
                <p><span>我们通过此类信息综合判断地藤管家的某一产品、解决方案或功能设置的必要性，可能会请用户参与各类反馈、互动以便推出新的产品和服务（例如和公司业务联系人手机、电子邮件沟通等），为了改善我们的产品或服务，在取得您同意的情况下，我们可能将您的个人信息与第三方数据匹配形成间接用户画像，以便我们进行产品研发或者有针对性地（通过邮寄、电子邮件、电话）向您提供服务信息。您也可通过联系地藤管家客服的方式告诉我们，我们将不再收集您的信息用于以上场景，这不会影响您正常使用地藤管家的核心技术功能。</span>
                </p>
                <p><span>2.5 开展营销和推广活动</span></p>
                <p><span>我们所收集的个人信息将被用于向您推广、介绍产品和服务。例如，通过电子邮箱地址以及手机号码的方式，向您发送产品和服务商业信息内容。当然，您有权根据我们在页面上设置的功能或通过我们附带告知的退订方式，选择不接收该类产品和服务的推广、介绍信息。</span>
                </p>
                <p><span>2.6 为您提供安全保障</span></p>
                <p><span>我们所收集的个人信息将用于确保我们产品和服务的安全性和可靠性，并防范网络欺诈、网络攻击和入侵等，更准确地识别违反法律法规或地藤管家相关协议规则的情况。我们可能使用或整合您的帐号信息、设备信息、软件使用信息以及我们关联公司、合作伙伴取得您授权或依据法律共享的信息，用于进行身份验证、检测及防范安全事件，并依法采取必要的记录、审计、分析、处置措施。</span>
                </p>
                <p><span>2.7 征得您授权同意的例外</span></p>
                <p><span>根据相关法律法规及个人信息保护规范的规定，在以下情形中，我们收集、使用个人信息无需征得您的授权同意：</span></p>
                <p><span>2.7.1</span></p>
                <p><span>与国家安全、国防安全有关的；</span></p>
                <p><span>2.7.2</span></p>
                <p><span>与公共安全、公共卫生、重大公共利益有关的；</span></p>
                <p><span>2.7.3</span></p>
                <p><span>与犯罪侦查、起诉、审判和判决执行等有关的；</span></p>
                <p><span>2.7.4</span></p>
                <p><span>出于维护个人信息主体或其他个人的生命、财产等重大合法权益但又很难得到您本人同意的；</span></p>
                <p><span>2.7.5</span></p>
                <p><span>所收集的个人信息是您自行向社会公众公开的；</span></p>
                <p><span>2.7.6</span></p>
                <p><span>从合法公开披露信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道；</span></p>
                <p><span>2.7.7</span></p>
                <p><span>根据您的要求签订合同所必需的；</span></p>
                <p><span>2.7.8</span></p>
                <p><span>用于维护我们产品或服务的安全稳定运行所必需的，例如发现、处置产品或服务的故障；</span></p>
                <p><span>2.7.9</span></p>
                <p><span>对您个人信息进行技术处理，使您的主体无法被识别，且处理后的信息不能被复原的信息（不属于个人信息）；或对您个人信息进行去标识化技术处理并保障安全的情况下；</span></p>
                <p><span>2.7.10</span></p>
                <p><span>法律法规或相关规范规定的其他情形。</span></p>
                <h2><span>3、我们如何使用 Cookie 和同类技术</span></h2>
                <p><span>3.1 Cookie</span></p>
                <p><span>为确保地藤管家正常运转、为您获得更轻松的访问体验、向您推荐您可能感兴趣的内容或广告等，我们会在您的计算机或移动设备上存储名为 Cookie 的小数据文件。Cookie 通常包含标识符、站点名称以及一些号码和字符。例如，借助于 Cookie，网站及客户端能够存储您的注册帐号、邮箱、密码（加密）和偏好等数据，Cookie 还可以帮助我们统计流量信息，分析页面设计和广告的有效性。</span>
                </p>
                <p><span>地藤管家启用 Cookie 的目的与大多数网站或互联网服务提供商启用 Cookie 的目的一样，即改善用户体验。我们不会将 Cookie 用于本政策所述目的之外的任何用途。您可根据自己的偏好管理或删除 Cookie。您可以通过各类不同浏览器自带的功能清除设备上保存的所有 Cookie，但如果您这么做，则需要在每一次使用地藤管家时亲自更改用户设置。您可通过自行修改您设备浏览器设置的方式拒绝或管理 Cookie。</span>
                </p>
                <p><span>3.2 网站信标和像素标签</span></p>
                <p><span>除 Cookie 外，我们还可能使用网站信标和像素标签等其他同类技术。例如，我们向您发送的电子邮件可能含有链接至我们的点击 URL，如果您点击该链接，我们则会跟踪此次点击，帮助我们了解您对产品或服务偏好并改善客户服务。网站信标通常是一种嵌入到网站或电子邮件中的透明图像，借助于电子邮件中的像素标签，我们能够获知电子邮件是否被打开，帮助我们判断向用户发送电子邮件的数量或者是否要向用户发送电子邮件。如果您不希望自己的活动以这种方式被追踪，则可以随时从我们的寄信名单中退订。</span>
                </p>
                <h2><span>4、我们如何披露 / 共享、转让您的个人信息</span></h2>
                <p><span>4.1 何时披露共享以及可能向谁披露 / 共享</span></p>
                <p><span>未经您的同意，我们将不会向第三方披露或共享您的信息。在获取您的同意后，为了向您提供服务，在以下情况下，我们可能向下列实体披露或共享您的信息：</span></p>
                <p><span>4.1.1</span></p>
                <p><span>在获得您（以及监护人）的明确同意或授权或您主动选择的情况下共享。</span></p>
                <p><span>4.1.2</span></p>
                <p><span>关联公司：您的个人信息可能会与地藤管家的关联公司共享。我们只会共享必要的个人信息，且受本隐私权政策中所声明目的的约束。关联公司如要改变个人信息的处理目的，将再次征求您的授权同意。</span></p>
                <p><span>4.1.3</span></p>
                <p><span>与授权合作伙伴共享：仅为实现本政策中声明的目的，我们的某些服务将由授权合作伙伴提供。我们可能会与合作伙伴共享您的某些个人信息，以提供更好的客户服务和用户体验。我们仅会出于合法、正当、必要、特定、明确的目的共享您的个人信息，并且只会共享提供服务所必要的个人信息。我们的合作伙伴无权将共享的个人信息用于任何其他用途。</span>
                </p>
                <p><span>4.1.3.1</span></p>
                <p><span>为实现广告推送，与广告、统计分析类合作伙伴的共享。地藤管家仅会向这些合作伙伴提供无法识别您个人身份信息的用户画像标签及去标识化或匿名化后的统计类信息，以帮助其在不识别您个人身份的前提下提升广告有效触达率。除非得到您的许可，否则我们不会将您的个人身份信息（指可以识别您身份的信息，例如姓名或手机号码，通过这些信息可以联系到您或识别您的身份）与提供广告、分析服务的合作伙伴共享。</span>
                </p>
                <p><span>4.1.3.2</span></p>
                <p><span>与供应商、服务提供商和其他合作伙伴的共享。我们将信息发送给支持我们业务的服务提供商、智能设备供应、系统服务提供商和其他合作伙伴（如硬件厂商、电信运营商、云服务商），这些支持包括提供技术基础设施服务、分析我们服务的使用方式、提供客户服务、违法违规事件调查、支付便利或进行学术研究和调查。我们会与共享的对象签署严格的数据保护协议，要求他们按照我们的说明、本隐私政策以及其他任何相关的保密和安全措施来处理个人信息。如果我们共享您的个人敏感信息或授权合作伙伴改变个人信息的使用及处理目的，将再次征求您的授权同意。</span>
                </p>
                <p><span>4.1.4</span></p>
                <p><span>在法定情形下的共享：我们可能会根据法律法规规定、诉讼争议解决需要，或按行政、司法机关依法提出的要求，对外共享披露您的个人信息。例如，如果我们确定您出现违反法律法规或严重违反地藤管家相关协议规则的情况，或为保护地藤管家及其关联公司用户或公众的人身财产安全免遭侵害，我们可能依据法律法规或平台相关协议规则披露关于您的个人信息，包括相关违规行为以及地藤管家平台已对您采取的措施。例如，若您使用的帐号或对您用户上传非法视频、违规视频等任何内容而严重违反我方平台规则、触犯法律法规和/或违背公序良俗，造成重大社会影响，给我方平台造成声誉损失，我们可能会公开披露您的信息与处罚情况。</span>
                </p>
                <p><span>4.2 转让信息及例外</span></p>
                <p><span>我们不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外：</span></p>
                <p><span>4.2.1</span></p>
                <p><span>在获取明确同意的情况下转让。</span></p>
                <p><span>4.2.2</span></p>
                <p><span>在涉及合并、收购或破产清算时，如涉及到个人信息转让，我们会要求新的持有您个人信息的公司、组织继续受此隐私权政策的约束，否则我们将要求该公司、组织重新向您征求授权同意。</span></p>
                <p><span>4.3 公开披露</span></p>
                <p><span>我们仅会在以下情况下，且采取符合业界标准的安全防护措施的前提下，才会公开披露您的个人信息：</span></p>
                <p><span>4.3.1</span></p>
                <p><span>根据您的需求，在您明确同意的披露方式下披露您所指定的个人信息。</span></p>
                <p><span>4.3.2</span></p>
                <p><span>根据法律、法规的要求、强制性的行政执法或司法要求所必须提供您个人信息的情况下，我们可能会依据所要求的个人信息类型和披露方式公开披露您的个人信息。在符合法律法规的前提下，当我们收到上述披露信息的请求时，我们会要求必须出具与之相应的法律文件，如传票或调查函。我们坚信，对于要求我们提供的信息，应该在法律允许的范围内尽可能保持透明。我们对所有的请求都将进行慎重的审查，以确保其具备合法依据，且仅限于执法部门因特定调查目的且有合法权利获取的数据。</span>
                </p>
                <p><span>4.4 共享、转让、公开披露用户信息时事先征得授权同意的例外</span></p>
                <p><span>以下情形中，共享、转让、公开披露您的用户信息无需事先征得您的授权同意：</span></p>
                <p><span>4.4.1</span></p>
                <p><span>与国家安全、国防安全有关的；</span></p>
                <p><span>4.4.2</span></p>
                <p><span>与公共安全、公共卫生、重大公共利益有关的；</span></p>
                <p><span>4.4.3</span></p>
                <p><span>与犯罪侦查、起诉、审判和判决执行等有关的；</span></p>
                <p><span>4.4.4</span></p>
                <p><span>出于维护您或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；</span></p>
                <p><span>4.4.5</span></p>
                <p><span>您自行向社会公众公开或向交易对手提供的个人信息；</span></p>
                <p><span>4.4.6</span></p>
                <p><span>从合法公开披露的信息中收集个人信息的，如新闻报道、政府信息公开等渠道；</span></p>
                <p><span>4.4.7</span></p>
                <p>
                    <span>评价信息或法律法规规定必须披露的信息。例如云市场为构建诚信交易环境，您的信用评价信息（星级、客户评价）需要被公开分享。若您是服务商，您应当根据适用的法律法规和市场规则的要求，公开分享企业或者自然人经营者的相关信息；</span>
                </p>
                <p><span>4.4.8</span></p>
                <p><span>其他法律法规等规定的情形。</span></p>
                <h2><span>5、我们如何保护您的个人信息</span></h2>
                <p><span>5.1 安全的例外</span></p>
                <p><span>我们采取了合理的实际措施和技术措施，以保护所收集的与服务有关的信息。但是请注意，虽然我们采取了合理的措施保护您的信息，但没有任何网站、Internet 传输、计算机系统或无线连接是绝对安全的。请您妥善保护自己的个人信息，仅在必要的情形下向他人提供。如您发现自己的个人信息泄密，尤其是您的账户及密码发生泄露，请您立即联络在线客服，以便我们采取相应措施。</span>
                </p>
                <p><span>5.2 我们采取的安全措施</span></p>
                <p><span>我们已使用符合业界标准的安全防护措施保护您提供的个人信息，防止数据遭到未经授权的访问、公开披露、使用、修改、损坏或丢失。我们会采取一切合理可行的措施，保护您的个人信息。我们特别采取了以下措施：</span></p>
                <p><span>5.2.1</span></p>
                <p><span>我们会将收集的您的个人信息进行去标识化处理，从而降低其他组织或个人通过去标识化个人信息识别到您的风险。我们使用 SSL 对许多服务进行加密。我们会审查信息收集、存储和处理方面的做法（包括物理性安全措施），以避免各种系统遭到未经授权的访问。</span>
                </p>
                <p><span>5.2.2</span></p>
                <p><span>我们已经获得由英国标准协会（BSI）iso27001 信息安全管理体系认证，以及中国信息通信研究院(工信部电信研究院)的可信云服务认证，能够有效保障您的信息系统安全、知识产权、商业秘密等。</span></p>
                <p><span>5.2.3</span></p>
                <p><span>我们只允许那些为了帮我们处理个人信息而需要知晓这些信息的地藤管家员工、授权代为处理的服务公司的人员访问个人信息，而且他们需要履行严格的合同保密义务，且适时进行相关安全培训，如果其未能履行这些义务，就可能会被追究法律责任或被终止其与地藤管家的关系。</span>
                </p>
                <p><span>5.2.4</span></p>
                <p><span>对我们来说，您的信息的安全非常重要。因此，我们将不断努力保障您的个人信息安全，并实施存储和传输全程安全加密等保障手段，以免您的信息在未经授权的情况下被访问、使用或披露。同时某些加密数据的具体内容，除了用户自己，其他人都无权访问。</span>
                </p>
                <p><span>我们在传输和存储您的个人敏感信息时，会采用加密等安全措施；存储个人生物识别信息时，将采用技术措施处理后再进行存储，例如仅存储个人生物识别信息的摘要。</span></p>
                <p><span>5.3 安全事件应急处置</span></p>
                <p><span>在发生个人信息安全事件后，我们将按照法律法规的要求，及时向您告知：安全事件的基本情况和可能的影响、我们已采取或将要采取的处置措施、您可自主防范和降低风险的建议、对您的补救措施等。我们将及时将事件相关情况以邮件、信函、电话、推送通知等方式告知您，难以逐一告知个人信息主体时，我们会采取合理、有效的方式发布公告。同时，我们还将按照监管部门要求，主动上报个人信息安全事件的处置情况。</span>
                </p>
                <p><span>5.4 保存期限和地域</span></p>
                <p><span>您在使用地藤管家期间，我们将持续为您保存您的个人信息，但相关信息将以实现目的所必需的最小化时间进行保存，否则，我们将对个人信息进行源数据及备份数据的删除或匿名化处理。如果您注销帐号或主动删除上述信息，地藤管家将依据网络安全法等法律法规规定在您删除后 6 个月内继续保存您的信息。</span>
                </p>
                <p><span>地藤管家会按照法律法规的规定，将在境内运营过程中收集和产生的个人信息存储于中华人民共和国境内，且不会将该等信息向境外进行传输。如地藤管家因业务发展需要，需向境外进行传输的，将明确告知并征得您的同意。</span>
                </p>
                <h2><span>6、您的权利</span></h2>
                <p><span>6.1 个人信息访问权</span></p>
                <p><span>您有权访问您的个人信息，但法律法规规定的例外情况除外。如果您想行使数据访问权，可以在地藤管家网站来登录您的帐号。具体而言，您可以通过在地藤管家“个人面板-个人信息”访问您帐号下的信息内容。</span></p>
                <p><span>6.2 个人信息更正权</span></p>
                <p><span>当您发现我们处理的关于您的个人信息有错误时，您有权要求我们做出更正或自行通过登陆帐号更正，通过在地藤管家“个人面板-个人信息/安全设置”更改您的个人信息。在更新您的个人信息时，我们可能会要求您先验证自己的身份（如向您电子邮箱或手机号码发送验证信息），然后再处理您的请求。</span>
                </p>
                <p><span>6.3 个人信息删除权。在以下情形中，您可以向我们提出删除个人信息的请求：</span></p>
                <p><span>6.3.1</span></p>
                <p><span>如果我们处理个人信息的行为违反法律法规；</span></p>
                <p><span>6.3.2</span></p>
                <p><span>如果我们收集、使用您的个人信息，却未征得您的同意；</span></p>
                <p><span>6.3.3</span></p>
                <p><span>如果我们处理个人信息的行为违反了与您的约定；</span></p>
                <p><span>6.3.4</span></p>
                <p><span>如果您不再使用我们的产品或服务，或您注销了帐号；</span></p>
                <p><span>6.3.5</span></p>
                <p><span>如果我们不再为您提供产品或服务。</span></p>
                <p><span>6.4 改变您授权同意的范围</span></p>
                <p><span>每个业务功能需要一些基本的个人信息或设备权限才能得以完成。对于额外收集的个人信息的收集和使用，以及您当时认为不必要的设备权限，您可以随时通过在线客服或以站内信的方式给予或收回您的授权同意，我们会及时给以回复。当您收回同意后，我们将不再处理相应的个人信息。但您收回同意的决定，不会影响此前基于您的授权而开展的个人信息处理。</span>
                </p>
                <p><span>6.5 个人信息主体注销帐号</span></p>
                <p><span>在您的帐号内无资源、无任何未支付的费用、无争议纠纷时，您可通过提交工单注销帐号。请注意，您注销帐号的行为是不可逆的行为，在注销帐号之后，您将无法通过已注销的帐号获得地藤商城提供产品或服务，我们将会在15个工作日内删除或匿名化有关您帐号的一切信息，发送邮件通知您，并保证这些信息不会泄露，但法律法规另有规定要求保存的数据除外。</span>
                </p>
                <p><span>6.6 个人信息主体获取个人信息副本</span></p>
                <p><span>在法律法规允许的范围内，您有权获取您的个人信息副本，您可通过联系在线客服进行处理。在技术可行、成本合理的的前提下，我们还可按您的明确要求，直接将您的个人信息副本传输给您指定的第三方。</span></p>
                <p><span>6.7 约束信息系统自动决策</span></p>
                <p><span>在某些业务功能中，我们可能仅依据信息系统、算法等在内的非人工自动决策机制做出决定。如果这些决定显著影响您的合法权益，您有权要求我们做出解释，我们也将提供适当的救济方式。</span></p>
                <p><span>6.8 投诉举报及响应</span></p>
                <p>
                    <span>当您有其他的投诉、建议或相关问题时，请通过本政策的联系方式与地藤管家公司联系。我们将尽快审核所涉问题，并在验证您的用户身份后及时予以回复，一般在三十天内作出答复。当然，如您不满意，您也可以通过向主管机关提出投诉举报。</span>
                </p>
                <p><span>对于您合理的请求，我们原则上不收取费用，但对多次重复、超出合理限度的请求，我们将视情收取一定成本费用。对于那些无端重复、需要过多技术手段（例如，需要开发新系统或从根本上改变现行惯例）、给他人合法权益带来风险或者非常不切实际的请求，我们可能会予以拒绝。此外，如果您的请求直接涉及国家安全、国防安全、公共卫生、犯罪侦查等和公共利益直接相关的事由，或者可能导致您或者其他个人、组织的合法权益受到严重损害，我们可能无法响应您的请求。</span>
                </p>
                <p><span>6.9 有权获得停止运营的告知</span></p>
                <p><span>如果地藤管家终止服务或运营，我们将及时停止收集您个人信息的活动，并且会至少提前三十日将停止运营的通知以逐一送达或公告的形式通知您，并在终止服务或运营后对所持有的您的个人信息进行删除或匿名化处理。</span></p>
                <h2><span>7、我们如何处理儿童的个人信息</span></h2>
                <p><span>地藤管家产品和服务主要面向非自然人。如果没有父母或监护人的同意，儿童不得创建自己的用户帐号。对于经父母同意而收集儿童个人信息的情况，我们只会在受到法律允许、父母或监护人明确同意或者保护儿童所必要的情况下使用或公开披露此信息。您注意，我们将不满 14 周岁的任何人均视为儿童。</span>
                </p>
                <p><span>如果我们发现自己在未事先获得可证实的父母同意的情况下收集了儿童的个人信息，则会设法尽快删除相关数据。</span></p>
                <h2><span>8、适用范围</span></h2>
                <p><span>为确保流畅的地藤管家使用体验，您可能会收到来自第三方提供的内容或网络链接。我们对此类第三方无控制权。您可选择是否访问第三方提供的链接、内容、产品和服务。我们无法控制第三方的隐私和数据保护政策，此类第三方不受到本政策的约束。在向第三方提交个人信息之前，请参见这些第三方的隐私保护政策。</span>
                </p>
                <p><span>您应当清楚无误地知悉，本隐私权政策不适用于其他第三方向您提供的服务，例如，地藤管家云市场上的服务商（例如直播服务商）依托地藤管家向您提供服务时，您向该类服务商提供的信息不适用本隐私权政策。我们也建议利用我们云服务而再向您用户提供服务的企业用户，应当另行与您的用户约定隐私权政策。</span>
                </p>
                <h2><span>9、本政策如何更新</span></h2>
                <p><span>基于互联网日新月异的特性，我们保留不时更新或修改本政策的权利。我们会通过不同渠道向您发送变更通知。对于本隐私权政策变更，我们会将最新版隐私权政策发布在我们的网站或地藤管家显著位置上，或向您发布单独的通知（如电子通知），提醒您隐私权政策的任何变更。</span>
                </p>
                <p><span>虽然本隐私权政策容许调整，但是未经您同意，我们不会削弱您按照本隐私权政策所应享有的权利，除非通过您提供的电子邮件地址向您发送通知或发布网站公告。</span></p>
                <h2><span>10、联系方式</span></h2>
                <p><span>您对地藤管家及本隐私权政策有任何疑惑、意见或建议，您可通过拨打客服热线的方式来取得我们的联系。</span></p>
                <p><span>为保障我们高效处理您的问题并及时向您反馈，需要您提交身份证明、有效联系方式和书面请求及相关证据，我们会在验证您的身份后处理您的请求。</span></p></div>
        </div>
    )
}

export default class FrmPrivacyRight extends React.Component {
    constructor() {
        super();
    }

    render(): React.ReactNode {
        return <PrivacyRight />
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