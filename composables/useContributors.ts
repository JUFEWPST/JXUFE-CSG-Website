export interface Contributor {
    login: string;
    avatar_url: string;
    html_url: string;
    contributions: number;
}

interface CachedContributors {
    expiresAt: number;
    value: Contributor[];
}

const CACHE_KEY = "contributors:v1";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

const API_URL =
    "https://api.github.com/repos/JUFEWPST/JXUFE-CSG-Website/contributors?per_page=50";

const readCache = (): Contributor[] | null => {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const cached: CachedContributors = JSON.parse(raw);
        if (Date.now() > cached.expiresAt) return null;
        return cached.value;
    } catch {
        return null;
    }
};

const writeCache = (value: Contributor[]) => {
    try {
        const data: CachedContributors = {
            expiresAt: Date.now() + CACHE_TTL_MS,
            value,
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch {
        /* quota exceeded — ignore */
    }
};

export const useContributors = () => {
    const contributors = useState<Contributor[]>("contributors", () => []);
    const loaded = useState<boolean>("contributors-loaded", () => false);
    const error = useState<boolean>("contributors-error", () => false);

    const load = async () => {
        if (loaded.value) return;

        const cached = readCache();
        if (cached) {
            contributors.value = cached;
            loaded.value = true;
            return;
        }

        try {
            const data = await $fetch<Contributor[]>(API_URL, {
                headers: { Accept: "application/vnd.github+json" },
            });
            contributors.value = data;
            writeCache(data);
        } catch {
            error.value = true;
        } finally {
            loaded.value = true;
        }
    };

    return { contributors, loaded, error, load };
};
