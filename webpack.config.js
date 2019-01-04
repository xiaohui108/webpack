const path = require("path");
const glob = require("glob-all");
var PostCss_CssNext = require('postcss-cssnext');
const htmlPlugin = require("html-webpack-plugin"); // html 通用模板
const extractTextWebpackPlugin= require("extract-text-webpack-plugin"); // css 分离
const PurifyCSSPlugin = require("purifycss-webpack");  // css 去除不需要的css
module.exports = {
    mode: "development",
    entry: {
        main: './src/main.js',
        main2: './src/main2.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)/i,
                use: [{
                    loader: "babel-loader"
                }],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: extractTextWebpackPlugin.extract({ // 使用ExtractTextWebpackPlugin插件提取css
                    fallback: {// 这里表示不提取的时候，使用什么样的配置来处理css
                        loader: 'style-loader',
                        options: {
                            singleton: true // 表示将页面上的所有css都放到一个style标签内
                        }
                    },
                    use: [ // 提取的时候，继续用下面的方式处理
                        {
                            loader: 'css-loader',
                            // options: {
                            //     minimize: true  // 开启压缩
                            // }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',  // 表示下面的插件是对postcss使用的
                                plugins: [
                                    PostCss_CssNext(), // 允许使用未来的css（包含AutoPrefixer功能）
                                ]
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(htm|html)$/i,
                use: ['html-withimg-loader']
            },
            {
                test: /\.less$/,
                use: extractTextWebpackPlugin.extract({
                    // fallback: "style-loader",
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }, {
                        loader: "postcss-loader"
                    }]
                })
                // use: [{
                //     loader: "style-loader",
                // }, {
                //     loader: "css-loader",
                // }, {
                //     loader: "less-loader",
                // }]
            },
            {
                test: /\.(png|jpg|gif|jpeg)/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 500,
                    }
                }]
            }
        ]
    },
    plugins: [
        new htmlPlugin({
            minify:{ //是对html文件进行压缩
                removeAttributeQuotes: true  //removeAttrubuteQuotes是却掉属性的双引号。
            },
            hash: true, //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
            template:'./src/index.html' //是要打包的html模版路径和文件名称。
        }),
        new extractTextWebpackPlugin("css/index.css"),
        new PurifyCSSPlugin({
            paths: glob.sync([
                path.join(__dirname, './src/*.html'),
                path.join(__dirname, './src/*.js')
            ])
        })
    ],
    devServer: {
        contentBase: path.resolve(__dirname, '../dist'),
        host: "localhost",
        compress: true,
        port: 8888,
    }
}
