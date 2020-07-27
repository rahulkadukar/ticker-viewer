const bunyanMiddleware = require('bunyan-middleware')
const compression = require('compression')
const express = require('express')
const fs = require('fs')
const path = require('path')
const logPath = './logs'
const logger = require('./utils/logger')
const { level0, sqlQuery } = require('./utils/postgres')

if (!(fs.existsSync(logPath))) {
  try {
    fs.mkdirSync(logPath)
  } catch (excp) {
    console.log(excp.message)
  }
}

const app = express();

app.use(compression())
app.use(express.json())
app.use(
  bunyanMiddleware({
    headerName: 'X-Request-Id',
    propertyName: 'reqId',
    logName: 'req_id',
    obscureHeaders: ['cookie'],
    logger: logger,
    additionalRequestFinishData: function(req, res) {
      return { 'req': req }
    }
  })
)

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '/public')))

// Handle the API calls
app.post('/api/stockInfo', async (req, res) => {
  const formatProcessTime = (t) => Math.ceil((t[0] * 1e9 + t[1]) / 1e6)
  const beginTime = process.hrtime()
  const t = (req.body && req.body.ticker ? req.body.ticker : 'AMD')

  const cData = await level0.get(t)
  if (cData) {
    const totalTime = formatProcessTime(process.hrtime(beginTime))
    res.json({
      data: JSON.parse(cData),
      totalTime,
    })
  } else {
    const data = await sqlQuery(`SELECT * FROM "stockData".stockinfo WHERE ticker = '${t}' ORDER BY date ASC`)
    if (data.returnCode === 0) {
      const stockData = data.dbResult.map((r) => {
        return {
          k: new Date(r.date).toISOString().slice(0, 10),
          v: parseFloat(r.high).toFixed(2)
        }
      })

      const totalTime = formatProcessTime(process.hrtime(beginTime))
      level0.set(t, JSON.stringify(stockData))
      res.json({
        data: stockData,
        totalTime,
      })
    }
  }
})

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/public/index.html'))
})

const port = process.env.PORT || 4000
app.listen(port)

console.log('App is listening on port ' + port)
