import React from 'react';
import { connect } from 'react-redux';

import { recipeFetch } from '../../actions/search-actions.js';
import { favoriteFetchRequest, favoriteDeleteRequest } from '../../actions/favorite-actions.js';
import { renderIf, logError, classToggler } from '../../lib/util';

class RecipesMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {userSuccess: false, userSuccessMessage: ''};
  }

  componentDidMount() {
    console.log("this.refs: ", this.refs);
    this.props.passRefUpward(this.refs);
  }

  handleBoundRecipeClick = (myRecipe, e) => {
    this.props.recipeFetchRequest(myRecipe.recipe);
    let uri = myRecipe.recipe.uri.split('recipe_')[1];
    return this.props.redirect(`/recipe/${uri}`);
  };

  handleBoundFavoriteClick = (favorite, e) => {
    if (this.props.userAuth) {
      let found = this.props.favorites.filter(fav => fav.uri == favorite.recipe.uri);
      if (found.length) {
        this.props.favoriteDelete(found[0])
          .then(() => {
            this.setState({userSuccessMessage: 'Favorite deleted.'});
            return this.handleUserSuccess();
          })
          .catch(err => logError(err));
      } else {
        return this.props.favoriteFetch(favorite.recipe)
          .then(() => {
            this.setState({userSuccessMessage: 'Favorite added.'});
            return this.handleUserSuccess();
          })
          .catch(err => logError(err));
      }
    }
  };

  handleUserSuccess = () => {
    this.setState({userSuccess: true});
    setTimeout(() => this.setState({userSuccess: false}), 5000);
  };

  calsPS = (cals, servings) => Math.round(cals/servings);

  render() {
    let { recipes } = this.props;
    return (
        <div className={this.props.containerClass} ref='scroller'>
            {renderIf(recipes && recipes.length > 0 ,
                <div className='recipesSection'>
                    {recipes.map((myRecipe, idx) => {
                    let boundRecipeClick = this.handleBoundRecipeClick.bind(this, myRecipe);
                    let boundFavoriteClick = this.handleBoundFavoriteClick.bind(this, myRecipe);
                    return <div key={idx} className='outer'>
                            <div className='cardImageContainer' onClick={boundRecipeClick}>
                                <img className='cardImage' src={myRecipe.recipe.image} />
                            </div>
                            <div className={classToggler({likeButton: true, hideLike: !this.props.userAuth, likedRecipe: this.props.favorites && this.props.favorites.some(o => o["uri"] === myRecipe.recipe.uri)})} onClick={boundFavoriteClick}></div>
                            <div className='cardInfo' onClick={boundRecipeClick}>
                                <div className='byDiv'>
                                <p className='byP'><a className='byA' rel='noopener noreferrer' target='_blank' href={myRecipe.recipe.url}>{myRecipe.recipe.source}</a></p>
                                </div>
                                <div className='cardInfoDiv'>
                                <h3 className='cardTitle'>{myRecipe.recipe.label} </h3>
                                <p className='healthLabels'>{myRecipe.recipe.healthLabels.join(", ")} </p>
                                <p className='calsAndIngreds'> 
                                <span className='tileCalorieText'> <span className='tileCalorieTextNumber'> {this.calsPS(myRecipe.recipe.calories, myRecipe.recipe.yield)}</span> <span className='caloriesSpan'>CALORIES </span><span className='calsSpan'>CALS </span>   </span>   |   <span className='tileIngredientText'> <span className='tileIngredientTextNumber'> {myRecipe.recipe.ingredientLines.length} </span><span className='ingredientsSpan'> INGREDIENTS</span><span className='ingredsSpan'> INGRDS</span></span>
                                </p>
                                </div>
                            </div>
                    </div> 
                    })}
                </div>
            )}
            <div className={classToggler({'sliderPopup': true, 'clozed': this.state.userSuccess })} onClick={() => this.setState({userSuccess: false})}>
              <p>{this.state.userSuccessMessage}</p>
            </div>
        </div>
    );
  }
}

let mapStateToProps = state => ({
  userAuth: state.userAuth,
  favorites: state.favorites,
});

let mapDispatchToProps = dispatch => {
  return {
    favoriteFetch: favorite => dispatch(favoriteFetchRequest(favorite)),
    recipeFetchRequest: recipe => dispatch(recipeFetch(recipe)),
    favoriteDelete: favorite => dispatch(favoriteDeleteRequest(favorite)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipesMap);