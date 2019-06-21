import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { tokenSignInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest } from '../../actions/userProfile-actions.js';
import { favoritesFetchRequest, favoriteFetchRequest } from '../../actions/favorite-actions.js';
import { recipesFetchRequest, recipesFetch, recipeFetch, infiniteRecipesFetch } from '../../actions/search-actions.js';
import { logError, renderIf, userValidation, classToggler } from './../../lib/util.js';

class RecipesContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {userSuccess: false};
  }

  componentWillMount() {
    userValidation(this.props);
    if (!this.props.recipes || !this.props.recipes.hits || !this.props.recipes.hits.length) {
      let string = window.location.href.split('/search/')[1];
      let hashIndex = string.indexOf('&');
      let queryString = string.substring(0, hashIndex);
      let queryParams = string.substring(hashIndex, string.length);
      if (localStorage.getItem(`${queryString}${queryParams}0`) && JSON.parse(localStorage.getItem(`${queryString}${queryParams}0`))['timestamp'] > new Date().getTime()) {
        this.props.recipesFetchRequest(JSON.parse(localStorage.getItem(`${queryString}${queryParams}0`))['content']);
      } else {
        this.props.recipesFetch(queryString, queryParams, 0, false)
        .catch(err => logError(err));
      }
    }
    window.scrollTo(0, 0);
  }

  componentDidMount() {
    document.addEventListener('scroll', this.trackScrolling);
  }

  componentWillUnmount() {
    this.setState({userSuccess: false});
    document.removeEventListener('scroll', this.trackScrolling);
  }

  handleBoundRecipeClick = (myRecipe, e) => {
    this.props.recipeFetchRequest(myRecipe.recipe);
    let uri = myRecipe.recipe.uri.split('recipe_')[1];
    return this.props.history.push(`/recipe/${uri}`);
  };

  handleBoundFavoriteClick = (favorite, e) => {
    if (this.props.userAuth) {
      this.props.favoriteFetch(favorite.recipe)
        .then(() => this.handleUserSuccess())
        .catch(err => logError(err));
    }
  };

  handleUserSuccess = () => {
    this.setState({userSuccess: true});
    setTimeout(() => this.setState({userSuccess: false}), 5000);
  };
  
  calsPS = (cals, servings) => Math.round(cals/servings);

  isBottom = (el) => {
    return el.getBoundingClientRect().bottom <= (window.innerHeight + 1500);
  };
  
  trackScrolling = () => {
    document.removeEventListener('scroll', this.trackScrolling);
    const wrappedElement = document.getElementById('recipesWrapper');
    if (this.isBottom(wrappedElement) && this.props.recipes && this.props.recipes.hits && this.props.recipes.hits.length < 96) {
      let string = window.location.href.split('/search/')[1];
      let hashIndex = string.indexOf('&');
      let queryString = string.substring(0, hashIndex);
      let queryParams = string.substring(hashIndex, string.length);
      let min = (this.props.recipes.hits.length).toString();
      if (localStorage.getItem(`${queryString}${queryParams}${min}`) && JSON.parse(localStorage.getItem(`${queryString}${queryParams}${min}`))['timestamp'] > new Date().getTime()) {
        this.props.infiniteRecipesFetchRequest(JSON.parse(localStorage.getItem(`${queryString}${queryParams}${min}`))['content']);
        return document.addEventListener('scroll', this.trackScrolling);
      } else {
        const infiniteSearch = true;
        return this.props.recipesFetch(queryString, queryParams, min, infiniteSearch)
          .then(() => document.addEventListener('scroll', this.trackScrolling))
          .catch(err => logError(err));
      }
    }
    document.addEventListener('scroll', this.trackScrolling);
  };

  render() {
    let { recipes } = this.props;
    return (
      <div id='recipesWrapper' className='container-fluid'>
        {renderIf(!recipes,
          <div className='resultCountDiv'>
            Sorry, no results. Please try modifying your search.
          </div>
        )}
        <div className='recipesOuter'>
          {renderIf(recipes,
            <div>
            <div className='resultCountDiv'>
              <p>{recipes.count} recipe results for <span>"{recipes.q}"</span></p>
            </div>
            {this.props.recipes.hits &&
                      <div className='recipesSection'>
                        {this.props.recipes.hits.map((myRecipe, idx) => {
                          let boundRecipeClick = this.handleBoundRecipeClick.bind(this, myRecipe);
                          let boundFavoriteClick = this.handleBoundFavoriteClick.bind(this, myRecipe);
                          return <div key={idx} className='outer'>
                                  <div className='cardImageContainer' onClick={boundRecipeClick}>
                                    <img className='cardImage' src={myRecipe.recipe.image} />
                                  </div>
                                  <div className='likeButton' onClick={boundFavoriteClick}></div>
                                  <div className='cardInfo' onClick={boundRecipeClick}>
                                    <div className='byDiv'>
                                      <p className='byP'><a className='byA' rel='noopener noreferrer' target='_blank' href={myRecipe.recipe.url}>{myRecipe.recipe.source}</a></p>
                                    </div>
                                    <div className='cardInfoDiv'>
                                    <h3 className='cardTitle'>{myRecipe.recipe.label} </h3>
                                    <p className='healthLabels'>{myRecipe.recipe.healthLabels.join(", ")} </p>
                                    <p className='calsAndIngreds'> 
                                    <span className='tileCalorieText'> <span className='tileCalorieTextNumber'> {this.calsPS(myRecipe.recipe.calories, myRecipe.recipe.yield)}</span> CALORIES   </span>   |   <span className='tileIngredientText'> <span className='tileIngredientTextNumber'> {myRecipe.recipe.ingredientLines.length} </span>   INGREDIENTS</span>
                                    </p>
                                    </div>
                                  </div>
                          </div> 
                        })}
                      </div>
            }
            <div>
              {renderIf(this.props.recipes && this.props.recipes.hits && this.props.recipes.hits.length >= 96,
                <div className='infiniteScrollMax'>
                  <p>Sorry, but the API limits our query results. </p>
                </div>
              )}
            </div>
            </div>
          )}
        </div>
        <div className={classToggler({'sliderPopup': true, 'clozed': this.state.userSuccess })} onClick={() => this.setState({userSuccess: false})}>
          <p>Favorite added.</p>
        </div>
      </div>
    );
  }
}

let mapStateToProps = state => ({
  recipes: state.recipes,
  userAuth: state.userAuth,
});

let mapDispatchToProps = dispatch => {
  return {
    favoritesFetch: favoritesArr => dispatch(favoritesFetchRequest(favoritesArr)),
    favoriteFetch: favorite => dispatch(favoriteFetchRequest(favorite)),
    userProfileFetch: () => dispatch(userProfileFetchRequest()),
    tokenSignIn: token => dispatch(tokenSignInRequest(token)),
    recipesFetch: (queryString, queryParams, min, infiniteSearch) => dispatch(recipesFetchRequest(queryString, queryParams, min, infiniteSearch)),
    recipesFetchRequest: recipes => dispatch(recipesFetch(recipes)),
    recipeFetchRequest: recipe => dispatch(recipeFetch(recipe)),
    infiniteRecipesFetchRequest: recipes => dispatch(infiniteRecipesFetch(recipes)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RecipesContainer));