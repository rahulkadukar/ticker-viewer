import React, { useState, useEffect } from 'react'
import ThemeContext from '../components/ThemeContext'
import { config } from '../charts/LineChartConfig'
import LineChart from '../charts/LineChart'
import P from '../components/P'

const Home = (props) => {
  const initState = {
    "config": config,
    "data": [],
    "meta": {
      "execTime": 0
    }
  }

  const [inputValue, setValue] = useState('AMD')
  const [data, updateData] = useState(initState)

  const url = '/api/stockInfo'

  function changeTicker(t) {
    fetchStockInfo(t)
  }

  function fetchStockInfo(ticker) {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ticker: ticker})
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      const stockData = json.data.map((r) => {
        return {
          k: r.k,
          v: parseFloat(r.v)
        }
      })

      const newState = Object.assign({}, data)
      newState.data = stockData
      newState.config.title = ticker
      newState.meta.execTime = json.totalTime

      updateData(newState)
    })
  }

  useEffect(() => {
    fetchStockInfo(inputValue)
  }, [props])

  return (
    <ThemeContext.Consumer>
      { (value) =>
        <div className="container">
          <input type="text" value={inputValue} onBlur={e => changeTicker(e.target.value)}
            onChange={e => setValue(e.target.value)}/>
          {
            data.data.length === 0 ? <div/> :
            <LineChart config={data.config} data={data.data} theme={value.theme}/>
          }
          <P>This page was rendered in {data.meta.execTime} ms</P>
        </div>
      }
    </ThemeContext.Consumer>
  )
}

export default Home
