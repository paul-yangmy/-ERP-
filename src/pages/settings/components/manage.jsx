import {
    Table, 
    Input,
    Button, 
    Popconfirm, 
    Form, 
    message, 
    Select, 
    Modal, 
    Cascader, 
    Checkbox } from 'antd';
import { connect } from 'dva';

const { Option } = Select;
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
        if(editing){
            if (dataIndex == "uGroup") {
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
                        })(<Select
                            showSearch
                            optionFilterProp="children"
                            onBlur={this.save}
                            filterOption={(input, option) =>
                                option.props.children.indexOf(input) >= 0
                            }
                            ref={node => (this.input = node)}
                        >
                            <Option value="admin">admin</Option>
                            <Option value="user">user</Option>
                            <Option value="test">test</Option>
                        </Select>)}
                    </Form.Item>
                )
            }
            else{ 
                return(
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
                )}
            } 
       else{
           return(
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

class ChangeUser extends React.Component {
    state = {
        confirmDirty: false,
    };

    handleSubmit = (e) => {
        e.preventDefault();
        // console.log(this.props)
        const { form } = this.props.props;
        const { onOk } = this.props;
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

    checkPwd = (rule, value, callback) => {
        const { form } = this.props.props;
        const newPassword = form.getFieldValue("uPwd")
        // console.log(newPassword)
        if (value !== newPassword) {
            callback("请输入相同的密码!");
        } else {
            callback()
        }
    }

    render() {
        // console.log(this)
        const { getFieldDecorator } = this.props.props.form;
        const { visible: changeUserVisible, onCancel } = this.props;

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
                title="新建用户"
                visible={changeUserVisible}
                destroyOnClose
                maskClosable={false}
                onOk={this.handleSubmit}
                onCancel={onCancel}
            >
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item
                        label="用户名"
                    >
                        {getFieldDecorator('uName', {
                            rules: [{ required: true, message: '请输入用户名！', whitespace: true }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item
                        label="组别"
                    >
                        {getFieldDecorator('uGroup', {
                            rules: [{ required: true, message: '阿斯顿' }],
                        })(<Select
                            showSearch
                            optionFilterProp="children"
                            onBlur={this.save}
                            filterOption={(input, option) =>
                                option.props.children.indexOf(input) >= 0
                            }
                            ref={node => (this.input = node)}
                        >
                            <Option value="admin">admin</Option>
                            <Option value="user">user</Option>
                            <Option value="test">test</Option>
                        </Select>)}
                    </Form.Item>
                    <Form.Item
                        label="性别"
                    >
                        {getFieldDecorator('uSex', {
                            rules: [{ required: true, message: '阿斯顿' }],
                        })(<Select
                            showSearch
                            optionFilterProp="children"
                            onBlur={this.save}
                            filterOption={(input, option) =>
                                option.props.children.indexOf(input) >= 0
                            }
                            ref={node => (this.input = node)}
                        >
                            <Option value="female">female</Option>
                            <Option value="male">male</Option>
                        </Select>)}
                    </Form.Item>
                    <Form.Item label="密码" hasFeedback>
                        {getFieldDecorator('uPwd', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入密码！',
                                },
                                {
                                    validator: this.validateToNextPassword,
                                },
                            ],
                        })(<Input.Password />)}
                    </Form.Item>
                    <Form.Item label="确认密码" hasFeedback>
                        {getFieldDecorator('confirm', {
                            rules: [
                                {
                                    required: true,
                                    message: '请再次输入密码！',
                                },
                                {
                                    validator: this.checkPwd,
                                },
                            ],
                        })(<Input.Password />)}
                    </Form.Item>
                    <Form.Item label="电子邮箱">
                        {getFieldDecorator('uEmail', {
                            rules: [
                                {
                                    type: 'email',
                                    message: '邮箱格式错误！',
                                },
                                {
                                    required: true,
                                    message: '请输入邮箱📫！',
                                },
                            ],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="电话">
                        {getFieldDecorator('uPhone', {
                            rules: [{ required: true, message: '请输入你的电话📞!' }],
                        })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
                    </Form.Item>
                    {/* <Form.Item label="Captcha" extra="We must make sure that your are a human.">
                        <Row gutter={8}>
                            <Col span={12}>
                                {getFieldDecorator('captcha', {
                                    rules: [{ required: true, message: 'Please input the captcha you got!' }],
                                })(<Input />)}
                            </Col>
                            <Col span={12}>
                                <Button>Get captcha</Button>
                            </Col>
                        </Row>
                    </Form.Item> */}
                    <Form.Item {...tailFormItemLayout}>
                        {getFieldDecorator('agreement', {
                            rules: [{
                                required: true, 
                                message: '请阅读相关文档!'
                            }]
                        })(
                            <Checkbox>
                                点击阅读 <a href="https://github.com/paul-yangmy/Graduation-Project-FrontEnd/blob/master/README.md" target="_blank">相关文档</a>
                            </Checkbox>,
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

@connect(({ user }) => ({
    currentUser:user.currentUser,
}))

class ManageView extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'uName',
                sorter: (a, b) => a.uName.localeCompare(b.uName),
                sortDirections: ['descend', 'ascend'],
                editable: true,
                width:"15%",
            },
            {
                title: '权限',
                dataIndex: 'uGroup',
                filters: [
                    {
                        text: 'admin',
                        value: 'admin',
                    },
                    {
                        text: 'user',
                        value: 'user',
                    },
                ],
                onFilter: (value, record) => record.uGroup.indexOf(value) === 0,
                editable: true,
            },
            {
                title: '性别',
                dataIndex: 'uSex',
                editable: true,
            },
            {
                title: '电话',
                dataIndex: 'uPhone',
                editable: true,
            },
            {
                title: '邮件',
                dataIndex: 'uEmail',
                editable: true,
            },
            {
                title: '个性标签',
                dataIndex: 'uTitle',
                editable: true,
                ellipsis: true,
            },
            {
                title: '操作',
                dataIndex: 'operation',
                widt:200,
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <Popconfirm title="确定要删除么？" onConfirm={() => this.handleDelete(record.uId)} okText="确认" cancelText="取消">
                            <a>删除</a>
                        </Popconfirm>
                    ) : null,
                editable: false,
            },
        ];
        this.state = {
            dataSource: [],
            loading: false,
            changeUserVisible:false,
        };
    }

    componentWillMount() {
        const { dispatch, currentUser} = this.props;
        if (dispatch) {
            dispatch({
                type: 'user/fetch',
                payload: currentUser.uGroup,
                callback: response => {
                    // console.log(Math.max.apply(Math, response.map(item => { return item.uId })))
                    // Read total count from server
                    // pagination.total = data.totalCount;
                    this.setState({
                        loading: false,
                        dataSource: response,
                        count: Math.max.apply(Math, response.map(item => { return item.uId })),
                    });
                    // console.log(this.state.dataSource)
                }
            });      
        }
    }

    onOk = (data) => {
        // console.log(data)
        //后端交互
        // console.log(this.props)
        const { dispatch } = this.props;
        // console.log(dispatch)
        data.uId = this.state.count+1
        data.uTitle = "喜看稻菽千重浪，最是风流袁隆平！"
        data.uAvatar ="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
        const dataSource = [...this.state.dataSource];
        console.log(data)
        dispatch({
            type: "user/create",
            payload: data,
            callback: response => {
                if (response === true) {
                    console.log(1)
                    message.success("创建成功！");
                    this.setState({ changeUserVisible: false });
                    this.setState({
                        dataSource: [...dataSource, data],
                        count: data.uId,
                    });
                }
                else {
                    message.error("创建用户失败！");
                }
            }
        })
    }
    onCancel = () => {
        this.setState({ changeUserVisible: false, })
    }

    showModal = (e) => { 
        const {currentUser}=this.props       
        e.preventDefault();
        if (currentUser.uGroup == "admin") {
            this.setState({ changeUserVisible: true, })
        }
        else {
            message.error("您无权添加人员信息！");
        }

        // console.log(this.state)
    }

    handleDelete = key => {
        const dataSource = [...this.state.dataSource];
        const {dispatch, currentUser} = this.props;
        // console.log(dataSource.filter(item => item.uId === key))
        if(currentUser.uGroup=="admin") {
            dispatch({
                type: 'user/delete',
                payload: key,
                callback: response => {
                    if (response == true) {
                        message.success("删除信息成功!");
                        this.setState({ dataSource: dataSource.filter(item => item.uId !== key) })
                    }
                    else { message.error("删除失败！"); }
                }
            });
        }
        else{
            message.error("您无权修改人员数据！");
        }

    };

    handleSave = row => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.uId === item.uId);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        console.log(newData[index])
        const { dispatch } = this.props;
        if (dispatch) {
            dispatch({
                type: 'user/updateInfo',
                payload: newData[index],
                callback: response => {
                    if(response==true){
                        message.success("更新信息成功!");
                        this.setState({ dataSource: newData });
                    }
                    else{
                        message.error("更新失败:<!"); 
                    }
                }
            })
        }
        
    };
    render() {
        const { dataSource, changeUserVisible } = this.state;
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
        return (
            <div>
                <div>
                    <Button type="primary" style={{ marginBottom: 16 }} onClick={this.showModal}>
                        新建
                    </Button>
                    <ChangeUser props={this.props} onOk={this.onOk} onCancel={this.onCancel} visible={changeUserVisible}/>
                </div>
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                />
            </div>
        );
    }
}
const ManageEditView = Form.create()(ManageView);
export default ManageEditView;