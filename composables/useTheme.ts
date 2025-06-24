import { ref, onMounted } from "vue";

export default function useTheme() {
    const isDark = ref(false);

    const toggleTheme = () => {
        isDark.value = !isDark.value;
        document.documentElement.classList.toggle("dark", isDark.value);
        localStorage.setItem("dark-theme", isDark.value ? "dark" : "light");
    };

    onMounted(() => {
        const savedTheme = localStorage.getItem("dark-theme");
        const systemDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        isDark.value = savedTheme ? savedTheme === "dark" : systemDark;

        document.documentElement.classList.toggle("dark", isDark.value);
    });

    return { isDark, toggleTheme };
}
