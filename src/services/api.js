export const fetchTimetable = async (url) => {
    try {
        // Check if it's a valid URL
        const targetUrl = new URL(url);

        // NOTE: The user provided URL returns JSON.
        const response = await fetch(targetUrl.toString());

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch failed:", error);
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
