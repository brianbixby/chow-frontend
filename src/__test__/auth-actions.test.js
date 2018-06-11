import { signIn, signOut, signUpRequest, signInRequest } from '../actions/userAuth-actions.js';
import superagent from 'superagent';

const randomNum = max => {
  return Math.floor(Math.random()* max);
};

const mockUser = {
  username: `testname${randomNum(5000)}`,
  email: `testemail${randomNum(1000)}@email.net`,
  password: '1234512345',
};

describe('Auth actions', () => {
  let tempUser;

  test('signIn should return a SIGN_IN action', () => {
    let action = signIn({ token: '12345' });
    expect(action).toEqual({
      'payload': {'token': '12345'}, 'type': 'SIGN_IN'}
    );
  });

  test('signOut should return a SIGN_OUT action', () => {
    let action = signOut({ token: '12345' });
    expect(action).toEqual({'type': 'SIGN_OUT'});
  });
});