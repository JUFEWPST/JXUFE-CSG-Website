<template>
  <ClientOnly>
    <nuxt-particles class="particles-bg" id="app-particles" :options="particlesOptions" />
  </ClientOnly>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const particlesOptions = {
  particles: {
    number: { value: 15 }, // 粒子数量
    color: {
      value: [
        "#ffffff", "#ff6b6b", "#4ecdc4", "#45b7d1", "#ffda79", "#a77dc2"
      ]
    },
    move: {
      enable: true,        // 启用运动
      speed: 3,            // 运动速度
      direction: 'none' as const,   // 运动方向
      random: true,        // 随机方向
      straight: false,     // 是否直线运动
      outModes: {          // 粒子超出画布的行为
        default: 'bounce' as const, // 反弹
        left: 'out' as const,       // 左侧超出时消失
        right: 'out' as const,      // 右侧超出时消失
      },
    },
    opacity: {
      value: 0.7,
      // 启用随机透明度
      random: true,
      min: 0.3,  
      max: 1,    
    },
    size: {
      value: 6,
      random: true,
      min: 5,  // 最小尺寸
      max: 8, // 最大尺
      anim: {
        enable: true,      // 启用大小变化动画
        speed: 6,          // 变化速度
        size_min: 1,       // 最小尺寸
        sync: false        // 是否同步变化
      }
    },
  },
  background: {
    color: 'transparent'
  }
};

</script>

<style>
.particles-bg {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
}
</style>
