# summer-ci

## 一、构建环境

### 1、安装webpack webpack-cli
```
cnpm i -D webpack webpack-cli
```
### 2、配置webpack的自动打包功能

webpack 可以打包项目用到的js和非js文件 但是每次修改 都需要手动执行打包命令 然后刷新浏览器页面 比较麻烦 ，运行 npm i -D webpack-dev-server ，然后打开 package.json 修改 scripts 下的 dev配置 为 webpack-dev-server
然后直接运行 npm run dev就能执行文件 ，最后我们直接访问直接访问localhost:8080就能查看项目了
```
cnpm i -D webpack-dev-server
```
### 3、webpack-配置html-webpack-plugin生成预览页面

html-webpack-plugin 将index.html文件也生成到了内存中 这样直接访问localhost:8080 就可以打开 index.html 文件 html-webpack-plugin 还会自动引入js文件 不需要我们引入js文件
```
cnpm i -D html-webpack-plugin
```

### 4、安装ts开发依赖

```
cnpm install --D typescript ts-loader
cnpm install --D clean-webpack-plugin
```

二、打包
运行测试环境
```
cnpm run dev
```

运行正式环境
```
cnpm run build
```