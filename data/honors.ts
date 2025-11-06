export interface HonorItem {
    level: string;
    description: string;
}

export interface YearHonors {
    year: string;
    honors: HonorItem[];
}

export const getLevelColor = (level: string): string => {
    const colorMap: Record<string, string> = {
        '国一': 'from-blue-500 to-blue-600',      
        '国二': 'from-purple-500 to-purple-600',  
        '省二': 'from-green-500 to-green-600',    
        '省三': 'from-yellow-500 to-yellow-600'   
    };

    return colorMap[level] || 'from-gray-500 to-gray-600';
};

export const getYearColor = (year: string): string => {
    const colorMap: Record<string, string> = {
        '2025年': 'bg-pink-500',
        '2024年': 'bg-blue-500'
    };

    return colorMap[year] || 'bg-gray-500';
};

export const honorsData: YearHonors[] = [
    {
        year: "2025年",
        honors: [
            { level: "国二", description: "第22届ISCC竞赛博弈对抗赛" },
            { level: "国二", description: "第10届全国高校密码数学挑战赛" },
            { level: "国一", description: "第22届ISCC竞赛" },
            { level: "省二", description: "十六届蓝桥杯网络安全赛道" },
            { level: "省三", description: "十八届CISCN广东赛区" }
        ]
    },
    {
        year: "2024年",
        honors: [
            { level: "国一", description: "21届ISCC全国大学生信息安全竞赛" },
            { level: "国二", description: "2024睿抗机器人开发者大赛(RAICOM)全国总决赛" },
            { level: "省二", description: "十五届蓝桥杯网络安全赛道" },
            { level: "省二", description: "第九届全国密码挑战赛" }
        ]
    }
];
