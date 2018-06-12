import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import { signUpRequest, signInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest } from '../../actions/userProfile-actions.js';
import { recipesFetchRequest, recipeFetchRequest } from '../../actions/search-actions.js';
import Modal from '../helpers/modal';
import UserAuthForm from '../userAuth-form';
import SeachBar from '../searchBar';
import { logError, renderIf } from './../../lib/util.js';

class RecipeContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {  };
  }

  handleSignin = (user, errCB) => {
    return this.props.signIn(user)
      .then(() => this.props.userProfileFetch())
      .catch(err => {
        logError(err);
        errCB(err);
      });
  };
  handleSignup = (user, errCB) => {
    return this.props.signUp(user)
      .then(() => this.props.userProfileFetch())
      .catch(err => {
        logError(err);
        errCB(err);
      });
  };
  // handleSearch = (searchParams, errCB) => {
  //   console.log('searchParams: ',searchParams);
  //   if(!searchParams.minCals) searchParams.minCals='0';
  //   if(!searchParams.maxCals) searchParams.maxCals='10000';
  //   let ingredients = searchParams.maxIngredients ? `&ingr=${searchParams.maxIngredients}` : '';
  //   let diet = searchParams.dietOption ? `&diet=${searchParams.dietOption}` : '';
  //   let health = searchParams.healthOption ? `&health=${searchParams.healthOption}` : '';
  //   let queryParams = `&calories=${searchParams.minCals}-${searchParams.maxCals}${health}${diet}${ingredients}`;
  //   let queryString = searchParams.searchTerm ? `search?q=${searchParams.searchTerm}` : null;
  //   console.log('queryString: ', queryString);
  //   console.log('queryParams: ', queryParams);
  
  //   return this.props.recipesFetch(queryString, queryParams)
  //     .then(() => {
  //       if(queryString) {
  //         return this.props.history.push(`/search/${queryString}${queryParams}`);
  //       } else {
  //         return this.props.history.push(`/search/?q=${queryString}${queryParams}`);
  //       }
  //     })
  //     .catch(err => {
  //       logError(err);
  //       errCB(err);
  //     });
  // };

  handleBoundRecipeClick = (recipe, e) => {
    return this.props.recipeFetch(recipe.uri)
      .then(() => this.props.history.push(`/recipe/${recipe.uri}`))
      .catch(err => {
        logError(err);
        errCB(err);
      });
  };
  handleBoundFavoriteClick = (recipe, e) => {
    console.log('recipe: ', recipe);
    // return this.props.recipeFetch(recipe.users)
    //   .then(() => this.props.history.push(`/recipe/${recipe.uri}`))
    //   .catch(err => {
    //     logError(err);
    //     errCB(err);
    //   });
  };
  calsPS = (cals, servings) => Math.round(cals/servings);

  render() {
    let handleComplete = this.state.authFormAction === 'Sign Up' ? this.handleSignup : this.handleSignin;
    let { recipes } = this.props;
    return (
      <div className='container-fluid'>
        {/* <div ng-include=''app/containers/searchbar/smallsearchbar.html''></div> */}
        {renderIf(recipes && recipes.length < 1 ,
          <div>
            Sorry, no results.
          </div>
        )}
        <div className='row searchResultsDisplay'>
          <div className='flex-container space-around'>
            {renderIf(recipes && recipes.length > 0 ,
              <div>
                {recipes.map(recipe => {
                  let boundRecipeClick = this.handleBoundRecipeClick.bind(this, recipe);
                  let boundFavoriteClick = this.handleBoundFacoriteClick.bind(this, recipe);
                  return <div key={recipe._id}>
                    <div className='tile'>
                      <button onClick={boundFavoriteClick} className='allResultsFavButton' type='btn btn-default' style='display: none;'>
                        <span className='glyphicon glyphicon-bookmark'></span> <span className='allResultsFavButtonText'>Save</span>
                      </button>
                      <div className='tileWoutFavButton' onClick={boundRecipeClick}>
                        <img className='tilePic' src={recipe.image} />
                        <p className='tileLabel'>{recipe.label}</p>
                        <p className='tileCalorieAndIngredientText'><span className='tileCalorieText'> <span className='tileCalorieTextNumber'> {this.calsPS(recipe.calories, recipe.yield)}</span> CALORIES   </span>   |   <span className='tileIngredientText'> <span className='tileIngredientTextNumber'> {recipe.ingredientLines.length} </span>   INGREDIENTS</span></p>
                        <p className='tileCalorieAndIngredientTextHidden'><span className='tileCalorieText'> <span className='tileCalorieTextNumber'> {this.calsPS(recipe.calories, recipe.yield)}</span> CALS   </span>   |   <span className='tileIngredientText'> <span className='tileIngredientTextNumber'> {recipe.ingredientLines.length} </span>   INGR</span></p>
                      </div>
                        <p><a className='tileSource' rel="noopener noreferrer" target="_blank" href={recipe.url}>{recipe.source}</a></p>
                    </div>
                  </div>
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

let mapStateToProps = state => ({
  userAuth: state.userAuth,
  userProfile: state.userProfile,
  recipes: state.recipes,
});

let mapDispatchToProps = dispatch => {
  return {
    signUp: user => dispatch(signUpRequest(user)),
    signIn: user => dispatch(signInRequest(user)),
    userProfileFetch: () => dispatch(userProfileFetchRequest()),
    recipesFetch: (queryString, queryParams) => dispatch(recipesFetchRequest(queryString, queryParams)),
    recipeFetch: query => dispatch(recipeFetchRequest(query)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipeContainer);