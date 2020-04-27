<h1 align="center">Ant Design Pro</h1>

<div align="center">
基于antd pro的前端毕业设计
</div>

This project is initialized with [Ant Design Pro](https://pro.ant.design). Follow is the quick guide for how to use.

## Environment Prepare

Install `node_modules`:

```bash
npm install
```

## Provided Scripts

Ant Design Pro provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```
## Flow Process
![流程概念图](C:\Users\ymyum\OneDrive\学年设计\捕获.PNG)

## Design Blocks

### Home

### Item

##### Commodity
实现   
问题：  
1.多选时会出现选择不当问题（你点击其他行时都会选中第一行）  
解决：加上rowKey={record => record.id}
2.

### Dispatch

##### map

连接百度地图api，实现搜索、定位、路线规划  
参考资料：  
1. [B站视频-爱尚学院讲师](https://www.bilibili.com/video/av56228042?from=search&seid=3488583008774048375)  
2. [官方高德地图文档](https://github.com/ElemeFE/react-amap)

