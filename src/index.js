import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import ThemeContext from './components/ThemeContext'
import App from './App.js'

class ThemeHelper extends React.Component {
  constructor(props) {
    super(props)

    this._toggleTheme = () => {
      this.setState(state => ({
        theme: state.theme === 'dark' ? 'light' : 'dark'
      }));
    };

    // State also contains the updater function so it will
    // be passed down into the context provider
    this.state = {
      theme: 'dark',
      _toggleTheme: this._toggleTheme,
    };
  }

  render() {
    // The entire state is passed to the provider
    return (
      <ThemeContext.Provider value={this.state}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

render((
  <BrowserRouter>
    <ThemeHelper>
      <App/>
    </ThemeHelper>
  </BrowserRouter>
), document.getElementById('root'))
