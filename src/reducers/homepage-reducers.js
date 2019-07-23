export default (state=[], action) => {
    let { type, payload } = action;
  
    switch(type) {
      case 'HOMEPAGE_FETCH':
        return [...state, ...payload];
      default:
        return state;
    }
  };