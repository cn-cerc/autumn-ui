1、介绍
npm目录为代码上传至npm平台的最终结构目录

2、上传前提
需要将与npm统计目录code文件夹下面中dist文件夹中所有生成文件拷贝到npm下

3、发布npm
    1、使用npm login命令登录npm平台
    2、将package中的版本号字段(version)升级，如是第一次上传则无需此操作
    3、使用npm publish命令将npm目录下所有的文件上传至npm平台