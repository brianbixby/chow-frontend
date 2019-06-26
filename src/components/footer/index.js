import React from 'react';

class Footer extends React.Component {
  render() {
    return (
      <footer>
        <div className='socialIcons'>
          <li>
            <a href="https://github.com/brianbixby" rel="noopener noreferrer" target="_blank" title="Github"><span className='githubSpan'></span> </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/brianbixby1/" rel="noopener noreferrer" target="_blank" title="Linkedin"><span className='linkedinSpan'></span></a>
          </li>
        </div>
      </footer>
    );
  }
}

export default Footer;