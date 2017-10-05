const resolve = require('path').resolve;
const webpackMerge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = function(env) {
//console.log(env)
const config = require('xtraplatform-manager/webpack.config.' + (env || 'development'));

let newConfig = webpackMerge(config(env), {
    context: resolve(__dirname, 'src'),
    output: {
        path: resolve('../resources/manager')
    }
})

if (env === 'production') {
    newConfig = webpackMerge(newConfig, {
        plugins: [
            new CleanWebpackPlugin(['resources/manager'], {
                root: resolve('../')
            })
        ]
    })
}

//console.log(newConfig)
return newConfig

}

