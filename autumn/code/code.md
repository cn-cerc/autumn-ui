1、介绍
code目录为autumn-ui框架源码文件夹
其下:
    assets--用于存放autumn-ui框架中组件使用的css文件
    src--用于存放autumn-ui框架中声明的组件

2、生成npm框架代码
    1、执行npm run dev命令将所有js文件打包成js以及对应的.d.ts声明文件
    2、将assets文件夹拷贝至dist文件夹中，与src同级即可

3、发布框架
将生成在dist文件夹中的所有文件拷贝到与code目录同级的npm目录下，按照npm目录下npm.md说明按步骤执行