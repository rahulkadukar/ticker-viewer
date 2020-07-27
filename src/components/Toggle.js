import React, { Component , useState } from 'react'
import styled from 'styled-components'
import ThemeContext from './ThemeContext'

const ToggleDiv = styled.div`
  background: ${props => props.theme === 'dark' ? ' linear-gradient(#004752 0%, #040147 100%);' : 'linear-gradient(#55e2f7 0%, #44a6c8 100%);'};
  padding: 4px;
  transition: background 0.5s ease-in, border 0.5s ease-in;
  border-radius: 30px;
  border: 2px solid ${props => props.theme === 'dark' ? '#CCCCCC' : '#FFFFFF'};
  cursor: pointer;
  width: 60px;
  height: 24px;
`

const RoundDiv = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#EEEEEE' : 'yellow'};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  margin-left: ${props => props.theme === 'dark' ? '36px' : '0px'};
  transition: margin 0.5s ease-in, background-color  0.5s ease-in;
  width: 24px;
  height: 24px;
`

const InnerDiv = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#546E7A' : 'yellow'};
  border-radius: 10px;
  position: relative;
  margin-top: 1px;
  transition: margin 0.5s ease-in, background-color  0.5s ease-in;
  width: 20px;
  height: 20px;
`

const Toggle = (props) => {
  return <ThemeContext.Consumer>
     { (value) =>
      <ToggleDiv theme={value.theme} onClick={value._toggleTheme}>
        <RoundDiv theme={value.theme}>
          <InnerDiv theme={value.theme}></InnerDiv>
        </RoundDiv>
      </ToggleDiv> 
    }
  </ThemeContext.Consumer>
}

export default Toggle
