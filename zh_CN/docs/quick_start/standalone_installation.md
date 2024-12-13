# 2. 部署第一个隐私计算网络

标签: ``搭建隐私计算网络``

----

本章介绍搭建隐私计算网络的必要安装和配置。通过在单机上部署一个2机构的WeDPR隐私计算网络，帮助用户掌握WeDPR隐私计算平台的部署流程，请参考(系统和硬件要求)[./hardware_requirements.md]使用支持的硬件和平台错左。

```eval_rst
.. note::
   - 本教程主要针对linux环境使用部署脚本wedpr-builder，若是macos使用部署脚本，请将所有 `sed -i` 命令替换为 `sed -i .bkp`
   - 非开发者建议使用docker搭建WeDPR
```

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
pip3 install -i https://mirrors.aliyun.com/pypi/simple -r requirements.txt
```

## 2.3 隐私计算平台部署配置

**步骤一: 拷贝配置模板**

```eval_rst
.. note::
   - 部署脚本的配置详细介绍参考 `这里 <../op/wedpr_builder.html>`_
   - wedpr-builder默认采用docker部署模式，请求确保所有机器安装了Docker，若Docker拉取镜像很慢，可参考 `这里 <https://www.runoob.com/docker/docker-mirror-acceleration.html>`_ 配置加速源
   - 网关、PSI节点、MPC节点、WeDPR管理台、PIR服务、建模服务支持源码编译安装部署，源码编译部署前，请参考 `这里 <../op/compile.html>`_ 编译源码、提供二进制，再参考  `这里 <../op/wedpr_builder.html>`_ ，将 ``docker_mode`` 设置为false以支持源码部署安装
```

```bash
conf/config-example.toml config.toml
```

**步骤二: 配置HDFS信息**

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

**步骤三: 统一替换本机IP为机器内网IP**

统一替换配置模板中的本机地址`127.0.0.1`为本机的内网ip地址:

```bash
# 获取机器ip地址：从输出的列表中选择内网IP
ifconfig

# 替换127.0.0.1为机器的内网ip，设内网ip地址为: 192.168.1.2，则执行如下命令:
sed -i 's/127.0.0.1/192.168.1.2/g' config.toml
```


```eval_rst
.. note::
   配置模板中默认部署机构 `agency0` 和 `agency1` 的隐私计算环境，若想修改机构名，可采用 `sed` 命令，将旧的机构名统一替换成目标机构名
```

**步骤四：部署隐私计算合约**

获取隐私计算合约:

```bash
curl -#LO https://github.com/WeBankBlockchain/WeDPR/releases/download/v3.0.0/wedpr-sol.tar.gz &&  tar -xvf wedpr-sol.tar.gz
```
下载控制台, 并设置控制台连接区块链，具体可参考[配置和使用FISCO BCOS 3.0版本控制台](https://fisco-bcos-doc.readthedocs.io/zh-cn/latest/docs/quick_start/air_installation.html#id7):
将隐私计算合约放置于控制台contracts/solidity目录下:

```bash
# 设控制台目录为~/fisco/console
cd ~/fisco/console/ && cp -r ~/wedpr/wedpr-builder/wedpr-sol/* ~/fisco/console/contracts/solidity/

# 启动控制台
bash start.sh

# 部署定序合约, 合约地址为: 0x2cce9b84c7b9cf8ca4a8438fac936877a8c7e6a9
[group0]: /apps> deploy ResourceSequencer
transaction hash: 0x79c6fe6ac2b06db79fbe733c8ecdd4af0c1efacb646c6f76a28130d24b43e3b5
contract address: 0x2cce9b84c7b9cf8ca4a8438fac936877a8c7e6a9
currentAccount: 0xef375a109f9f817b5480c408511012f0c49e42bb

# 根据定序合约地址，部署工厂合约，部署参数为定序合约的地址，最终工厂合约地址为: 0x45c4ac4bf51d82d820b2ed904611e3fc37b6a737
[group0]: /apps> deploy ResourceLogRecordFactory 0x2cce9b84c7b9cf8ca4a8438fac936877a8c7e6a9
transaction hash: 0x750c6e7fad14f0dbb68a93a43da5928e057656b3fb77881ebb4503910120f068
contract address: 0x45c4ac4bf51d82d820b2ed904611e3fc37b6a737
currentAccount: 0xef375a109f9f817b5480c408511012f0c49e42bb

# 切换回到部署目录
cd ~/wedpr/wedpr-builder
```

**步骤五：配置隐私计算合约地址信息**:

```bash
# vim或其他编辑器打开配置模板config.toml, 配置定序合约地址为上面部署的合约地址0x2cce9b84c7b9cf8ca4a8438fac936877a8c7e6a9(请您根据实际使用情况配置)
sequencer_contract_address = "0x2cce9b84c7b9cf8ca4a8438fac936877a8c7e6a9"

# 打开配置模板config.ini，配置合约工厂地址为上面部署的合约地址0x45c4ac4bf51d82d820b2ed904611e3fc37b6a737(请您根据实际使用情况配置)
recorder_factory_contract_address = "0x45c4ac4bf51d82d820b2ed904611e3fc37b6a737"
```


**步骤六: 配置区块链信息**

**这里设区块链节点位于~/fisco目录下**。

```eval_rst
.. note::
   区块链的配置信息可参考 `这里 <https://fisco-bcos-doc.readthedocs.io/zh-cn/latest/docs/tutorial/air/config.html>`_
```

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

## 2.4 生成隐私计算服务配置

可通过`-h`命令查看部署脚本使用方法:
```bash
python build_wedpr.py -h
usage: build_wedpr.py [-h] [-o OPERATION] [-c CONFIG] [-d OUTPUT] [-t TYPE]

examples:
 * generate node config:	 python3 build_wedpr.py -t wedpr-node
 * generate gateway config:	 python3 build_wedpr.py -t wedpr-gateway
 * generate mpc config:	 python3 build_wedpr.py -t wedpr-mpc
 * generate wedpr-site config:	 python3 build_wedpr.py -t wedpr-site
 * generate wedpr-pir config:	 python3 build_wedpr.py -t wedpr-pir
* generate wedpr-model service config:	 python3 build_wedpr.py -t wedpr-model
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
                        * now support: wedpr-node, wedpr-gateway, wedpr-site, wedpr-pir, wedpr-jupyter-worker, wedpr-model, wedpr-mpc
```

**生成隐私计算统一网关配置**

```bash
python3 build_wedpr.py -t wedpr-gateway
# 如下输出表明配置生成成功
* load gateway configuration, gateway targets: ipv4:192.168.1.2:40600,192.168.1.2:40601
* load gateway configuration, gateway targets: ipv4:192.168.1.2:40620,192.168.1.2:40621
----------- * generate gateway config, deploy_dir: wedpr-example -----------
* generate ca cert success, sm_mode: 0, ca cert path: wedpr-generated/wedpr-example/wedpr-gateway/ca
* generate config for ppc-gateway
----------- * generate config for ppc-gateway agency0.node0, deploy_ip: 192.168.1.2 -----------
* No need to copy binary for enable docker mode
* store ini config for config.ini
	 path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-gateway/node0/config.ini
* store ini config for config.ini success
* generate the node cert success, sm_mode: 0, ca cert path: wedpr-generated/wedpr-example/wedpr-gateway/ca, node cert path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-gateway/node0/conf
* No need to copy the shell scripts for enable docker mode
----------- * generate config for ppc-gatewaynode0 success -----------
----------- * generate config for ppc-gateway agency0.node1, deploy_ip: 192.168.1.2 -----------
* No need to copy binary for enable docker mode
* store ini config for config.ini
	 path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-gateway/node1/config.ini
* store ini config for config.ini success
* generate the node cert success, sm_mode: 0, ca cert path: wedpr-generated/wedpr-example/wedpr-gateway/ca, node cert path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-gateway/node1/conf
* No need to copy the shell scripts for enable docker mode
----------- * generate config for ppc-gatewaynode1 success -----------
* generate config for ppc-gateway success
* generate config for ppc-gateway
----------- * generate config for ppc-gateway agency1.node0, deploy_ip: 192.168.1.2 -----------
* No need to copy binary for enable docker mode
* store ini config for config.ini
	 path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-gateway/node0/config.ini
* store ini config for config.ini success
* generate the node cert success, sm_mode: 0, ca cert path: wedpr-generated/wedpr-example/wedpr-gateway/ca, node cert path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-gateway/node0/conf
* No need to copy the shell scripts for enable docker mode
----------- * generate config for ppc-gatewaynode0 success -----------
----------- * generate config for ppc-gateway agency1.node1, deploy_ip: 192.168.1.2 -----------
* No need to copy binary for enable docker mode
* store ini config for config.ini
	 path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-gateway/node1/config.ini
* store ini config for config.ini success
* generate the node cert success, sm_mode: 0, ca cert path: wedpr-generated/wedpr-example/wedpr-gateway/ca, node cert path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-gateway/node1/conf
* No need to copy the shell scripts for enable docker mode
----------- * generate config for ppc-gatewaynode1 success -----------
* generate config for ppc-gateway success
* store json config for nodes.json
	 path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-gateway/node0/nodes.json
* store json config for nodes.json success
* store json config for nodes.json
	 path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-gateway/node1/nodes.json
* store json config for nodes.json success
* store json config for nodes.json
	 path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-gateway/node0/nodes.json
* store json config for nodes.json success
* store json config for nodes.json
	 path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-gateway/node1/nodes.json
* store json config for nodes.json success
----------- * generate gateway config success, deploy_dir: wedpr-example -----------
```

**生成隐私计算PSI节点配置**

```bash
python3 build_wedpr.py -t wedpr-node

# 如下输出表明配置生成成功
* load gateway configuration, gateway targets: ipv4:192.168.1.2:40600,192.168.1.2:40601
* load gateway configuration, gateway targets: ipv4:192.168.1.2:40620,192.168.1.2:40621
----------- * generate_node_config -----------
* generate ca cert success, sm_mode: 0, ca cert path: wedpr-generated/wedpr-example/wedpr-node/ca
----------- * generate node config for node0, ip: 192.168.1.2, agency: agency0 -----------
* No need to copy binary for enable docker mode
* generate private_key success, path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-node/node0/conf, public_key: 6de991c4184aac15e4c05047a984003312a67b73de0dc40078327f286ab54944a4da6cdc557e65f98306b1f8a8e9de2c8a33bc15a638301ab496a7ce4858f467
* store ini config for config.ini
	 path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-node/node0/config.ini
* store ini config for config.ini success
* generate the node cert success, sm_mode: 0, ca cert path: wedpr-generated/wedpr-example/wedpr-node/ca, node cert path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-node/node0/conf
* No need to copy shell scripts for enable docker mode
----------- * generate node config node0, ip: agency0.192.168.1.2 success -----------
----------- * generate node config for node1, ip: 192.168.1.2, agency: agency0 -----------
* No need to copy binary for enable docker mode
* generate private_key success, path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-node/node1/conf, public_key: 11f9b9a7c8f33b6110388d1165872689f35705be5377819e0cdd3a8f9172fd7531120124ae943800c89749e24ae748985bf84594d65596c6715c4703a6f248b6
* store ini config for config.ini
	 path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-node/node1/config.ini
* store ini config for config.ini success
* generate the node cert success, sm_mode: 0, ca cert path: wedpr-generated/wedpr-example/wedpr-node/ca, node cert path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-node/node1/conf
* No need to copy shell scripts for enable docker mode
----------- * generate node config node1, ip: agency0.192.168.1.2 success -----------
----------- * generate node config for node0, ip: 192.168.1.2, agency: agency1 -----------
* No need to copy binary for enable docker mode
* generate private_key success, path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-node/node0/conf, public_key: f671fca6ea33443c9348cbf1be77f2da34cb22d7f2ac5c4b96ccafa9001c5d9b35085203f3156eca408231cca08f15f5f7a8f737e2b10155295aceecbb9e379e
* store ini config for config.ini
	 path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-node/node0/config.ini
* store ini config for config.ini success
* generate the node cert success, sm_mode: 0, ca cert path: wedpr-generated/wedpr-example/wedpr-node/ca, node cert path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-node/node0/conf
* No need to copy shell scripts for enable docker mode
----------- * generate node config node0, ip: agency1.192.168.1.2 success -----------
----------- * generate node config for node1, ip: 192.168.1.2, agency: agency1 -----------
* No need to copy binary for enable docker mode
* generate private_key success, path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-node/node1/conf, public_key: 2590e337f373846fb31cda2e59fa3a24c34bbdcf6289f4f7c8b7251690b4308ab8c352a185ba30d0b31bdf6f03ec4bfc49f4cae8752c6fd6eb8806b5c7010b21
* store ini config for config.ini
	 path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-node/node1/config.ini
* store ini config for config.ini success
* generate the node cert success, sm_mode: 0, ca cert path: wedpr-generated/wedpr-example/wedpr-node/ca, node cert path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-node/node1/conf
* No need to copy shell scripts for enable docker mode
----------- * generate node config node1, ip: agency1.192.168.1.2 success -----------
----------- * generate_node_config success -----------
```

**生成隐私站点端管理台配置**

同时生成了站点端和专家模式Jupyter的配置：

```bash
python3 build_wedpr.py -t wedpr-site

* load gateway configuration, gateway targets: ipv4:192.168.1.2:40600,192.168.1.2:40601
* load gateway configuration, gateway targets: ipv4:192.168.1.2:40620,192.168.1.2:40621
----------- * generate wedpr-jupyter-worker config, agency: agency0, deploy_dir: wedpr-example, service_config: **ServiceConfig: deploy_ip: ['192.168.1.2:1'], agency: agency0, server_start_port: 19000,service_type: wedpr-jupyter-worker
** -----------
----------- * generate wedpr-jupyter-worker config, deploy_ip: 192.168.1.2, node_index: 0, agency_index: 0,node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-jupyter-worker/wedpr-jupyter-worker-node0 -----------
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-jupyter-worker/wedpr-jupyter-worker-node0
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-jupyter-worker/wedpr-jupyter-worker-node0
----------- * generate wedpr-jupyter-worker config success, agency: agency0, deploy_dir: wedpr-example, service_type: wedpr-jupyter-worker -----------
----------- * generate wedpr-jupyter-worker config, agency: agency1, deploy_dir: wedpr-example, service_config: **ServiceConfig: deploy_ip: ['192.168.1.2:1'], agency: agency1, server_start_port: 29000,service_type: wedpr-jupyter-worker
** -----------
----------- * generate wedpr-jupyter-worker config, deploy_ip: 192.168.1.2, node_index: 0, agency_index: 1,node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-jupyter-worker/wedpr-jupyter-worker-node0 -----------
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-jupyter-worker/wedpr-jupyter-worker-node0
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-jupyter-worker/wedpr-jupyter-worker-node0
----------- * generate wedpr-jupyter-worker config success, agency: agency1, deploy_dir: wedpr-example, service_type: wedpr-jupyter-worker -----------
----------- * generate wedpr-site config, agency: agency0, deploy_dir: wedpr-example, service_config: **ServiceConfig: deploy_ip: ['192.168.1.2:2'], agency: agency0, server_start_port: 16000,service_type: wedpr-site
** -----------
----------- * generate wedpr-site config, deploy_ip: 192.168.1.2, node_index: 0, agency_index: 0,node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-site/wedpr-site-node0 -----------
* generate shell script, dist_path: /data/home/wedpr/WeDPR/wedpr-site/dist/, dst_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-site/wedpr-site-node0
* no need to generate the shell script in docker-mode!
* generate shell script success, dist_path: /data/home/wedpr/WeDPR/wedpr-site/dist/, dst_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-site/wedpr-site-node0
* no need to copy the dist/lib, dist/apps for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-site/wedpr-site-node0
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-site/wedpr-site-node0
----------- * generate wedpr-site config, deploy_ip: 192.168.1.2, node_index: 1, agency_index: 0,node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-site/wedpr-site-node1 -----------
* generate shell script, dist_path: /data/home/wedpr/WeDPR/wedpr-site/dist/, dst_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-site/wedpr-site-node1
* no need to generate the shell script in docker-mode!
* generate shell script success, dist_path: /data/home/wedpr/WeDPR/wedpr-site/dist/, dst_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-site/wedpr-site-node1
* no need to copy the dist/lib, dist/apps for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-site/wedpr-site-node1
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-site/wedpr-site-node1
* Generate init scripts for wedpr-site, init_dir: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-site/init
* Generate init script: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-site/init/site_init.sh success
* jupyter_setting: '{"hostSettings": [{"\"entryPoint\"": "\"192.168.1.2:19000\"", "\"jupyterExternalIp\"": "\"192.168.1.2\"", "\"jupyterStartPort\"": "19100", "\"maxJupyterCount\"": "10"}]}'
* Generate init scripts for wedpr-site success
* generate nginx for wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-site/wedpr-site-node0, nginx_listen_port: 16002
* generate nginx for wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-site/wedpr-site-node0 success
* generate nginx for wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-site/wedpr-site-node1, nginx_listen_port: 16005
* generate nginx for wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-site/wedpr-site-node1 success
----------- * generate wedpr-site config success, agency: agency0, deploy_dir: wedpr-example, service_type: wedpr-site -----------
----------- * generate wedpr-site config, agency: agency1, deploy_dir: wedpr-example, service_config: **ServiceConfig: deploy_ip: ['192.168.1.2:2'], agency: agency1, server_start_port: 26000,service_type: wedpr-site
** -----------
----------- * generate wedpr-site config, deploy_ip: 192.168.1.2, node_index: 0, agency_index: 1,node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-site/wedpr-site-node0 -----------
* generate shell script, dist_path: /data/home/wedpr/WeDPR/wedpr-site/dist/, dst_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-site/wedpr-site-node0
* no need to generate the shell script in docker-mode!
* generate shell script success, dist_path: /data/home/wedpr/WeDPR/wedpr-site/dist/, dst_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-site/wedpr-site-node0
* no need to copy the dist/lib, dist/apps for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-site/wedpr-site-node0
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-site/wedpr-site-node0
----------- * generate wedpr-site config, deploy_ip: 192.168.1.2, node_index: 1, agency_index: 1,node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-site/wedpr-site-node1 -----------
* generate shell script, dist_path: /data/home/wedpr/WeDPR/wedpr-site/dist/, dst_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-site/wedpr-site-node1
* no need to generate the shell script in docker-mode!
* generate shell script success, dist_path: /data/home/wedpr/WeDPR/wedpr-site/dist/, dst_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-site/wedpr-site-node1
* no need to copy the dist/lib, dist/apps for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-site/wedpr-site-node1
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-site/wedpr-site-node1
* Generate init scripts for wedpr-site, init_dir: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-site/init
* Generate init script: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-site/init/site_init.sh success
* jupyter_setting: '{"hostSettings": [{"\"entryPoint\"": "\"192.168.1.2:29000\"", "\"jupyterExternalIp\"": "\"192.168.1.2\"", "\"jupyterStartPort\"": "29100", "\"maxJupyterCount\"": "10"}]}'
* Generate init scripts for wedpr-site success
* generate nginx for wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-site/wedpr-site-node0, nginx_listen_port: 26002
* generate nginx for wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-site/wedpr-site-node0 success
* generate nginx for wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-site/wedpr-site-node1, nginx_listen_port: 26005
* generate nginx for wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-site/wedpr-site-node1 success
----------- * generate wedpr-site config success, agency: agency1, deploy_dir: wedpr-example, service_type: wedpr-site -----------
```

**生成隐私PIR服务配置**

```bash
python3 build_wedpr.py -t wedpr-pir


# 如下输出表明配置生成成功
* load gateway configuration, gateway targets: ipv4:192.168.1.2:40600,192.168.1.2:40601
* load gateway configuration, gateway targets: ipv4:192.168.1.2:40620,192.168.1.2:40621
----------- * generate wedpr-pir config, agency: agency0, deploy_dir: wedpr-example, service_config: **ServiceConfig: deploy_ip: ['192.168.1.2:2'], agency: agency0, server_start_port: 17000,service_type: wedpr-pir
** -----------
----------- * generate wedpr-pir config, deploy_ip: 192.168.1.2, node_index: 0, agency_index: 0,node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-pir/wedpr-pir-node0 -----------
* no need to generate the shell script in docker-mode!
* no need to copy the dist/lib, dist/apps for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-pir/wedpr-pir-node0
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-pir/wedpr-pir-node0
----------- * generate wedpr-pir config, deploy_ip: 192.168.1.2, node_index: 1, agency_index: 0,node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-pir/wedpr-pir-node1 -----------
* no need to generate the shell script in docker-mode!
* no need to copy the dist/lib, dist/apps for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-pir/wedpr-pir-node1
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-pir/wedpr-pir-node1
----------- * generate wedpr-pir config success, agency: agency0, deploy_dir: wedpr-example, service_type: wedpr-pir -----------
----------- * generate wedpr-pir config, agency: agency1, deploy_dir: wedpr-example, service_config: **ServiceConfig: deploy_ip: ['192.168.1.2:2'], agency: agency1, server_start_port: 27000,service_type: wedpr-pir
** -----------
----------- * generate wedpr-pir config, deploy_ip: 192.168.1.2, node_index: 0, agency_index: 1,node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-pir/wedpr-pir-node0 -----------
* no need to generate the shell script in docker-mode!
* no need to copy the dist/lib, dist/apps for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-pir/wedpr-pir-node0
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-pir/wedpr-pir-node0
----------- * generate wedpr-pir config, deploy_ip: 192.168.1.2, node_index: 1, agency_index: 1,node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-pir/wedpr-pir-node1 -----------
* no need to generate the shell script in docker-mode!
* no need to copy the dist/lib, dist/apps for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-pir/wedpr-pir-node1
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-pir/wedpr-pir-node1
----------- * generate wedpr-pir config success, agency: agency1, deploy_dir: wedpr-example, service_type: wedpr-pir -----------
```

**生成MPC服务配置**

```bash
python3 build_wedpr.py -t wedpr-mpc

# 如下输出表明配置生成成功
* load gateway configuration, gateway targets: ipv4:192.168.1.2:40600,192.168.1.2:40601
* load gateway configuration, gateway targets: ipv4:192.168.1.2:40620,192.168.1.2:40621
----------- * generate wedpr-mpc config, agency: agency0, deploy_dir: wedpr-example, service_config: **ServiceConfig: deploy_ip: ['192.168.1.2:1'], agency: agency0, server_start_port: 20000,service_type: wedpr-mpc
** -----------
----------- * generate wedpr-mpc config, deploy_ip: 192.168.1.2, node_index: 0, agency_index: 0,node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-mpc/wedpr-mpc-node0 -----------
* enable docker mode, no need to copy the scripts
* enable docker mode, no need to copy the binary
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-mpc/wedpr-mpc-node0
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-mpc/wedpr-mpc-node0
----------- * generate wedpr-mpc config success, agency: agency0, deploy_dir: wedpr-example, service_type: wedpr-mpc -----------
----------- * generate wedpr-mpc config, agency: agency1, deploy_dir: wedpr-example, service_config: **ServiceConfig: deploy_ip: ['192.168.1.2:1'], agency: agency1, server_start_port: 30000,service_type: wedpr-mpc
** -----------
----------- * generate wedpr-mpc config, deploy_ip: 192.168.1.2, node_index: 0, agency_index: 1,node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-mpc/wedpr-mpc-node0 -----------
* enable docker mode, no need to copy the scripts
* enable docker mode, no need to copy the binary
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-mpc/wedpr-mpc-node0
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-mpc/wedpr-mpc-node0
----------- * generate wedpr-mpc config success, agency: agency1, deploy_dir: wedpr-example, service_type: wedpr-mpc -----------
```

**生成隐私联合建模服务配置**

```bash
python3 build_wedpr.py -t wedpr-model


# 如下输出表明配置生成成功
* load gateway configuration, gateway targets: ipv4:192.168.1.2:40600,192.168.1.2:40601
* load gateway configuration, gateway targets: ipv4:192.168.1.2:40620,192.168.1.2:40621
----------- * generate wedpr-model config, agency: agency0, deploy_dir: wedpr-example, service_config: **ServiceConfig: deploy_ip: ['192.168.1.2:2'], agency: agency0, server_start_port: 18000,service_type: wedpr-model
** -----------
----------- * generate wedpr-model config, deploy_ip: 192.168.1.2, node_index: 0, agency_index: 0,node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-model/wedpr-model-node0 -----------
* no need to generate the shell script in docker-mode!
* no need to copy the wedpr-model source code for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-model/wedpr-model-node0
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-model/wedpr-model-node0
----------- * generate wedpr-model config, deploy_ip: 192.168.1.2, node_index: 1, agency_index: 0,node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-model/wedpr-model-node1 -----------
* no need to generate the shell script in docker-mode!
* no need to copy the wedpr-model source code for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-model/wedpr-model-node1
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency0/192.168.1.2/wedpr-model/wedpr-model-node1
----------- * generate wedpr-model config success, agency: agency0, deploy_dir: wedpr-example, service_type: wedpr-model -----------
----------- * generate wedpr-model config, agency: agency1, deploy_dir: wedpr-example, service_config: **ServiceConfig: deploy_ip: ['192.168.1.2:2'], agency: agency1, server_start_port: 28000,service_type: wedpr-model
** -----------
----------- * generate wedpr-model config, deploy_ip: 192.168.1.2, node_index: 0, agency_index: 1,node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-model/wedpr-model-node0 -----------
* no need to generate the shell script in docker-mode!
* no need to copy the wedpr-model source code for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-model/wedpr-model-node0
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-model/wedpr-model-node0
----------- * generate wedpr-model config, deploy_ip: 192.168.1.2, node_index: 1, agency_index: 1,node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-model/wedpr-model-node1 -----------
* no need to generate the shell script in docker-mode!
* no need to copy the wedpr-model source code for docker-mode!
* generate docker scripts, node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-model/wedpr-model-node1
* generate docker scripts success, node_path: wedpr-generated/wedpr-example/agency1/192.168.1.2/wedpr-model/wedpr-model-node1
----------- * generate wedpr-model config success, agency: agency1, deploy_dir: wedpr-example, service_type: wedpr-model -----------
```

最终生成的所有配置位于`wedpr-generated/wedpr-example`目录下，目录结果如下:

```bash
tree -d -L 3
.
├── agency0
│   ├── 127.0.0.1
│   │   └── wedpr-mpc
│   └── 192.168.1.2
│       ├── wedpr-gateway
│       ├── wedpr-jupyter-worker
│       ├── wedpr-model
│       ├── wedpr-mpc
│       ├── wedpr-node
│       ├── wedpr-pir
│       └── wedpr-site
├── agency1
│   ├── 127.0.0.1
│   │   └── wedpr-mpc
│   └── 192.168.1.2
│       ├── wedpr-gateway
│       ├── wedpr-jupyter-worker
│       ├── wedpr-model
│       ├── wedpr-mpc
│       ├── wedpr-node
│       ├── wedpr-pir
│       └── wedpr-site
├── wedpr-gateway
│   └── ca
└── wedpr-node
    └── ca

26 directories

 ls -lh agency0/192.168.1.2/wedpr-gateway/node0/*.sh
-rw-r--r--  1 wedpr  wedpr   1.1K 12 13 17:16 agency0/192.168.1.2/wedpr-gateway/node0/create_docker.sh
-rw-r--r--  1 wedpr  wedpr   719B 12 13 17:16 agency0/192.168.1.2/wedpr-gateway/node0/destroy_docker.sh
-rw-r--r--  1 wedpr  wedpr   361B 12 13 17:16 agency0/192.168.1.2/wedpr-gateway/node0/start_docker.sh
-rw-r--r--  1 wedpr  wedpr   358B 12 13 17:16 agency0/192.168.1.2/wedpr-gateway/node0/stop_docker.sh
```

- `agency0`目录下存放机构`agency0`的所有服务配置; `agency1`存放机构`agency1`的所有服务配置
- 每个节点配置下均包含四个脚本:
  - `create_docker.sh`: 创建docker实例
  - `destroy_docker.sh`: 删除docker实例
  - `start_docker.sh`: 启动docker实例
  - `stop_docker.sh`: 关闭docker实例


## 2.5 启动隐私计算服务

```eval_rst
.. note::
   本小节中所述的所有命令，使用默认的机构名agency0和agency1, 在实际使用中，请根据配置的机构名调整命令
```

**步骤一: 创建部署路径，并拷贝所有服务器配置**

```bash
mkdir -p ~/wedpr/ && cp -r ~/wedpr-generated/wedpr-example ~/wedpr  && cd ~/wedpr/wedpr-example
```

**步骤二：初始化站点端DB配置**


```eval_rst
.. note::
   每个机构仅需要初始化一次DB配置
```

```bash
# 切换到配置路径
cd ~/wedpr/wedpr-example
# 找到agency0的初始化脚本路径
find . -name site_init.sh |grep -ia agency0
# 输出路径如下
./agency0/192.168.1.2/wedpr-site/init/site_init.sh
# 执行该路径下的agency0的初始化脚本
bash ./agency0/192.168.1.2/wedpr-site/init/site_init.sh

# 找到agency1的初始化脚本路径
find . -name site_init.sh |grep -ia agency1
# 输出路径如下
./agency1/192.168.1.2/wedpr-site/init/site_init.sh
# 执行该路径下的agency1的初始化脚本
bash ./agency1/192.168.1.2/wedpr-site/init/site_init.sh
```

**步骤三: 创建docker**

```eval_rst
.. note::
   - 首次初始化docker需要使用 ``create_all_dockers.sh`` 脚本创建docker
   - 首次初始化后，需使用 ``start_all_dockers.sh`` 和 ``stop_all_dockers.sh`` 启动和停止docker，谨慎使用 ``destroy_docker.sh`` (该命令会销毁所有容器)
   - 可以通过 ``find . -name create_all_dockers.sh``命令找到所有的docker创建脚本
```

```bash
# 进入到部署路径
cd ~/wedpr/wedpr-example

# 创建agency0的所有容器
# 可以通过 find . -name create_all_dockers.sh |grep -i agency0获取机构agency0的所有容器创建脚本
bash ./agency0/192.168.1.2/wedpr-gateway/create_all_dockers.sh
bash ./agency0/192.168.1.2/wedpr-node/create_all_dockers.sh
bash ./agency0/192.168.1.2/wedpr-site/create_all_dockers.sh
bash ./agency0/192.168.1.2/wedpr-mpc/create_all_dockers.sh
bash ./agency0/192.168.1.2/wedpr-model/create_all_dockers.sh
bash ./agency0/192.168.1.2/wedpr-pir/create_all_dockers.sh
bash ./agency0/192.168.1.2/wedpr-jupyter-worker/create_all_dockers.sh


# 创建agency1的所有docker服务
# 可以通过 find . -name create_all_dockers.sh |grep -i agency1获取机构agency1的所有容器创建脚本
bash ./agency1/192.168.1.2/wedpr-gateway/create_all_dockers.sh
bash ./agency1/127.0.0.1/wedpr-mpc/create_all_dockers.sh
bash ./agency1/192.168.1.2/wedpr-site/create_all_dockers.sh
bash ./agency1/192.168.1.2/wedpr-node/create_all_dockers.sh
bash ./agency1/192.168.1.2/wedpr-mpc/create_all_dockers.sh
bash ./agency1/192.168.1.2/wedpr-model/create_all_dockers.sh
bash ./agency1/192.168.1.2/wedpr-pir/create_all_dockers.sh
bash ./agency1/192.168.1.2/wedpr-jupyter-worker/create_all_dockers.sh
```

**步骤四: 校验隐私服务是否正常启动**

- 通过`docker ps |grep -i wedpr` 命令找到wedpr相关的所有容器，检查是否有容器启动失败。
- 在有服务启动失败的情况下，通过`docker logs`命令查看容器启动失败原因。
- 所有服务的日志均挂载到了每个服务节点目录的logs子目录下，可通过命令 `find . -name logs`找到并查看对应服务节点的日志目录

```eval_rst
.. note::
   - 端口冲突或者依赖服务(如HDFS, 区块链)没有启动是导致服务启动失败的常见原因。若发生了端口冲突，请参考 `服务配置 <../op/config/index.html>`_ 修改端口配置; 启动服务前，请确保服务可正常连接到HDFS、区块链等依赖服务，可通过 ``telnet`` 命令探测连通性
   - 请确认参考步骤二正确初始化了机构站点端的DB配置
```

## 2.6 使用浏览器访问隐私计算平台

为了简化配置，WeDPR在站点端容器内部署了nginx，并挂载了前端，可通过如下命令获取前端访问url:

```bash
# 获取agency0的前端页面访问端口：
cat `find . -name nginx.conf |grep -ia agency0 |grep -ia wedpr-site-node0` |grep -ia listen
# 输出如下, 说明可通过：机器IP:16002的方式从浏览器访问agency0隐私计算平台
listen 16002;

# 获取agency1的前端页面访问端口:
cat `find . -name nginx.conf |grep -ia agency1 |grep -ia wedpr-site-node0` |grep -ia listen
# 输出如下, 说明可通过：机器IP:26002的方式从浏览器访问agency1隐私计算平台
 listen 26002;
```

- 机构`agency0`访问地址: http://${host_ip}:16002/#/login
- 机构`agency1`访问地址: http://${host_ip}:26002/#/login

```eval_rst
.. note::
   - 实际使用中，请将上述url的 ``${host_ip}`` 替换为机器可被浏览器访问的ip地址
   - 若无法访问，请确保以上获取的两个端口已经可开放访问
   - Web页面使用请参考 `用户指南章节 <../manual/interface_ui.html>`_
```

**专家模式下，需要暴露指定端口供浏览器访问Jupyter前端，可通过如下命令获取需要开放的端口列表：**

```bash
# 获取agency0的端口映射信息
 cat `find . -name "create_docker.sh" |grep -ia agency0 | grep -ia wedpr-jupyter-worker` | grep -ia "docker run" | awk -F' ' '{print $9}'
# 获得如下输出，说明需要开放19100-19120范围端口的浏览器访问权限
19100-19120:19100-19120


# 获取agency1的端口映射信息
cat `find . -name "create_docker.sh" |grep -ia agency1 | grep -ia wedpr-jupyter-worker` | grep -ia "docker run" | awk -F' ' '{print $9}'
# 获得如下输出，说明需要开放29100-29120范围端口的浏览器访问权限
29100-29120:29100-29120
```