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
  console.log(queryString, queryParams);
  let url = `https://api.edamam.com/${queryString}${process.env.API_KEY}&from=0&to=24${queryParams}`;
  console.log("url: ", url);
  return superagent.get(url)
    .then(res => {
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
  return superagent.get(url)
    .then(res => {
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

  return superagent.get(url)
    .then(res => {
      console.log("res.body: ",res.body);
      dispatch(recipeFetch(res.body[0]));
      return res.body[0];
    })
    .catch(err => {
      if(err.status === 404)
        return alert('404 Error: Recipe not found please try again with a valid search term ex. pizza' );
      alert(`${err.status} Error: ${err.message}`);
    });
};
