# 接口文档

## 生成并查看Rust SDK接口文档

在本项目的根目录（即`WeDPR-Lab-Core`目录）中，运行如下命令。

```bash
cargo doc --no-deps
```

以上命令将根据代码中的注释，在`target/doc`子目录中，生成的SDK接口文档。

进入`target/doc`文档目录后，会看到所有SDK相关的包名（包含WeDPR-Lab和其他依赖包），进入以下任意一个包名的目录，用网页浏览器打开其中的`index.html`文件，便可查看WeDPR-Lab相关的接口说明。
