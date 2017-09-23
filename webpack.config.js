var path = require('path')
var webpack = require('webpack')

var ip = require("ip");
console.dir ( ip.address() );

console.log('addr: '+ ip.address());
var hostaddress = ip.address();

module.exports = {
  entry: [
        './public/jquery-1.9.1.min.js',
        'babel-polyfill', 
        './src/main.js', 
        './public/aframe.min.js', 
        './public/aframe-mouse-cursor-component.min.js',
        './public/es6-shim.js',
        './public/gosharedata_setup.js'
    ],
  output: {
    path: path.resolve(__dirname, './public/dist'),
    publicPath: '/public/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this nessessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: false,
    proxy: {
      '/open_query_in_native_app': {
        target: 'http://' + hostaddress,
        secure: false
      },
      '/getresult': {
        target: 'http://' + hostaddress,
        secure: false
      },
      '/getqueryresult': {
        target: 'http://' + hostaddress,
        secure: false
      },

      '/get_all_table': {
        target: 'http://' + hostaddress,
        secure: false
      },

      '/add_new_connection': {
        target: 'http://' + hostaddress,
        secure: false
      },
      '/add_new_query': {
        target: 'http://' + hostaddress,
        secure: false
      },
      '/lock': {
        target: 'http://' + hostaddress,
        secure: false
      },
      
      '/get_search_results': {
        target: 'http://' + hostaddress,
        secure: false
      },
      '/send_client_details': {
        target: 'http://' + hostaddress,
        secure: false
      },
      '/scanharddisk': {
        target: 'http://' + hostaddress,
        secure: false
      },
      '/file_upload': {
        target: 'http://' + hostaddress,
        secure: false
      },
      '/docs': {
        target: 'http://' + hostaddress,
        secure: false
      },
      
      '/stopscanharddisk': {
        target: 'http://' + hostaddress,
        secure: false
      }
    }
  },
  performance: {
    hints: false
  }
}

if (process.env.NODE_ENV === 'production') {
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
  
  
  
} else if (process.env.NODE_ENV === 'dev') {
    module.exports.devtool = '#source-map'
}

