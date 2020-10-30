# iOS SDK

## 环境依赖

WeDPR Lab iOS SDK 依赖如下：

| 依赖软件 | 支持版本 |
| :-: | :-: |
| xcode-toolchain | 12.1 |

## 快速体验

编译项目前，需要准备好`xcode、安装cocoapods，并注册ios开发者账号`。

- 下载仓库

```bash
git clone https://github.com/WeBankBlockchain/WeDPR-Lab-iOS-SDK.git && cd ./WeDPR-Lab-iOS-SDK
```

- 获取静态库：访问[依赖库地址](https://github.com/WeBankBlockchain/WeDPR-Lab-Core/releases/tag/v1.1.0)页面下载ios_sdk_static_lib.tar.gz 与 OpenSSL.tar.gz，并解压

- 添加静态库至xcode：将libffi_c_crypto.a与libffi_c_vcl.a添加至xcode
- 查看demo：查看ViewController.m了解demo调用页面
