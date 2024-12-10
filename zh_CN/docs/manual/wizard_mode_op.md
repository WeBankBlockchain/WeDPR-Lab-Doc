# 4. 隐私计算任务操作指引(向导模式)

标签: ``向导模式`` ``操作指南``

----

WeDPR中，用户参考[项目空间](./project_op.md)创建项目后，可在项目空间内发起各种类型的隐私计算任务，目前平台支持的隐私计算任务如下:

<img src="../../manual/tasks/tasks.png" style="zoom:40%;" />

如下，项目空间内，可新建任务、查询任务、终止任务、复制任务，对于建模类的任务还可调参重跑。

![](../../images/manual/tasks/job.png)


## 4.1 新建任务

由于任务须归属于某个项目，因此发起所有类型任务之前，首先需要选定一个项目，操作步骤如下：

- 用户登录WeDPR管理平台，单击左侧导航栏中的【项目空间】进入到项目列表页面；
- 选择需要发起任务的项目卡片，单击进入【项目详情】页面
- 单击右上角的【新建任务】按钮可发起任务



### 4.1.1 数据对齐任务

```eval_rst
.. note::
   - 数据对齐仅支持对不同机构的数据集进行隐私求交集，同一机构的多个数据集无法进行运行PSI
   - 数据对齐任务中，须包含己方机构的数据集，不可全部选择他方机构数据集运行PSI任务
```

**使用前提**
****
- 已申请需要联合求交集的数据集使用权限，申请步骤可参考[数据集操作指引](dataset_op.md)中的**申请数据集权限**。

**操作步骤**
****
- 单击【项目详情】页面右上角的【新建任务按钮】，进入到【新增任务页面】，开始选择任务模板

- 选择【数据对齐】任务模板，单击【下一步】进入到【选择数据资源】页面

- 单击【选择参与方数据1】标签页，弹出【选择参与方】对话框，从中选择本机构的数据集，单击右下角的【确定】按钮，回到【选择数据资源】页面

- 单击【选择参与方数据2】标签，同样弹出【选择参与方】对话框，从中其他机构数据集

- WeDPR隐私计算平台支持>=2个参与方的隐私求交集任务，若还需要添加第三个甚至第四个机构的数据集，可单击【增加参与方】按钮继续新增参与PSI任务的数据集

- 数据资源选择完毕后，单击【下一步】进入到【配置并运行】页面，在该页面的【选择数据字段】对话框的【包含字段】列选择用于参与隐私求交集任务的数据列名

- 在【配置并运行】页面的【结果接收方】选项框中选择需要接收隐私求交集的结果的机构名称，单击【运行】发起数据对齐任务

<img src="../../manual/tasks/psi.png" style="zoom:60%;" />


### 4.1.2 匿踪查询任务

**使用前提**
****
- 拥有至少一个匿踪查询服务的使用权限，匿踪查询服务发布、权限申请可参考[这里](./service_publish_op.md)


**操作步骤**
****
- 单击【项目详情】页面右上角的【新建任务按钮】，进入到【新增任务页面】，选择【匿踪查询】任务模板:

<img src="../../manual/tasks/pir/pir_template.png" style="zoom:40%;" />

- 单击【下一步】进入到【选择数据】页面，从已经发布成功的服务中选择需要查询的服务：

<img src="../../manual/tasks/pir/pir_select_service.png" style="zoom:60%;" />


- 单击【下一步】进入到【配置并运行页面】，配置PIR任务，配置的参数主要包括：

| **参数名称** |           **参数说明**           |
|:--------:|:----------------------------:|
|   查询类型   |       包括查询存在性和查询字段值两类        |
|   查询字段   |    选择【查询字段值】时，选择需要查询的字段列表    |
|   字段值    | 需要查询的记录主键值，一般是姓名、身份证号、社会信用号等 |

配置示例如下:

<img src="../../manual/tasks/pir/pir_config.png" style="zoom:60%;" />



- 单击【运行】发起匿踪查询服务，匿踪查询服务详情如下：

<img src="../../manual/tasks/pir/pir_job.png" style="zoom:60%;" />

pir任务结果记录于csv文件中，任务执行完毕后，可通过【任务信息】中的【任务结果】->【结果文件】下载匿踪查询结果，如下：

<img src="../../manual/tasks/pir/pir_result.png" style="zoom:40%;" />


### 4.1.3 联表分析任务
--- TODO: 补充
### 4.1.4 自定义计算任务
--- TODO: 补充

### 4.1.5 SecureLGBM训练任务

**使用前提**
****
- 已申请需要联合建模的数据集使用权限，申请步骤可参考[数据集操作指引](dataset_op.md)中的**申请数据集权限**。
- 参与SecureLGBM训练任务的数据集须是合法的数据集，不能包含除了`nan`之外的非法字符
- 至少有一个数据集有标签`y`


**操作步骤**
****
- 单击【项目详情】页面右上角的【新建任务按钮】，进入到【新增任务页面】，选择【SecureLGBM训练】任务模板
- 单击【下一步】进入到【选择数据资源】页面，单击选择标签数据和参与方数据，如下:
<img src="../../manual/tasks/xgb/xgb_train_select_data.png" style="zoom:40%;" />

- 选择参与建模的数据集后，单击[下一步]进入到【配置并运行】页面，设置建模参数，SecureLGBM支持的建模参数包括：

| **参数名称**  |          **参数说明**           | **默认值** |
|:---------:|:---------------------------:| :----------------------------:|
|  use_psi  |             ||
|  fillna   |                             ||
| na_select |                             ||
| normalized |                             ||
| standardized |                             ||
| psi_select_col |                             ||
| psi_select_base |                             ||
| psi_select_thresh |                             ||
| psi_select_bins |                             ||
| corr_select |                             ||
| use_iv |                             ||
| group_num |                             ||
| iv_thresh |                             ||
| use_goss |                             ||
| test_dataset_percentage |                             ||
| learning_rate |                             ||
| num_trees |                             ||
| max_depth |                             ||
| max_bin |                             ||
| silent |                             ||
| subsample |                             ||
| colsample_bytree |                             ||
| colsample_bylevel |                             ||
| reg_alpha |                             ||
| reg_lambda |                             ||
| gamma |                             ||
| min_child_weight |                             ||
| min_child_samples |                             ||
| seed |                             ||
| early_stopping_rounds |                             ||
| eval_metric |                             ||
| verbose_eval |                             ||
| eval_set_column |                             ||
| train_set_value |                             ||
| eval_set_value |                             ||
| train_features |                             ||

配置示例如下:
![](../../images/manual/tasks/xgb/xgb_train_submit.png)

- 单击【运行】按钮发起SecureLGBM训练任务，任务元信息如下:

![](../../images/manual/tasks/xgb/xgb_train_detai.png)

SecureLGBM任务执行结束后，可通过【任务详情】按钮查看可视化的训练结果。
>>>>>>> wedpr/dev-3.0

| **参数名称**  |          **参数说明**           | **默认值** |
|:---------:|:---------------------------:| :----------------------------:|
|  use_psi  |             ||
|  fillna   |                             ||
| na_select |                             ||
| normalized |                             ||
| standardized |                             ||
| psi_select_col |                             ||
| psi_select_base |                             ||
| psi_select_thresh |                             ||
| psi_select_bins |                             ||
| corr_select |                             ||
| use_iv |                             ||
| group_num |                             ||
| iv_thresh |                             ||
| use_goss |                             ||
| test_dataset_percentage |                             ||
| learning_rate |                             ||
| num_trees |                             ||
| max_depth |                             ||
| max_bin |                             ||
| silent |                             ||
| subsample |                             ||
| colsample_bytree |                             ||
| colsample_bylevel |                             ||
| reg_alpha |                             ||
| reg_lambda |                             ||
| gamma |                             ||
| min_child_weight |                             ||
| min_child_samples |                             ||
| seed |                             ||
| early_stopping_rounds |                             ||
| eval_metric |                             ||
| verbose_eval |                             ||
| eval_set_column |                             ||
| train_set_value |                             ||
| eval_set_value |                             ||
| train_features |                             ||

配置示例如下:

<img src="../../manual/tasks/xgb/xgb_train_submit.png" style="zoom:40%;" />

- 单击【运行】按钮发起SecureLGBM训练任务，任务元信息如下:

<img src="../../manual/tasks/xgb/xgb_train_detai.png" style="zoom:50%;" />

SecureLGBM任务执行结束后，可通过【任务详情】按钮查看可视化的训练结果。

### 4.1.6 SecureLGBM预测任务

### 4.1.7 SecureLR建模任务


### 4.1.8 SecureLR预测任务

## 4.2 查询任务

## 4.3 任务相关操作
