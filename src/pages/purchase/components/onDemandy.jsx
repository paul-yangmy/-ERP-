import { Table, Typography } from 'antd';
import { Resizable } from 'react-resizable';
import React from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { connect } from 'dva';

//伸缩
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

//拖拽
const type = 'DragbleBodyRow';

const DragableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
    const ref = React.useRef();
    const [{ isOver, dropClassName }, drop] = useDrop({
        accept: type,
        collect: monitor => {
            const { index: dragIndex } = monitor.getItem() || {};
            if (dragIndex === index) {
                return {};
            }
            return {
                isOver: monitor.isOver(),
                dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
            };
        },
        drop: item => {
            moveRow(item.index, index);
        },
    });
    const [, drag] = useDrag({
        item: { type, index },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });
    drop(drag(ref));
    return (
        <tr
            ref={ref}
            className={`${className}${isOver ? dropClassName : ''}`}
            style={{ cursor: 'move', ...style }}
            {...restProps}
        />
    );
};

@connect(({ purchase, loading }) => ({
    purchase,
    loading: loading.effects['purchase/query'],
}))
class OnDemandyView extends React.Component {
    state = {
        dataSource: [],
        count: 0,
        columns: [
            {
                title: '采购单号',
                dataIndex: 'orderBuyId',
                width: 150,
                ellipsis: true,
                fixed: 'left',//固定
            },
            {
                title: '商品名称',
                dataIndex: 'commodity.name',
                fixed: 'left',//固定
                width: 150,
                ellipsis: true,
            },
            {
                title: '商品类型',
                dataIndex: 'commodity.classes',
                width: 150,
                ellipsis: true,
            },
            {
                title: '单位',
                dataIndex: 'commodity.unit',
                width: 150,
                ellipsis: true,
            },
            {
                title: '采购数量',
                dataIndex: 'buyNum',
                width: 150,
                ellipsis: true,
                // fixed: 'right',
            },
            {
                title: '提供商',
                dataIndex: 'commodity.purchases',
                width: 150,
                ellipsis: true,
            },
            {
                title: '质检报告',
                dataIndex: 'commodity.testReport.testFacility',
                width: 150,
                ellipsis: true,
            },
            {
                title: '检测员',
                dataIndex: 'commodity.testReport.testMan',
                width: 150,
                ellipsis: true,
            },
            {
                title: '检测类型',
                dataIndex: 'commodity.testReport.testSupplier',
                width: 150,
                ellipsis: true,
            },
            {
                title: '采购备注',
                dataIndex: 'buyComment',
                width: 150,
                ellipsis: true,
            },
        ],
    };
    componentDidMount() {
        const { dispatch ,reload} = this.props;
        console.log(reload)
        if(reload){
            dispatch({
                type: 'purchase/queryOnDemandyPurchase',
                callback: (inst) => this.setState({ dataSource: inst }),
            });
        }
    }

    moveRow = (dragIndex, hoverIndex) => {
        const { dataSource } = this.state;
        const dragRow = dataSource[dragIndex];

        this.setState(
            update(this.state, {
                dataSource: {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, dragRow],
                    ],
                },
            }),
        );
    };

    components = {
        header: {
            cell: ResizeableTitle,
        },
        body: {
            row: DragableBodyRow,
        },
    };

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

    render() {
        const columns = this.state.columns.map((col, index) => ({
            ...col,
            onHeaderCell: column => ({
                width: column.width,
                onResize: this.handleResize(index),
            }),
        }));
        console.log(this)
        return (
            <DndProvider backend={HTML5Backend}>
                <Table
                    bordered
                    components={this.components}
                    columns={columns}
                    dataSource={this.state.dataSource}
                    scroll={{ x: 1000 }}
                    title={() => '临时采购表'}
                    onRow={(record, index) => ({
                        index,
                        moveRow: this.moveRow,
                    })}

                />
            </DndProvider>
        );
    }
}

export default OnDemandyView;