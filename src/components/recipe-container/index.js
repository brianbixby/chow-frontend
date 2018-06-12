import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import { signUpRequest, signInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest } from '../../actions/userProfile-actions.js';
import { recipesFetchRequest, recipeFetchRequest, recipeFetch } from '../../actions/search-actions.js';
import Modal from '../helpers/modal';
import UserAuthForm from '../userAuth-form';
import SeachBar from '../searchBar';
import { logError, renderIf } from './../../lib/util.js';

class RecipeContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {  };
  }
  // componentWillMount() {
  //   userValidation(this.props);
  //   this.props.scoreBoardsFetch(this.props.currentLeague._id)
  //     .then(() => {
  //       this.props.userPicksFetch(this.props.currentLeague._id)
  //       .then(picks => {
  //         let gameIDArr = [];
  //         gameIDArr.push(picks.map(userPick => userPick.gameID._id));
  //         return this.props.gamesFetch(this.props.currentLeague.sportingEventID, gameIDArr)
  //       })
  //       .catch(logError);
  //     })
  //     window.scrollTo(0, 0);
  // }

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

  // handleBoundRecipeClick = (myRecipe, e) => {
  //   return this.props.recipeFetch(myRecipe.recipe.uri)
  //     .then(() => this.props.history.push(`/recipe/${myRecipe.recipe.uri}`))
  //     .catch(err => {
  //       logError(err);
  //       errCB(err);
  //     });
  // };

  // recipeFetch
  handleFavoriteClick = e => {
    console.log('recipe: ', recipe);
    // addToFavorite(this.props.recipe.uri, this.props.recipe.label, this.props.recipe.image);
    // return this.props.recipeFetch(recipe.users)
    //   .then(() => this.props.history.push(`/recipe/${recipe.uri}`))
    //   .catch(err => {
    //     logError(err);
    //     errCB(err);
    //   });
  };
  calsPS = (cals, servings) => Math.round(cals/servings);
  calsPD = (cals, servings) => (cals/servings/20).toFixed(0);

  render() {
    let handleComplete = this.state.authFormAction === 'Sign Up' ? this.handleSignup : this.handleSignin;
    let { recipe } = this.props;
    return (
      <div className='container'>
        <h1> single result</h1>
        {renderIf(recipe && recipe.length < 1 ,
          <div>
            Sorry, no results.
          </div>
        )}
        {renderIf(recipe && recipe.length > 0,
          <div className='row'>
            <div className='singleResultShowLarge'>
              <div className='row'>
                <div id='individualImgDiv' className='col-xs-12 col-sm-6 col-lg-6'>
                  <img className='individualResultImg' src={recipe.image} />
                </div>

                <div id='summaryDiv' className='col-xs-12 col-sm-6 col-lg-6'>
                  <p className='individualResultLabel'>{recipe.label}</p>
                  <p className='individualResultSource'>See full recipe on: <a rel="noopener noreferrer" target="_blank" href={recipe.url}>{recipe.source}</a></p>
                  <button className='individualResultFavButton' onClick={this.handleFavoriteClick} id='favoriteButton' className='btn btn-primary'>
                    <span className='glyphicon glyphicon-bookmark'></span> Save
                  </button>
                  {/* both a tag below should have on click */}
                  <h5> <a className='individualResultDietLabel'>{recipe.dietLabels}</a> <a className='individualResultHealthLabel'>{recipe.healthLabels}</a></h5>
                </div>
              </div>

              <div id='nutritionalSummaryDiv' className='col-xs-12 col-sm-6 col-lg-5'>
                <p className='individualResultIngredientCount'>Nutrition</p>
                <div className='individualResultNutritionDiv'>
                  <p className='individualResultNutritionBox'> <span className='individualResultNutritionNumber'>{this.calsPS(recipe.calories, recipe.yield)} </span><br/> <span className='individualResultNutritionLable'>CALORIES/SERVING </span></p>
                  <p className='individualResultNutritionBox'> <span className='individualResultNutritionNumber'>{this.calsPD(recipe.calories, recipe.yield)}% </span><br/><span className='individualResultNutritionLable'> DAILY VALUE</span></p>
                  <p className='individualResultNutritionBox'> <span className='individualResultNutritionNumber'>{recipe.yield}</span> <br/><span className='individualResultNutritionLable'> SERVINGS </span> </p>
                </div>
                <div id='showWhenLargeNutritionalInfo' ng-repeat='all in result.digest'>
                  <p>
                    <a className='individualResultNutritionButton'id='all-{{$index}}'
                    ng-click='all.isHidingOpen = !all.isHidingOpen'
                    className='{'glyphicon glyphicon-play': all.sub.length > 0, 'disable-link': !all.sub }'>
                    <span className='individualResultNutritionItemFacts'>{all.label}</span></a>
                    <span className='individualResultNutritionNumberFacts'>{this.calsPS(all.total, result.yield)} {all.unit}</span>
                    <span className='individualResultNutritionPercentFacts'>{this.calsPS((all.total/result.yield), all.daily)}%</span>
                  </p>
                  <p ng-show='all.isHidingOpen'
                    ng-repeat='subitem in all.sub'
                    id='subitem-{{$index}}'>
                    <span className='individualResultNutritionItemDetailedFacts'>{subitem.label} </span>
                    <span className='individualResultNutritionNumberDetailedFacts'>{this.calsPS(subitem.total, result.yield)}{subitem.unit} </span>
                    <span className='individualResultNutritionPercentDetailedFacts'>{this.calsPS((subitem.total/result.yield), subitem.daily)}% </span>
                  </p>
                </div>
              </div>
              <div id='ingredListDiv' className='col-xs-12 col-sm-6 col-lg-5'>
                  <p className='individualResultIngredientCount'>{recipe.ingredientLines.length} Ingredients</p>
                  <p className='individualResultIngredients' ng-repeat='each in result.ingredients'>{each.text}</p>
                  <p className='individualResultPrep'>Preparation</p>
                  <p>
                    <button ng-click='singleResultComp.instructions(recipe.url)' className='btn btn-default'>
                      Instructions
                    </button> on <a rel='noopener noreferrer' target='_blank' href={recipe.url}>{recipe.source}</a>
                  </p>
              </div>

              <div id='showWhenSmallNutritionalInfo' className='col-xs-12 col-sm-6 col-lg-5'>
                <div ng-repeat='all in result.digest'>
                  <p>
                    <a className='individualResultNutritionButton' id='all-{{$index}}'
                    ng-click='all.isHidingOpen = !all.isHidingOpen'
                    ng-className='{'glyphicon glyphicon-play': all.sub.length > 0, 'disable-link': !all.sub }'>
                    <span className='individualResultNutritionItemFacts'>{all.label }</span></a>
                    <span className='individualResultNutritionNumberFacts'>{this.calsPS(all.total, result.yield)} {all.unit}</span>
                    <span className='individualResultNutritionPercentFacts'>{this.calsPS((all.total/result.yield), all.daily)}%</span>
                  </p>
                  <p ng-show='all.isHidingOpen'
                    ng-repeat='subitem in all.sub'
                    id='subitem-{{$index}}'>
                    <span className='individualResultNutritionItemDetailedFacts'>{subitem.label} </span>
                    <span className='individualResultNutritionNumberDetailedFacts'>{this.calsPS(subitem.total, result.yield)}{subitem.unit} </span>
                    <span className='individualResultNutritionPercentDetailedFacts'>{this.calsPS((subitem.total/result.yield), subitem.daily)}% </span>
                  </p>
                </div>
              </div>
              <div className='col-lg-2'></div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

let mapStateToProps = state => ({
  userAuth: state.userAuth,
  userProfile: state.userProfile,
  recipe: state.recipe,
});

let mapDispatchToProps = dispatch => {
  return {
    signUp: user => dispatch(signUpRequest(user)),
    signIn: user => dispatch(signInRequest(user)),
    userProfileFetch: () => dispatch(userProfileFetchRequest()),
    recipesFetch: (queryString, queryParams) => dispatch(recipesFetchRequest(queryString, queryParams)),
    recipeFetch: query => dispatch(recipeFetchRequest(query)),
    recipeFetchRequest: recipe => dispatch(recipeFetch(recipe)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipeContainer);