# 1. 硬件和系统要求

标签：``硬件要求`` ``操作系统`` ``开发手册`` ``内存要求``

----

## 硬件要求

完整的WeDPR隐私计算生态系统包括：

- [隐私计算站点端](https://github.com/WeBankBlockchain/WeDPR)
- [隐私计算统一网关](https://github.com/WeBankBlockchain/WeDPR-Component/)
- [隐私计算组件](https://github.com/WeBankBlockchain/WeDPR-Component/)
- [区块链系统FISCO BCOS 3.0](https://fisco-bcos-doc.readthedocs.io/zh-cn/latest/index.html)
- [HDFS](https://github.com/apache/hadoop/tree/trunk)
- [MYSQL](https://hub.docker.com/_/mysql)

同一个机构内，各个组件间采用内网进行通信；隐私计算统一网关之间采用外网进行通信。隐私计算相关组件的推荐机器配置如下：

```eval_rst
.. note::
    - 区块链系统，HDFS和MYSQL的推荐配置可参考各自的官方文档
    - 推荐HDFS部署环境的磁盘空间不小于100GB
```

| **配置** | **最低配置** | **推荐配置** |
|:------:|:--------:|:--------:|
|   内存   |   8GB    |   32GB   |
|   核心   |    4核    |    8核    |
|   带宽   |    内网    |    内网    |
| 带宽(网关) |   5Mb    |   10Mb   |


## 操作系统

- CentOS 7.2+
- Ubuntu 18.04+