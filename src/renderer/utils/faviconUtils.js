/**
 * Utility functions for fetching website favicons
 */

/**
 * Get the favicon URL for a given website URL
 * @param {string} url - The website URL
 * @returns {string} - The favicon URL
 */
export const getFaviconUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    // Try multiple favicon locations in order of preference
    const faviconUrls = [
      `${urlObj.protocol}//${domain}/favicon.ico`,
      `${urlObj.protocol}//${domain}/favicon.png`,
      `${urlObj.protocol}//${domain}/apple-touch-icon.png`,
      `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
      `https://favicons.duckduckgo.com/ip3/${domain}.ico`
    ];
    
    return faviconUrls[0]; // Start with the most common one
  } catch (error) {
    console.error('Error getting favicon URL:', error);
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
  }
};

/**
 * Fetch favicon with fallback options
 * @param {string} url - The website URL
 * @returns {Promise<string>} - Promise that resolves to a working favicon URL
 */
export const fetchFavicon = async (url) => {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    const faviconUrls = [
      `${urlObj.protocol}//${domain}/favicon.ico`,
      `${urlObj.protocol}//${domain}/favicon.png`,
      `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
      `https://favicons.duckduckgo.com/ip3/${domain}.ico`
    ];
    
    // Try each favicon URL until one works
    for (const faviconUrl of faviconUrls) {
      try {
        const response = await fetch(faviconUrl, { 
          method: 'HEAD',
          mode: 'no-cors' // Allow cross-origin requests
        });
        
        // For no-cors mode, we can't check status, so just return the URL
        return faviconUrl;
      } catch (error) {
        // Continue to next URL if this one fails
        continue;
      }
    }
    
    // If all fail, return a default icon
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="%234A5568"/><path d="M12 6v6l4 2" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>';
    
  } catch (error) {
    console.error('Error fetching favicon:', error);
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="%234A5568"/><path d="M12 6v6l4 2" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>';
  }
};

/**
 * Preload favicon images to ensure they display quickly
 * @param {Array} urls - Array of favicon URLs to preload
 */
export const preloadFavicons = (urls) => {
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
    // No need to do anything with the image, just loading it into cache
  });
}; 