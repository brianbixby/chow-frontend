import superagent from 'superagent';

export const recipesFetch = recipes => ({
  type: 'RECIPES_FETCH',
  payload: recipes,
});

export const homepageFetch = recipes => ({
  type: 'HOMEPAGE_FETCH',
  payload: recipes,
});

export const recipeFetch = recipe => ({
  type: 'RECIPE_FETCH',
  payload: recipe,
});

export const recipesFetchRequest = (queryString, queryParams) => dispatch => {
  let url = `https://api.edamam.com/${queryString}${process.env.API_KEY}&from=0&to=24${queryParams}`;

  if (`localStorage.${queryString}${queryParams}` && `localStorage.${queryString}${queryParams}.timestamp` > new Date().getTime()) {
    console.log("local storage recipesFetchRequest: ");
    dispatch(recipesFetch(JSON.parse(localStorage.getItem(`${queryString}${queryParams}.content`))));
    return JSON.parse(localStorage.getItem(`${queryString}${queryParams}.content`));
  }
  return superagent.get(url)
    .then(res => {
      localStorage.setItem(queryString + queryParams, JSON.stringify({content: res.body, timestamp: new Date().getTime() + 480000}));
      console.log("edamam query");
      dispatch(recipesFetch(res.body));
      return res.body;
    })
    .catch(err => {
      if(err.status === 404)
        return alert('404 Error: Recipes not found please try again with a valid search term ex. pizza' );
      alert(`${err.status} Error: ${err.message}`);
    });
};

export const homepageFetchRequest = () => dispatch => {
  let url = `https://api.edamam.com/search?q=random${process.env.API_KEY}&from=0&to=24&calories=0-10000`;
  
  // if (localStorage.random  && 'localStorage.random.timestamp' > new Date().getTime()) {
  //   console.log("local storage homepageFetchRequest: ", JSON.parse(localStorage.getItem('random.content')));
  //   dispatch(homepageFetch(JSON.parse(localStorage.getItem('random.content'))));
  //   return JSON.parse(localStorage.getItem('random.content'));
  // }

  return superagent.get(url)
    .then(res => {
      console.log("edamam query");
      localStorage.setItem('random', JSON.stringify({content: res.body.hits, timestamp: new Date().getTime() + 480000}));
      dispatch(homepageFetch(res.body.hits));
      return res.body.hits;
    })
    .catch(err => {
      if(err.status === 404)
        return alert('404 Error: Recipes not found please try again with a valid search term ex. pizza' );
      alert(`${err.status} Error: ${err.message}`);
    });
};

export const recipeFetchRequest = recipeURI => dispatch => {
  let qString = `r=http%3A%2F%2Fwww.edamam.com%2Fontologies%2Fedamam.owl%23recipe_${recipeURI}`;
  let url = `https://api.edamam.com/search?${qString}${process.env.API_KEY}`;

  if (`localStorage.${recipeURI}` && `localStorage.${recipeURI}.timestamp` > new Date().getTime()) {
    console.log("local storage recipeFetchRequest: ");

    dispatch(recipeFetch(JSON.parse(localStorage.getItem(`${recipeURI}.content`))));
    return JSON.parse(localStorage.getItem(`${recipeURI}.content`));
  }

  return superagent.get(url)
    .then(res => {
      console.log("edamam query");
      localStorage.setItem(recipeURI, JSON.stringify({content: res.body[0], timestamp: new Date().getTime() + 480000}));
      dispatch(recipeFetch(res.body[0]));
      return res.body[0];
    })
    .catch(err => {
      if(err.status === 404)
        return alert('404 Error: Recipe not found please try again with a valid search term ex. pizza' );
      alert(`${err.status} Error: ${err.message}`);
    });
};
