# 7. 凭证管理

标签: ``凭证`` ``API接入``

----

WeDPR管理平台支持第三方应用通过API的方式接入，应用访问平台API时，需要带上使用访问凭证生成的签名信息。管理台支持凭证管理，包括创建、查询、启用和禁用凭证。

```eval_rst
.. note::
   - 生成的凭证和登录用户绑定，可访问其绑定用户对应的项目、数据集、任务、服务等所有资源
```

<img src="../../manual/credential/credential.png" style="zoom:40%;" />


*******
## 7.1 创建并启用凭证

- 单击左侧导航栏的【凭证管理】进入到凭证管理页面
- 单击右上角【+创建AccessKey】按钮，弹出创建AccessKey的对话框，在对话框中输入凭证的【描述信息】,单击【确定】，即可生成凭证
- 出于安全考虑，新建的凭证默认是禁用状态，可单击【操作】列的【启用】按钮启用凭证
- 若想获取凭证的所有信息，可单击【操作】列的【复制】按钮复制凭证


## 7.2 使用凭证生成签名信息

凭证包括如下信息：

- `AccesssID`: 访问凭证的ID
- `Access Secret`: 访问凭证密钥

生成凭证后，可使用凭证生成访问API的签名信息，签名生成规则：


```eval_rst
.. note::
   - Python语言的API签名生成方法可参考 `这里 <https://github.com/WeBankBlockchain/WeDPR-Component/blob/main/python/wedpr_ml_toolkit/wedpr_ml_toolkit/transport/credential_generator.py>`_
   - Java语言的API签名生成方法可参考 `这里 <https://github.com/WeBankBlockchain/WeDPR/blob/feature-milestone2/wedpr-components/api-credential/src/main/java/com/webank/wedpr/components/api/credential/core/impl/CredentialInfo.java#L68>`_
```

```bash
hash(hash(accessKeyID + nonce + timestamp) + accessKeySecret)
```
- `hash`: hash算法，默认使用sha256哈希算法
- `accessKeyID`：访问凭证ID
- `nonce`: 随机生成的字符串，每次API调用均要随机生成，用于防重放
- `timestamp`: 时间戳，用于防重放，每次API调用均要重新生成
- `accessKeySecret`: 访问凭证私钥

生成签名后，可通过在每个API接口后面加如下参数调用API(API接口列表可参考[这里](../api/index.html)):
- `hashAlgorithm`: 使用的hash算法，默认使用`SHA-256`算法
- `accessKeyID`: 访问凭证ID
- `nonce`: nonce
- `timestamp`: 时间戳
- `signature`: 签名

