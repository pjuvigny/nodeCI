// ###############################################################################
// Vows tests : meant to run with a started server for end-to-end API testing.
// ###############################################################################

var request = require('request'),
    vows = require('vows'),
    assert = require('assert'),
    config = require('../conf/config.json')[process.env.NODE_ENV || 'production'],
    apiUrl = 'http://' + config.APP_HOST + ':' + config.APP_PORT,
    cookie = null


function assertStatus(code) {
    return function (res, b, c) {
        assert.equal(res.statusCode, code);
    };
}

var apiTest = {
  general: function( method, path, data, cb ){
    request(
      {
        method: method,
        url: apiUrl+(path||''),
        json: data || {},
        headers: {Cookie: cookie}
      },
      function(req, res){
        cb( res )
      }
    )
  },
  get: function( path, data, cb  ){ apiTest.general( 'GET', path, data, cb    )  },
  post: function( path, data, cb ){ apiTest.general( 'POST', path, data, cb   )  },
  put: function( path, data, cb  ){ apiTest.general( 'PUT', path, data, cb    )  },
  del: function( path, data, cb  ){ apiTest.general( 'DELETE', path, data, cb )  }
}

function respondsWith(status) {
    var context = {
        topic: function () {
            // Get the current context's name, such as "POST /"
            // and split it at the space.
            var req = this.context.name.split(/ +/), // ["POST", "/"]
                method = req[0].toLowerCase(), // "post"
                path = req[1]; // "/"

            // Perform the contextual client request,
            // with the above method and path.
            apiTest[method](path, this.context.data, this.callback);
        }
    };
    // Create and assign the vow to the context.
    // The description is generated from the expected status code
    // and status name, from node's http module.
    context['should respond with a ' + status] = assertStatus(status);

    return context;
}



// Create a Test Suite
vows.describe('API test').addBatch({
    'GET /trip {}': respondsWith(200),
    //'POST /location': { data={"name": "FarFar, Away", "longitude": 2, "latitude": 4 }, respondsWith(200)},
    'GET /location {}': respondsWith(200),
    'GET /resources {}': respondsWith(404)
}).export(module, {error: false});

