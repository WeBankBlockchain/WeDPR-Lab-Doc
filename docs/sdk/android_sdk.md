# Android SDK

## 环境依赖

WeDPR Lab Android SDK 依赖如下：

| 依赖软件 | 支持版本 |
| :-: | :-: |
| JAVA | JDK1.8+ |
| Android Studio | 4.1+ |

## 快速体验

- 下载仓库

```bash
git clone https://github.com/WeBankBlockchain/WeDPR-Lab-Android-SDK.git && cd ./WeDPR-Lab-Android-SDK
```

- 获取动态库库：根据需求访问 `https://github.com/WeBankBlockchain/WeDPR-Lab-Android-SDK`的release页面下载wedpr_android_arm64_v8a_libs.tar.gz 或 wedpr_android_armeabi_v7a_libs.tar.gz

- 解压：tar zxvf wedpr_android_*_libs.tar
- 拷贝动态库至加载路径：将解压好的动态库放至jniLibs对应路径下

- 编译项目：bash ./gradlew clean build

- 查看demo：查看MainActivity.java
