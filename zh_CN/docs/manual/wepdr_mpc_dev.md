# 9. WeDPR MPC语法参考

## 9.1 联合统计SQL语法参考 
联合统计任务支持通过简洁的SQL语法来定义多方联合计算任务。
### 9.1.1 数据类型
支持数值类型的数据，包括整数和浮点数。数据表必须包含id列，表中不允许出现空值，合法的数据示例如下：
| **id**       | **age** | **tax**|   **accumulation_fund**|
| ------------ | --------|---------- | -------|
| **9527**     | 30 | 100000        | 150000 |
| **9528**     | 35 | 200000        | 300000 |
| **9529**     | 40 | 400000        | 600000 |

### 9.1.2 语法
基础语句：SELECT、FROM、WHERE、JOIN、INNER JOIN、ON、AS
复杂特性：GROUP BY
运算符合：+、-、*、/、>、<、==
聚合函数：COUNT、SUM、AVG、MAX、MIN

### 9.1.3 聚合函数
| 聚合函数 | 描述         |
|----------|------------|
| COUNT    | 用于统计数据数目 |
| SUM      | 用于计算数据之和 |
| AVG      | 用于计算平均值   |
| MAX      | 用于计算最大值   |
| MIN      | 用于计算最小值   |


#### SELECT

SELECT 语句用于从数据库中选取数据。SELECT 语句用于从数据库中选取数据。结果被存储在一个结果表中，称为结果集。

```sql
SELECT column1, column2, ...
FROM table_name;
```

与

```sql
SELECT * FROM table_name;
```

**参数说明：**

- **column1, column2, ...**：要选择的字段名称，可以为多个字段。如果不指定字段名称，则会选择所有字段。
- **table_name**：要查询的表名称。
- `*`: 通配符，表示选择表中的所有列。

#### WHERE

WHERE 子句用于提取那些满足指定条件的记录。

```sql
SELECT column1, column2, ...
FROM table_name
WHERE condition;
```

参数说明：

- **column1, column2, ...**：要选择的字段名称，可以为多个字段。如果不指定字段名称，则会选择所有字段。
- **table_name**：要查询的表名称。

#### JOIN

SQL join 用于把来自两个或多个表的行结合起来。

SQL JOIN 子句用于把来自两个或多个表的行结合起来，基于这些表之间的共同字段。

**SQL INNER JOIN**。 

SQL INNER JOIN 从多个表中返回满足 JOIN 条件的所有行。

```sql
SELECT column1, column2, ...
FROM table1
JOIN table2 ON condition;
```

- **column1, column2, ...**：要选择的字段名称，可以为多个字段。如果不指定字段名称，则会选择所有字段。
- **table1**：要连接的第一个表。
- **table2**：要连接的第二个表。
- **condition**：连接条件，用于指定连接方式。

```sql
SELECT column_name(s)
FROM table1
INNER JOIN table2
ON table1.column_name=table2.column_name;
```

#### 别名 AS

通过使用 SQL，可以为表名称或列名称指定别名。

通过使用 SQL，可以为表名称或列名称指定别名。

基本上，创建别名是为了让列名称的可读性更强。

列别名

```sql
SELECT column_name AS alias_name
FROM table_name;
```

表别名

```sql
SELECT column_name(s)
FROM table_name AS alias_name;
```

#### GROUP BY

GROUP BY 语句用于结合聚合函数，根据一个或多个列对结果集进行分组

```sql
SELECT column_name, aggregate_function(column_name)
FROM table_name
WHERE column_name operator value
GROUP BY column_name;
```

#### COUNT

COUNT() 函数返回匹配指定条件的行数。

```sql
SELECT COUNT(column_name) FROM table_name;
```

#### MAX

MAX() 函数返回指定列的最大值。

```sql
SELECT MAX(column_name) FROM table_name;
```

#### MIN

MIN() 函数返回指定列的最小值。

```sql
SELECT MIN(column_name) FROM table_name;
```

#### SUM

SUM() 函数返回数值列的总数。

```sql
SELECT SUM(column_name) FROM table_name;
```

#### AVG

AVG() 函数返回数值列的平均值。

```sql
SELECT AVG(column_name) FROM table_name
```

### 9.1.4 简单使用示例
以三方求和为例，对应的SQL语句为：
```sql
SELECT source0.field0 + source1.field0 + source2.field0 as total_balance
FROM source0,
     source1,
     source2
WHERE source0.id = source1.id = source2.id;
```
使用GROUP BY的示例：
```sql
SELECT s1.field4 AS r0,
       COUNT(s1.field4) AS 'count',
       AVG(s0.field1) * 2 + s1.field4 AS r1,
       (SUM(s0.field2) + SUM(s1.field2))/(COUNT(s1.field4) + 100/(MIN(s0.field1)+MIN(s1.field1))) + 10,
       MAX(s1.field1),
       MIN(s2.field2)
FROM (source0 AS s0
      INNER JOIN source1 AS s1 ON s0.id = s1.id)
INNER JOIN source2 AS s2 ON s0.id = s2.id
GROUP BY s1.field4
```

### 9.1.5 综合使用示例
```sql
# 使用了数据源（source0, source1, source2）来计算两个结果（r0 和 r1），并将它们作为新的列返回
SELECT 3*(s1.field3 + s2.field3) - s0.field3 AS r0,

​       (s0.field1 + s2.field1) / 2 * s1.field1 AS r1

FROM (source0 AS s0

​      INNER JOIN source1 AS s1 ON s0.id = s1.id)

INNER JOIN source2 AS s2 ON s0.id = s2.id;
```

1. 查询选择的列:

- r0: 这是通过计算得到的一个新列，计算方法是 3*(s1.field3 + s2.field3) - s0.field3。
- r1: 这是另一个新列，计算方法是 ((s0.field1 + s2.field1) / 2) * s1.field1。

2. FROM子句:

- source0 AS s0: 这是查询的主数据源，被别名为 s0。
- source1 AS s1 和 source2 AS s2: 这是另外两个要连接的数据源，分别被别名为 s1 和 s2。

3. INNER JOIN子句:

- 第一个 INNER JOIN 是 source1 AS s1 与 source0 AS s0 的连接，连接条件是 s0.id = s1.id，意味着只有在 id 字段匹配的情况下，来自 source1 和 source0 的记录才会被包括在结果集中。

- 第二个 INNER JOIN 是 source2 AS s2 与已经连接的 (source0 AS s0 INNER JOIN source1 AS s1) 的连接，连接条件同样是 s0.id = s2.id。

4. 计算逻辑:

- 对于 r0:
  - 从 source1 和 source2 中选择 field3 字段的值，将它们相加。
  - 将这个和乘以3。
  - 从结果中减去 source0 中的 field3 字段值。
- 对于 r1:
  - 从 source0 和 source2 中选择 field1 字段的值，将它们相加。
  - 将这个和除以2，得到平均值。
  - 将这个平均值与 source1 中的 field1 字段值相乘。

5. 结果:

- 查询结果将包含两列：r0 和 r1，每一行的数据都是基于连接的三个数据源和上述计算逻辑得出的。

```sql
SELECT 3*s1.field4 AS r0,
       COUNT(s1.field4) AS 'count',
       AVG(s0.field1) * 2 + s1.field4 AS r1,
       (SUM(s0.field2) + SUM(s1.field2))/(COUNT(s1.field3) + 100/(MIN(s0.field1)+MIN(s1.field1))) + 10,
       MAX(s1.field1),
       MIN(s2.field2)
FROM (source0 AS s0
      INNER JOIN source1 AS s1 ON s0.id = s1.id)
INNER JOIN source2 AS s2 ON s0.id = s2.id
GROUP BY s1.field4;
```

这段SQL查询代码使用了数据源（`source0`, `source1`, `source2`）进行连接，并基于这些数据源的字段执行一系列聚合计算，最后根据`source1`中的`field4`字段值进行分组。下面是对这段SQL的详细解释：

1. **选择列表**:
   - `3*s1.field4 AS r0`: 选择`source1`中的`field4`字段值，乘以3，并将结果命名为`r0`。
   - `COUNT(s1.field4) AS 'count'`: 计算`source1`中`field4`字段值的出现次数，并将结果命名为`count`。注意，由于使用了单引号，列名实际上是`'count'`，这在某些数据库系统中可能不是有效的列名。
   - `AVG(s0.field1) * 2 + s1.field4 AS r1`: 计算`source0`中`field1`字段值的平均值，乘以2后加上`source1`的`field4`字段值，结果命名为`r1`。
   - `(SUM(s0.field2) + SUM(s1.field2)) / (COUNT(s1.field3) + 100 / (MIN(s0.field1) + MIN(s1.field1))) + 10`: 这是一个复杂的表达式，首先计算`source0`和`source1`中`field2`字段值的总和，然后除以`source1`中`field3`字段值的出现次数加上100除以`source0`和`source1`中`field1`字段值的最小值之和，最后结果加上10。
   - `MAX(s1.field1)`: 计算`source1`中`field1`字段值的最大值。
   - `MIN(s2.field2)`: 计算`source2`中`field2`字段值的最小值。

2. **FROM子句**:
   - `source0 AS s0`: 这是查询的主数据源，别名为`s0`。
   - `source1 AS s1` 和 `source2 AS s2`: 这是另外两个要连接的数据源，别名分别为`s1`和`s2`。

3. **INNER JOIN子句**:
   - `INNER JOIN source1 AS s1 ON s0.id = s1.id`: 将`source1`与`source0`连接，条件是两个数据源的`id`字段相等。
   - `INNER JOIN source2 AS s2 ON s0.id = s2.id`: 将`source2`与已经连接的`source0`和`source1`的组合连接，条件同样是`id`字段相等。

4. **GROUP BY子句**:
   - `GROUP BY s1.field4`: 根据`source1`中的`field4`字段值对结果进行分组。这意味着SELECT语句中的聚合函数（如COUNT, AVG, SUM, MAX, MIN）将在每个`field4`值的分组上分别计算。

5. **结果**:
   - 查询结果将为每个`field4`值的分组返回多列数据：`r0`, `'count'`, `r1`, 复杂表达式的结果，`MAX(s1.field1)`, 和 `MIN(s2.field2)`。


## 9.2 自定义计算语法参考 
自定义计算语法可以使用类似python语法方式，自定义计算逻辑，通过自定义任务进行多方安全计算。联合统计的SQL执行之前平台会将SQL解析成自定义计算任务，然后执行该任务。
### 9.2.1 数据类型

| **数据类型** | **描述**                                        | **示例**                       |
| ------------ | ----------------------------------------------- | ------------------------------ |
| **pint**     | 秘密数据整数类型，如pint(1)、pint(-1)、pint(10) | a = pint(1)b = pint(-1)        |
| **pnum**     | 秘密数据默认数据类型，等同于pfloat              | a = pnum(1.2) b = pnum(2)      |
| **pfix**     | 秘密数据定点数类型，如pfix(1.1)、 pfix(-2)      | a = pfix(1.1) b = pfix(-2)     |
| **pfloat**   | 秘密数据浮点数类型，如pfloat(1.1)、 pfloat(-2)  | a = pfloat(1.1) b = pfloat(-2) |

|              | **pint** | **pfix** | **pfloat（pnum）** |
| ------------ | -------- | -------- | ------------------ |
| **支持小数** | 否       | 是       | 是                 |
| **数据精度** | -        | 可配置   | 高                 |
| **性能**     | 高       | 中       | 低                 |

- pfix类型设置精度
  - pfix.set_precision(n,m)
    - n 小数部分的位数长度（初始默认值为16）
    - m 定点数的总位数长度，如果没有指定，默认为`f`的两倍（初始默认值为31）。

高级类型

- 不可变数组Array：ppc的数组仅为数据的存储形式，运算时请对单个元素进行操作，
- 不可变而为数组Matrix：ppc的数组仅为数据的存储形式，运算时请对单个元素进行操作

### 9.2.2 语法
WeDPR自定义计算明文数据语法与Python类似。所有秘密数据类型均支持以下操作。
#### 9.2.2.1 运算符
支持加+、减-、乘*、除/（整数类型pint为//）、取模%（仅限整数类型pint）运算
```python
a_int = pint(1)
b_int = pint(-1)
c_int = a_int + b_int

a_fix = pfix(1.1)
b_fix = pfix(-2)
c_fix = a_fix * b_fix

a_float = pfloat(1.1)
b_float = pfloat(-2)
c_float = a_float/b_float
```
#### 9.2.2.2 读取数据，支持读取为数组以及矩阵
 - 读取秘密输入为数组：read_array

`read_array(party_id, source_record_count, value_type=pnum)`

读取数据源数据输入为秘密数组

- 参数
  - party_id: 数据方id
  - source_record_count：读取的数据条数
  - value_type：数据类型，包括pint、pfix、pfloat、pnum，默认类型为pnum

- 返回值
  - Array(数据类型)：不可变数组类型，通过.length访问长度

**注意：** 读取数据时，可以不用在算法文件中写具体记录数，使用占位符`$(source{参与方序号}_record_count)`代替，例如`$(source0_record_count)`，表示读取第0方所有行数据。 
。
- 示例
```python
source0_record = read_array(SOURCE0, 1, pfix)
source1_record = read_array(SOURCE1, 2, pfix)
source2_record = read_array(SOURCE2, 3, pfloat)
# 使用数据
c_fix = source0_record[0] + source1_record[0]
c = c_fix.reveal()
```

```python
source0_record = read_array(SOURCE0, 1, pint)
a = source0_record.length
# a = 1
```

- 读取数据为矩阵 read_matrix

`read_matrix(party_id, height, width, value_type=pnum)`

读取数据源数据输入为秘密数组

- 参数
  - party_id: 数据方id
  - height：读取的矩阵行数
  - width：读取的矩阵列数
  - value_type：数据类型，包括pint、pfix、pfloat、pnum，默认类型为pnum

- 返回值
  - Matrix(数据类型)：不可变矩阵类型，通过.sizes访问长度
- 示例

```python
source0_record = read_matrix(SOURCE0, 1,1, pfix)
source1_record = read_matrix(SOURCE1, 2,1, pfix)
source2_record = read_matrix(SOURCE2, 3,2, pfloat)
# 使用数据
c_fix = source0_record[0][0] + source1_record[0][1]
c = c_fix.reveal()
```

```python
source0_record = read_matrix(SOURCE0, 1, 2, pint)
a = source0_record.sizes[0]
b = source0_record.sizes[1]
# a = 1, b = 2
```

#### 9.2.2.3 披露明文结果
`reveal(data)`

将秘密数据转换明文

- 参数
  - data: 秘密数据
- 返回值
  - 明文数据，如int、fix、float

- 示例
```python
a_int = pint(1)
b_int = pint(-1)
c_int = a_int + b_int
display_data([c_int.reveal()])
```

### 9.2.3 工具函数
针对密文数据类型，PPC提供了多种工具函数，分别如下：
#### 9.2.3.1 条件判断：condition
```python
a = pint(1)
b = pint(2)
c = condition(a > b, a, b)
# c is pint(2)
```

#### 9.2.3.2 合并两个秘密数组combine_array
```python
source0_record = read_array(SOURCE0, 1, pint) # read pint(1)
source1_record = read_array(SOURCE1, 1, pint) # read pint(2)
array_result = combine_array(source0_record, source1_record)
# array_result is [pint(1), pint(2)]
```

#### 9.2.3.3 返回秘密数组中的最大值max_in_array，最小值min_in_array
```python
source0_record = read_array(SOURCE0, 1, pint) # read pint(4)
source1_record = read_array(SOURCE1, 1, pint) # read pint(5)
array_result = combine_array(source0_record, source1_record)
# array_result is [pint(4), pint(5)]
              
max_value, max_index = max_in_array(array_result)
# max_value = pint(5) max_index = pint(1)
 min_value, min_index = min_in_array(array_result)
# min_value = pint(4) min_index = pint(0)
```

#### 9.2.3.4 结果输出
`display_data(data)`

将明文结果展示

- 参数
  - data: 明文数据
- 示例

```python
a_int = pint(1)
b_int = pint(-1)
c_int = a_int + b_int
c = c_int.reveal()
display_data([c_int.reveal()])
```

`set_display_field_names(data)`

设置输出列表中的列名

- 参数
  - data: 字段列名数组

`display_array(data)`

将秘密数组展示

- 参数
  - data: 秘密数组
- 示例

```python
# 输出数组
data_array = read_array(SOURCE0, 3)
set_display_field_names(["age", "salary", "score"])
display_array(data_array)
```

`display_matrix(data)`

将秘密矩阵展示

- 参数
  - data: 秘密矩阵
- 示例

```python
# 输出矩阵
data_matrix = read_matrix(SOURCE0, 2, 3)
set_display_field_names(["age", "salary", "score"])
display_matrix(data_matrix)
```

### 9.2.4 自定义计算简单示例
下面是一个模拟2方比较(经典的百万富翁问题)的逻辑，安全比较两方数值的大小
```python
# 定义两方参与
SOURCE0 = 0
SOURCE1 = 1

# sourceX_record_count和sourceX_column_count为wedpr读取数据时的关键字，系统会根据填写的行列进行数据预处理
# 读取数据源0第1列数据(具体指id列之后的第1列)
source0_record_count=$(source0_record_count)
source0_column_count=1
source0_record = read_array(SOURCE0, source0_record_count, pint)

source1_record_count=$(source1_record_count)
source1_column_count=1
source1_record = read_array(SOURCE1, source1_record_count, pint)

# 定义计算模块
def wedpr_main(source0_record, source1_record):
    # 比较大小，条件判断
    result_value = condition(source0_record[0] > source1_record[0], 1, 0)
    # 输出结果，输出1表示结果接收方大，输出0表示另一方大
    set_display_field_names(["is_winner"])
    display_data([result_value.reveal()])

wedpr_main(source0_record, source1_record)
```

### 9.2.5 自定义计算综合示例
下面是一个模拟三方投票的逻辑，每一方给一个候选项投一个数值
```python
# 定义三方参与
SOURCE0 = 0
SOURCE1 = 1
SOURCE2 = 2

# sourceX_record_count和sourceX_column_count为wedpr读取数据时的关键字，系统会根据填写的行列进行数据预处理
# 读取数据源0第1列数据(具体指id列之后的第1列)
source0_record_count=$(source0_record_count)
source0_column_count=1
# 读取数据源1的前1列数据
source1_record_count=$(source1_record_count)
source1_column_count=1
# 读取数据源2的前1列数据
source2_record_count=$(source2_record_count)
source2_column_count=1

# 读取数据为数组
candidate_count = 3
source0_record = read_array(SOURCE0, candidate_count, pint)
source1_record = read_array(SOURCE1, candidate_count, pint)
source2_record = read_array(SOURCE2, candidate_count, pint)

def wedpr_main(source0_record, source1_record, source2_record):

    candidate0 = source0_record[0] + source1_record[0] + source2_record[0]
    candidate1 = source0_record[1] + source1_record[1] + source2_record[1]
    candidate2 = source0_record[2] + source1_record[2] + source2_record[2]

    set_display_field_names(["candidate1", "candidate2", "candidate3"])
    display_data([candidate0.reveal(),candidate1.reveal(),candidate2.reveal()])

wedpr_main(source0_record, source1_record, source2_record)
```