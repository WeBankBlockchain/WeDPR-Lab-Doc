# Android SDK

## 环境依赖

WeDPR Lab Android SDK 依赖如下：

| 依赖软件 | 支持版本 |
| :-: | :-: |
| Java | JDK1.8+ |
| Android Studio | 4.1+ |
| Android NDK | 21+ |

## 快速体验

编译项目前，需要准备好`Android Studio、并安装NDK`。

- 下载仓库

```bash
git clone https://github.com/WeBankBlockchain/WeDPR-Lab-Android-SDK.git && cd ./WeDPR-Lab-Android-SDK
```

- 获取动态库库：根据需求访问[依赖库地址](https://gitee.com/WeBankBlockchain/WeDPR-Lab-Core/releases/v1.2.0-Android-SDK)页面下载对应版本的动态库

- 拷贝动态库至加载路径：将解压好的动态库放至demo/app/src/main/jniLibs对应路径下

- 编译项目：bash ./gradlew clean build

- 查看demo：查看MainActivity.java
