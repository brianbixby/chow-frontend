export default (state=[], action) => {
  let { type, payload } = action;

  switch(type) {
    case 'RECIPES_FETCH':
      return payload;
    case 'INFINITE_RECIPES_FETCH':
      console.log(state, payload)
      state.hits = [...state.hits, ...payload];
      return state;
    default:
      return state;
  }
};