import React, { Component} from 'react'
import ThemeContext from './components/ThemeContext'
import {
  Link as ReactRouterLink,
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import styled  from 'styled-components'
import "./App.css"

import About from './pages/About'
import Home from './pages/Home'
import Index from './pages/Index'

import Toggle from './components/Toggle'

const Main = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#303030' : '#FFFFFF'};
  transition: background-color 1s ease-in-out;
  min-height: 100%;
  min-width: 100%;
`

const NavBar = styled.nav`
  background-color: ${props => props.theme === 'dark' ? '#040404' : '#EE4E02'};
  transition: background-color 1s ease-in-out;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Item = styled.li`
  display: block;
  font-size: 20px;
  padding: 20px;
`

const List = styled.ul`
  display: flex;
  flex-direction: row;
`

const Footer = styled.div`
  color: green;
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: absolute;
  bottom: 0;
  width: 100%;
`

const Link =styled(ReactRouterLink)`
  color: white;
  text-decoration: none;
`

const ItemRight =styled(Item)`
  text-align: right;
  padding: 12px;
`

const Text = styled.p`
  padding: 10px;
  font-size: 20px;
  display: block;
  transition: color 0.5s ease-in-out;
  color: ${props => props.theme === 'dark' ? '#ECEFF1' : 'black'};
`

const App = (props) => {
  return <ThemeContext.Consumer>
    { (value) =>
      <Router>
        <Main theme={value.theme}>
          <NavBar theme={value.theme}>
            <List>
              <Item><Link to="/">Home</Link></Item>
              <Item><Link to="/about">About</Link></Item>
            </List>
            <ItemRight><Toggle callBack={(x) => {this._darkMode(x)}} /></ItemRight>
          </NavBar>
          <Switch>
            <Route exact path="/"><Index /></Route>
            <Route exact path="/about"><About /></Route>
            <Route path="*"><Home /></Route>
          </Switch>
          <Footer>
            <Text theme={value.theme}>&copy;</Text>
          </Footer>
        </Main>
      </Router>
    }
  </ThemeContext.Consumer>
}

export default App
