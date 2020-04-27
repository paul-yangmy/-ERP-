import {
    Table,
    Input,
    Button,
    Form,
    message,
    Modal,
    DatePicker,
    Card
} from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';

const dateFormat = 'YYYY/MM/DD';
class CreateTestReport extends React.Component {
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
    
        return (
            <Modal
                title="新建检测报告"
                visible={createVisible}
                destroyOnClose
                maskClosable={false}
                onOk={this.handleSubmit}
                onCancel={onCancel}
            >
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item
                        label="检测单号"
                    >
                        {getFieldDecorator('testId', {
                            rules: [{ required: true, message: '请输入检测单号！', whitespace: true }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item
                        label="检测时间"
                    >
                        {getFieldDecorator('testDate', {
                            rules: [{ required: true, message: '选择正确的时间！' }],
                        })(<DatePicker defaultValue={moment('YYYY/MM/DD', dateFormat)} format={dateFormat} />)}
                    </Form.Item>
                    <Form.Item
                        label="检测机构"
                    >
                        {getFieldDecorator('testFacility', {
                            rules: [{ required: true, message: '请填写相关部门！' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="检测人员" >
                        {getFieldDecorator('testMan', {
                            rules: [{required: true, message: '请输入相关人员！' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="提供商" >
                        {getFieldDecorator('testSupplier', {
                            rules: [{ required: true, message: '请输入相关供应商！' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="对照值" >
                        {getFieldDecorator('testΔA0', {
                            rules: [{ required: true, message: '请输入对照值！' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="测定率" >
                        {getFieldDecorator('testΔA1', {
                            rules: [{ required: true, message: '请输入测定率！' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="抑制率" >
                        {getFieldDecorator('testInhibition', {
                            rules: [{ required: true, message: '请输入抑制率！' }],
                        })(<Input />)}
                    </Form.Item>                    
                </Form>
            </Modal>
        );
    }
}

@connect(({ commodity, testReport }) => ({
    commodity,
    testReport,
}))

class testTab extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title:'检测单号',
                dataIndex: 'testId',
                width: 100,
                key: 'testId',
                fixed: 'left',
            },
            { title: '检测时间', dataIndex: 'testDate', key: '1' },
            { title: '检测机构', dataIndex: 'testFacility', key: '2' },
            { title: '检测员', dataIndex: 'testMan', key: '3' },
            { title: '提供商', dataIndex: 'testSupplier', key: '4' },
            { title: '对照值', dataIndex: 'testΔA0', key: '5' },
            { title: '测定值', dataIndex: 'testΔA1', key: '6' },
            { title: '抑制率', dataIndex: 'testInhibition', key: '7' },
        ];
        this.state = {
            dataSource: [],
            createVisible: false,
        };
    }

    componentWillMount() {
        const { dispatch } = this.props;
        if (dispatch) {
            dispatch({
                type: 'testReport/queryAll',
                callback: (inst) => this.setState({ dataSource: inst}),
            });
        }
    }

    onOk = (data) => {
        //后端交互
        // console.log(this.props)
        const { dispatch } = this.props;
        // console.log(dispatch)  
        const dataSource = [...this.state.dataSource];
        console.log(data.testDate._d)
        dispatch({
            type: "testReport/create",
            payload: data,
            callback: response => {
                console.log(response)
                if (response === true) {
                    message.success("创建成功！");
                    this.setState({ createVisible: false });
                    dispatch({
                        type: 'testReport/queryAll',
                        callback: (inst) => this.setState({ dataSource: inst }),
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

    render() {
        const { dataSource, createVisible } = this.state;
        
        return (
                <PageHeaderWrapper>
                    <Card>
                        <Button type="primary"  onClick={this.showModal}>
                            新建
                        </Button>
                        <CreateTestReport props={this.props} onOk={this.onOk} onCancel={this.onCancel} visible={createVisible} />
                    </Card>
                    <Table
                        bordered
                        dataSource={dataSource}
                        columns={this.columns}
                    />
                </PageHeaderWrapper>
        );
    }
}
const testTabForm = Form.create()(testTab);
export default testTabForm;