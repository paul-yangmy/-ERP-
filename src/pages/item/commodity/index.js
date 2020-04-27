import { connect } from 'dva';
import {
  Table, Card, Divider, Input, message, Button, Popconfirm, Form, Icon, Upload,Avatar, Select, Modal ,Checkbox} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Highlighter from 'react-highlight-words';
//上传
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 文件!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片要小于 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

// 编辑修改子框
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      // console.log(values, { ...record, ...values })
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    // console.log(this.state)
    // console.log(this.props)
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    // console.log(children)
    if (editing) {
      if (dataIndex == "state") {
        return (
          <Form.Item style={{ margin: 0 }}>
            {form.getFieldDecorator(dataIndex, {
              initialValue: record[dataIndex],
            })(<Select
              optionFilterProp="children"
              onBlur={this.save}
              filterOption={(input, option) =>
                option.props.children.indexOf(input) >= 0
              }
              ref={node => (this.input = node)}
            >
              <Option value="已上架">已上架</Option>
              <Option value="已下架">已下架</Option>
            </Select>)}
          </Form.Item>
        )
      }
      else {
        return (
          <Form.Item style={{ margin: 0 }}>
            {form.getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `${title} 是必填的！`,
                },
              ],
              initialValue: record[dataIndex],
            })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
          </Form.Item>
        )
      }
    }
    else {
      return (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingRight: 24 }}
          onClick={this.toggleEdit}
        >
          {children}
        </div>
      )
    }
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    // console.log(editable)
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
            children
          )}
      </td>
    );
  }
}
//新建
class CreateCommodity extends React.Component {
  state = {
    confirmDirty: false,
    loading: false,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    // console.log(this.props)
    const { form } = this.props.props;
    const { onOk } = this.props;
    const { imageUrl } = this.state;
    // console.log(imageUrl)
    // console.log(form)
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        onOk(values);
      }
    })
  }
  onCancel = (e) => {
    e.preventDefault();
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  render() {
    // console.log(this)
    const { getFieldDecorator } = this.props.props.form;
    const { visible: createVisible, onCancel } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
   
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    const { imageUrl } = this.state;
    return (
      <Modal
        title="新建商品"
        visible={createVisible}
        destroyOnClose
        maskClosable={false}
        onOk={this.handleSubmit}
        onCancel={onCancel}
      >
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item
            label="图片"
          >
            {getFieldDecorator('graph', {
              rules: [{ required: true,}],
            })(<Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={this.handleChange}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>)}
          </Form.Item>
          <Form.Item
            label="商品分类"
          >
            {getFieldDecorator('classes', {
              rules: [{ required: true, message: '请选择商品类别' }],
            })(<Select
              optionFilterProp="children"
              onBlur={this.save}
              filterOption={(input, option) =>
                option.props.children.indexOf(input) >= 0
              }
              defaultValue="请选择商品类别"
            >
              <Option value="新鲜蔬菜">新鲜蔬菜</Option>
              <Option value="米面粮油">米面粮油</Option>
              <Option value="进口水果">进口水果</Option>
              <Option value="干货调料">干货调料</Option>
              <Option value="肉类">肉类</Option>
              <Option value="水产冻货">水产冻货</Option>
              <Option value="时令水果">时令水果</Option>
              <Option value="蛋品豆面">蛋品豆面</Option>
              <Option value="豆类">豆类</Option>
              <Option value="野味">野味</Option>
            </Select>)}
          </Form.Item>
          <Form.Item
            label="商品名称"
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入名称' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label="单位"
          >
            {getFieldDecorator('unit', {
              rules: [{ required: true, message: '请输入单位' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label="市场价"
          >
            {getFieldDecorator('price', {
              rules: [{ required: true, message: '请输入市场价' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label="供应类型"
          >
            {getFieldDecorator('purchases', {
              rules: [{ required: true, message: '请选择供应类型' }],
            })(<Select
              optionFilterProp="children"
              onBlur={this.save}
              filterOption={(input, option) =>
                option.props.children.indexOf(input) >= 0
              }
              defaultValue="请选择供应类型"
            >
              <Option value="市场自采">市场自采</Option>
              <Option value="供应商直供">供应商直供</Option>
            </Select>)}
          </Form.Item>
          <Form.Item
            label="供应员"
          >
            {getFieldDecorator('buyer', {
              rules: [{ required: true, message: '请输入供应员/供应商' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label="商品状态"
          >
            {getFieldDecorator('state', {
              rules: [{ required: true }],
            })(<Select
              optionFilterProp="children"
              onBlur={this.save}
              filterOption={(input, option) =>
                option.props.children.indexOf(input) >= 0
              }
              defaultValue="请选择商品状态"
            >
              <Option value="已上架">已上架</Option>
              <Option value="已下架">已下架</Option>
            </Select>)}
          </Form.Item>
          <Form.Item
            label="检测报告"
          >
            {getFieldDecorator('testReportId',{
              rules: [{ required: true }],
            })(<Select
              optionFilterProp="children"
              onBlur={this.save}
              filterOption={(input, option) =>
                option.props.children.indexOf(input) >= 0
              }
              defaultValue="请选择检测报告"
            >
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
            </Select>)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

//-------------------
@connect(({ commodity,testReport,loading }) => ({
  commodity,
  testReport,
  loading: loading.effects['commodity/query'],
}))
class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      count: 0, 
      searchText: '',
      searchedColumn: '',
      selectedRowKeys:[],
      createVisible: false,
      testReportData:[],
    };
    this.columns = [
      {
        title: '图片',
        dataIndex: 'graph',
        key: 'graph',
        editable: true,
        render: text => (
          <img src="../../../../public/delivery.png"/>
        ),
      },
      {
        title: '商品分类',
        dataIndex: 'classes',
        key: 'classes',
        editable: true,
        // render: () => Area[this.state.region],
        filters: [
          {
            text: '新鲜蔬菜',
            value: '新鲜蔬菜',
          },
          {
            text: '米面粮油',
            value: '米面粮油',
          },
          {
            text: '进口水果',
            value: '进口水果',
          },
          {
            text: '干货调料',
            value: '干货调料',
          },
          {
            text: '肉类',
            value: '肉类',
          },
          {
            text: '水产冻货',
            value: '水产冻货',
          },
          {
            text: '时令水果',
            value: '时令水果',
          },
          {
            text: '蛋品豆面',
            value: '蛋品豆面',
          },
          {
            text: '豆类',
            value: '豆类',
          },
          {
            text: '野味',
            value: '野味',
          },
        ],
        filterMultiple: true,
        onFilter: (value, record) => record.classes.indexOf(value) === 0,
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        editable: true,
        ...this.getColumnSearchProps('name'),
        render: text => {
          const Url = "https://baike.baidu.com/item/"+text
          // console.log(Url)
          return(
            < a href={Url} target="_blank" >
              {
                //浏览器总在一个新打开、未命名的窗口中载入目标文档。
              }{text}
            </a >
          )
        }
      },
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
        editable: true,
      },
      {
        title: '市场价',
        dataIndex: 'price',
        key: 'price',
        editable: true,
        sorter: (a, b) => a.price - b.price,
        sortDirections: ['descend', 'ascend'],
        render: text => `¥${text}`
        //    render: text => `${text}M`,
      },
      {
        title: '供应类型',
        dataIndex: 'purchases',
        key: 'purchases',
        editable: true,
      },
      {
        title: '供应员',
        dataIndex: 'buyer',
        key: 'buyer',
        editable: true,
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        widt: 200,
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="确定要删除么？" onConfirm={() => this.handleDelete(record.itemId)} okText="确认" cancelText="取消">
              <a>删除</a>
            </Popconfirm>
          ) : null,
        editable: false,
      },
    ];
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commodity/queryCommodity',
      callback: (inst, count) => this.setState({ dataSource: inst, count: inst.length }),
    });
    dispatch({
      type: 'testReport/queryAll',
      callback: (inst) => this.setState({ testReportData: inst }),
    });
  }
  // setState(updater, callback)这个方法是用来告诉react组件数据有更新，有可能需要重新渲染。
  // 它是异步的,react通常会集齐一批需要更新的组件，然后一次性更新来保证渲染的性能:
  // 即那就是在使用setState改变状态之后，立刻通过this.state去拿最新的状态往往是拿不到的（this.props未变）。
  // 1.setState 不会立刻改变React组件中state的值.
  // 2.setState 通过触发一次组件的更新来引发重绘.
  // 3.多次 setState 函数调用产生的效果会合并。

  onOk = (data) => {
    //后端交互
    const { dispatch } = this.props;
    data.itemId = this.state.count + 1;
    data.graph=data.graph.file.name;
    const dataSource = [...this.state.dataSource];
    console.log(data)
    console.log(this.state.testReportData)
    for (var i=0;i<this.state.testReportData.length;i++){
      console.log(this.state.testReportData[i])
      if (data.testReportId == this.state.testReportData[i].testId){
        data.testReport = this.state.testReportData[i]
        break
      }
    }
    dispatch({
      type: "commodity/create",
      payload: data,
      callback: response => {
        if (response === true) {
          message.success("创建成功！");
          this.setState({ createVisible: false });
          this.setState({
            dataSource: [...dataSource, data],
            count: data.itemId,
          });
        }
        else {
          message.error("创建失败！");
        }
      }
    })
  }

  onCancel = () => {
    this.setState({ createVisible: false, })
  }

  showModal = (e) => {
    e.preventDefault();
    this.setState({ createVisible: true, })
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    const { dispatch } = this.props;
    // console.log(dataSource.filter(item => item.uId === key))
    if(dispatch){
      dispatch({
        type: 'commodity/delete',
        payload: key,
        callback: response => {
          if (response == true) {
            message.success("删除信息成功!");
            this.setState({ dataSource: dataSource.filter(item => item.itemId !== key) })
          }
          else { message.error("删除失败！"); }
        }
      });
    }
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    console.log(newData)
    console.log(row)
    const index = newData.findIndex(item => row.itemId === item.itemId);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    // console.log(newData[index])
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'commodity/updateCommodity',
        payload: newData[index],
        callback: response => {
          if (response == true) {
            message.success("更新信息成功!");
            this.setState({ dataSource: newData });
          }
          else {
            message.error("更新失败:<!");
          }
        }
      })
    }
  }
  // 搜索
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`商品名称 `}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          搜索
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          重置
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
          text
        ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
//批量上下架
  updateState = (flag)=>{
    console.log(flag)
  
    const rowKeys = Array.from(new Set([...new Set(this.state.selectedRowKeys)]))
    let data = new Set();
    console.log(rowKeys)
    console.log(this.state.dataSource[rowKeys[0]].state)
    const newData = [...this.state.dataSource];
    for (var i in rowKeys){
      if(flag=="in")
        this.state.dataSource[rowKeys[i]].state="已上架"
   
      else
        this.state.dataSource[rowKeys[i]].state="已下架"
      
      data.add(this.state.dataSource[rowKeys[i]])
      const item = newData[rowKeys[i]]
      newData.splice(rowKeys[i], 1, {
        ...item,
      });

    }

    // console.log(newData)
    const {dispatch}=this.props
    if(dispatch){
      dispatch({
        type: 'commodity/updateState',
        payload: Array.from(data),
        callback: response => {
          // console.log(response)
          if (response == true) {
            message.success("更新信息成功!");
            this.setState({ dataSource: newData,selectedRowKeys: [],});
          }
          else {
            message.error("更新失败:<!");
          }
        }
      });   
    }
  }
  //扩展
  expandedRowRender = (record) => {
    // console.log(record.testReport)//打印出对应id展开行所请求的数据
    const columns = [
      { title: '检测单号', dataIndex: 'testId' },
      { title: '检测时间', dataIndex: 'testDate' },
      { title: '检测机构', dataIndex: 'testFacility' },
      { title: '检测员', dataIndex: 'testMan' },
      { title: '提供商', dataIndex: 'testSupplier' },
    ];
    const data=[];
    data.push(record.testReport)
    // console.log(data)
    return <Table columns={columns} dataSource={data} pagination={false} />;
  }

  render(){
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    // console.log(components)
    const columns = this.columns.map(col => {
      // console.log(col.editable)
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    
    //多选
    const { selectedRowKeys, createVisible} =this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    console.log(rowSelection)
  
    return (
      <PageHeaderWrapper>
        <Button onClick={this.showModal} type="primary" style={{ marginBottom: 16 }} disabled={hasSelected} icon="plus-square">
          添加
        </Button>
        <CreateCommodity props={this.props} onOk={this.onOk} onCancel={this.onCancel} visible={createVisible} />
        &nbsp;&nbsp;
        <Divider type="vertical" />
        <Button onClick={(flag) => this.updateState("in")} type="primary" style={{ marginBottom: 16 }} disabled={!hasSelected} shape="circle" >上架</Button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button onClick={(flag) => this.updateState("out")} type="primary" style={{ marginBottom: 16 }} disabled={!hasSelected} shape="circle" >下架</Button>
        <Card>
          <Table
            rowKey={record => record.itemId-1}
            components={components}
            dataSource={this.state.dataSource}
            columns={columns}
            rowClassName={() => 'editable-row'}
            rowSelection={rowSelection}
            expandedRowRender={record => this.expandedRowRender(record)}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
const EditableFormTable = Form.create()(EditableTable);
export default EditableFormTable;