const getCacheKey = (url) => {
    return `timetable_cache_${btoa(url).slice(0, 50)}`;
};

const getCache = (url) => {
    try {
        const key = getCacheKey(url);
        const cached = localStorage.getItem(key);
        if (cached) {
            return JSON.parse(cached);
        }
    } catch (e) {
        console.warn('Failed to read cache:', e);
    }
    return null;
};

const setCache = (url, data) => {
    try {
        const key = getCacheKey(url);
        const cacheEntry = {
            data,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(cacheEntry));
    } catch (e) {
        console.warn('Failed to write cache:', e);
    }
};

export const fetchTimetable = async (url) => {
    const targetUrl = new URL(url);
    const urlString = targetUrl.toString();

    try {
        const response = await fetch(urlString);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Cache the successful response
        setCache(urlString, data);

        return {
            data,
            lastUpdated: new Date().toISOString(),
            fromCache: false
        };
    } catch (error) {
        console.error("Fetch failed, trying cache:", error);

        // Try to return cached data
        const cached = getCache(urlString);
        if (cached) {
            return {
                data: cached.data,
                lastUpdated: cached.lastUpdated,
                fromCache: true
            };
        }

        throw error;
    }
};

export const parseUrlParams = (url) => {
    try {
        const urlObj = new URL(url);
        return Object.fromEntries(urlObj.searchParams.entries());
    } catch (e) {
        return {};
    }
};
