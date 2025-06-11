import { jwtDecode } from 'jwt-decode';

interface JwtDecode {
  nick: string;
  hpf: boolean;
  iss: string;
  exp: number;
  sub: string;
  job: string;
  car: string;
}

/**
 * jwt를 디코딩하여 claims 값을 가져온다.
 */
export const decodeToken = (token: string): JwtDecode => {
  return jwtDecode<JwtDecode>(token);
};
