<template>
  <vue-particles id="tsparticles-instance" :options="particlesOptions" @particles-loaded="onParticlesLoaded"
    class="particles-container" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { isDark } = useTheme();
const particlesOptions = {
  background: {
    color: {
      value: "transparent",
    },
  },
  fpsLimit: 120,
  particles: {
    color: {
      value: ["#ffffff", "#ff6b6b", "#4ecdc4", "#45b7d1", "#ffda79", "#a77dc2"],
    },
    // links: {
    //   color: "random",
    //   distance: 150,
    //   enable: true,
    //   opacity: 0.5,
    //   width: 1,
    // },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 2,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 30,
    },
    opacity: {
      value: { min: 0.3, max: 0.8 },
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 7 },
    },
  },
  detectRetina: true,
};

const onParticlesLoaded = async (container: any) => {
  console.log("Particles container loaded", container);
};
</script>

<style>
.particles-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: -999;
}
</style>
