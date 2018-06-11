import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

// import Navbar from '../navbar';
import LandingContainer from '../landing-container';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <section>
          {/* <Route path='*' component={Navbar} /> */}
          <Route exact path='/' component={LandingContainer} />
        </section>
      </BrowserRouter>
    );
  }
}

export default App;