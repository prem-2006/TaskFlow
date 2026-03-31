/**
 * Global SWR fetcher — used by all useSWR hooks
 * @param {string} url - API endpoint URL
 * @returns {Promise<any>} Parsed JSON response
 */
const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error('An error occurred while fetching data');
    error.info = await res.json().catch(() => ({}));
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export default fetcher;
