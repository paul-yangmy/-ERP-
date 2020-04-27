import {
    Table,
    Input,
    Button,
    Form,
    message,
    Select,
    Card
} from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';

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
        const { children, dataIndex, record, title } = this.props;
        const { editing } = this.state;
        // console.log(children)
        if (editing) {
            if (dataIndex == "inState") {
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
                            <Option value="分拣完成">分拣完成</Option>
                            <Option value="采购中">采购中</Option>
                        </Select>)}
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

@connect(({ repository }) => ({
    repository,
}))

class InStorage extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '入库单号',
                dataIndex: 'inId',
                width: 100,
                key: 'inId',
            },
            { title: '出库时间', dataIndex: 'inDate' },
            { title: '仓库类型', dataIndex: 'storageNam' },
            { title: '采购单号', dataIndex: 'purchase.buyId' },
            { title: '提供商', dataIndex: 'purchase.buyer' },
            { title: '制表人', dataIndex: 'lister' },
            { title: '出库状态', dataIndex: 'inState', editable: true },
        ];
        this.state = {
            dataSource: [],
            count: 0,
            selectedRowKeys: [],
        };
    }

    componentWillMount() {
        const { dispatch } = this.props;
        if (dispatch) {
            dispatch({
                type: 'repository/queryInStorage',
                callback: (inst, count) => this.setState({ dataSource: inst, count: inst.length }),
            });
        }
    }
    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    handleSave = row => {
        const newData = [...this.state.dataSource];
        console.log(newData)
        console.log(row)
        const index = newData.findIndex(item => row.inId === item.inId);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        // console.log(newData[index])
        const { dispatch } = this.props;
        if (dispatch) {
            dispatch({
                type: 'repository/updateInStorage',
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
    //批量上下架
    updateState = (flag) => {
        const rowKeys = Array.from(new Set([...new Set(this.state.selectedRowKeys)]))
        console.log(rowKeys)
        let data = new Set();
        const newData = [...this.state.dataSource];
        // console.log(this.state.dataSource.indexOf(rowKeys[i]))
        for (var i in rowKeys) {
            console.log(i)
            console.log(rowKeys[i])
            for (var j = 0; j < this.state.dataSource.length; j++) {
                console.log(this.state.dataSource[j].inId)
                if (this.state.dataSource[j].inId == rowKeys[i]) {
                    if (flag == "one")
                        this.state.dataSource[j].inState = "分拣完成"
                    else
                        this.state.dataSource[j].inState = "采购中"
                    data.add(this.state.dataSource[j])
                    const item = newData[j]
                    newData.splice(j, 1, {
                        ...item,
                    });

                }
            }

        }

        console.log(newData)
        const { dispatch } = this.props
        if (dispatch) {
            dispatch({
                type: 'repository/updateInStorageState',
                payload: Array.from(data),
                callback: response => {
                    console.log(response)
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
        const { dataSource } = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
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
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;

        return (
            <PageHeaderWrapper>
                <Card>
                    <Button onClick={(flag) => this.updateState("one")} type="primary" style={{ marginBottom: 16 }} disabled={!hasSelected} shape="circle" >分拣完成</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button onClick={(flag) => this.updateState("two")} type="primary" style={{ marginBottom: 16 }} disabled={!hasSelected} shape="circle" >采购中</Button>
                    
                    <Table
                        bordered
                        components={components}
                        rowKey={record => record.inId}
                        dataSource={dataSource}
                        columns={columns}
                        rowClassName={() => 'editable-row'}
                        rowSelection={rowSelection}
                    />
                </Card>
            </PageHeaderWrapper>
        );
    }
}
const InStorageForm = Form.create()(InStorage);
export default InStorageForm;