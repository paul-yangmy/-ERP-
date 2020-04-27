import { Avatar, Card, Col, List, Skeleton, Row, Calendar, Badge , Spin} from 'antd';
import React, { Component } from 'react';
import Link from 'umi/link';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Radar from './components/Radar';
import EditableLinkGroup from './components/EditableLinkGroup';
import InfiniteScroll from 'react-infinite-scroller';
import styles from './style.less';
import reqwest from 'reqwest';

const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';


function getListData(value) {
  let listData;

  switch (value.date()) {
    case 8:
      listData = [
        {
          type: 'warning',
          content: 'This is warning event.',
        },
        {
          type: 'success',
          content: 'This is usual event.',
        },
      ];
      break;

    case 10:
      listData = [
        {
          type: 'warning',
          content: 'This is warning event.',
        },
        {
          type: 'success',
          content: 'This is usual event.',
        },
        {
          type: 'error',
          content: 'This is error event.',
        },
      ];
      break;

    case 15:
      listData = [
        {
          type: 'warning',
          content: 'This is warning event',
        },
        {
          type: 'success',
          content: 'This is very long usual event。。....',
        },
        {
          type: 'error',
          content: 'This is error event 1.',
        },
        {
          type: 'error',
          content: 'This is error event 2.',
        },
        {
          type: 'error',
          content: 'This is error event 3.',
        },
        {
          type: 'error',
          content: 'This is error event 4.',
        },
      ];
      break;

    default:
  }

  return listData || [];
}

function dateCellRender(value) {
  const listData = getListData(value);
  return (
    <ul className="events">
      {listData.map(item => (
        <li key={item.content}>
          <Badge status={item.type} text={item.content} />
        </li>
      ))}
    </ul>
  );
}

function getMonthData(value) {
  if (value.month() === 8) {
    return 1394;
  }
}

function monthCellRender(value) {
  const num = getMonthData(value);
  return num ? (
    <div className="notes-month">
      <section>{num}</section>
      <span>Backlog number</span>
    </div>
  ) : null;
}

const links = [
  {
    title: '商品',
    href: 'item/commodity',
  },
  {
    title: '采购',
    href: 'purchase',
  },
  {
    title: '库房',
    href: 'storeroom/on_hand',
  },
  {
    title: '配送',
    href: 'dispatch/map',
  },
];

const PageHeaderContent = ({ currentUser }) => {
  const loading = currentUser && Object.keys(currentUser).length;

  if (!loading) {
    return (
      <Skeleton
        avatar
        paragraph={{
          rows: 1,
        }}
        active
      />
    );
  }
  var date = new Date();
  const hour=date.getHours();
  var time="";
  if (0<=hour&&hour<=9)
    time="早上好!";
  else if(9<hour&&hour<=11)
    time="上午好!";
  else if(hour>12&&hour<=19)
    time="下午好!";
  else if(hour>19&&hour<24)
    time="晚上好!";
  else
    time="中午好!";

  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar size="large" src={currentUser.uAvatar} />
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          {time }
          {currentUser.uName}
          ，祝你开心每一天！
        </div>
        <div>
          {currentUser.uTitle} |{currentUser.uGroup}
        </div>
      </div>
    </div>
  );
};

const ExtraContent = () => (
  <div className={styles.extraContent}>
    <EditableLinkGroup onAdd={() => { }} links={links} linkElement={Link} />
  </div>
);

class InfiniteList extends React.Component {
  state = {
    data: [],
    loading: false,
    hasMore: true,
  };

  componentDidMount() {
    this.fetchData(res => {
      this.setState({
        data: res.results,
      });
    });
  }

  fetchData = callback => {
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: res => {
        callback(res);
      },
    });
  };

  handleInfiniteOnLoad = () => {
    let { data } = this.state;
    this.setState({
      loading: true,
    });
    this.fetchData(res => {
      data = data.concat(res.results);
      this.setState({
        data,
        loading: false,
      });
    });
  };

  render() {
    return (
      <div className={styles.demoInfiniteContainer}>
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={this.handleInfiniteOnLoad}
          hasMore={!this.state.loading && this.state.hasMore}
          useWindow={false}
        >
          <List
            dataSource={this.state.data}
            renderItem={item => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title={<a href="https://www.sdongpo.com/xueyuan/shudongpozixun/">{item.name.last}</a>}
                  description={item.email}
                />
                <div>Content</div>
              </List.Item>
            )}
          >
            {this.state.loading && this.state.hasMore && (
              <div className={styles.demoLoadingContainer}>
                <Spin />
              </div>
            )}
          </List>
        </InfiniteScroll>
      </div>
    );
  }
}

@connect(({ homeAnd: { projectNotice, activities, radarData }, user, loading }) => ({
  currentUser: user.currentUser,
  projectNotice,
  activities,
  radarData,
  currentUserLoading: loading.effects['homeAnd/fetchUserCurrent'],
  projectLoading: loading.effects['homeAnd/fetchProjectNotice'],
  activitiesLoading: loading.effects['homeAnd/fetchActivitiesList'],
}))
class Home extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'homeAnd/init',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'homeAnd/clear',
    });
  }


  render() {
    const {
      currentUser,
      activities,
      projectNotice,
      projectLoading,
      activitiesLoading,
      radarData,
    } = this.props;
    return (
      <PageHeaderWrapper
        content={<PageHeaderContent currentUser={currentUser} />}
        extraContent={<ExtraContent />}
      >
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{
                marginBottom: 24,
              }}
              bordered={false}
              title="日程表"
            >
              <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{
                marginBottom: 24,
              }}
              bordered={false}
              title="营业趋势表"
              loading={radarData.length === 0}
            >
              <div className={styles.chart}>
                <Radar hasLegend height={343} data={radarData} />
              </div>
            </Card>
            <Card
              bodyStyle={{
                padding: 0,
              }}
              bordered={false}
              className={styles.activeCard}
              title="系统公告"
              loading={activitiesLoading}
            >
              <InfiniteList/>
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default Home;
