# winston-pagerduty
PagerDuty Transport for Winston

```javascript
var winston = require('winston');

require('winston-pagerduty');

var options = {
	serviceKey: "your service key",
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
```