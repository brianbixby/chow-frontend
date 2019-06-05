export default (state=[], action) => {
    let { type, payload } = action;
  
    switch(type) {
      case 'HOMEPAGE_FETCH':
        return payload;
      default:
        return state;
    }
  };