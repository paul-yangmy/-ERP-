import React, { PureComponent, Fragment } from 'react';
import LzEditor from 'react-lz-editor'
import moment from 'moment';
import { connect } from 'dva';
import { Card, Table, Tabs, Form, message, Row, Input, Select, Button ,InputNumber ,Modal ,Pagination ,Icon ,Upload ,Popconfirm ,DatePicker} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
 
 
const FormItem = Form.Item;
const { Option } = Select;
 
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
  },
};
 
@connect(({ newArticle, loading ,}) => ({
  newArticle,
  loading: loading.models.newArticle,
  submitting: loading.effects['form/submitAdvancedForm'],
}))
@Form.create()
export default class WriteArticle extends PureComponent {
  state = {
    htmlContent: '<h3>请输入</h3>',
    content:'',
    fileList: [],
    preBannerVisible: false,
    previewImage: '',
    fileList1: [],
    upImgUrl:'',
 
    category:0,
    unit:''
  };
  
  receiveHtml=(content)=> {
    console.log("recieved HTML content", content);
    this.setState({
      fileList:[],
      content:content
    });
  }
  uploadSuccess=(res)=>{ //文本 富文本上传图片成功的回调函数
    console.log(res)
    let url = 'https://xxx.com.cn/'
    let arr = this.state.fileList
    let obj={
      uid: res.url,
      name: 'image.png',
      status: 'done',
      url: url+res.url,
    }
    arr.push(obj)
    this.setState({ fileList: [...arr] });  
  }
  handleChange=(res)=>{
    console.log(res)
  }
  beforeUpload=()=>{}
  onValidateForm = () => { //转化为分钟
    const { validateFields } = this.props.form;
    const { unit ,content} = this.state
    validateFields((err, values) => {
      values.banner = this.state.upImgUrl
      if(unit == 2){
        values.minute = values.minute*60
      }
      if(unit == 3){
        values.minute = values.minute*60*24
      }
      values.content = content
      console.log(values)
      if (!err) {
        this.props.dispatch({
          type: 'newArticle/newOne',
          payload: values,
        }).then(()=>{
          this.props.form.setFields({title:""})
        })
      }
    });
  }
 
  handleSuccess = (e) => { //banner图的成功回调函数 返回的不是全路径，我需要自己拼接
    let arr = [{
      uid: '-1',
      name: 'banner.png',
      status: 'done',
      url: 'https://xxx.com.cn/'+e.url,
    }]
    this.setState({
      fileList1:arr,
      upImgUrl:'https://xxx.com.cn/'+e.url
    })
    if(e.code ==201){
      message.success(e.msg)
    }else if(e.code ==404){
      message.error(e.msg)
    }
  }
  remove = (res) => { //没用到
    console.log(res)
    // this.props.dispatch({
    //   type: 'sponsorMeeting/delImg',
    //   payload: {
    //     id: res.uid,
    //     meetingId: this.state.meetingId,
    //     uploadType:this.state.uploadType
    //   },
    // }).then(()=>{
    //   message.success('删除成功')
    // })
  }
  handlePreview = (file) => { //预览方法
    this.setState({
      previewImage: file.url || file.thumbUrl,
      preBannerVisible: true,
    });
  }
  handleImgCancel = () => this.setState({ preBannerVisible: false }) //关闭banner预览
 
  selectCategory=(category)=>{ //选择类型
    console.log(category)
    this.setState({
      category:category
    })
  }
  
  selectUnit=(n)=>{ //选择单位
    console.log(n)
    this.setState({
      unit:n
    })
  }
  showCategory(){//根据选择类型 显示表单
    const { getFieldDecorator} = this.props.form;
    const selectAfter = (
      <Select defaultValue="1" style={{ width: 80 }} onChange={this.selectUnit}>
        <Option value="1">分钟</Option>
        <Option value="2">小时</Option>
        <Option value="3">天</Option>
      </Select>
    );
    
    if(this.state.category == 1){
      return ;
    }else if(this.state.category == 2){
      return (
        <Form.Item label='公共推文推送日期' {...formItemLayout}>
        {getFieldDecorator('date', {
          rules: [{ required: true, message: '请输入' }],
          initialValue:'' ,
        })(
          <DatePicker
            format="YYYY-MM-DD"
            disabledDate={this.disabledDate}
          />
        )}
      </Form.Item>
      )
    }else if(this.state.category == 3){
      return (
        <Form.Item label='个性化推文推送时间' {...formItemLayout}>
        {getFieldDecorator('minute', {
          rules: [{ required: true, message: '请输入' },{
          pattern: /^[1-9]\d*$/, message: '请输入正整数！'}
        ],
          initialValue:'',
        })(
          <Input addonBefore='入组后' addonAfter={selectAfter} />
        )}
      </Form.Item>
      )
    }
  }
  disabledDate(current) { //禁用时间
    return current < moment().endOf('day').subtract(1, "days");
  }
 
 
  render() {
    const { newArticle: { data ,lookimg }, loading, form } = this.props;
   
    const { validateFields ,getFieldDecorator} = form;
    const { preBannerVisible, previewImage, fileList1 ,fileList} = this.state;
    console.log(data,fileList)
    const upload = {
      name: 'file',
      action: "https://xxx.com.cn/MeetingPhoto",//上传接口，成功后返回该图片服务器地址
      listType: 'picture',
      headers: {
        authorization: 'authorization-text',
      },
      fileList: [...this.state.fileList],
      onSuccess:this.uploadSuccess,
      onChange: this.handleChange,
      supportServerRender:true,
      multiple: false,
      beforeUpload: this.beforeUpload,
      showUploadList: true
    }
    
      const uploadButton = (
        <div>
          <Icon type="plus" />
          <div className="ant-upload-text">上传</div>
        </div>
      );
      
    return (
      <PageHeaderLayout>
        <Card bordered={false}> 
          <Form onSubmit={this.onValidateForm}>
            <Form.Item label='Banner图' {...formItemLayout}>
            {getFieldDecorator('banner', {
              rules: [{ required: true, message: '请输入' }],
              initialValue:'' ,
            })(
              <Upload 
                name='file'
                accept='image/*'
                action="https://xxx.cn/MeetingPhoto"
                fileList={fileList1}
                onSuccess={this.handleSuccess}
                onPreview={this.handlePreview}
                onRemove={this.remove}
                listType="picture-card">
                  {fileList1.length > 0 ? null : uploadButton} //限制上传个数
              </Upload>           
            )}
          </Form.Item>
          <Form.Item label='文章标题' {...formItemLayout}>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入' }],
              initialValue:'' ,
            })(
              <Input></Input>
            )}
          </Form.Item>
          <Form.Item label='文章类型' {...formItemLayout}>
            {getFieldDecorator('categoryId', {
              rules: [{ required: true, message: '请输入' }],
              initialValue:'' ,
            })(
              <Select onChange={this.selectCategory}>
                <Option value="1">医生推文</Option>
                <Option value="2">公共推文</Option>
                <Option value="3">个性化推文</Option>
              </Select>
            )}
          </Form.Item>
          {this.showCategory()}
          <Form.Item label='作者' {...formItemLayout}>
            {getFieldDecorator('author', {
              rules: [{ required: true, message: '请输入' }],
              initialValue:'' ,
            })(
              <Input></Input>
            )}
          </Form.Item>
          <Form.Item label='内容' {...formItemLayout}>
            {getFieldDecorator('content', {
              rules: [{ required: true, message: '请输入' }],
              initialValue:this.state.content,
            })(
              <LzEditor 
              active={true} 
              importContent={this.state.htmlContent}
              cbReceiver={this.receiveHtml} 
              uploadProps={upload}
              video={false}
              audio={false}
              lang="ch"/>
            )}
          </Form.Item> 
          <FormItem>
            <Button type="primary" htmlType="submit" style={{float:'right'}}>确认发布</Button>
          </FormItem>  
        </Form>

        <Modal visible={preBannerVisible} footer={null} onCancel={this.handleImgCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
