import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const entry = './src/index.jsx'

export const module = {
    rules: [
        { test: /\.jsx?$/, exclude: /(node_modules|bower_components)/, use: { loader: 'babel-loader', options: { presets: ['@babel/preset-env', '@babel/preset-react'] } } },
        { test: /\.(sa|sc|c)ss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
        { test: /\.(png|jpe?g|gif)$/i, use: [{ loader: 'file-loader' }] },
    ],
}

export const resolve = {
    extensions: ['.js', '.jsx'],
}

export const output = {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
}

export const devServer = {
    static: [
        path.join(__dirname, 'dist'),
    ],
    compress: true,
    port: 25001,
    historyApiFallback: true,
}

export const plugins = [
    new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico',
    }),
    new CopyWebpackPlugin({
        patterns: [{ from: 'public', to: '', globOptions: { ignore: ['**/index.html'] } }],
    }),
]

export default {
    entry,
    module,
    resolve,
    output,
    devServer,
    plugins,
}
