// src/data/membersData.ts

export interface Member {
    name: string;
    position: string;
    avatar?: string;
    message?: string;
    contact?: string;
}

export interface MemberCollection {
    [year: string]: Member[];
}

const membersData: MemberCollection = {
    '2025': [
        {
            name: '糖糖毬',
            position: '会长',
            avatar: 'https://tantanchugasuki.cn/76721863_p0_お願いごと、ひとつ.avif',
            contact: 'tangtangchugasuki@qq.com'
        },
        {
            name: '涂紫妍',
            position: '团支书',
        },
    ]
};

export default membersData;
