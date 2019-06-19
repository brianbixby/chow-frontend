import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import LandingContainer from '../landing-container';
import RecipesContainer from '../recipes-container';
import RecipeContainer from '../recipe-container';
import ProfileContainer from '../profile-container';
import Navbar from '../nav';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <section>
          <Route path='*' component={Navbar} />
          <Route exact path='/' component={LandingContainer} />
          <Route path='/profile/:userName' component={ProfileContainer} />
          <Route path='/search/:searchQuery' component={RecipesContainer} />
          <Route path='/recipe/:recipeQuery' component={RecipeContainer} />
        </section>
      </BrowserRouter>
    );
  }
}

export default App;