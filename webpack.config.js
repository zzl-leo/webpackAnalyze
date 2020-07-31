// webpack是 node写出来的 node的写法
let path = require('path')
let htmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    devServer: {
        port: 3000, // 本地服务端口
        progress: true, // 打包的时候显示进度条
        contentBase: './dist', // 运行时指定目录文件运行 
        open: true, // 自动打包完成后 自动打开浏览器
        compress: true // 为每个静态文件开启
    },
    mode: 'development', // 模式 默认有两种 开发production 和生产 development
    // mode: 'production', // 模式 默认有两种 开发production 和生产 development
    entry: './src/index.js', // 入口 
    output: { // 出口
        filename: 'bundle.[hash:8].js', // 打包后的文件名  [hash] 每次打包时候生成一个新的文件，防止出现缓存问题 :8 hash值为8位
        path: path.resolve(__dirname, 'dist'), // 路径 必须是一个绝对路径 需要node path, reslove可以将一个相对路径解析成绝对路径
    },
    plugins: [ // 配置webpack插件
        new htmlWebpackPlugin({
            template: './src/index.html', // 指定模板页面，会更加页面路径生成内存（打包）中的页面
            filename: 'index.html', // 指定页面生成的名称
            minify: { // 对模板进行压缩
                removeAttributeQuotes: true, // 删除属性的双引号
                collapseWhitespace: true, // 折叠空行
            },
            hash: true, // 增加hash戳  缓存问题处理
        })
    ],
    module: {
        //webpack原生只支持js文件类型，只支持ES5语法，我们使用以其它文件名结尾的文件时，需要为其指定loader
        // loader的特点是单一功能
        // loader 用法：字符串，则只能用一个loader，数组则可以使用多个loader
        // loader是有顺序的，默认是从右到左执行
        // loader还可以写成对象形式  其对象还可以传一个options参数
        rules: [
            // 匹配规则 css-loader 解析@import这种语法
            // style-loader: 把css插入到head的标签中
            // {test: /\.css$/, use: ['style-loader', 'css-loader']},
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            insert: 'head', // css样式表会插入到html顶部
                        }
                    },
                    'css-loader'
                ]
            },
            { // 处理less文件 sass: sass-loader node-sass     stylus: stylus stylus-loader
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            insert: 'head', // css样式表会插入到html顶部
                        }
                    },
                    'css-loader',
                    'less-loader', // 把less解析成css
                ]
            }
        ]
    }
}