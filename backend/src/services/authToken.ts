import redis from '../utils/redis';

const authToken = async (
  token: string | null | undefined
): Promise<string | null> => {
  if (token) {
    const email = await redis.get(token);
    return email;
  } else return null;
};

export default authToken;
