import React, {useEffect, useRef} from 'react'
import {
  d3axisBottom,
  d3axisLeft,
  d3brushX,
  d3curveMonotoneX,
  d3event,
  d3extent,
  d3line,
  d3max,
  d3min,
  d3scaleLinear,
  d3scaleOrdinal,
  d3scaleUtc,
  d3select
} from './D3Config'

import { timeDay as d3TimeMonth } from "d3-time";

import {schemeCategory10} from 'd3-scale-chromatic'
/* Import all configuration from LineChartConfig */
import { config } from './LineChartConfig'

const defaultConfig = {}
config.docs.forEach((p) => {
  defaultConfig[p.name] = p.value
})

const LineChart = React.memo(function LineChartD3 (props) {
  const opts = Object.assign({}, defaultConfig, props.config)
  const { data, theme } = props
  const node = useRef(null)
  const snode = useRef(null)

  opts._dbclick = false

  function updateBrush(someSVG, a, b) {
    const brush = d3brushX()
        .extent([[0, 0], [opts._innerWidth, opts.slidingWindowHeight]])

    opts._slidingBrush = brush
    opts._slidingBrush.on("end", updateChartBrush)

    someSVG.append("g")
        .attr("class", "slidingBrush")

    const s1 = a || 0
    const s2 = b || 0

    someSVG.select(".slidingBrush")
        .call(brush)
        .call(brush.move, [s1,s2])
  }

  function createSlidingWindow() {
    // Get the node that will be used for creating the sliding window
    const svg = d3select(snode.current)
    svg.selectAll('*').remove()
    svg.attr("width", opts._innerWidth)
        .attr("height", opts.slidingWindowHeight)
        .attr("transform", `translate(${opts._margin.left + opts._yAxisWidth}, 0)`)

    opts._slidingSVG = svg
    updateBrush(svg)

    const xAxis = d3axisBottom(opts._xScaleSliding)
    svg.append('g')
        .call(xAxis)
        .style("font-size", "1em")
        .attr("transform", `translate(0, ${opts.slidingWindowHeight - 30})`)
        .style("color", `${theme === 'dark' ? 'white' : 'black'}`)
  }

  function updateChartBrush() {
    const selectionRange = d3event.selection

    if (selectionRange && selectionRange !== [0,0]) {
      const startTstmp = opts._xScaleSliding.invert(selectionRange[0])
      const endTstmp = opts._xScaleSliding.invert(selectionRange[1])

      const lineData = data.filter((r) => {
        const rk = new Date(r.k)
        if (rk >= startTstmp && rk <= endTstmp) return true
      })

      opts._currData = lineData
      drawChart(lineData, true)
    }
  }

  function updateChart() {
    const selectionRange = d3event.selection
    if (selectionRange) {
      const startTstmp = opts._xScale.invert(selectionRange[0])
      const endTstmp = opts._xScale.invert(selectionRange[1])

      const lineData = data.filter((r) => {
        const rk = new Date(r.k)
        if (rk >= startTstmp && rk <= endTstmp) return true
      })

      if (lineData.length <= 3) {
        lineData.length = 0
        lineData.push(...opts._currData)
      }

      opts._currData = lineData
      drawChart(lineData, false)
    } else {
      if (opts._dbclick) {
        clearTimeout(opts._dbclickTimer)
        drawChart(data, true)
      } else {
        opts._dbclickTimer = setTimeout(() => { opts._dbclick = false }, 200)
      }

      opts._dbclick = !opts._dbclick
    }
  }


  const drawChart = (lineData, noBrushUpdate) => {
    if (!noBrushUpdate) {
      const minMaxTime = d3extent(lineData.map(d => new Date(`${d.k}T00:00:00`)))

      updateBrush(opts._slidingSVG,
          Math.floor(opts._xScaleSliding(minMaxTime[0])),
          Math.floor(opts._xScaleSliding(minMaxTime[1])))
    }

    const brush = d3brushX()
        .extent([[0,0],[opts._innerWidth, opts._innerHeight]])
        .on("end", updateChart)

    // xScale is for the length along x-axis
    const minDate = d3min(lineData.map((d) => d.k))
    const xScale = d3scaleUtc()
        .domain(d3extent(lineData.map(d => new Date(`${d.k}T00:00:00`))))
        .range([0, opts._innerWidth]).nice(d3TimeMonth)
    opts._xScale = xScale
    const xAxis = d3axisBottom(xScale)

    // yScale is for the names of the keys along y-axis
    const yScale = d3scaleLinear()
        .domain(d3extent(lineData.map(d => d.v)))
        .range([opts._innerHeight, 0]).nice()
    const yAxis = d3axisLeft(yScale)

    const pathData = d3line().curve(d3curveMonotoneX)
        .x(d => xScale( new Date(`${d.k}T00:00:00`)))
        .y(d => yScale(d.v))

    const createXGrid = () => d3axisBottom(xScale)
    const createYGrid = () => d3axisLeft(yScale)

    // Color scale for the color of the charts
    const colorScale = d3scaleOrdinal(schemeCategory10)

    // Get the node that will be used for creating the chart
    const svg = d3select(node.current)
    svg.selectAll('*').remove()

    svg.attr("width", opts._width)
        .attr("height", opts._height)

    svg.append("g")
        .attr("class", "brush")
        .attr("transform", `translate(${opts._margin.left + opts._yAxisWidth}, ${opts._titleHeight + opts._margin.top})`)

    svg.select(".brush")
        .call(brush)

    svg.append("text")
        .attr("x", Math.round(opts._width / 2))
        .attr("y", 36)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .style("font-family", "Roboto")
        .text(opts._title)

    const g = svg.append("g")
        .attr("width", opts._innerWidth)
        .attr("height", opts._innerHeight)
        .attr("transform", `translate(${opts._margin.left}, ${opts._margin.top + opts._titleHeight})`)

    g.append('g')
        .call(yAxis)
        .style("font-size", "1.2em")
        .attr("transform", `translate(${opts._yAxisWidth},0)`)
        .style("font-family", "Roboto")
        .style("color", `${theme === 'dark' ? 'white' : 'black'}`)

    g.append('g')
        .call(xAxis)
        .attr("transform", `translate(${opts._yAxisWidth}, ${opts._innerHeight})`)
        .style("font-size", "1em")
        .style("color", `${theme === 'dark' ? 'white' : 'black'}`)

    g.append("g")
        .attr("class", "xgrid")
        .attr("transform", `translate(${opts._yAxisWidth}, ${opts._innerHeight})`)
        .call(createXGrid().tickSize(-opts._innerHeight).tickFormat(""))
        .style('stroke-width', 0.2)

    g.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(${opts._yAxisWidth}, 0)`)
        .call(createYGrid().tickSize(-opts._innerWidth).tickFormat(""))
        .style('stroke-width', 0.2)

    g.append('path')
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("transform", `translate(${opts._yAxisWidth},0)`)
        .attr("d", pathData)
  }

  useEffect(() => {
    opts._margin = {
      top: opts.marginTop,
      right: opts.marginRight,
      bottom: opts.marginBottom,
      left: opts.marginLeft
    }

    const temptitleHeight = 40
    opts._yAxisWidth = 5 + (d3max(data.map((r) => r.v.toString().length)) * 12)

    opts._title = opts.title ? opts.title : ''
    opts._titleHeight = opts.title.length === 0 ? 0 : temptitleHeight
    const parentElem = d3select(node.current).node()
    opts._width = parentElem.getBoundingClientRect().width - 4
    opts._height = opts._margin.top + opts._margin.bottom + opts._titleHeight + opts.heightChart

    opts._innerWidth = opts._width - opts._margin.right - opts._margin.left - opts._yAxisWidth
    opts._innerHeight = opts.heightChart

    const xScaleSliding = d3scaleUtc()
        .domain(d3extent(data.map(d => new Date(`${d.k}T00:00:00`))))
        .range([0, opts._innerWidth]).nice(d3TimeMonth)

    opts._xScaleSliding = xScaleSliding

    if (opts.slidingWindow === true) createSlidingWindow()
    drawChart(data, true)

  }, [props])

  return (
      <div>
        <svg width="100%" className="d3-class" ref={node} />
        <svg width="100%" className="d3-class" ref={snode} />
      </div>
  )
})

export default LineChart
