import authReducer from '../reducers/userAuth-reducers.js';

describe('Auth reducer', () => {
  test('initial state should be null', () => {
    expect(authReducer(undefined, { type: null })).toEqual(null);
  });

  test('no action type should return the state', () => {
    let state = { username: 'tetname', email: 'testemail', password: 'password' };
    expect(authReducer(state, { type: null })).toEqual(state);
  });
});