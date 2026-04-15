import axios, { tokenManager } from 'src/utils/axios';

// ----------------------------------------------------------------------

function jwtDecode(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

export const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

// ----------------------------------------------------------------------

export const tokenExpired = (exp: number) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer;

  const currentTime = Date.now();

  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s

  const timeLeft = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  console.log('timeLeft', timeLeft);

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(async () => {
    const tokenUUID = sessionStorage.getItem('tokenUUID');

    tokenManager.setTokenUUID(tokenUUID ?? '');

    try {
      const newToken = await tokenManager.refreshToken();
      if (newToken) {
        setSession(newToken);
      }
    } catch (error) {
      console.error('Token refresh failed, logging out:', error);
      setSession(null);
      // The refreshToken function already redirects to login, so we don't need to do it here
    }
  }, timeLeft);
};

// ----------------------------------------------------------------------

export const setSession = (accessToken: string | null) => {
  if (accessToken) {
    sessionStorage.setItem('accessToken', accessToken);

    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    // This function below will handle when token is expired
    const { exp } = jwtDecode(accessToken); // ~3 days by minimals server
    console.log('exp', exp);
    tokenExpired(exp);
  } else {
    sessionStorage.removeItem('accessToken');

    delete axios.defaults.headers.common.Authorization;
  }
};
