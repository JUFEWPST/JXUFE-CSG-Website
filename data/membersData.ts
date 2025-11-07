// 能翻到这查真名的应该都是自己人吧（

export interface Member {
    name: string;
    display?: string;
    position: string;
    avatar?: string;
    message?: string;
    contact?: string;
}

export interface MemberCollection {
    [year: number]: Member[];
}
export interface MemberGroup {
    year: string | number;
    members: Member[];
}
const founder: Member[] = [{
    name: '乐晨阳',
    display: 'leshier',
    position: '创始人',
    message: '希望网安协会越来越好'
}]
const member2025: Member[] = [
    {
        name: '邱挺',
        display: '糖糖毬',
        position: '会长',
        avatar: 'https://img.tantanchugasuki.cn/i/2025/10/16/avatar.webp',
        contact: 'tangtangchugasuki@qq.com',
        message: '愿我们终能与我们所憧憬的美好相遇'
    },
    {
        name: '涂紫妍',
        display: 'Firstsnow',
        position: '团支书',
        avatar: '/avatar/不退让._2025-08-04 21.46.05_picture-0.avif',
        message: '自由 热爱 风生水起'
    },
    {
        display: 'Heaven',
        name: '柯善璐',
        avatar: 'https://pic-bed.dearheaven.cn/img/touxiang.webp',
        position: '学习部部长',
    },
    {
        name: '刘若华',
        display: '刘若华',
        position: '宣传部部长',
        avatar: '/avatar/lrh.avif'
    },
    {
        name: '陈家炜',
        position: '组织部部长',
        display: '定夏汐',
        message: '记得好好吃饭',
        avatar: '/avatar/昵称..avif'
    },
    {
        name: '余俊康',
        display: '余jk',
        position: '学习部成员',
        avatar: '/avatar/yjk.avif'
    },
    {
        name: '吴欣宇',
        display: 'Kay',
        avatar: "/avatar/WKayyy.avif",
        position: '学习部成员',
    },
    {
        name: '杨昊哲',
        display: 'fjsdof',
        position: '学习部成员',
        avatar: '/avatar/yhz.avif'
    },
    {
        name: '潘钰楷',
        position: '学习部成员',
        avatar: '/avatar/Little Pan_2025-08-04 21.27.51_菜阿姨.avif',
        display: 'Jack Pan'
    },
    {
        name: '乐俊豪',
        position: '宣传部成员',
        display: 'TrappinX',
        message: '我爱抹茶',
        avatar: '/avatar/TrappinX.avif'
    },
    {
        name: '聂绍恒',
        position: '学习部成员',
        display: 'piter',
        avatar: '/avatar/piter.avif',
        message: '无人问津也好 技不如人也罢 你都要试着安静下来做自己该做的事 而不是让内心的烦躁焦虑毁掉你本就不多的热情和定力'
    },
    {
        name: '曾祥春',
        position: '学习部成员',
        display: '富贵夫斯基',
        avatar: '/avatar/明天..avif'
    },
    {
        name: '涂传朕',
        position: '学习部成员',
        display: 'KipJayChou',
        avatar: '/avatar/球状闪电.avif',
        message: 'Canzoni preferite'
    },
    {
        name: '郑林均',
        position: '学习部成员',
        display: '雨霁',
        avatar: '/avatar/路.avif'
    },
    {
        name: '严雨睿',
        position: '学习部成员',
        display: 'Lestine',
        avatar: '/avatar/掷清露.avif',
        message: '梦想在远方，我在月球'
    },
    {
        name: '马嘉锴',
        position: '学习部成员',
        display: 'waterloo',
        avatar: '/avatar/Edric.avif',
        message: 'AST waterloo'
    },
    {
        name: '熊姝婕',
        position: '学习部成员',
        display: 'xxxx',
        avatar: '/avatar/bulletproof.avif',
    },
    {
        name: '陈紫烨',
        position: '宣传部成员',
        display: 'Duck不必',
        avatar: '/avatar/Duck不必.avif',
        message: '正在输入中…'
    },
    {
        name: '曹庭上',
        position: '学习部成员',
        display: '元一',
        avatar: '/avatar/躺平摆烂真君.avif',
        message: '又菜又爱玩'
    },
    {
        name: '连怡盛',
        position: '学习部成员',
        display: '栗悟饭与龟波功',
        avatar: '/avatar/伊邪.avif',
    },
    {
        name: '胡蓉',
        position: '???',
        display: 'zred',
        avatar: '/avatar/zred.avif',
    },
    {
        name: '陈磊',
        position: '学习部成员',
        display: '槐安',
        avatar: '/avatar/槐安.avif',
    },
    {
        name: '蒋滔',
        position: '数智部大王',
        display: '数智天王',
        avatar: '/avatar/MIUMA.avif',
        message: '我爱睡觉'
    },
    {
        name: '刘傲',
        position: '学习部成员',
        display: '6aoa',
        avatar: '/avatar/la.avif',
        message: '我真不会'
    },
    {
        name: '关睿霖',
        position: '学习部成员',
        display: 'GRL',
        avatar: '/avatar/GRL.avif',
        message: '来啦！'
    },
    {
        name: '陈阔',
        position: '学习部成员',
        display: 'Final Infinity',
        avatar: '/avatar/后现代抽象人.avif',
        message: '(\\x -> x x)(\\x -> x x)'
    },
    {
        name: '余念强',
        position: '学习部成员',
        display: '余念强',
        avatar: '/avatar/ynq.avif',
        message: '风过无痕，往事轻扬'
    },
    {
        name: '程琦磊',
        position: '学习部成员',
        display: '宸',
        avatar: '/avatar/宸Qilence.avif',
        message: '在这个怀疑的年代，我们依然需要信仰！'
    },
    {
        name: '曹京顺',
        position: '学习部成员',
        display: 'ソギョク',
        avatar: '/avatar/ソギョク.avif',
    },
    {
        name: '吴沁沁',
        position: '学习部成员',
        display: 'Q',
        avatar: '/avatar/Zy..avif',
        message: 'ʕ •ᴥ•ʔ'
    },
    {
        name: '万正翔',
        position: '学习部成员',
        display: '离歌笑',
        avatar: '/avatar/wzx.avif',
        message: 'Always'
    },
    {
        name: '方娅苈',
        position: '学习部成员',
        display: '电子休眠',
        avatar: '/avatar/电子休眠.avif',
    },
    {
        name: '叶雨涵',
        position: '组织部成员',
        display: '一枚笨蛋',
        avatar: '/avatar/云暮.avif',
    },
    {
        name: '章可欣',
        position: '学习部成员',
        display: 'Z_☆',
        avatar: '/avatar/Z_☆.avif',
    },
    {
        name: '李名辉',
        position: '学习部成员',
        display: '神瑛辉',
        avatar: '/avatar/LMH.avif',
        message: '一切都是命运石之门的安排'
    },
    {
        name: '胡文浩',
        position: '学习部成员',
        display: '路人甲',
        avatar: '/avatar/胡文浩.avif',
        message: '咸鱼之王'
    },
    {
        name: '李文浩',
        position: '学习部成员',
        display: '伊蕾娜',
        avatar: '/avatar/臻于佳境.avif',
        message: '像洋娃娃般精致的面容，连夏日的骄阳都甘愿臣服于我的光芒——没错，正是本魔女伊蕾娜在此宣告'
    },
    {
        name: '潘澄辰',
        position: '学习部成员',
        display: 'yue3862',
        avatar: '/avatar/悲凉的月亮62.avif',
        message: '透视真是太简单了，你知道吗'
    },
    {
        name: '张笠彬',
        position: '学习部成员',
        display: 'jlb',
        avatar: '/avatar/JLB.avif',
    },
    {
        name: '廖宇馨',
        position: '学习部成员',
        display: 'haris',
        avatar: '/avatar/Iris.avif',
    },
    {
        name: '曾梦鸽',
        position: '组织部成员',
        display: 'z_d',
        avatar: '/avatar/Tender.avif',
        message: '任何看不清的路，都是命运预留的旷野'
    },
    {
        name: '黄强',
        position: '组织部成员',
        display: '遗憾托付科幻',
        avatar: '/avatar/遗憾托付科幻.avif',
    },
    {
        name: '刘悦清',
        position: '组织部成员',
        display: '刘悦清',
        avatar: '/avatar/Lumi.avif',
        message: '人生三万天，试试又能怎'
    },
]
const member2024: Member[] =
    [
        {
            name: '谢智屹',
            display: '秋雨样',
            position: "会长",
            avatar: '/avatar/qyy.avif',
            message: 'Hack For Fun!',
            contact: 'https://amqyy.cn/'
        },
        {
            name: "吴沁沁",
            position: "团支书",
            display: 'Q',
            avatar: '/avatar/Zy..avif',
            message: 'ʕ •ᴥ•ʔ'
        },
        {
            name: "周俊宇",
            position: "组织部成员"
        },
        {
            name: "顾正皓",
            position: "学习部成员"
        },
        {
            name: "孙苒栋",
            position: "宣传部成员"
        },
        {
            name: '潘钰楷',
            position: '学习部成员',
            avatar: '/avatar/Little Pan_2025-08-04 21.27.51_菜阿姨.avif',
            display: 'Jack Pan'
        },
        {
            name: "喻菲",
            position: "宣传部成员"
        },
        {
            name: "雷诚",
            position: "组织部成员"
        },
        {
            name: "丁子萱",
            position: "组织部成员"
        },
        {
            name: "秦柯",
            position: "宣传部部长"
        },
        {
            name: "陈岩松",
            position: "宣传部成员"
        },
        {
            name: "黄俊诚",
            position: "组织部成员"
        },
        {
            name: "周涵雨",
            position: "宣传部成员"
        },
        {
            name: "刘若华",
            display: '刘若华',
            position: "宣传部成员",
            avatar: '/avatar/lrh.avif'
        },
        {
            name: '吴欣宇',
            display: 'Kay',
            avatar: "/avatar/WKayyy.avif",
            position: '学习部成员',
        },
        {
            name: "邱挺",
            display: "糖糖毬",
            avatar: "https://img.tantanchugasuki.cn/i/2025/10/16/avatar.webp",
            position: "学习部成员",
            message: '愿我们终能与我们所憧憬的美好相遇'
        },
        {
            name: "俞成洋",
            position: "学习部成员"
        },
        {
            name: "乐俊豪",
            position: "宣传部成员",
            display: 'TrappinX',
            message: '我爱抹茶',
            avatar: '/avatar/TrappinX.avif'
        },
        {
            name: '曾祥春',
            position: '学习部成员',
            display: '富贵夫斯基',
            avatar: '/avatar/明天..avif'
        },
        {
            name: '郑林均',
            position: '学习部成员',
            display: '雨霁',
            avatar: '/avatar/路.avif'
        },
        {
            name: '余俊康',
            display: '余jk',
            position: '学习部成员',
            avatar: '/avatar/yjk.avif'
        },
        {
            display: 'Heaven',
            name: '柯善璐',
            avatar: 'https://pic-bed.dearheaven.cn/img/touxiang.webp',
            position: '学习部成员',
        },
        {
            name: "高钧睿",
            position: "学习部成员",
            avatar: '/avatar/╰⋛星☆阑⋚╯.avif'
        },
        {
            name: "盛德云龙",
            position: "宣传部成员"
        },
        {
            name: "姜杭骏",
            position: "宣传部成员"
        },
        {
            name: "聂绍恒",
            position: "学习部成员",
            display: 'piter',
            avatar: '/avatar/piter.avif',
            message: '无人问津也好 技不如人也罢 你都要试着安静下来做自己该做的事 而不是让内心的烦躁焦虑毁掉你本就不多的热情和定力'
        },
        {
            name: "叶涵",
            position: "组织部成员"
        },
        {
            name: "陈永盛",
            position: "学习部成员"
        },
        {
            name: "朱誉璇",
            position: "组织部成员"
        },
        {
            name: "姚真",
            position: "宣传部成员"
        },
        {
            name: "胡天伟",
            position: "学习部成员"
        },
        {
            name: '涂紫妍',
            display: 'Firstsnow',
            position: '学习部成员',
            avatar: '/avatar/不退让._2025-08-04 21.46.05_picture-0.avif'
        },
        {
            name: "杨昊哲",
            display: 'fjsdof',
            position: "学习部成员",
            avatar: '/avatar/yhz.avif'
        },
        {
            name: "潘雪",
            position: "组织部部长"
        },
        {
            name: "谢雨伸",
            position: "学习部成员"
        },
        {
            name: "纪晓岚",
            position: "组织部成员"
        },
        {
            name: "钟琳琳",
            position: "组织部成员"
        },
        {
            name: "陈帆",
            position: "学习部成员"
        },
        {
            name: "胡蓉",
            position: "???",
            display: 'zred',
            avatar: '/avatar/zred.avif',
        },
        {
            name: "邹雨欣",
            position: "组织部成员"
        },
        {
            name: "焦昱淇",
            position: "学习部成员"
        },
        {
            name: "吴彦姗",
            position: "组织部成员"
        },
        {
            name: "喻志敏",
            position: "组织部成员"
        },
        {
            name: "周翔宇",
            position: "宣传部成员"
        }
    ]
const member2023 = [{
    display: '静我凡心',
    name: '陈永盛',
    position: '会长',
    message: '前途漫漫，当克己，当慎独，磨棱角，退优越，沉下心！',
    avatar: '/avatar/cys.avif'
},
{
    name: "胡蓉",
    position: "???",
    display: 'zred',
    avatar: '/avatar/zred.avif',
},]
const member2022 = [{
    name: '钟金龙',
    display: '钟金龙',
    position: '会长',
    message: '请永远的相信自己，努力终将会有收获',
    contact: '2272704942@qq.com',

},
{
    name: '严慧婷',
    display: '一一',
    position: '宣传部部长',
},
]
const member2021: Member[] = [
    {
        name: '孔令健',
        display: 'King Is Not Geek',
        position: '学习部成员',
        message: '希望网安协会蒸蒸日上',
        avatar: '/avatar/King Is Not a Geek!.avif',
    },
    {
        name: '钟金龙',
        display: '钟金龙',
        position: '学习部成员',
        message: '请永远的相信自己，努力终将会有收获',
        contact: '2272704942@qq.com',
    },
    {
        name: '王舒',
        display: '梦泽',
        position: '学习部成员',
        message: '失败总是贯穿人生始终',
        avatar: '/avatar/万花筒.avif'
    },
    {
        name: '严慧婷',
        display: '一一',
        position: '组织部成员',
    },]
const member2020: Member[] = [{
    name: '宗梦洁',
    display: 'zmj',
    position: '会长',
    message: '漏洞是隐藏的数字彩蛋，攻防是烧脑的真人剧本杀～欢迎大家加入网安协会，一起打怪升级呀！',
    avatar: '/avatar/zmj.avif'
}]
// export const membersData: MemberCollection = {
//     ...member2025, ...member2024
// };
export const membersArray: MemberGroup[] = [
    { year: '创始人', members: founder },
    { year: 2025, members: member2025 },
    { year: 2024, members: member2024 },
    { year: 2023, members: member2023 },
    { year: 2022, members: member2022 },
    { year: 2021, members: member2021 },
    { year: 2020, members: member2020 },
];

