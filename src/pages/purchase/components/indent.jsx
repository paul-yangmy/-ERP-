// import { Table } from 'antd';
// import { Resizable } from 'react-resizable';
// import './style.css';
// import { connect } from 'dva';
// import React from 'react';


// const ResizeableTitle = props => {
//     const { onResize, width, ...restProps } = props;

//     if (!width) {
//         return <th {...restProps} />;
//     }

//     return (
//         <Resizable
//             width={width}
//             height={0}
//             onResize={onResize}
//             draggableOpts={{ enableUserSelectHack: false }}
//         >
//             <th {...restProps} />
//         </Resizable>
//     );
// };
// @connect(({ indent }) => ({
//     indent
// }))
// class IndentView extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             dataSource: [],
//             count: 0, 
//             columns: [
//                 {
//                     title: '订单号',
//                     dataIndex: 'indId',
//                     width: 150,
//                     // ellipsis: true,
//                 },
//                 {
//                     title: '客户名',
//                     dataIndex: 'customerName',
//                     width: 150,
//                     ellipsis: true,
//                 },
//                 {
//                     title: '客户编号',
//                     dataIndex: 'customerNum',
//                     width: 150,
//                     ellipsis: true,
//                 },
//                 {
//                     title: '提交时间',
//                     dataIndex: 'submitTime',
//                     width: 150,
//                     ellipsis: true,
//                 },
//                 {
//                     title: '订单状态',
//                     dataIndex: 'indState',
//                     width: 150,
//                     ellipsis: true,
//                 },
//                 {
//                     title: '订单来源',
//                     dataIndex: 'indSource',
//                     width: 150,
//                     ellipsis: true,
//                 },
//                 {
//                     title: '下单总额',
//                     dataIndex: 'totalAmount',
//                     width: 150,
//                     ellipsis: true,
//                 },
//                 {
//                     title: '配送线路',
//                     dataIndex: 'transLine',
//                     width: 150,
//                     ellipsis: true,
//                 },
//                 {
//                     title: '配送司机',
//                     dataIndex: 'transDriver',
//                     width: 150,
//                     ellipsis: true,
//                 },
//                 {
//                     title: '发货时间',
//                     dataIndex: 'transTime',
//                     width: 150,
//                     ellipsis: true,
//                 },
//                 {
//                     title: '运费',
//                     dataIndex: 'transFee',
//                     width: 150,
//                     ellipsis: true,
//                 },
//                 {
//                     title: '收货时间',
//                     dataIndex: 'arrTime',
//                     width: 150,
//                     ellipsis: true,
//                 },
//             ],
//             subTabData: []
//         };
//     }
//     componentDidMount() {
//         const { dispatch } = this.props;
//         dispatch({
//             type: 'indent/queryIndent',
//             callback: (inst, count) => this.setState({ dataSource: inst, count: inst.length }),
//         });
//     }

//     components = {
//         header: {
//             cell: ResizeableTitle,
//         },
//     };

//     handleResize = index => (e, { size }) => {
//         this.setState(({ columns }) => {
//             const nextColumns = [...columns];
//             nextColumns[index] = {
//                 ...nextColumns[index],
//                 width: size.width,
//             };
//             return { columns: nextColumns };
//         });
//     };
//     expandedRowRender = (record) => {
//         // console.log(record)
//         // console.log(this)
//         console.log(this.state.subTabData[record.indId])
//         const columns = [
//             { title: '详情单号', dataIndex: 'orderId', width: '150px', align:'center'},
//             { title: '关联商品', dataIndex: 'commodity.name', width: '150px', align: 'center'},
//             { title: '商品数量', dataIndex: 'orderNum', width: '150px', align: 'center'},
//             { title: '商品单价', dataIndex: 'orderCost', width: '150px', align: 'center'}, 
//             { title: '商品总价', dataIndex: 'orderTotalCost', width: '150px', align: 'center' }, 
//             { title: '备注', dataIndex: 'orderComment', align: 'center' },
//         ];
        
//         // console.log(data)
//         return <Table columns={columns} dataSource={this.state.subTabData[record.indId]} pagination={false} />;
//     }

//     onExpand = (expanded, record) => {
//         const { dispatch } = this.props;
//         if (expanded === false) {
//             // 因为如果不断的添加键值对，会造成数据过于庞大，浪费资源，
//             // 因此在每次合并的时候讲相应键值下的数据清空
//             this.setState({
//                 subTabData: {
//                     ...this.state.subTabData,
//                     [record.indId]: [],
//                 }
//             });
//         } else {
//             console.log(record);
//             dispatch({
//                 type: 'indent/queryDetailByIndId',
//                 payload: record.indId,
//                 callback: (response) => {
//                     response.map(item => { item.orderTotalCost=item.orderNum*item.orderCost})
//                     this.setState({
//                         subTabData: {
//                             ...this.state.subTabData,
//                             [record.indId]: response,
//                         }
//                     });
//                 }
//             });
//         }
//     }
//     render() {
//         const columns = this.state.columns.map((col, index) => ({
//             ...col,
//             onHeaderCell: column => ({
//                 width: column.width,
//                 onResize: this.handleResize(index),
//             }),
//         }));
//         // console.log(this.state.dataSource)
//         return (
//             <Table 
//                 bordered
//                 rowKey={record => record.indId - 1}
//                 components={this.components}
//                 columns={columns} 
//                 dataSource={this.state.dataSource}
//                 scroll={{ x: 1000 }}
//                 title={() => '订单表'}
//                 expandedRowRender={record => this.expandedRowRender(record)}
//                 onExpand={(expanded, record) => this.onExpand(expanded, record)}
//             />

//         );
//     }
// }

// export default IndentView;