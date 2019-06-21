import superagent from 'superagent';

export const recipesFetch = recipes => ({
  type: 'RECIPES_FETCH',
  payload: recipes,
});

export const infiniteRecipesFetch = recipes => ({
  type: 'INFINITE_RECIPES_FETCH',
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

export const recipesFetchRequest = (queryString, queryParams, min, infiniteSearch) => dispatch => {
  console.log("hi");
  const max = (parseInt(min) + 24).toString();
  console.log("min: ", min, " max: ", max);
  let url = `https://api.edamam.com/${queryString}${process.env.API_KEY}&from=${min}&to=${max}${queryParams}`;

  return superagent.get(url)
    .then(res => {
      localStorage.setItem(queryString + queryParams + min, JSON.stringify({content: res.body, timestamp: new Date().getTime() + 604800000}));
      !infiniteSearch ? dispatch(recipesFetch(res.body)) : dispatch(infiniteRecipesFetch(res.body));
      return res.body;
    })
    .catch(err => err);
    // .catch(err => {
    //   if(err.status === 404)
    //     return alert('404 Error: Recipes not found please try again with a valid search term ex. pizza' );
    //   alert(`${err.status} Error: ${err.message}`);
    // });
};

export const homepageFetchRequest = () => dispatch => {
  let url = `https://api.edamam.com/search?q=random${process.env.API_KEY}&from=0&to=24&calories=0-10000`;

  return superagent.get(url)
    .then(res => {
      localStorage.setItem('random', JSON.stringify({content: res.body.hits, timestamp: new Date().getTime() + 604800000}));
      dispatch(homepageFetch(res.body.hits));
      return res.body.hits;
    })
    // .catch(err => {
    //   if(err.status === 404)
    //     return alert('404 Error: Recipes not found please try again with a valid search term ex. pizza' );
    //   alert(`${err.status} Error: ${err.message}`);
    // });
};

export const recipeFetchRequest = recipeURI => dispatch => {
  let qString = `r=http%3A%2F%2Fwww.edamam.com%2Fontologies%2Fedamam.owl%23recipe_${recipeURI}`;
  let url = `https://api.edamam.com/search?${qString}${process.env.API_KEY}`;

  return superagent.get(url)
    .then(res => {
      if (!res.body.length) return null;
      dispatch(recipeFetch(res.body[0]));
      return res.body[0];
    })
    // .catch(err => {
    //   if(err.status === 404)
    //     return alert('404 Error: Recipe not found please try again with a valid search term ex. pizza' );
    //   alert(`${err.status} Error: ${err.message}`);
    // });
};
