const bunyan = require('bunyan')
const fs = require('fs')
const logPath = './logs'

if (!(fs.existsSync(logPath))) {
  try {
    fs.mkdirSync(logPath)
  } catch (excp) {
    console.log(excp.message)
  }
}

const bunyanOpts = {
  name: 'network',
  streams: [
    {
      level: 'info',
      path: './logs/logs.json'  // log ERROR and above to a file
    }
  ]
}

const logger = bunyan.createLogger(bunyanOpts)

module.exports = logger
