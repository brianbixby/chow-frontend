import React from 'react';
import { renderIf, classToggler } from './../../lib/util.js';

class RecipeDigest extends React.Component {
  calsPS = (cals, servings) => Math.round(cals/servings);
  render() {
    let { digest, recipeYield } = this.props;
    return (
      <div className='tableRow'>
        {renderIf(digest && digest.length > 0,
            <div>
            {digest.map((myRecipe, idx) => {
                return <div id='showWhenLargeNutritionalInfo' key={idx}>
                    <div>
                    <p className='individualResultNutritionButton' id={`all-${idx}`}>
                    <span className={classToggler({ 'glyphicon glyphicon-play': !!myRecipe.sub, 'disable-link': !myRecipe.sub })}></span>
                    <span className='individualResultNutritionItemFacts'>{myRecipe.label}</span></p>
                    <span className='individualResultNutritionNumberFacts'>{this.calsPS(myRecipe.total, recipeYield)} {myRecipe.unit}</span>
                    <span className='individualResultNutritionPercentFacts'>{this.calsPS((myRecipe.total/recipeYield), myRecipe.daily)}%</span>
                    </div>
                </div>
                })}
            </div>
        )}
      </div>
    );
  }
}

export default RecipeDigest;