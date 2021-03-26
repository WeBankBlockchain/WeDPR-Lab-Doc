# Java SDK

## 环境依赖

WeDPR Lab Java SDK 依赖如下：

| 依赖软件 | 支持版本 |
| :-: | :-: |
| Java | JDK1.8+ |

## 快速体验


### 下载仓库
```
git clone https://github.com/WeBankBlockchain/WeDPR-Lab-Java-SDK.git && cd ./WeDPR-Lab-Java-SDK
```
或
```
git clone https://gitee.com/WeBankBlockchain/WeDPR-Lab-Java-SDK.git && cd ./WeDPR-Lab-Java-SDK
```
### 根据操作系统访问release页面获取对应动态库，以linux为例，支持mac、linux和windows版本
```
curl -LO https://gitee.com/WeBankBlockchain/WeDPR-Lab-Core/releases/v1.2.0-Java-SDK/libffi_java_crypto.so
curl -LO https://gitee.com/WeBankBlockchain/WeDPR-Lab-Core/releases/v1.2.0-Java-SDK/libffi_java_vcl.so
curl -LO https://gitee.com/WeBankBlockchain/WeDPR-Lab-Core/releases/v1.2.0-Java-SDK/libffi_java_scd_1_1.so
```
### 拷贝动态库至加载路径
```
cp ./*.so ./demo/src/main/resources/WeDPR_dynamic_lib
```

### 编译项目
```
bash ./gradlew clean build
```
### 进入项目目录
```
cd demo/dist
```
### 运行demo
```
java -cp "apps/*:conf/:libs/*" com.webank.wedpr.demo.DemoMain
```
