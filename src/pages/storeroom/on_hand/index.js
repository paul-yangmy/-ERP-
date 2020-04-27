import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import { formatRangeDate } from '../../../utils/utils';
import Link from 'umi/link';
import {
    Row,
    Col,
    Form,
    Input,
    Icon,
    Button,
    DatePicker,
    Divider,
    Card,
    message,
    Table,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import styles from './index.less';

/* eslint react/no-multi-comp:0 */
//-------------------
@connect(({ repository, loading }) => ({
    repository,
    loading: loading.effects['repository/query'],
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
        };
        this.columns = [
            {
                title: '仓库编号',
                dataIndex: 'repoId',
                key: 'repoId',
            },
            {
                title: '仓库类型',
                dataIndex: 'repoState',
                key: 'repoState',
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
                onFilter: (value, record) => record.repoState.indexOf(value) === 0,
            },
            {
                title: '商品名称',
                dataIndex: 'repoItem',
                key: 'repoItem',
                ...this.getColumnSearchProps('repoItem'),
            },
            {
                title: '库存数量',
                dataIndex: 'repoNum',
                key: 'repoNum',
                sorter: (a, b) => a.repoNum - b.repoNum,
                sortDirections: ['descend', 'ascend'],
                render: text => `${text}`
                //    render: text => `${text}M`,
            },
            {
                title: '入库时间',
                dataIndex: 'inStorage.inDate',
                key: 'inStorage.inDate',
                sorter: (a, b) => a.inStorage.inDate - b.inStorage.inDate,
                sortDirections: ['descend', 'ascend'],
                render: text => `${text}`
                //    render: text => `${text}M`,
            },
            {
                title: '库存上限',
                dataIndex: 'repoUpNum',
                key: 'repoUpNum',
            },
            {
                title: '关联入库单号',
                dataIndex: 'inStorage.inId',
                key: 'inStorage.inId',
            },
            {
                title: '关联出库单号',
                dataIndex: 'outStorage.outId',
                key: 'outStorage.outId',
            },
            {
                title: '维护费',
                dataIndex: 'repoFee',
                key: 'repoFee',
            },
        ];
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'repository/queryRepository',
            callback: (inst, count) => this.setState({ dataSource: inst, count: inst.length }),
        });
        console.log(this.state)
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

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        dispatch({
            type: 'repository/queryRepository',
            callback: (inst, count) => this.setState({ dataSource: inst, count: inst.length }),
        });
    };

    handleFormSearch = e => {
        e.preventDefault();
        let data = [];

        const { dispatch, form } = this.props;

        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const { beginDate = '', endDate = '' } = formatRangeDate(fieldsValue.rangeDate);
            // console.log(beginDate)
            const values = {
                ...fieldsValue,
                beginDate,
                endDate,
            };
            delete values.rangeDate;
            this.setState({
                formValues: values,
            });
            console.log(values.beginDate)
            // this.state.dataSource.forEach(row => {
            //     if (row.inStorage.inDate >= values.beginDate && row.inStorage.inDate <= values.endDate){
            //         console.log(row);
            //         data.push(row)
            //     }
            //     this.setState({
            //         searchedColumn: data,
            //     });
                
            // });
            dispatch({
                type: 'repository/queryByDate',
                payload: {values},
                callback: (inst, count) => this.setState({ dataSource: inst, count: inst.length }),
            });
            
        });
    };


    renderSimpleForm() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <Form onSubmit={this.handleFormSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={12} sm={24}>
                        <Form.Item label="添加时间">
                            {getFieldDecorator('rangeDate')(<DatePicker.RangePicker />)}
                        </Form.Item>
                    </Col>
                    <Col md={6} sm={24}>
                        <span className={styles.submitButtons}>
                            <Button type="primary" htmlType="submit">
                                查询
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                                重置
                            </Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {
        return (
            <PageHeaderWrapper>           
                <Card>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                        
                    <Table
                        rowKey={record => record.repoId - 1}
                        size="small"
                        dataSource={this.state.dataSource}
                        columns={this.columns}
                    />
                    </div>
                </Card>
            
            </PageHeaderWrapper>
        );
    }
}
const EditableFormTable = Form.create()(EditableTable);
export default EditableFormTable;