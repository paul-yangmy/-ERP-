import { connect } from 'dva';
import {
    Table, Card, Divider, Input, message, Button, Popconfirm, Form, Icon, Upload, Avatar, Select, Modal, Checkbox,Row,Col
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import ReactDOM from 'react-dom';
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
            if (dataIndex == "dState") {
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
                            <Option value="带班">带班</Option>
                            <Option value="线路一">线路一</Option>
                            <Option value="线路二">线路二</Option>
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

class Createtransportation extends React.Component {
    state = {
        confirmDirty: false,
        loading: false,
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { form } = this.props.props;
        const { onOk } = this.props;
     
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                onOk(values);
            }
        })
    }
    onCancel = (e) => {
        e.preventDefault();
    }

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
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>,
        );

        return (
            <Modal
                title="添加司机"
                visible={createVisible}
                destroyOnClose
                maskClosable={false}
                onOk={this.handleSubmit}
                onCancel={onCancel}
            >
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item
                        label="姓名"
                    >
                        {getFieldDecorator('dName', {
                            rules: [{ required: true, message: '输入姓名'}],
                        })(<Input/>)}
                    </Form.Item>
                    <Form.Item
                        label="电话"
                    >
                        {getFieldDecorator('dPhone', {
                            rules: [{ required: true, message: '输入电话' }],
                        })(<Input addonBefore={prefixSelector}/>)}
                    </Form.Item>
                    <Form.Item label="Captcha" extra="确保本人注册！">
                        <Row gutter={8}>
                            <Col span={12}>
                                {getFieldDecorator('captcha', {
                                    rules: [{ required: true, message: '请输入验证码！' }],
                                })(<Input />)}
                            </Col>
                            <Col span={12}>
                                <Button>获取验证码</Button>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

//-------------------
@connect(({ transportation, loading }) => ({
    transportation,
    loading: loading.effects['transportation/query'],
}))
class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            count: 0,
            searchText: '',
            searchedColumn: '',
            selectedRowKeys: [],
            createVisible: false,
        };
        this.columns = [
            {
                title: '司机',
                dataIndex: 'dName',
                key: 'dName',
                editable: true,
            },
            {
                title: '电话',
                dataIndex: 'dPhone',
                key: 'dPhone',
                editable: true,
            },
            {
                title: '状态',
                dataIndex: 'dState',
                key: 'dState',
                editable: true,
            },
            {
                title: '操作',
                dataIndex: 'operation',
                widt: 200,
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <Popconfirm title="确定要删除么？" onConfirm={() => this.handleDelete(record.dId)} okText="确认" cancelText="取消">
                            <a>删除</a>
                        </Popconfirm>
                    ) : null,
                editable: false,
            },
        ];
        this.tableRef = React.createRef();
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'transportation/queryDriver',
            callback: (inst, count) => this.setState({ dataSource: inst, count: inst.length }),
        });
        const table = this.tableRef.current.querySelector('table');
        table.setAttribute('id', 'table-to-xls');
    }

    onOk = (data) => {
        //后端交互
        const { dispatch } = this.props;
        data.dId = this.state.count + 1;
        data.dState="带班";
        const dataSource = [...this.state.dataSource];
        console.log(data)
        dispatch({
            type: "transportation/createDriver",
            payload: data,
            callback: response => {
                if (response === true) {
                    message.success("创建成功！");
                    this.setState({ createVisible: false });
                    this.setState({
                        dataSource: [...dataSource, data],
                        count: data.dId,
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
        const authorize=localStorage.getItem('user')
        if (authorize=="admin"){
            e.preventDefault();
            this.setState({ createVisible: true, })
        }
        else{
            message.error("您无权添加人员数据！")
        }
    }

    handleDelete = key => {
        const dataSource = [...this.state.dataSource];
        const { dispatch } = this.props;
        // console.log(dataSource.filter(item => item.uId === key))
        if (dispatch) {
            dispatch({
                type: 'transportation/deleteDriver',
                payload: key,
                callback: response => {
                    if (response == true) {
                        message.success("删除信息成功!");
                        this.setState({ dataSource: dataSource.filter(item => item.dId !== key) })
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
        const index = newData.findIndex(item => row.dId === item.dId);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        // console.log(newData[index])
        const { dispatch } = this.props;
        if (dispatch) {
            dispatch({
                type: 'transportation/updateDriver',
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
            if (flag == "wait")
                this.state.dataSource[rowKeys[i]].dState = "带班"
            else if (flag == "one")
                this.state.dataSource[rowKeys[i]].dState = "线路一"
            else
                this.state.dataSource[rowKeys[i]].dState = "线路二"
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
                type: 'transportation/updateDriverState',
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

    render() {
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
        const { selectedRowKeys, createVisible } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;

        return (
            <PageHeaderWrapper>
                <Button onClick={this.showModal} type="primary" style={{ marginBottom: 16 }} disabled={hasSelected} icon="plus-square">
                    添加
                </Button>
                <Createtransportation props={this.props} onOk={this.onOk} onCancel={this.onCancel} visible={createVisible} />
                &nbsp;&nbsp;
                <Divider type="vertical" />
                <Button onClick={(flag) => this.updateState("wait")} type="primary" style={{ marginBottom: 16 }} disabled={!hasSelected} shape="circle" >带班</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button onClick={(flag) => this.updateState("one")} type="primary" style={{ marginBottom: 16 }} disabled={!hasSelected} shape="circle" >线路一</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button onClick={(flag) => this.updateState("two")} type="primary" style={{ marginBottom: 16 }} disabled={!hasSelected} shape="circle" >线路二</Button>
                
                <Card>
                    <div>
                        <ReactHTMLTableToExcel
                            id="test-table-xls-button"
                            className="download-table-xls-button"
                            table="table-to-xls"
                            filename="tablexls"
                            sheet="tablexls"
                            buttonText="导出"
                        />
                        {/* react无法获取自定义组件节点,所以这里要包一层 */}
                        <div ref={this.tableRef}>
                            <Table
                                rowKey={record => record.dId - 1}
                                components={components}
                                dataSource={this.state.dataSource}
                                columns={columns}
                                rowClassName={() => 'editable-row'}
                                rowSelection={rowSelection}
                            />
                        </div>
       
                    </div>
                    {/* <Table
                        rowKey={record => record.dId - 1}
                        components={components}
                        dataSource={this.state.dataSource}
                        columns={columns}
                        rowClassName={() => 'editable-row'}
                        rowSelection={rowSelection}
                    /> */}
                </Card>
            </PageHeaderWrapper>
        );
    }
}
const EditableFormTable = Form.create()(EditableTable);
export default EditableFormTable;