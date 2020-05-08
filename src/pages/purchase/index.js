import { Carousel, Card,Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import IndentView from './components/indent';
import PurchaseView from './components/purchase';
import OnDemandyView from './components/onDemandy';
import styles from './style.less';

class CarouselCard extends React.Component {
    state = {
        loading: true,
        cardLoading:true,
        reload:false,
    };

    onChange = checked => {
        
        this.setState({ loading: !checked });
        this.setState({ cardLoading: false });
        this.setState({ reload: true })
        
        setTimeout(() => {
            this.setState({ loading: checked });
        }, 3000)
        
    };
    change=()=>{
        return(
        <a onClick = {() => {
            this.refs.welcome.prev();
        }}> 点击事件</a >
    )
    }

    render(){
        const { loading, cardLoading} = this.state;
        return(
            <PageHeaderWrapper>
                <Button type="primary" icon="scan" onClick={this.onChange} loading ={!loading}>刷新采购单数据！</Button>
                
                <Carousel autoplay effect="fade" ref={this.change} className={styles.carousel}>
                    <div>
                        <Card bordered={true} loading={false} >
                            <PurchaseView />
                        </Card>
                    </div>
                    <div>
                        <Card bordered={true} loading={cardLoading} >
                            <OnDemandyView reload={this.state.reload}/>
                        </Card>   
                    </div>
                </Carousel>
            </PageHeaderWrapper>
        )
    }
}
export default CarouselCard;
