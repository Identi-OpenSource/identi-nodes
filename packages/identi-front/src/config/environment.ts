const HOST_URL = `${import.meta.env.VITE_APP_HOST_URL}`;
const HOST_API = `${import.meta.env.VITE_APP_HOST_API ?? '/identi-api/'}`;
const MAPBOX_TOKEN = import.meta.env.VITE_APP_MAPBOX_TOKEN;

const JWT_PREFIX = `${import.meta.env.VITE_APP_JWT_PREFIX}`;
const COMMUNITY_BASE_URL_S3 = `${import.meta.env.VITE_COMMUNITY_BASE_URL_S3}`;

export { HOST_URL, HOST_API, MAPBOX_TOKEN, JWT_PREFIX, COMMUNITY_BASE_URL_S3 };
