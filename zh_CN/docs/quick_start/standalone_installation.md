# 2. 部署第一个隐私计算网络

标签: ``搭建隐私计算网络``

----

本章介绍搭建隐私计算网络的必要安装和配置。通过在单机上部署一个2机构的WeDPR隐私计算网络，帮助用户掌握WeDPR隐私计算平台的部署流程，请参考(系统和硬件要求)[./hardware_requirements.md]使用支持的硬件和平台错左。

## 2.1 部署前置依赖

WeDPR隐私计算平台搭建前，需准备好[MYSQL](https://hub.docker.com/_/mysql), [HDFS](https://github.com/apache/hadoop/tree/trunk)和[FISCO BCOS v3.0]((https://fisco-bcos-doc.readthedocs.io/zh-cn/latest/index.html))区块链系统环境。
前置依赖的搭建可参考[依赖安装](../op/pre_installation.md).


## 2.2 下载部署脚本

```bash
# 创建操作目录
mkdir -p ~/wedpr
cd ~/wedpr

# 下载并解压环境部署脚本wedpr-builder
curl -#LO https://github.com/WeBankBlockchain/WeDPR/releases/download/v3.0.0/wedpr-builder.tar.gz && tar -xvf wedpr-builder.tar.gz && cd wedpr-builder
```

## 2.3 隐私计算平台部署配置

**步骤一: 拷贝配置模板**

```eval_rst
.. note::
   - 部署脚本的配置详细介绍参考 `这里 <../op/wedpr_builder.html>`_
   - wedpr-builder默认采用docker部署模式，请求确保所有机器安装了Docker
   - 网关、PSI节点、MPC节点、WeDPR管理台、PIR服务、建模服务支持源码编译安装部署，源码编译部署前，请参考 `这里 <../op/compiles.html>`_ 编译源码、提供二进制，再参考`这里 <../op/wedpr_builder.html>`_ ，将``docker_mode``设置为false以支持源码部署安装
```

```bash
conf/config-example.toml config.toml
```

**步骤二: 配置区块链信息**

**这里设区块链节点位于~/fisco目录下**。

```shell
# macos 请在使用 sed -i .bkp
# 获取区块链节点的rpc监听端口:
vim ~/fisco/nodes/127.0.0.1/node0/config.ini
# 查看rpc模块的监听端口为20200,如下:
[rpc]
    listen_ip=0.0.0.0
    listen_port=20200

# 配置区块链连接信息，配置两个连接节点
sed -i 's/blockchain_peers = []/blockchain_peers = ["127.0.0.1:20200", "127.0.0.1:20201"]/g' config.toml

# 拷贝区块链节点证书
mkdir -p sdk && cp -r ~/fisco/nodes/127.0.0.1/sdk/* sdk/

# 配置区块链证书路径:
sed -i 's/blockchain_cert_path = ""/blockchain_cert_path = "sdk"/g' config.toml
```


**步骤三: 配置HDFS信息**

这里设HDFS的RPC访问地址为`127.0.0.1:9000`, webfs访问地址为`127.0.0.1:50070`, 搭建环境过程中请根据HDFS实际访问链接进行配置。

```eval_rst
.. note::
   - HDFS的访问地址可通过命令 ``hdfs getconf -confKey fs.default.name`` 获取
```

```bash
# 配置name_node的ip地址，实际配置时请把${namenode_host}替换为namenode的ip地址
# sed -i 's/name_node = "127.0.0.1"/name_node = "${namenode_host}"/g' config.toml
 sed -i 's/name_node = "127.0.0.1"/name_node = "127.0.0.1"/g' config.toml
 
# 配置HDFS RPC访问端口，实际配置时请把${namenode_port}配置为HDFS RPC访问地址
# sed -i 's/name_node_port = 9000/name_node_port = ${namenode_port}/g' config.toml
sed -i 's/name_node_port = 9000/name_node_port = 9000/g' config.toml
 
# 配置webfs访问端口, 实际配置时请把${namenode_webfs_port}配置为HDFS webfs 访问地址
# sed -i 's/webfs_port = 50700/webfs_port = ${namenode_webfs_port}/g' config.toml
sed -i 's/webfs_port = 50700/webfs_port = 50700/g' config.toml

```


