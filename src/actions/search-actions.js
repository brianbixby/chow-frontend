import superagent from 'superagent';

export const recipesFetch = recipes => ({
  type: 'RECIPES_FETCH',
  payload: recipes,
});

export const recipeFetch = recipe => ({
  type: 'RECIPE_FETCH',
  payload: recipe,
});

export const recipesFetchRequest = (queryString, queryParams) => dispatch => {
  let url = `https://api.edamam.com/${queryString}${process.env.API_KEY}&from=0&to=20${queryParams}`;
  console.log('url: ', url);
  return superagent.get(url)
    .then(res => {
      console.log('res.body: ', res.body.hits);
      dispatch(recipesFetch(res.body.hits));
      return res.body.hits;
    })
    .catch(err => {
      if(err.status === 404)
        return alert('404 Error: Recipes not found please try again with a valid search term ex. pizza' );
      alert(`${err.status} Error: ${err.message}`);
    });
};

export const recipeFetchRequest = queryString => dispatch => {
  console.log("queryString: ", queryString);
  var string =  queryString;
  var hashIndex = string.indexOf('#');
  var leftSide = string.substring(0, hashIndex);
  var rightSide = string.substring(hashIndex + 1, string.length);
  var qString = leftSide + '%23' + rightSide;

  let url = `https://api.edamam.com/search?r=${qString}${process.env.API_KEY}`;
  console.log('url: ', url);
  return superagent.get(url)
    .then(res => {
      console.log('res.body: ', res.body);
      dispatch(recipeFetch(res.body[0]));
      return res.body[0];
    })
    .catch(err => {
      if(err.status === 404)
        return alert('404 Error: Recipe not found please try again with a valid search term ex. pizza' );
      alert(`${err.status} Error: ${err.message}`);
    });
};

// var string =  req.query.queryString;
// var hashIndex = string.indexOf('#');
// var leftSide = string.substring(0, hashIndex);
// var rightSide = string.substring(hashIndex + 1, string.length);
// var queryString = leftSide + '%23' + rightSide;