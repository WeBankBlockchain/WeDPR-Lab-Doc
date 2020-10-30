# Android SDK

## 环境依赖

WeDPR Lab Android SDK 依赖如下：

| 依赖软件 | 支持版本 |
| :-: | :-: |
| JAVA | JDK1.8+ |
| Android Studio | 4.1+ |

## 快速体验

编译项目前，需要准备好`Android Studio、并安装NDK`。

- 下载仓库

```bash
git clone https://github.com/WeBankBlockchain/WeDPR-Lab-Android-SDK.git && cd ./WeDPR-Lab-Android-SDK
```

- 获取动态库库：根据需求访问[依赖库地址](https://github.com/WeBankBlockchain/WeDPR-Lab-Core/releases/tag/v1.1.0)页面下载android_sdk_dynamic_lib_arm64_v8a.tar.gz 或 android_sdk_dynamic_lib_armeabi_v7a.tar.gz，并解压

- 拷贝动态库至加载路径：将解压好的动态库放至demo/app/src/main/jniLibs对应路径下

- 编译项目：bash ./gradlew clean build

- 查看demo：查看MainActivity.java
