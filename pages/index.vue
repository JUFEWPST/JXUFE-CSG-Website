<template>
    <div class=" h-screen relative bg-gradient-to-b from-blue-50 to-blue-100 items-center flex justify-center">
        <div class=" font-bold text-5xl">江西财经大学<br>
            <div class=" text-4xl text-center text-blue-400">网络安全协会</div>
        </div>
        <div class=" absolute bottom-5 text-2xl font-bold">信敏廉毅 ↓</div>
    </div>
    <div class="h-auto md:h-screen flex justify-baseline md:justify-between flex-col md:flex-row items-center">
        <div class="font-bold text-3xl md:text-6xl md:w-1/3 p-2 box-border text-center items-center">
            近期动态
        </div>
        <div class="w-full md:w-1/2 m-4 box-border">
            <ul>
                <ArticleBlock linkto="/" title="你好"></ArticleBlock>
                <ArticleBlock linkto="/" title="Ciallo"></ArticleBlock>
                <ArticleBlock linkto="/" title="和我一起 签订契约"></ArticleBlock>
                <ArticleBlock linkto="/" title="成为魔法少女吧"></ArticleBlock>
            </ul>
        </div>
    </div>
</template>