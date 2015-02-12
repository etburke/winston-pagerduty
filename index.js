var util = require('util');
var winston = require('winston');
var request = require('superagent');

var os = require('os');

var PagerDuty = winston.transports.PagerDuty = function (options) {
  winston.Transport.call(this, options);
  options = options || {};

  var requiredOptions = ['serviceKey'];

  requiredOptions.forEach(function (item) {
    if (!options.hasOwnProperty(item)) throw new Error("Missing required config '" + item + "'");
  });

  //
  // Name this logger
  //
  this.name = 'pagerduty';

  //
  // Set the level from your options
  //
  this.level = options.level || 'error';

  //
  // Configure your storage backing as you see fit
  //
  this.serviceKey = options.serviceKey;
  this.incidentKey = options.incidentKey;
  this.client = options.client || os.hostname();
  this.clientUrl = options.clientUrl;

  this.additionalParams = options.additionalParams || {};
};

//
// Inherit from `winston.Transport` so you can take advantage
// of the base functionality and `.handleExceptions()`.
//

util.inherits(PagerDuty, winston.Transport);

//
// Expose the name of this Transport on the prototype
//

PagerDuty.prototype.name = 'pagerduty';

//
// ### function log (level, msg, [meta], callback)
// #### @level {string} Level at which to log the message.
// #### @msg {string} Message to log
// #### @meta {Object} **Optional** Additional metadata to attach
// #### @callback {function} Continuation to respond to when complete.
// Core logging method exposed to Winston. Metadata is optional.
//

PagerDuty.prototype.log = function (level, msg, meta, callback) {
  //
  // Store this message and metadata, maybe use some custom logic
  // then callback indicating success.
  //

  var data = {
    service_key: this.serviceKey,
    event_type: 'trigger',
    description: msg,
    details: {
      level: level,
      message: msg
    }
  };

  for (var m in meta) {
    data.details[m] = meta[m];
  }

  for (var a in this.additionalParams) {
    data.details[a] = this.additionalParams[a];
  }

  if (this.client) data.client = this.client;
  if (this.clientUrl) data.client_url = this.clientUrl;
  if (this.incidentKey) data.incident_key = this.incidentKey;

  request
    .post('https://events.pagerduty.com/generic/2010-04-15/create_event.json')
    .send(data)
    .set('Accept', 'application/json')
    .end(function(res) {
      if (res.ok) {
        callback(null);
      } else {
        callback(new Error(res.text));
      }
    });
};