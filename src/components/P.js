import React, { Component , useState } from 'react'
import ThemeContext from './ThemeContext'
import styled from 'styled-components'

const PStyled = styled.p`
  color: ${props => props.theme === 'dark' ? '#ECEFF1' : 'black'};
  transition: color 0.5s ease-in-out;
  padding: 10px;
`

const P = (props) => {
  return <ThemeContext.Consumer>
     { (value) =>
      <PStyled theme={value.theme}>
        {props.children}
      </PStyled>
    }
  </ThemeContext.Consumer>
}

export default P;