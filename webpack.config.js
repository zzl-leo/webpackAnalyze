// webpack是 node写出来的 node的写法
let path = require('path');
let htmlWebpackPlugin = require('html-webpack-plugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let optimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
let uglifyJsPlugin = require('uglifyjs-webpack-plugin');
let webpack = require('webpack')
module.exports = {
    devServer: {
        port: 3000, // 本地服务端口
        progress: true, // 打包的时候显示进度条
        contentBase: './dist', // 运行时指定目录文件运行 
        open: true, // 自动打包完成后 自动打开浏览器
        compress: true // 为每个静态文件开启
    },
    // mode: 'development', // 模式 默认有两种 开发production 和生产 development
    mode: 'production', // 模式 默认有两种 开发production 和生产 development
    entry: './src/index.js', // 入口 
    output: { // 出口
        filename: 'bundle.[hash:8].js', // 打包后的文件名  [hash] 每次打包时候生成一个新的文件，防止出现缓存问题 :8 hash值为8位
        path: path.resolve(__dirname, 'dist'), // 路径 必须是一个绝对路径 需要node path, reslove可以将一个相对路径解析成绝对路径
        // publicPath: 'http://www.....'   // 如果要做cdn资源访问 可以通过publicPath 在所有资源前面加上publicPath
    },
    optimization: { // 优化项目
        minimizer: [
            new optimizeCssAssetsWebpackPlugin({}),
            new uglifyJsPlugin({
                cache: true, // 使用缓存
                parallel: true, // 并发打包，同时压缩多个
                sourceMap: true, // 源码映射
            })
        ]
    },
    plugins: [ // 配置webpack插件
        new htmlWebpackPlugin({
            template: './src/index.html', // 指定模板页面，会更加页面路径生成内存（打包）中的页面
            filename: 'index.html', // 指定页面生成的名称
            // minify: { // 对模板进行压缩
            //     removeAttributeQuotes: true, // 删除属性的双引号
            //     collapseWhitespace: true, // 折叠空行
            // },
            hash: true, // 增加hash戳  缓存问题处理
        }),
        new MiniCssExtractPlugin({
            filename: 'css/main.css', // 抽离出的css文件名
            // 指定css还是less等其它样式语言被抽离 --- loader
        }),
        new webpack.ProvidePlugin({ // 在每个模块中都注入 $ 
            $: 'jquery'
        })
    ],
    module: {
        //webpack原生只支持js文件类型，只支持ES5语法，我们使用以其它文件名结尾的文件时，需要为其指定loader
        // loader的特点是单一功能
        // loader 用法：字符串，则只能用一个loader，数组则可以使用多个loader
        // loader是有顺序的，默认是从右到左执行
        // loader还可以写成对象形式  其对象还可以传一个options参数
        rules: [
            // { // 全局引用jquery
            //     test: require.resolve('jquery'),
            //     use: [{
            //         loader: 'expose-loader',
            //         options: '$'
            //     }]
            // },
            // 匹配规则 css-loader 解析@import这种语法
            // style-loader: 把css插入到head的标签中
            // {test: /\.css$/, use: ['style-loader', 'css-loader']},
            // css
            {
                test: /\.css$/, // css 处理
                // use: 'css-loader'
                // use: ['style-loader', 'css-loader'],
                use: [
                    // {
                    //     loader: 'style-loader',
                    //     options: {
                    //         insertAt: 'top' // 将css标签插入最顶头  这样可以自定义style不被覆盖
                    //     }
                    // },
                    MiniCssExtractPlugin.loader,
                    'css-loader', // css-loader 用来解析@import这种语法,
                    'postcss-loader'
                ]
            },
            // less
            {
                test: /\.less$/, // less 处理
                // use: 'css-loader'
                // use: ['style-loader', 'css-loader'],
                use: [
                    // {
                    //     loader: 'style-loader',
                    //     options: {
                    //         insertAt: 'top' // 将css标签插入最顶头  这样可以自定义style不被覆盖
                    //     }
                    // },
                    MiniCssExtractPlugin.loader, // 这样相当于抽离成一个css文件， 如果希望抽离成分别不同的css, 需要再引入MiniCssExtractPlugin，再配置
                    'css-loader', // css-loader 用来解析@import这种语法
                    'postcss-loader',
                    'less-loader' // less-loader less -> css
                    // sass node-sass sass-loader
                    // stylus stylus-loader
                ]
            },
            // js
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: { // 用babel-loader 需要把es6 - es5
                        presets: [
                            '@babel/preset-env'
                        ],
                        plugins: [
                            // '@babel/plugin-proposal-class-properties',
                            [
                                "@babel/plugin-proposal-decorators", // @babel/plugin-proposal-decorators需要在@babel/plugin-proposal-class-properties之前
                                {
                                    "legacy": true // 推荐
                                }
                            ],
                            [
                                "@babel/plugin-proposal-class-properties",
                                {
                                    "loose": true // babel编译时，对class的属性采用赋值表达式，而不是Object.defineProperty（更简洁）
                                }
                            ],
                            "@babel/plugin-transform-runtime"
                        ]
                    }
                },
                exclude:/node_modules/ // 排除node_modules
            },
            // { // loader可以使用多个
            //     test:/\.js$/,
            //     use: {
            //         loader: 'eslint-loader',
            //         options: {
            //             enforce: 'pre' // 保证该loader在前面执行
            //         }
            //     },
            // },
            // html中引用的静态资源在这里处理,默认配置参数attrs=img:src,处理图片的src引用的资源.
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            // 图片资源处理
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        // 限制 图片小于5k时，用base64来转化   减少图片http请求
                        // 否则用file-loader产生真实的图片   
                        limit: 5*1024,
                        outputPath: 'img/', // 设置打包后 图片输出路径
                        // publicPath: 'http........', // 也可以只对图片资源做cdn公共路径前缀设置
                    }
                }
            }
        ]
    },
    externals: {
        jquery: '$'
    }
}