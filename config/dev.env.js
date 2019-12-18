'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    COUCHDB_URL: '"http://localhost:5984"',
    DB_NAME : '"books"',
    DB_DESIGN_DOCUMENT : '"main_design"',
    PAGINATION_SIZE: 10,
    SERVER_ADMIN_USERNAME : '"admin"',
    SERVER_ADMIN_PASSWORD : '"admin"'
})
