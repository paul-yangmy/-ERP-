import {
    Table, Card,Icon, Divider, Input, message, Button, Form, Slider, InputNumber, Row, Col,Tooltip, Select, Modal, Popconfirm
} from 'antd';
import './style.css';
import Highlighter from 'react-highlight-words';
import { connect } from 'dva';

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
            if (dataIndex == "buyState") {
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
                            <Option value="采购中">采购中</Option>
                            <Option value="已收货（未验收）">已收货（未验收）</Option>
                            <Option value="验收合格">验收合格</Option>
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
class CreatePurchase extends React.Component {
    state = {
        confirmDirty: false,
        loading: false,
        inputValue: 1,
    };

    handleSubmit = (e) => {
        e.preventDefault();
        // console.log(this.props)
        const { form } = this.props.props;
        const { onOk } = this.props;
        const { inputValue } = this.state;

        // console.log(form)
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                onOk(values,inputValue);
            }
        })
    }
    onCancel = (e) => {
        e.preventDefault();
    }
    onChange = value => {
        this.setState({
            inputValue: value,
        });
    };
    render() {
        // console.log(this)
        const { getFieldDecorator } = this.props.props.form;
        const { visible: createVisible, onCancel } = this.props;
        const { inputValue } = this.state;

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

        const { imageUrl } = this.state;
        return (
            <Modal
                title="新建采购单"
                visible={createVisible}
                destroyOnClose
                maskClosable={false}
                onOk={this.handleSubmit}
                onCancel={onCancel}
            >
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    
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
                        label="采购单价"
                    >
                        {getFieldDecorator('buyFee', {
                            rules: [{ required: true, message: '请输入市场价' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item
                        label="采购数目"
                    >
                        {getFieldDecorator('buyNum', {
                            rules: [{ required: false }],
                        })(<Row>
                            <Col span={12}>
                                <Slider
                                    min={1}
                                    max={20}
                                    onChange={this.onChange}
                                    value={typeof inputValue === 'number' ? inputValue : 0}
                                />
                            </Col>
                            <Col span={4}>
                                <InputNumber
                                    min={1}
                                    max={20}
                                    style={{ margin: '0 16px' }}
                                    value={inputValue}
                                    onChange={this.onChange}
                                />
                            </Col>
                        </Row>)}
                    </Form.Item>
                    <Form.Item
                        label="供应类型"
                    >
                        {getFieldDecorator('buyType', {
                            rules: [{ required: true, message: '请输入供应类型' }],
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
                        label="供应商"
                    >
                        {getFieldDecorator('buyer', {
                            rules: [{ required: true, message: '请输入供应员/供应商' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item
                        label="商品状态"
                    >
                        {getFieldDecorator('buyState', {
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
                        label={
                        <span>
                            采购备注&nbsp;
                            <Tooltip title="本次采购过程有啥变化？">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                        }
                    >
                        {getFieldDecorator('buyComment', {
                            rules: [{ required: false}],
                        })(<Input.TextArea rows={4} />)}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

//-------------------
@connect(({ indent, loading }) => ({
    indent,
    loading: loading.effects['commodity/query'],
}))
class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            count: 0,
            selectedRowKeys: [],
            createVisible: false,
            columns: [
                {
                    title: '采购单号',
                    dataIndex: 'buyId',
                    width: 100,
                    editable: true,
                    // ellipsis: true,
                },
                {
                    title: '采购类型',
                    dataIndex: 'buyType',
                    width: 140,
                    ellipsis: true,
                    editable: true,
                },
                {
                    title: '供应商',
                    dataIndex: 'buyer',
                    width: 140,
                    ellipsis: true,
                    editable: true,
                },
                {
                    title: '采购总额',
                    dataIndex: 'buyFee',
                    width: 140,
                    ellipsis: true,
                    editable: true,
                },
                {
                    title: '采购状态',
                    dataIndex: 'buyState',
                    width: 140,
                    ellipsis: true,
                    editable: true,
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    widt: 140,
                    render: (text, record) =>
                        this.state.dataSource.length >= 1 ? (
                            <Popconfirm title="确定要删除么？" onConfirm={() => this.handleDelete(record.buyId)} okText="确认" cancelText="取消">
                                <a>删除</a>
                            </Popconfirm>
                        ) : null,
                    editable: false,
                },
            ],
            subTabData: []
        };
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'purchase/queryPurchase',
            callback: (inst) => this.setState({ dataSource: inst }),
        });
    }
    dateToString(now) {
        var year = now.getFullYear();
        var month = (now.getMonth() + 1).toString();
        var day = (now.getDate()).toString();
        var hour = (now.getHours()).toString();
        if (month.length == 1) {
            month = "0" + month;
        }
        if (day.length == 1) {
            day = "0" + day;
        }
        if (hour.length == 1) {
            hour = "0" + hour;
        }
        var dateTime = ""+year +""+  month + "" + day + "" + hour;
        return dateTime;
    }

    onOk = (data,buyNum) => {
        //后端交互
        var date = new Date()//id格式
        date = this.dateToString(date);
        console.log(date)
        var num = Math.floor(Math.random() * 10 + 1);
        const { dispatch } = this.props;
        data.buyId = date;
        // data.order
        data.buyNum = buyNum;
        if(data.buyComment==null){
            data.buyComment=""
        }
        const dataSource = [...this.state.dataSource];
        console.log(data)
        dispatch({
            type: "purchase/create",
            payload: data,
            callback: response => {
                if (response!==null) {
                    message.success("创建成功！");
                    this.setState({ createVisible: false });
                    console.log(response)
                    dispatch({
                        type: 'purchase/queryPurchase',
                        callback: (inst) => this.setState({ dataSource: inst }),
                    });
                    // this.setState({
                    //     dataSource: [...dataSource, response.purchase],
                    //     count: response.orderBuyId,
                    // });
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
        console.log(key);
        if (dispatch) {
            dispatch({
                type: 'purchase/delete',
                payload: key,
                callback: response => {
                    if (response == true) {
                        message.success("删除信息成功!");
                        this.setState({ dataSource: dataSource.filter(item => item.buyId !== key) })
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
        const index = newData.findIndex(item => row.buyId === item.buyId);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        // console.log(newData[index])
        const { dispatch } = this.props;
        if (dispatch) {
            dispatch({
                type: 'purchase/updatePurchase',
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

    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };
    //批量上下架
    updateState = (flag) => {
        // console.log(flag)
        console.log(this.state.selectedRowKeys)
        const rowKeys = Array.from(new Set([...new Set(this.state.selectedRowKeys)]))
        console.log(rowKeys)
        let data = new Set();
        const newData = [...this.state.dataSource];
        for (var i in rowKeys) {
            if (flag == "in")
                this.state.dataSource[rowKeys[i]].state = "已上架"
            else
                this.state.dataSource[rowKeys[i]].state = "已下架"
            data.add(this.state.dataSource[rowKeys[i]])
            const item = newData[rowKeys[i]]
            newData.splice(rowKeys[i], 1, {
                ...item,
            });

        }
        // console.log(newData)
        const { dispatch } = this.props
        if (dispatch) {
            dispatch({
                type: 'purchase/updateState',
                payload: Array.from(data),
                callback: response => {
                    // console.log(response)
                    if (response == true) {
                        message.success("更新信息成功!");
                        this.setState({ dataSource: newData, selectedRowKeys: [], });
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
        // console.log(record)
        // console.log(this)
        console.log(this.state.subTabData[record.buyId])
        const columns = [
            { title: '详情单号', dataIndex: 'orderBuyId', width: '150px', align: 'center' },
            { title: '关联商品', dataIndex: 'commodity.name', width: '150px', align: 'center' },
            { title: '商品数量', dataIndex: 'buyNum', width: '150px', align: 'center' },
            { title: '商品单价', dataIndex: 'buyPrice', width: '150px', align: 'center' },
            { title: '商品总价', dataIndex: 'buyTotal', width: '150px', align: 'center' },
            { title: '备注', dataIndex: 'buyComment', align: 'center' },
        ];

        // console.log(data)
        return <Table columns={columns} dataSource={this.state.subTabData[record.buyId]} pagination={false} />;
    }

    onExpand = (expanded, record) => {
        const { dispatch } = this.props;
        if (expanded === false) {
            // 因为如果不断的添加键值对，会造成数据过于庞大，浪费资源，
            // 因此在每次合并的时候讲相应键值下的数据清空
            this.setState({
                subTabData: {
                    ...this.state.subTabData,
                    [record.buyId]: [],
                }
            });
        } else {
            console.log(record);
            dispatch({
                type: 'purchase/queryDetailByBuyId',
                payload: record.buyId,
                callback: (response) => {
                    response.map(item => { item.orderTotalCost = item.orderNum * item.orderCost })
                    this.setState({
                        subTabData: {
                            ...this.state.subTabData,
                            [record.buyId]: response,
                        }
                    });
                }
            });
        }
    }

    render() {
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };

        const columns = this.state.columns.map(col => {
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
        const { selectedRowKeys, createVisible } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;

        return (
            <Card bordered>
                <Button onClick={this.showModal} type="primary" style={{ marginBottom: 16 }} disabled={hasSelected} icon="plus-square">
                    添加
                </Button>
                <CreatePurchase props={this.props} onOk={this.onOk} onCancel={this.onCancel} visible={createVisible} />
                &nbsp;&nbsp;
                <Divider type="vertical" />
                <Button onClick={(flag) => this.updateState("one")} type="primary" style={{ marginBottom: 16 }} disabled={!hasSelected} shape="circle" >采购中</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button onClick={(flag) => this.updateState("two")} type="primary" style={{ marginBottom: 16 }} disabled={!hasSelected} shape="circle" >已收货（未验收）</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button onClick={(flag) => this.updateState("three")} type="primary" style={{ marginBottom: 16 }} disabled={!hasSelected} shape="circle" >验收合格</Button>
                    <Table
                        bordered
                        title={() => '采购单'}
                        rowKey={record => record.buyId - 1}
                        components={components}
                        dataSource={this.state.dataSource}
                        columns={columns}
                        rowClassName={() => 'editable-row'}
                        rowSelection={rowSelection}
                        expandedRowRender={record => this.expandedRowRender(record)}
                        onExpand={(expanded, record) => this.onExpand(expanded, record)}
                    />
            </Card>
        );
    }
}
const PurchaseView = Form.create()(EditableTable);
export default PurchaseView;