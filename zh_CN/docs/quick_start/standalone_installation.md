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

# 安装部署脚本依赖
pip install -i https://mirrors.aliyun.com/pypi/simple -r requirements.txt
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
sed -i 's/blockchain_peers = \[\]/blockchain_peers = [\"127.0.0.1:20200\", \"127.0.0.1:20201\"]/g' config.toml

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


## 2.4 生成隐私计算服务配置

可通过`-h`命令查看部署脚本使用方法:
```bash
python build_wedpr.py -h
usage: build_wedpr.py [-h] [-o OPERATION] [-c CONFIG] [-d OUTPUT] [-t TYPE]

examples:
 * generate node config:	 python3 build_wedpr.py -t wedpr-node
 * generate gateway config:	 python3 build_wedpr.py -t wedpr-gateway
 * generate wedpr-site config:	 python3 build_wedpr.py -t wedpr-site
 * generate wedpr-pir config:	 python3 build_wedpr.py -t wedpr-pir
* generate wedpr-model service config:	 python3 build_wedpr.py -t wedpr-model
 * generate wedpr-jupyter-worker config:	 python3 build_wedpr.py -t wedpr-jupyter-worker
 * generate gateway config:	 python3 build_wedpr.py -o genconfig -c config.toml -t wedpr-gateway -d wedpr-generated
 * generate node config:	 python3 build_wedpr.py -o genconfig -c config.toml -t wedpr-node -d wedpr-generated

optional arguments:
  -h, --help            show this help message and exit
  -o OPERATION, --operation OPERATION
                        [Optional] specify the command:
                        * supported command list: genconfigextend
  -c CONFIG, --config CONFIG
                        [Optional] the config file, default is config.toml
  -d OUTPUT, --output OUTPUT
                        [Optional] the output path, default is pp-generated
  -t TYPE, --type TYPE  [Required] the service type:
                        * now support: wedpr-node, wedpr-gateway, wedpr-site, wedpr-pir, wedpr-jupyter-worker, wedpr-model, wedpr-mpc-service
```

**生成隐私计算统一网关配置**

```bash
python3 build_wedpr.py -t wedpr-gateway
# 如下输出表明配置生成成功
----------- * generate gateway config, deploy_dir: wedpr-example -----------
* generate ca cert success, sm_mode: 0, ca cert path: wedpr-generated/wedpr-example/wedpr-gateway/ca
* generate config for ppc-gateway
----------- * generate config for ppc-gateway agency0.node0, deploy_ip: 127.0.0.1 -----------
* No need to copy binary for enable docker mode
* store ini config for config.ini
	 path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-gateway/node0/config.ini
* store ini config for config.ini success
* generate the node cert success, sm_mode: 0, ca cert path: wedpr-generated/wedpr-example/wedpr-gateway/ca, node cert path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-gateway/node0/conf
* No need to copy the shell scripts for enable docker mode
----------- * generate config for ppc-gatewaynode0 success -----------
----------- * generate config for ppc-gateway agency0.node1, deploy_ip: 127.0.0.1 -----------
* No need to copy binary for enable docker mode
* store ini config for config.ini
	 path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-gateway/node1/config.ini
* store ini config for config.ini success
* generate the node cert success, sm_mode: 0, ca cert path: wedpr-generated/wedpr-example/wedpr-gateway/ca, node cert path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-gateway/node1/conf
* No need to copy the shell scripts for enable docker mode
----------- * generate config for ppc-gatewaynode1 success -----------
* generate config for ppc-gateway success
* generate config for ppc-gateway
----------- * generate config for ppc-gateway agency1.node0, deploy_ip: 127.0.0.1 -----------
* No need to copy binary for enable docker mode
* store ini config for config.ini
	 path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-gateway/node0/config.ini
* store ini config for config.ini success
* generate the node cert success, sm_mode: 0, ca cert path: wedpr-generated/wedpr-example/wedpr-gateway/ca, node cert path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-gateway/node0/conf
* No need to copy the shell scripts for enable docker mode
----------- * generate config for ppc-gatewaynode0 success -----------
----------- * generate config for ppc-gateway agency1.node1, deploy_ip: 127.0.0.1 -----------
* No need to copy binary for enable docker mode
* store ini config for config.ini
	 path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-gateway/node1/config.ini
* store ini config for config.ini success
* generate the node cert success, sm_mode: 0, ca cert path: wedpr-generated/wedpr-example/wedpr-gateway/ca, node cert path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-gateway/node1/conf
* No need to copy the shell scripts for enable docker mode
----------- * generate config for ppc-gatewaynode1 success -----------
* generate config for ppc-gateway success
* store json config for nodes.json
	 path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-gateway/node0/nodes.json
* store json config for nodes.json success
* store json config for nodes.json
	 path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-gateway/node1/nodes.json
* store json config for nodes.json success
* store json config for nodes.json
	 path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-gateway/node0/nodes.json
* store json config for nodes.json success
* store json config for nodes.json
	 path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-gateway/node1/nodes.json
* store json config for nodes.json success
----------- * generate gateway config success, deploy_dir: wedpr-example -----------
```

**生成隐私计算PSI节点配置**

```bash
python3 build_wedpr.py -t wedpr-node

# 如下输出表明配置生成成功
----------- * generate_node_config -----------
* generate ca cert success, sm_mode: 0, ca cert path: wedpr-generated/wedpr-example/wedpr-node/ca
----------- * generate node config for node0, ip: 127.0.0.1, agency: agency0 -----------
* No need to copy binary for enable docker mode
__generate_single_node_inner_config__, load config.ini from /Users/chenyujie/open-source/cyjseagull/FB3.0/wedpr/3.0/WeDPR/wedpr-builder/wedpr_builder/tpl/config.ini.node
* generate private_key success, path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-node/node0/conf, public_key: 453b66be5bd75e16c7c939b067cc45052ff524c54ff54225c7e361b5f77d3536466cb01675717169fe41d8a65ca7800e1a8e9f6bb8b28323a0fcda8a730813d2
* store ini config for config.ini
	 path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-node/node0/config.ini
* store ini config for config.ini success
* generate the node cert success, sm_mode: 0, ca cert path: wedpr-generated/wedpr-example/wedpr-node/ca, node cert path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-node/node0/conf
* No need to copy shell scripts for enable docker mode
----------- * generate node config node0, ip: agency0.127.0.0.1 success -----------
----------- * generate node config for node1, ip: 127.0.0.1, agency: agency0 -----------
* No need to copy binary for enable docker mode
__generate_single_node_inner_config__, load config.ini from /Users/chenyujie/open-source/cyjseagull/FB3.0/wedpr/3.0/WeDPR/wedpr-builder/wedpr_builder/tpl/config.ini.node
* generate private_key success, path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-node/node1/conf, public_key: b7606953fd9b6abb7853776af08441c97a519276f5b46f76eb2d12b632e6528a4276ea2cc5639dff33b16d19d745881cd13a8196a5ad9f7e3d582be7b1f7df24
* store ini config for config.ini
	 path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-node/node1/config.ini
* store ini config for config.ini success
* generate the node cert success, sm_mode: 0, ca cert path: wedpr-generated/wedpr-example/wedpr-node/ca, node cert path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-node/node1/conf
* No need to copy shell scripts for enable docker mode
----------- * generate node config node1, ip: agency0.127.0.0.1 success -----------
----------- * generate node config for node0, ip: 127.0.0.1, agency: agency1 -----------
* No need to copy binary for enable docker mode
__generate_single_node_inner_config__, load config.ini from /Users/chenyujie/open-source/cyjseagull/FB3.0/wedpr/3.0/WeDPR/wedpr-builder/wedpr_builder/tpl/config.ini.node
* generate private_key success, path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-node/node0/conf, public_key: e142d5e3fb3b5daa0bab8f0506793fa8c8dd2bc1266dc880dc0202682ddfb53c5b791bba6785f250db91a54d9d5125ae6c7acaebc5117512bb183f0869657568
* store ini config for config.ini
	 path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-node/node0/config.ini
* store ini config for config.ini success
* generate the node cert success, sm_mode: 0, ca cert path: wedpr-generated/wedpr-example/wedpr-node/ca, node cert path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-node/node0/conf
* No need to copy shell scripts for enable docker mode
----------- * generate node config node0, ip: agency1.127.0.0.1 success -----------
----------- * generate node config for node1, ip: 127.0.0.1, agency: agency1 -----------
* No need to copy binary for enable docker mode
__generate_single_node_inner_config__, load config.ini from /Users/chenyujie/open-source/cyjseagull/FB3.0/wedpr/3.0/WeDPR/wedpr-builder/wedpr_builder/tpl/config.ini.node
* generate private_key success, path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-node/node1/conf, public_key: a0d2408bf3c2db10fe45d6388a35a145838cc0a944bda5c9c6d3e8c156f66d2000a8eabb4fe471278ed659f84159e27ebb3d2cdf35dd569079fe4fe55344fe7e
* store ini config for config.ini
	 path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-node/node1/config.ini
* store ini config for config.ini success
* generate the node cert success, sm_mode: 0, ca cert path: wedpr-generated/wedpr-example/wedpr-node/ca, node cert path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-node/node1/conf
* No need to copy shell scripts for enable docker mode
----------- * generate node config node1, ip: agency1.127.0.0.1 success -----------
----------- * generate_node_config success -----------
```

**生成隐私站点端管理台配置**

```bash
python3 build_wedpr.py -t wedpr-site

# 如下输出表明配置生成成功
----------- * generate wedpr-site config, agency: agency0, deploy_dir: wedpr-example, service_config: **ServiceConfig: deploy_ip: ['127.0.0.1:2'], agency: agency0server_start_port: 16000,service_type: wedpr-site
** -----------
----------- * generate wedpr-site config, deploy_ip: 127.0.0.1, node_index: 0, node_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-site/wedpr-site-node0 -----------
* generate shell script, dist_path: /data/home/wedpr/WeDPR/wedpr-site/dist/, dst_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-site/wedpr-site-node0
* no need to generate the shell script in docker-mode!
* generate shell script success, dist_path: /data/home/wedpr/WeDPR/wedpr-site/dist/, dst_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-site/wedpr-site-node0
* no need to copy the dist/lib, dist/apps for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-site/wedpr-site-node0
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-site/wedpr-site-node0
----------- * generate wedpr-site config, deploy_ip: 127.0.0.1, node_index: 1, node_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-site/wedpr-site-node1 -----------
* generate shell script, dist_path: /data/home/wedpr/WeDPR/wedpr-site/dist/, dst_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-site/wedpr-site-node1
* no need to generate the shell script in docker-mode!
* generate shell script success, dist_path: /data/home/wedpr/WeDPR/wedpr-site/dist/, dst_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-site/wedpr-site-node1
* no need to copy the dist/lib, dist/apps for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-site/wedpr-site-node1
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-site/wedpr-site-node1
----------- * generate wedpr-site config success, agency: agency0, deploy_dir: wedpr-example, service_type: wedpr-site -----------
----------- * generate wedpr-site config, agency: agency1, deploy_dir: wedpr-example, service_config: **ServiceConfig: deploy_ip: ['127.0.0.1:2'], agency: agency1server_start_port: 26000,service_type: wedpr-site
** -----------
----------- * generate wedpr-site config, deploy_ip: 127.0.0.1, node_index: 0, node_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-site/wedpr-site-node0 -----------
* generate shell script, dist_path: /data/home/wedpr/WeDPR/wedpr-site/dist/, dst_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-site/wedpr-site-node0
* no need to generate the shell script in docker-mode!
* generate shell script success, dist_path: /data/home/wedpr/WeDPR/wedpr-site/dist/, dst_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-site/wedpr-site-node0
* no need to copy the dist/lib, dist/apps for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-site/wedpr-site-node0
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-site/wedpr-site-node0
----------- * generate wedpr-site config, deploy_ip: 127.0.0.1, node_index: 1, node_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-site/wedpr-site-node1 -----------
* generate shell script, dist_path: /data/home/wedpr/WeDPR/wedpr-site/dist/, dst_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-site/wedpr-site-node1
* no need to generate the shell script in docker-mode!
* generate shell script success, dist_path: /data/home/wedpr/WeDPR/wedpr-site/dist/, dst_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-site/wedpr-site-node1
* no need to copy the dist/lib, dist/apps for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-site/wedpr-site-node1
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-site/wedpr-site-node1
----------- * generate wedpr-site config success, agency: agency1, deploy_dir: wedpr-example, service_type: wedpr-site -----------
```

**生成隐私PIR服务配置**

```bash
python3 build_wedpr.py -t wedpr-pir


# 如下输出表明配置生成成功
----------- * generate wedpr-pir config, agency: agency0, deploy_dir: wedpr-example, service_config: **ServiceConfig: deploy_ip: ['127.0.0.1:2'], agency: agency0server_start_port: 17000,service_type: wedpr-pir
** -----------
----------- * generate wedpr-pir config, deploy_ip: 127.0.0.1, node_index: 0, node_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-pir/wedpr-pir-node0 -----------
* no need to generate the shell script in docker-mode!
* no need to copy the dist/lib, dist/apps for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-pir/wedpr-pir-node0
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-pir/wedpr-pir-node0
----------- * generate wedpr-pir config, deploy_ip: 127.0.0.1, node_index: 1, node_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-pir/wedpr-pir-node1 -----------
* no need to generate the shell script in docker-mode!
* no need to copy the dist/lib, dist/apps for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-pir/wedpr-pir-node1
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-pir/wedpr-pir-node1
----------- * generate wedpr-pir config success, agency: agency0, deploy_dir: wedpr-example, service_type: wedpr-pir -----------
----------- * generate wedpr-pir config, agency: agency1, deploy_dir: wedpr-example, service_config: **ServiceConfig: deploy_ip: ['127.0.0.1:2'], agency: agency1server_start_port: 27000,service_type: wedpr-pir
** -----------
----------- * generate wedpr-pir config, deploy_ip: 127.0.0.1, node_index: 0, node_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-pir/wedpr-pir-node0 -----------
* no need to generate the shell script in docker-mode!
* no need to copy the dist/lib, dist/apps for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-pir/wedpr-pir-node0
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-pir/wedpr-pir-node0
----------- * generate wedpr-pir config, deploy_ip: 127.0.0.1, node_index: 1, node_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-pir/wedpr-pir-node1 -----------
* no need to generate the shell script in docker-mode!
* no need to copy the dist/lib, dist/apps for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-pir/wedpr-pir-node1
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-pir/wedpr-pir-node1
----------- * generate wedpr-pir config success, agency: agency1, deploy_dir: wedpr-example, service_type: wedpr-pir -----------
```

**生成Jupyter服务配置**

```bash
python3 build_wedpr.py -t wedpr-jupyter-worker


# 如下输出表明配置生成成功
----------- * generate wedpr-jupyter-worker config, agency: agency0, deploy_dir: wedpr-example, service_config: **ServiceConfig: deploy_ip: ['127.0.0.1:1'], agency: agency0server_start_port: 19000,service_type: wedpr-jupyter-worker
** -----------
----------- * generate wedpr-jupyter-worker config, deploy_ip: 127.0.0.1, node_index: 0, node_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-jupyter-worker/wedpr-jupyter-worker-node0 -----------
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-jupyter-worker/wedpr-jupyter-worker-node0
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-jupyter-worker/wedpr-jupyter-worker-node0
----------- * generate wedpr-jupyter-worker config success, agency: agency0, deploy_dir: wedpr-example, service_type: wedpr-jupyter-worker -----------
----------- * generate wedpr-jupyter-worker config, agency: agency1, deploy_dir: wedpr-example, service_config: **ServiceConfig: deploy_ip: ['127.0.0.1:1'], agency: agency1server_start_port: 29000,service_type: wedpr-jupyter-worker
** -----------
----------- * generate wedpr-jupyter-worker config, deploy_ip: 127.0.0.1, node_index: 0, node_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-jupyter-worker/wedpr-jupyter-worker-node0 -----------
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-jupyter-worker/wedpr-jupyter-worker-node0
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-jupyter-worker/wedpr-jupyter-worker-node0
----------- * generate wedpr-jupyter-worker config success, agency: agency1, deploy_dir: wedpr-example, service_type: wedpr-jupyter-worker -----------
```

**生成隐私联合建模服务配置**

```bash
python3 build_wedpr.py -t wedpr-model


# 如下输出表明配置生成成功
----------- * generate wedpr-model config, agency: agency0, deploy_dir: wedpr-example, service_config: **ServiceConfig: deploy_ip: ['127.0.0.1:2'], agency: agency0server_start_port: 18000,service_type: wedpr-model
** -----------
----------- * generate wedpr-model config, deploy_ip: 127.0.0.1, node_index: 0, node_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-model/wedpr-model-node0 -----------
* no need to generate the shell script in docker-mode!
* no need to copy the wedpr-model source code for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-model/wedpr-model-node0
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-model/wedpr-model-node0
----------- * generate wedpr-model config, deploy_ip: 127.0.0.1, node_index: 1, node_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-model/wedpr-model-node1 -----------
* no need to generate the shell script in docker-mode!
* no need to copy the wedpr-model source code for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-model/wedpr-model-node1
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency0/127.0.0.1/wedpr-model/wedpr-model-node1
----------- * generate wedpr-model config success, agency: agency0, deploy_dir: wedpr-example, service_type: wedpr-model -----------
----------- * generate wedpr-model config, agency: agency1, deploy_dir: wedpr-example, service_config: **ServiceConfig: deploy_ip: ['127.0.0.1:2'], agency: agency1server_start_port: 28000,service_type: wedpr-model
** -----------
----------- * generate wedpr-model config, deploy_ip: 127.0.0.1, node_index: 0, node_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-model/wedpr-model-node0 -----------
* no need to generate the shell script in docker-mode!
* no need to copy the wedpr-model source code for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-model/wedpr-model-node0
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-model/wedpr-model-node0
----------- * generate wedpr-model config, deploy_ip: 127.0.0.1, node_index: 1, node_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-model/wedpr-model-node1 -----------
* no need to generate the shell script in docker-mode!
* no need to copy the wedpr-model source code for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-model/wedpr-model-node1
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency1/127.0.0.1/wedpr-model/wedpr-model-node1
----------- * generate wedpr-model config success, agency: agency1, deploy_dir: wedpr-example, service_type: wedpr-model -----------
```

最终生成的所有配置位于`wedpr-generated/wedpr-example`目录下，目录结果如下:

```bash
tree -d -L 3
.
├── agency0
│   └── 127.0.0.1
│       ├── wedpr-gateway
│       ├── wedpr-jupyter-worker
│       ├── wedpr-model
│       ├── wedpr-node
│       ├── wedpr-pir
│       └── wedpr-site
├── agency1
│   └── 127.0.0.1
│       ├── wedpr-gateway
│       ├── wedpr-jupyter-worker
│       ├── wedpr-model
│       ├── wedpr-node
│       ├── wedpr-pir
│       └── wedpr-site

 ls -lh agency0/127.0.0.1/wedpr-gateway/node0/*.sh
-rw-r--r--  1 wedpr  wedpr   1.0K 12  9 17:28 agency0/127.0.0.1/wedpr-gateway/node0/create_docker.sh
-rw-r--r--  1 wedpr  wedpr   563B 12  9 17:28 agency0/127.0.0.1/wedpr-gateway/node0/destroy_docker.sh
-rw-r--r--  1 wedpr  wedpr   337B 12  9 17:28 agency0/127.0.0.1/wedpr-gateway/node0/start_docker.sh
-rw-r--r--  1 wedpr  wedpr   334B 12  9 17:28 agency0/127.0.0.1/wedpr-gateway/node0/stop_docker.sh

```

- `agency0`目录下存放机构`agency0`的所有服务配置; `agency1`存放机构`agency1`的所有服务配置
- 每个节点配置下均包含四个脚本:
  - `create_docker.sh`: 创建docker实例
  - `destroy_docker.sh`: 删除docker实例
  - `start_docker.sh`: 启动docker实例
  - `stop_docker.sh`: 关闭docker实例


## 2.5 启动隐私计算服务

**步骤一: 创建部署路径，并拷贝所有服务器配置**

```bash
mkdir -p ~/wedpr/ && cp -r ~/wedpr-generated/wedpr-example ~/wedpr 
```

**步骤二: 创建docker**

```eval_rst
.. note::
   - 首次初始化docker需要使用 ``create_all_dockers.sh`` 脚本创建docker
   - 首次初始化后，需使用 ``start_all_dockers.sh`` 和 ``stop_all_dockers.sh`` 启动和停止docker，谨慎使用 ``destroy_all_dockers.sh`` (该命令会销毁所有容器)
```

```bash
# 进入到部署路径
cd ~/wedpr/wedpr-example

# 创建agency0的所有docker服务
bash agency0/create_all_dockers.sh

# 创建agency1的所有docker服务
bash agency1/create_all_dockers.sh
```

**步骤三: 校验隐私服务是否正常启动**

通过`docker ps |grep -i wedpr` 命令找到wedpr相关的所有容器，检查是否有容器启动失败。在有服务启动失败的情况下，通过`docker logs`命令查看容器启动失败原因。


```eval_rst
.. note::
   端口冲突或者依赖服务(如HDFS, 区块链)没有启动是导致服务启动失败的常见原因。若发生了端口冲突，请参考 `服务配置 <../op/config/index.html>`_ 修改端口配置; 启动服务前，请确保服务可正常连接到HDFS、区块链等依赖服务，可通过 ``telnet`` 命令探测连通性
```

## 2.6 使用浏览器访问隐私计算平台

- 机构`agency0`访问地址: http://127.0.0.1:8010/#/login
- 机构`agency1`访问地址: http://127.0.0.1:8030/#/login

```eval_rst
.. note::
   - 两机构环境，默认使用``8010``， ``8030`` 作为 web端口， 若无法访问，请确保开启了这两个端口的策略
   - 两机构环境，agency0需暴露范围``19100-19120``的端口访问jupyter; agency1需暴露范围``29100-29120:29100-29120`` 的端口访问jupyter，请确保开启了这两个范围端口的策略用于访问专家模式Jupyter
   - Web页面使用请参考用户指南章节
```