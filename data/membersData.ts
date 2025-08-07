// src/data/membersData.ts

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
const member2025: Member[] = [
    {
        name: '邱挺',
        display: '糖糖毬',
        position: '会长',
        avatar: 'https://tantanchugasuki.cn/76721863_p0_お願いごと、ひとつ.avif',
        contact: 'tangtangchugasuki@qq.com'
    },
    {
        name: '涂紫妍',
        display: '不退让',
        position: '团支书',
        avatar: '/avatar/不退让._2025-08-04 21.46.05_picture-0.avif'
    },
    {
        name: '柯善璐',
        position: '学习部部长',
    },
    {
        name: '刘若华',
        display: '刘若华',
        position: '宣传部部长',
    },
    {
        name: '陈家炜',
        position: '组织部部长',
    },
    {
        name: '余俊康',
        display: '余jk',
        position: '学习部成员',
    },
    {
        name: '吴欣宇',
        display: 'Kay',
        position: '学习部成员',
    },
    {
        name: '杨昊哲',
        position: '学习部成员',
    },
    {
        name: '潘钰楷',
        position: '学习部成员',
        avatar: '/avatar/Little Pan_2025-08-04 21.27.51_菜阿姨.avif'
    },
    {
        name: '乐俊豪',
        position: '宣传部成员',
    },
    {
        name: '聂绍恒',
        position: '学习部成员',
    },
    {
        name: '曾祥春',
        position: '学习部成员',
    },
    {
        name: '郑林均',
        position: '学习部成员',
    },
]
const member2024: Member[] =
    [
        {
            "name": "谢智屹",
            display: '秋雨样',
            "position": "会长",
            "avatar": '/avatar/qyy.avif',
            message:'Hack For Fun!',
            contact:'https://amqyy.cn/'
        },
        {
            "name": "吴沁沁",
            "position": "团支书"
        },
        {
            "name": "周俊宇",
            "position": "组织部成员"
        },
        {
            "name": "顾正皓",
            "position": "学习部成员"
        },
        {
            "name": "邱挺",
            "position": "学习部成员"
        },
        {
            "name": "孙苒栋",
            "position": "宣传部成员"
        },
        {
            "name": "喻菲",
            "position": "宣传部成员"
        },
        {
            "name": "雷诚",
            "position": "组织部成员"
        },
        {
            "name": "丁子萱",
            "position": "组织部成员"
        },
        {
            "name": "秦柯",
            "position": "宣传部成员"
        },
        {
            "name": "陈岩松",
            "position": "宣传部成员"
        },
        {
            "name": "黄俊诚",
            "position": "组织部成员"
        },
        {
            "name": "周涵雨",
            "position": "宣传部成员"
        },
        {
            "name": "刘若华",
            "position": "宣传部成员"
        },
        {
            "name": "吴欣宇",
            "position": "学习部成员"
        },
        {
            "name": "俞成洋",
            "position": "学习部成员"
        },
        {
            "name": "乐俊豪",
            "position": "宣传部成员"
        },
        {
            "name": "高钧睿",
            "position": "学习部成员"
        },
        {
            "name": "盛德云龙",
            "position": "宣传部成员"
        },
        {
            "name": "姜杭骏",
            "position": "宣传部成员"
        },
        {
            "name": "聂绍恒",
            "position": "学习部成员"
        },
        {
            "name": "叶涵",
            "position": "组织部成员"
        },
        {
            "name": "陈永盛",
            "position": "学习部成员"
        },
        {
            "name": "朱誉璇",
            "position": "组织部成员"
        },
        {
            "name": "姚真",
            "position": "宣传部成员"
        },
        {
            "name": "胡天伟",
            "position": "学习部成员"
        },
        {
            "name": "杨昊哲",
            "position": "学习部成员"
        },
        {
            "name": "潘雪",
            "position": "组织部成员"
        },
        {
            "name": "谢雨伸",
            "position": "学习部成员"
        },
        {
            "name": "纪晓岚",
            "position": "组织部成员"
        },
        {
            "name": "钟琳琳",
            "position": "组织部成员"
        },
        {
            "name": "陈帆",
            "position": "学习部成员"
        },
        {
            "name": "胡蓉",
            "position": "学习部成员"
        },
        {
            "name": "邹雨欣",
            "position": "组织部成员"
        },
        {
            "name": "焦昱淇",
            "position": "学习部成员"
        },
        {
            "name": "吴彦姗",
            "position": "组织部成员"
        },
        {
            "name": "喻志敏",
            "position": "组织部成员"
        },
        {
            "name": "周翔宇",
            "position": "宣传部成员"
        }
    ]

// export const membersData: MemberCollection = {
//     ...member2025, ...member2024
// };
export const membersArray: MemberGroup[] = [
    { year: 2025, members: member2025 },
    { year: 2024, members: member2024 }
];

