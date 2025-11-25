import localData from '../esempio_risposta.json';

const PROXY_URL = 'https://corsproxy.io/?'; // Optional: Use a CORS proxy if needed

export const fetchTimetable = async (url) => {
    try {
        // Check if it's a valid URL
        const targetUrl = new URL(url);

        // For now, we might try to fetch directly. 
        // If CORS fails, we might need a proxy or just use local data for demo.
        // In a real scenario, we'd likely need a backend proxy.

        // Attempt fetch (using a public CORS proxy for demo purposes might be an option, 
        // but let's try direct first or fallback)

        // NOTE: The user provided URL returns JSON.
        const response = await fetch(targetUrl.toString());

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.warn("Fetch failed, falling back to local data (or erroring if intended). Error:", error);
        // For this specific task, if the fetch fails (likely due to CORS), 
        // we return the local example data so the user can see the UI.
        return localData;
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
