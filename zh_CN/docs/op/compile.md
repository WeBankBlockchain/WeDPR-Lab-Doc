# 3. 源码编译

标签: ``源码编译``

----

[WeDPR](https://github.com/WeBankBlockchain/WeDPR)和[WeDPR-Component](https://github.com/WeBankBlockchain/WeDPR-Component)是WeDPR平台的核心仓库，前者主要基于`Java`语言实现，实现了WeDPR隐私计算平台的站点端管理; 后者实现了核心组件，包括PSI、MPC、建模服务等。

本文重点介绍这两个仓库的编译，并简单介绍这两个仓库的代码结构。

## 3.1 编译WeDPR

```eval_rst
.. note::
   WeDPR支持JDK1.8--JDK17
```

*********

**安装依赖**

```bash
# macos
brew install openjdk git

# ubuntu
sudo apt-get update && sudo apt install -y git default-jdk

# centos
yum install -y java-11-openjdk-devel git
```

*********

**下载源码**

```bash
# 从github下载源码
git clone https://github.com/WeBankBlockchain/WeDPR && cd WeDPR

# 查看源码目录结构：
ls -lh
total 112
-rw-r--r--   1 wedpr  wedpr   1.6K 12 16 11:15 ChangeLog.md
-rw-r--r--   1 wedpr  wedpr    11K 12  5 19:37 LICENSE
-rw-r--r--   1 wedpr  wedpr   2.3K 12 17 09:36 README.md
-rw-r--r--   1 wedpr  wedpr    12K 12 16 09:21 build.gradle
drwxr-xr-x   2 wedpr  wedpr    64B 12 17 09:40 doc
drwxr-xr-x   6 wedpr  wedpr   192B 12 13 18:15 docker-files
drwxr-xr-x   3 wedpr  wedpr    96B 12 11 14:30 gradle
-rw-r--r--   1 wedpr  wedpr    29B 12 11 14:30 gradle.properties
-rw-r--r--   1 wedpr  wedpr   5.6K 12 11 14:30 gradlew
-rw-r--r--   1 wedpr  wedpr   2.7K 12 11 14:30 gradlew.bat
drwxr-xr-x   4 wedpr  wedpr   128B 12 11 14:30 python
-rw-r--r--   1 wedpr  wedpr   5.2K 12 11 14:30 settings.gradle
drwxr-xr-x   3 wedpr  wedpr    96B 12 11 14:30 static
drwxr-xr-x  17 wedpr  wedpr   544B 12 19 09:28 wedpr-builder
drwxr-xr-x   4 wedpr  wedpr   128B 12  5 19:38 wedpr-common
drwxr-xr-x  29 wedpr  wedpr   928B 12  5 19:38 wedpr-components
drwxr-xr-x   6 wedpr  wedpr   192B 12 19 09:41 wedpr-pir
drwxr-xr-x   6 wedpr  wedpr   192B 12 19 09:41 wedpr-site
drwxr-xr-x   5 wedpr  wedpr   160B 12 18 18:20 wedpr-sol
drwxr-xr-x  18 wedpr  wedpr   576B 12 11 14:30 wedpr-web
drwxr-xr-x  19 wedpr  wedpr   608B 12 11 14:30 wedpr-web-components
drwxr-xr-x   6 wedpr  wedpr   192B 12 19 09:41 wedpr-worker
```
[WeDPR](https://github.com/WeBankBlockchain/WeDPR)的核心代码结构介绍如下：

- `build.gradle`: 项目的依赖构建文件
- `settings.gradle`: 定义了项目的所有子模块

WeDPR的核心代码位于如下几个目录中:
- `wedpr-common`: 包括`wedpr-common-utils`和`wedpr-common-protocol`两个子模块，实现了整个WeDPR仓库的基本依赖
- `wedpr-components`: 实现了WeDPR所有模块功能，包括存储、数据集、跨机构数据同步、元数据管理、认证鉴权、调度服务、用户管理、服务发布等，WeDPR站点端管理服务、PIR服务、Jupyter服务均是由`wedpr-components`定义的子模块组装而成

如下几个目录是WeDPR的服务App实现目录，本质上是依赖了`wedpr-components`中的众多子模块组装而成。

- `wedpr-site`:  站点端服务，实现了WeDPR站点端管理台的所有功能
- `wedpr-pir`: PIR服务，实现了匿踪查询功能
- `wedpr-worker`: Worker服务，支持执行指定的shell命令，Jupyter管理服务即是基于worker服务构建的

WeDPR前端web也开源了，位于如下目录:
- `wedpr-web-components`: web服务的基础模块
- `wedpr-web`： 实现了站点端管理台的前端

整个WeDPR隐私计算平台的构建脚本也位于该仓库：
- `wedpr-builder`: WeDPR隐私计算平台构建脚本；数据库初始化ddl和dml位于`wedpr-builder/db`目录下
- `wedpr-sol`: 隐私计算平台的合约，用于实现跨机构的数据同步

此外，为了实现Jupyter鉴权适配WeDPR鉴权认证体系，实现了Jupyter鉴权插件如下:
- `python/jupyter`: Jupyter鉴权插件，适配WeDPR用户鉴权体系，已上传pypip，包名为`wedpr-authenticator`

WeDPR支持用户直接写类SQL语句进行联合分析，`mpc_generator`插件负责将SQL语句转换成MPC语言，转换脚本如下:

- `python/mpc_generator`: SQL转MPC语言的转换脚本，用于支持WeDPR平台直接运行类SQL语句跑联合分析任务，包名为`wedpr_mpc_generator`，已上传pypip管理

为了简化部署，WeDPR平台默认使用Docker部署，相关服务的构建docker脚本如下:

- `docker-files/base`: WeDPR平台的基础镜像
- `docker-files/jupyter`: Jupyter服务的镜像，安装了Jupyter Lab等
- `docker-files/site`: 整个WeDPR站点端管理服务的构建镜像，包括`wedpr-site`, `wedpr-pir`, `wedpr-jupyter-worker`

*********

**编译源码**

```bash
bash gradlew clean build
```

编译成功后，项目根目录下会生成WeDPR站点端服务Jar包、WeDPR PIR服务Jar包以及WeDPR Jupyter服务Jar包如下:

```bash
# WeDPR站点端服务Jar包
ls -lh wedpr-site/dist
total 16
drwxr-xr-x    3 wedpr  wedpr    96B 12 16 10:21 apps
drwxr-xr-x   10 wedpr  wedpr   320B 12 16 10:21 conf
drwxr-xr-x  427 wedpr  wedpr    13K 12 16 10:22 lib
-rw-r--r--    1 wedpr  wedpr   3.6K 12 16 10:21 start.sh
-rw-r--r--    1 wedpr  wedpr   900B 12 16 10:21 stop.sh

# WeDPR PIR服务Jar包
ls -lh wedpr-pir/dist
total 16
drwxr-xr-x    3 wedpr  wedpr    96B 12 16 10:21 apps
drwxr-xr-x    6 wedpr  wedpr   192B 12 16 10:21 conf
drwxr-xr-x  246 wedpr  wedpr   7.7K 12 16 10:21 lib
-rw-r--r--    1 wedpr  wedpr   3.6K 12 16 10:21 start.sh
-rw-r--r--    1 wedpr  wedpr   891B 12 16 10:21 stop.sh

# WeDPR Jupyter服务Jar包
ls -lh wedpr-worker/dist
total 16
drwxr-xr-x   3 wedpr  wedpr    96B 12 16 10:22 apps
drwxr-xr-x   5 wedpr  wedpr   160B 12 16 10:22 conf
drwxr-xr-x  57 wedpr  wedpr   1.8K 12 16 10:22 lib
-rw-r--r--   1 wedpr  wedpr   3.6K 12 16 10:22 start.sh
-rw-r--r--   1 wedpr  wedpr   897B 12 16 10:22 stop.sh
```

## 3.2 编译WeDPR-Component

[WeDPR-Component](https://github.com/WeBankBlockchain/WeDPR-Component)实现了WeDPR隐私计算平台的核心组件, 包括如下目录:

```bash
total 56
-rw-r--r--   1 wedpr  wedpr   1.1K 12 10 18:08 ChangeLog.md
-rw-r--r--   1 wedpr  wedpr    11K  8 21 14:18 LICENSE
-rw-r--r--   1 wedpr  wedpr   2.3K 12 10 18:14 README.md
-rw-r--r--   1 wedpr  wedpr   1.4K 12 10 18:08 README.md.bak
drwxr-xr-x  30 wedpr  wedpr   960B 12 13 22:24 cpp
drwxr-xr-x   5 wedpr  wedpr   160B 12 10 18:08 docker-files
drwxr-xr-x  13 wedpr  wedpr   416B 12 10 18:08 python
drwxr-xr-x   3 wedpr  wedpr    96B 12 10 18:08 static
```

各目录核心功能介绍如下:

- `cpp`: 基于cpp语言实现的核心组件，包括PSI服务、PIR服务、MPC服务、统一网关、统一网关SDK(Java && Python)以及各种基础密码学库和同态密码学库的实现
- `python`: 基于python语言实现的核心组件，主要包括联邦建模功能，如`SecureLGBM`, `SecureLR`, `Feature Bining`, `Feature Selection`, `Pre-Processing`等
- `docker-files`: `wedpr-component`的Docker构建脚本，主要构建了建模服务(`wedpr-model-service`), PSI服务(`wedpr-pro-node-service`), 统一网关(`wedpr-gateway-service`)和MPC服务(`wedpr-mpc-service`)等

```eval_rst
.. note::
   - 每个发布版本的二进制均会上传到Release,  ``v3.0.0`` 版本的二进制下载链接可参考 ``这里 <https://github.com/WeBankBlockchain/WeDPR-Component/releases/tag/v3.0.0>``_
   - WeDPR-Component基于vcpkg构建依赖，很多vcpkg仓库从github下载依赖仓库源码，编译时请确保您的环境可流畅地访问github
```

********
**下载源码**

```bash
mkdir -p ~/wedpr
cd ~/wedpr && git clone https://github.com/WeBankBlockchain/WeDPR-Component --recursive --depth=1 && cd WeDPR-Component
```

*******
**安装依赖**


```bash
# 安装rust依赖
curl https://sh.rustup.rs -sSf | bash -s -- -y

# 安装依赖---ubuntu系统
apt-get -q update && apt-get install -qy --no-install-recommends \
    vim curl lcov git make nasm build-essential cmake wget libtool ca-certificates python3.11 python3-dev \
    libgmp-dev flex bison patch libzstd-dev unzip ninja-build pkg-config zip tar ccache uuid-runtime automake autoconf \
    m4 tcpdump net-tools gcc g++ default-jdk \
    && ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && apt-get install -qy --no-install-recommends tzdata \
    && dpkg-reconfigure --frontend noninteractive tzdata 

# 安装依赖---macos
bash -x cpp/tools/install_depends.sh -o macos
brew install libiconv
brew rm autoconf && brew rm m4 && brew install autoconf m4 libtool automake

# 安装依赖---centos
yum update -y
yum install -y epel-release centos-release-scl centos-release-scl-rh
yum install -y https://packages.endpointdev.com/rhel/7/os/x86_64/endpoint-repo.x86_64.rpm
yum install -y libtool wget java-11-openjdk-devel git autoconf automake make gcc gcc-c++ glibc-static glibc-devel cmake3 ccache devtoolset-11 libzstd-devel zlib-devel flex bison python-devel python3-devel
```

*******
**编译源码，产生服务二进制:**

```bash
cd ~/wedpr/WeDPR-Component/cpp && mkdir -p build && cd build
# 配置项目，下载项目依赖
# Note: 本步骤会通过vcpkg构建依赖，若出错，请检查您的网络是否能流畅联通github
cmake .. 

# 编译源码
make -j4

# 编译完成后，会在bin子目录下产生如下二进制文件:
ls -lh bin/
total 283840
-rwxr-xr-x  1 wedpr  wedpr    42M 12 13 19:52 ppc-air-node
-rwxr-xr-x  1 wedpr  wedpr    25M 12 13 19:52 ppc-gateway-service
-rwxr-xr-x  1 wedpr  wedpr    42M 12 13 19:52 ppc-pro-node
-rwxr-xr-x  1 wedpr  wedpr    30M 12 13 19:52 wedpr-mpc
```

*******
**编译源码，产生网关SDK动态库**

[WeDPR-Component](https://github.com/WeBankBlockchain/WeDPR-Component)实现了统一接入网关的SDK，支持Java和Python语言:

- `cpp/wedpr-transport/sdk-wrapper/java/bindings`: 统一网关的Java实现，基于`swig` + 动态库`libwedpr_java_transport_jni`构建统一网关SDK `wedpr-gateway-sdk`，该Jar包已经上传maven, gradle构建的项目中可通过`api ("com.webank.wedpr:wedpr-gateway-sdk:3.0.0")`
- `cpp/wedpr-transport/sdk-wrapper/python/bindings`: 统一网关的Python实现，基于`swig` + 动态库`libwedpr_python_transport`构建统一网关SDK `wedpr-python-gateway-sdk`, 该SDK已上传到pypip，包名为`wedpr-python-gateway-sdk`, 可通过pip工具直接下载

```bash
cd ~/wedpr/WeDPR-Component/cpp && mkdir -p build-sdk && cd build-sdk

# 配置编译: 开启BUILD_WEDPR_TOOLKIT开关编译网关SDK; 通过BUILD_PYTHON开启python gateway sdk的编译
cmake .. -DBUILD_WEDPR_TOOLKIT=ON -DBUILD_PYTHON=ON -DCMAKE_BUILD_TYPE=Release

# 执行编译
make -j4

# 编译完成后，
# Java SDK动态库更新到了cpp/wedpr-transport/sdk-wrapper/java/bindings/src/main/resources/META-INF/native目录下
# Python SDK动态库更新到了cpp//wedpr-transport/sdk-wrapper/python/bindings/wedpr_python_gateway_sdk/libs目录下
```



