var winston = require('winston');

require('./index.js');

var options = {
	serviceKey: "add your service key to test",
	level: "error",
	handleExceptions: true
}

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.PagerDuty)(options)
  ]
});

logger.error("Test, test, test", {
	"param1": "val1",
	"param2": "val2",
	"param3": "val3",
	"param4": "val4",
	"param5": "val5"
});

tttt