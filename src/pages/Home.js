import React, { Component } from 'react'
import ThemeContext from "../components/ThemeContext"
import { config as chartConfig, data } from '../charts/LineChartConfig'
import LineChart from '../charts/LineChart'

class Home extends Component {
  render() {
    return (
      <ThemeContext.Consumer>
        { (value) =>
          <div className="container">
            <LineChart config={chartConfig} data={data} theme={value.theme} />
          </div>
        }
      </ThemeContext.Consumer>
    );
  }
}

export default Home
