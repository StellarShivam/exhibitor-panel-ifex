'use client';

import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios, { endpoints, apiEndpoints, tokenManager } from 'src/utils/axios';

import { BASE_URL } from 'src/config-global';

import { AuthContext } from './auth-context';
import { setSession, isValidToken } from './utils';
import { AuthUserType, ActionMapType, AuthStateType } from '../../types';

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const TOKEN_STORAGE_KEY = 'accessToken';

const TOKEN_UUID_STORAGE_KEY = 'tokenUUID';

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
      if (accessToken) {
        if (!isValidToken(accessToken)) {
          const tokenUUID = sessionStorage.getItem(TOKEN_UUID_STORAGE_KEY);
          tokenManager.setTokenUUID(tokenUUID ?? '');
          await tokenManager.refreshToken();
          const reFreshedToken = tokenManager.getToken();
          setSession(reFreshedToken);
          dispatch({
            type: Types.INITIAL,
            payload: {
              user: {
                reFreshedToken,
              },
            },
          });
        }
        tokenManager.setToken(accessToken);
        setSession(accessToken);
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: {
              accessToken,
            },
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN

  const login = useCallback(async (email: string, password: string) => {
    const data = {
      email,
      password,
    };

    // const res = await axios.post(endpoints.auth.login, data);
    const res = await axios.post(`${BASE_URL}${apiEndpoints.auth.login}`, data);

    console.log('********* The response is : ', res);

    if (
      !res.data.data.roles?.includes('EXHIBITOR_ADMIN') &&
      !res.data.data.roles?.includes('EXHIBITOR_USER')
    ) {
      throw new Error('Access denied');
    }

    tokenManager.setTokenUUID(res.data.data.token);
    sessionStorage.setItem(TOKEN_UUID_STORAGE_KEY, res.data.data.token);
    await tokenManager.refreshToken();

    const access = tokenManager.getToken();

    setSession(access);

    dispatch({
      type: Types.LOGIN,
      payload: {
        user: {
          // ...user,
          access,
        },
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      const data = {
        email,
        password,
        firstName,
        lastName,
      };

      const res = await axios.post(endpoints.auth.register, data);

      const { accessToken, user } = res.data;

      sessionStorage.setItem(TOKEN_STORAGE_KEY, accessToken);

      dispatch({
        type: Types.REGISTER,
        payload: {
          user: {
            ...user,
            accessToken,
          },
        },
      });
    },
    []
  );

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
