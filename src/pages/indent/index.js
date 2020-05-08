import { Table, Button, Form, message, Select, Modal, Input, Icon, Slider, InputNumber, Row, Col} from 'antd';
import { Resizable } from 'react-resizable';
import { connect } from 'dva';
import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from "moment";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

let id=0;
let k=0;
class CreateIndent extends React.Component {
    state = {
        confirmDirty: false,
        loading: false,
        inputValue: [1],
    };
    
    handleSubmit = (e) => {
        e.preventDefault();
        // console.log(this.props)
        const { form } = this.props.props;
        const { onOk } = this.props;
        const {inputValue}=this.state;

        // console.log(form)
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                onOk(values, inputValue);
            }
        })
    }
    onCancel = (e) => {
        e.preventDefault();
    }

    remove = k => {
        const { form } = this.props.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    };

    add = () => {
        const { form } = this.props.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id++);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    };
    onChange = (values,k) => {
        const{inputValue}=this.state;
        console.log(k)
        console.log(values)
        console.log(inputValue)
        inputValue[k]=values;
        this.setState({
            inputValue: inputValue,
        });
        console.log(this.state.inputValue)
    };

    render() {
        const { visible: createVisible, onCancel } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.props.form;
            const formItemLayout = {
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 4 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 20 },
                },
            };
            const formItemLayoutWithOutLabel = {
                wrapperCol: {
                    xs: { span: 24, offset: 0 },
                    sm: { span: 20, offset: 4 },
                },
            };
            const { inputValue } = this.state;
            // console.log(inputValue)
            getFieldDecorator('keys', { initialValue: [] });
            const keys = getFieldValue('keys');
            // console.log(keys)
            const formItems = keys.map((k, index) => (
                <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? '采购商品' : ''}
                    required={true}
                    key={k}
                >
                    {getFieldDecorator(`commodity[${k}]`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [
                            {
                                required: true,
                            },
                        ],
                    })(<div>
                        <Row>
                            <Col span={10}>商品名称&nbsp;&nbsp;: </Col>
                            <Col span={14}><Input /></Col>
                        </Row>
                        <Row >
                            <Col span={10}>
                                采购数量:
                            </Col>
                            <Col span={9}>
                                <Slider
                                    min={1}
                                    max={20}
                                    onChange={(values, key) => this.onChange(values, k)}
                                    value={typeof inputValue[k] === 'number' ? inputValue[k] : 0}
                                />
                            </Col>
                            <Col span={4}>
                                <InputNumber
                                    min={1}
                                    max={20}
                                    value={inputValue[k]}
                                    onChange={(values, key) => this.onChange(values, k)}
                                />
                            </Col>
                        </Row>
                    </div>
                    )}
                    {keys.length > 1 ? (
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            onClick={() => this.remove(k)}
                        />
                    ) : null}
                </Form.Item>
            ));
        return (
            <Modal
                title="新建订单"
                visible={createVisible}
                destroyOnClose
                maskClosable={false}
                onOk={this.handleSubmit}
                onCancel={onCancel}
            >
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item
                        label="客户名"
                    >
                        {getFieldDecorator('customerName', {
                            rules: [{ required: true, message: '' }],
                        })(<Input />)}
                    </Form.Item>
                    {formItems}
                    <Form.Item {...formItemLayoutWithOutLabel}>
                        <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                            <Icon type="plus" />添加商品
                     </Button>
                    </Form.Item>


                    {/* <Form.List name="names">
                        {(fields, { add, remove }) => {
                            return (
                                <div>
                                    {fields.map((field, index) => (
                                        <Form.Item
                                            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                            label={index === 0 ? 'Passengers' : ''}
                                            required={false}
                                            key={field.key}
                                        >
                                            <Form.Item
                                                {...field}
                                                validateTrigger={['onChange', 'onBlur']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        whitespace: true,
                                                        message: "Please input passenger's name or delete this field.",
                                                    },
                                                ]}
                                                noStyle
                                            >
                                                <Input placeholder="passenger name" style={{ width: '60%' }} />
                                            </Form.Item>
                                            {fields.length > 1 ? (
                                                <MinusCircleOutlined
                                                    className="dynamic-delete-button"
                                                    style={{ margin: '0 8px' }}
                                                    onClick={() => {
                                                        remove(field.name);
                                                    }}
                                                />
                                            ) : null}
                                        </Form.Item>
                                    ))}
                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => {
                                                add();
                                            }}
                                            style={{ width: '60%' }}
                                        >
                                            <PlusOutlined /> Add field
                                    </Button>
                                    </Form.Item>
                                </div>
                            );
                        }}
                    </Form.List> */}

                    {/* <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                  </Button>
                    </Form.Item> */}
                </Form>
            </Modal>
        );
    }
}

const ResizeableTitle = props => {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable
            width={width}
            height={0}
            onResize={onResize}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps} />
        </Resizable>
    );
};
@connect(({ indent }) => ({
    indent
}))
class IndentView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            count: 0,
            createVisible: false,
            columns: [
                {
                    title: '订单号',
                    dataIndex: 'indId',
                    width: 150,
                    // ellipsis: true,
                },
                {
                    title: '客户名',
                    dataIndex: 'customerName',
                    width: 150,
                    ellipsis: true,
                },
                {
                    title: '客户编号',
                    dataIndex: 'customerNum',
                    width: 150,
                    ellipsis: true,
                },
                {
                    title: '提交时间',
                    dataIndex: 'submitTime',
                    width: 150,
                    ellipsis: true,
                },
                {
                    title: '订单状态',
                    dataIndex: 'indState',
                    width: 150,
                    ellipsis: true,
                },
                {
                    title: '订单来源',
                    dataIndex: 'indSource',
                    width: 150,
                    ellipsis: true,
                },
                {
                    title: '下单总额',
                    dataIndex: 'totalAmount',
                    width: 150,
                    ellipsis: true,
                },
                {
                    title: '配送线路',
                    dataIndex: 'transLine',
                    width: 150,
                    ellipsis: true,
                },
                {
                    title: '配送司机',
                    dataIndex: 'transDriver',
                    width: 150,
                    ellipsis: true,
                },
                {
                    title: '发货时间',
                    dataIndex: 'transTime',
                    width: 150,
                    ellipsis: true,
                },
                {
                    title: '运费',
                    dataIndex: 'transFee',
                    width: 150,
                    ellipsis: true,
                },
                {
                    title: '收货时间',
                    dataIndex: 'arrTime',
                    width: 150,
                    ellipsis: true,
                },
            ],
            subTabData: []
        };
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'indent/queryIndent',
            callback: (inst, count) => this.setState({ dataSource: inst, count: inst.length }),
        });
    }

    components = {
        header: {
            cell: ResizeableTitle,
        },
    };
    onOk = (data, itemNum) => {
        console.log(data)
        //后端交互
        const { dispatch } = this.props;
        data.indId = this.state.count + 1;
        // data.customerName = localStorage.getItem('user');
        data.customerNum="0";
        data.submitTime = moment().format('YYYY-MM-DD HH:mm:ss');
        data.indSource="管理员添加";
        data.indState="待采购";
        data.indNum=itemNum;
        const dataSource = [...this.state.dataSource];
        console.log(data)
        dispatch({
            type: "indent/create",
            payload: data,
            callback: response => {
                if (response === true) {
                    message.success("创建成功！");
                    this.setState({ createVisible: false });
                    dispatch({
                        type: 'indent/queryIndent',
                        callback: (inst, count) => this.setState({ dataSource: inst, count: inst.length }),
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
    handleResize = index => (e, { size }) => {
        this.setState(({ columns }) => {
            const nextColumns = [...columns];
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
            };
            return { columns: nextColumns };
        });
    };
    expandedRowRender = (record) => {
        // console.log(record)
        // console.log(this)
        console.log(this.state.subTabData[record.indId])
        const columns = [
            { title: '详情单号', dataIndex: 'orderId', width: '150px', align: 'center' },
            { title: '关联商品', dataIndex: 'commodity.name', width: '150px', align: 'center' },
            { title: '商品数量', dataIndex: 'orderNum', width: '150px', align: 'center' },
            { title: '商品单价', dataIndex: 'orderCost', width: '150px', align: 'center' },
            { title: '商品总价', dataIndex: 'orderTotalCost', width: '150px', align: 'center' },
            { title: '备注', dataIndex: 'orderComment', align: 'center' },
        ];

        // console.log(data)
        return <Table columns={columns} dataSource={this.state.subTabData[record.indId]} pagination={false} />;
    }

    onExpand = (expanded, record) => {
        const { dispatch } = this.props;
        if (expanded === false) {
            // 因为如果不断的添加键值对，会造成数据过于庞大，浪费资源，
            // 因此在每次合并的时候讲相应键值下的数据清空
            this.setState({
                subTabData: {
                    ...this.state.subTabData,
                    [record.indId]: [],
                }
            });
        } else {
            console.log(record);
            dispatch({
                type: 'indent/queryDetailByIndId',
                payload: record.indId,
                callback: (response) => {
                    response.map(item => { item.orderTotalCost = item.orderNum * item.orderCost })
                    this.setState({
                        subTabData: {
                            ...this.state.subTabData,
                            [record.indId]: response,
                        }
                    });
                }
            });
        }
    }
    render() {
        const { createVisible } = this.state;
        const columns = this.state.columns.map((col, index) => ({
            ...col,
            onHeaderCell: column => ({
                width: column.width,
                onResize: this.handleResize(index),
            }),
        }));
        // console.log(this.state.dataSource)
        return (
            <PageHeaderWrapper>
                <Button onClick={this.showModal} type="primary" style={{ marginBottom: 16 }} icon="plus-square">
                    添加
                </Button>
                <CreateIndent props={this.props} onOk={this.onOk} onCancel={this.onCancel} visible={createVisible}/>
                <Table
                    bordered
                    rowKey={record => record.indId - 1}
                    components={this.components}
                    columns={columns}
                    dataSource={this.state.dataSource}
                    scroll={{ x: 1000 }}
                    expandedRowRender={record => this.expandedRowRender(record)}
                    onExpand={(expanded, record) => this.onExpand(expanded, record)}
                />
            </PageHeaderWrapper>
        );
    }
}
const IndentViewTab = Form.create()(IndentView);
export default IndentViewTab;