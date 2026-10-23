const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

if (!REDIS_HOST || !REDIS_PORT) {
  throw new Error("REDIS_HOST and REDIS_PORT must be set");
}

export default connection = {
  host: REDIS_HOST,
  port: parseInt(REDIS_PORT),
  password: REDIS_PASSWORD || undefined,
};
