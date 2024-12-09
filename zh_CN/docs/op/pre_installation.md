# 1. 依赖环境搭建


WeDPR隐私计算平台搭建前，需准备好[MYSQL](https://hub.docker.com/_/mysql), [HDFS](https://github.com/apache/hadoop/tree/trunk)和[FISCO BCOS v3.0]((https://fisco-bcos-doc.readthedocs.io/zh-cn/latest/index.html))区块链系统环境，

```eval_rst
.. note::
   - MySQL可选用Docker安装方式
   - HDFS的详细搭建流程参考 `这里 <https://hadoop.apache.org/docs/r1.0.4/cn/cluster_setup.html>`_ 
   - FISCO BCOS v3.0区块链网络搭建指南请参考 `这里 <https://fisco-bcos-doc.readthedocs.io/zh-cn/latest/docs/quick_start/air_installation.html>`_
```

这里以安装单机版本的MySQL、HDFS、FISCO-BCOS区块链系统为例，简单介绍前置依赖搭建步骤。

## 1.1 安装依赖

**安装macos依赖**

```bash
brew install openssl@1.1 curl wget vim
```

**安装ubuntu依赖**

```bash
sudo apt install -y curl openssl wget default-jdk vim
```

**安装centos依赖**

```bash
sudo yum install -y curl openssl openssl-devel wget java-1.8.0-openjdk vim
```

## 1.2 部署MYSQL

```eval_rst
.. note::
   这里使用Docker搭建MySQL环境，请确保您的机器搭建了Docker环境。
```

```bash
# 拉取mysql镜像
docker pull mysql:8

# 启动mysql镜像
# Note: 
# 1. 生产环境可根据实际需求挂载配置、数据目录
# 2. MYSQL_ROOT_PASSWORD参数指定了mysql密码，需根据实际安全需求设置
docker run -p 3306:3306 --name wedpr_mysql -e MYSQL_ROOT_PASSWORD=WeDPR2024 -d mysql
```


## 1.3 部署HDFS

```eval_rst
.. note::
   - HDFS更详细的搭建步骤可参考 `这里 <https://www.alibabacloud.com/help/zh/ecs/use-cases/build-a-hadoop-environment>`_ 
   - 安装HDFS需要有root权限
```
**步骤一：获取hadoop安装包**

```bash
# 下载v3.3.6版本的hadoop安装包
wget https://mirrors.bfsu.edu.cn/apache/hadoop/common/hadoop-3.3.6/hadoop-3.3.6.tar.gz

# 将hadoop安装解压到/opt/hadoop
sudo tar -zxvf hadoop-3.3.6.tar.gz -C /opt/
sudo mv /opt/hadoop-3.3.6 /opt/hadoop
```

**步骤二：配置hadoop环境**

```bash
sudo sh -c "echo 'export HADOOP_HOME=/opt/hadoop' >> /etc/profile"
sudo sh -c "echo 'export PATH=\$PATH:/opt/hadoop/bin' >> /etc/profile"
sudo sh -c "echo 'export PATH=\$PATH:/opt/hadoop/sbin' >> /etc/profile"
source /etc/profile
```

**步骤三：配置hadoop使用的Java环境**

```bash
# 获取java路径
$ which java
# 输出: /usr/bin/java，说明java_home是/user

# 配置JAVA_HOME(这里的路径请根据which java输出的java二进制所在目录调整)
sudo sh -c 'echo "export JAVA_HOME=/usr" >> /opt/hadoop/etc/hadoop/yarn-env.sh'
sudo sh -c 'echo "export JAVA_HOME=/usr" >> /opt/hadoop/etc/hadoop/hadoop-env.sh'

# 检查hadoop是否安装成功, 若安装成功会有对应的版本信息输出
hadoop version
# 输出如下信息表明hadoop安装成功
Hadoop 3.3.6
Source code repository https://github.com/apache/hadoop.git -r 1be78238728da9266a4f88195058f08fd012bf9c
Compiled by ubuntu on 2023-06-18T08:22Z
Compiled on platform linux-x86_64
Compiled with protoc 3.7.1
From source with checksum 5652179ad55f76cb287d9c633bb53bbd
This command was run using /usr/local/hadoop/share/hadoop/common/hadoop-common-3.3.6.jar
```

**步骤四：创建数据存放目录**

```eval_rst
.. note::
   - 请选择容量最大的磁盘存放数据文件
```

```bash
# 选择最大容量的磁盘创建HDFS数据存放目录，这里设为 /data/home/hadoop
# 创建临时数据存放目录
mkdir -p /data/home/hadoop/tmp
# 创建持久化数据存放目录
mkdir -p /data/home/hadoop/data
# 创建name-node持久化数据存放目录
mkdir -p /data/home/hadoop/dfs/name
```

**步骤五：配置core-site.xml**

获取当前机器的内容ip:
```bash
ifconfig
192.168.0.18
```

执行如下命令，进入编辑页面：

```bash
vim /opt/hadoop/etc/hadoop/core-site.xml
```

```eval_rst
.. note::
   实际配置中，请把``fs.defaultFS``中的 ``${HOST_IP}`` 替换为 ``ifconfig`` 获取的内容ip
```

在`<configuration></configuration>`中加入如下配置：

```xml
    <property>
        <name>hadoop.tmp.dir</name>
        <value>file:/data/home/hadoop/tmp</value>
        <description>location to store temporary files</description>
    </property>
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://${HOST_IP}:9000</value>
    </property>
```


**步骤六：配置hdfs-site.xml**

执行如下命令,进入编辑页面：
```bash
vim /opt/hadoop/etc/hadoop/hdfs-site.xml
```
在`<configuration></configuration>`中加入如下配置：
(Note: 这里使用了一个副本)

```xml
<property>
        <name>dfs.replication</name>
        <value>1</value>
    </property>
    <property>
        <name>dfs.namenode.name.dir</name>
        <value>file:/data/home/hadoop/dfs/name</value>
    </property>
    <property>
        <name>dfs.datanode.data.dir</name>
        <value>file:/data/home/hadoop/data</value>
    </property>
    <property>
        <name>dfs.namenode.rpc-bind-host</name>
        <value>0.0.0.0</value>
    </property>
```

**步骤七: 初始化namenode**

```bash
hadoop namenode -format
```

**步骤八: 启动HDFS服务**

```bash
bash start-dfs.sh
```

检查hdfs是否启动成功，请确保如下组件均启动成功。

```eval_rst
.. note::
   - 若某服务启动失败，可通过 ``/opt/hadoop/logs`` 查看具体的诊断信息。
```

```bash
# 检查datanode是否启动成功
 ps aux |grep -ia hadoop |grep -ia datanode
 
 # 检查namenode是否启动成功
 ps aux |grep -ia hadoop |grep -ia namenode |grep -v secondary
 
 # 检查secondary namenode是否启动成功
 ps aux |grep -ia hadoop |grep -ia namenode |grep -i secondary
```

## 1.4 部署区块链系统

```eval_rst
.. note::
   - FISCO BCOS v3.0区块链网络搭建指南请参考 `这里 <https://fisco-bcos-doc.readthedocs.io/zh-cn/latest/docs/quick_start/air_installation.html>`_ 
```

**步骤一: 创建操作目录，下载安装脚本**
(这里以构建v3.11.0版本区块链节点为例)

```bash
# 创建操作目录
cd ~ && mkdir -p fisco && cd fisco
# 下载建链脚本
curl -#LO https://github.com/FISCO-BCOS/FISCO-BCOS/releases/download/v3.11.0/build_chain.sh && chmod u+x build_chain.sh
# Note: 若访问git网速太慢，可尝试如下命令下载建链脚本:
curl -#LO https://gitee.com/FISCO-BCOS/FISCO-BCOS/releases/download/v3.11.0/build_chain.sh && chmod u+x build_chain.sh
```
**步骤二: 搭建单机4节点区块链**

```bash
bash build_chain.sh -l 127.0.0.1:4 -p 30300,20200
```

**步骤三: 启动区块链节点**

```bash
bash nodes/127.0.0.1/start_all.sh
```

**步骤四：检查区块链环境**

```bash
# 检查进程是否启动成功, 预期输出4个区块链节点进程
ps aux |grep -ia fisco-bcos

# 验证网络连接是否正常, 预期每个节点日志输出的connected count均不小于3
tail -f nodes/127.0.0.1/node*/log/* |grep -i "heartBeat,connected count"

# 验证区块链节点共识是否正常, 预期每个节点均有该日志输出
cat nodes/127.0.0.1/node0/log/* |grep -ia "reach.*new.*view"
```