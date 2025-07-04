<template>
   <div class="min-h-screen bg-gradient-to-br from-blue-50 to-white">
  <!-- 顶部标题区 -->
  <div class="py-20 text-center">
    <h1 class="text-5xl font-bold text-gray-800 mb-4">关于我们</h1>
    <p class="text-xl text-gray-600 max-w-2xl mx-auto">探索、学习、守护网络安全</p>
  </div>

  <!-- 内容卡片容器 -->
  <div class="container mx-auto px-6 grid md:grid-cols-2 gap-12 pb-20">
    
    <!-- 协会简介 -->
    <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
        <h2 class="text-3xl font-bold mb-6 flex items-center transition-all duration-300 hover:translate-y-1 hover:text-[var(--color-accent-hover)] hover:drop-shadow-[0_5px_5px_rgba(59,130,246,0.3)]">
  <svg class="w-8 h-8 mr-2 transition-transform duration-300 hover:rotate-12">...</svg>
  协会简介
</h2>
<p class="text-gray-700 leading-relaxed text-lg">
  江西财经大学网络安全协会成立于2016年,是由学生自发组织的技术型社团。
  我们致力于培养成员的
  <span class="relative inline-block mx-1 group">
    <span class="font-semibold text-[var(--color-accent)] z-10 relative">网络安全技能</span>
    <span class="absolute bottom-0 left-0 h-1 w-full bg-[var(--color-accent-hover)] opacity-30 group-hover:opacity-70 transition-all duration-300 -z-1"></span>
  </span>、
  <span class="relative inline-block mx-1 group">
    <span class="font-semibold text-[var(--color-accent)] z-10 relative">CTF竞赛能力</span>
    <span class="absolute bottom-0 left-0 h-1 w-full bg-[var(--color-accent)] opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-1"></span>
  </span>和
  <span class="relative inline-block mx-1 group">
    <span class="font-semibold text-[var(--color-accent)] z-10 relative">实战经验</span>
    <span class="absolute bottom-0 left-0 h-1 w-full bg-[var(--color-accent)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left -z-1"></span>
  </span>。
</p>

<div class="mt-6 space-y-4">
  <p class="text-gray-700 leading-relaxed text-lg pl-6 border-l-4 border-[var(--color-primary)] hover:border-[var(--color-accent)] transition-colors duration-300">
    协会拥有完善的组织架构和专业的技术分支，定期举办：
    <ul class="list-disc list-inside mt-2 space-y-1 marker:text-[var(--color-primary)]">
      <li class="hover:text-[var(--color-accent)] transition-colors">网络安全讲座</li>
      <li class="hover:text-[var(--color-accent)] transition-colors">技能培训工作坊</li>
      <li class="hover:text-[var(--color-accent)] transition-colors">CTF竞赛活动</li>
      <li class="hover:text-[var(--color-accent)] transition-colors">校企合作项目</li>
    </ul>
  </p>

  <p class="text-gray-700 leading-relaxed text-lg bg-gradient-to-r from-blue-50 to-transparent p-4 rounded-lg hover:from-blue-100 transition-all duration-500">
    在数字化时代，网络安全的重要性日益凸显。我们期待更多对网络安全感兴趣的同学加入，
    <span class="inline-block relative group">
      <span class="text-[var(--color-primary)] font-medium">共同学习、共同进步</span>
      <svg class="w-4 h-4 absolute -right-5 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[var(--color-accent)]" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
      </svg>
    </span>,
    为校园网络安全和国家网络安全事业贡献力量。
  </p>
</div>
    </div>

    <!-- 使命与目标 -->
    <div class="bg-white p-8 rounded-xl shadow-lg">
      <h2 class="text-3xl font-bold mb-6">使命与目标</h2>
      <ul class="space-y-4">
        <li class="flex items-start">
          <span class="text-gray-700"> 🔒 <span class="font-semibold text-[var(--color-accent)]">技术培养</span>：每周技术沙龙、漏洞复现实验室<br>
                                       🏆 <span class="font-semibold text-[var(--color-accent)]">竞赛支持</span>：组织参加ISCC、强网杯等赛事<br>
                                       🛡️ <span class="font-semibold text-[var(--color-accent)]">校园安全</span>：协助学校进行网络安全检查<br>
                                       🌐 <span class="font-semibold text-[var(--color-accent)]">社区贡献</span>：发布校园网络安全指南</span>
        </li>
      </ul>
    </div>
     <!-- 招新卡片 -->
  <div class="bg-white p-8 rounded-xl shadow-lg max-w-2xl  border-2 border-dashed border-blue-200 hover:border-solid hover:border-blue-400 transition-all">
    <h2 class="text-3xl font-bold mb-4 text-blue-600">加入我们</h2>
    <p class="text-gray-600 mb-6">欢迎对网络安全感兴趣的同学加入协会QQ群交流学习</p>
    <!-- 群号提示 -->
    <p class="mt-4 text-sm text-gray-500">
      QQ群号:<span class="font-mono bg-gray-100 px-2 py-1 rounded">972909982</span>
    </p>
  </div>
    <div class="container mx-auto px-6 pb-20">
    </div>
</div>
</div>
</template>
   