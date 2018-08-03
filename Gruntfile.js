const path = require('path');

const CimpressTranslationsWebpackPlugin = require("cimpress-translations-webpack-plugin");
const Auth0 = require("cimpress-translations-webpack-plugin/lib/auth0Authenticator");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const auth = new Auth0("cimpress.auth0.com", CLIENT_ID, CLIENT_SECRET);

let plugin = new CimpressTranslationsWebpackPlugin({
  serviceId: "7f446c56-8c8e-438b-9cb2-64e5d7b1d89c",
  path: path.join(__dirname, "./src/locales/translations.json"),
  authorizer: {
    getAccessToken: async () => await auth.getAccessTokenUsingRefreshToken()
  }
});

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-webpack');

  grunt.initConfig({
    verbose: true,
    webpack: {
      config: () => ({
        plugins: [plugin],
        resolve: {
          extensions: ['.js', '.jsx']
        },
        entry: ['./src'],
        module: {
          rules: [
            {
              test: /\.css$/,
              use: [
                { loader: 'style-loader' },
                { loader: 'css-loader', }
              ]
            },
            { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' }
          ]
        }
      })
    }
  });
};
