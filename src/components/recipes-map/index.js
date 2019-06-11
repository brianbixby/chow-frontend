import React from 'react';
import { connect } from 'react-redux';


import { recipeFetch } from '../../actions/search-actions.js';
import { favoriteFetchRequest } from '../../actions/favorite-actions.js';
import { renderIf, logError } from '../../lib/util';

class RecipesMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleBoundRecipeClick = (myRecipe, e) => {
    console.log("myRecipe.recipe: ",myRecipe.recipe);
    this.props.recipeFetchRequest(myRecipe.recipe);
    let uri = myRecipe.recipe.uri.split('recipe_')[1];
    return this.props.redirect(`/recipe/${uri}`);
  };

  handleBoundFavoriteClick = (favorite, e) => {
    if (this.props.userAuth) {
      this.props.favoriteFetch(favorite.recipe)
        .then(() => alert("favorite added."))
        .catch(err => logError(err));
    }
  };

  // handleBoundRecipeClick = (favorite, e) => {
  //   console.log(favorite);
  //   this.props.recipeFetch(favorite.uri)
  //     .then(() => this.props.history.push(`/recipe/${favorite.label}`))
  //     .catch(err => logError(err));
  // };

  // handleboundDeleteFavoriteClick = (favorite, e) => {
  //   console.log("del fav click: ", favorite)
  //   if (this.props.userAuth) {
  //     this.props.favoriteDelete(favorite)
  //       .then(() => alert("favorite deleted."))
  //       .catch(err => logError(err));
  //   }
  // };

  calsPS = (cals, servings) => Math.round(cals/servings);

  render() {
    let { recipes } = this.props;
    return (
        <div className={this.props.containerClass}>
            {renderIf(recipes && recipes.length > 0 ,
                <div className='recipesSection'>
                    {recipes.map(myRecipe => {
                    let boundRecipeClick = this.handleBoundRecipeClick.bind(this, myRecipe);
                    let boundFavoriteClick = this.handleBoundFavoriteClick.bind(this, myRecipe);
                    return <div key={myRecipe.recipe.uri} className='outer'>
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
            )}
        </div>
    );
  }
}

let mapStateToProps = state => ({
  userAuth: state.userAuth,
});

let mapDispatchToProps = dispatch => {
  return {
    favoriteFetch: favorite => dispatch(favoriteFetchRequest(favorite)),
    recipeFetchRequest: recipe => dispatch(recipeFetch(recipe)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipesMap);