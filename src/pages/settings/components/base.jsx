import { Button, Form, Input, Select, Upload, message, Tooltip, Icon, Mentions, Divider,Card} from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import styles from './BaseView.less';
import SecurityView from './security';

const FormItem = Form.Item;
const { Option } = Select; 
const { TextArea } = Input;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = (props) => {
  const {changeAvatar,avatar}=props;
  console.log(props)
  // const getBase64=(file) =>{
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = error => reject(error);
  //   });
  // }
  const onChange= (info) =>{
    console.log(info)
    //上传图片而非文件
    const isJPG = file.type === 'image/jpeg';
    const isJPEG = file.type === 'image/jpeg';
    const isGIF = file.type === 'image/gif';
    const isPNG = file.type === 'image/png';
    if (!(isJPG || isJPEG || isGIF || isPNG)) {
      Modal.error({
        title: '只能上传JPG 、JPEG 、GIF、 PNG格式的图片~',
      });
      return;
    }
    if(info.file.status==='done'){
      console.log(info.file.name)
      console.log(info.file.response)
      changeAvatar(info.file.response);
    }
  }
  return (
    <Fragment>
      <div className={styles.avatar_title}>
        头像
      </div>
      <div className={styles.avatar}>
        <img src={avatar} alt="avatar" />
      </div>
      <Upload 
        // fileList={[]}    
        action='graph/UpdateAvatar'
        onChange={onChange}
      >
        <div className={styles.button_view}>
          <Button icon="upload">
            更改头像
          </Button>
        </div>
      </Upload>
    </Fragment>
  );
}

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class BaseView extends Component {
  state={
    avatar:'',
  };
  view = undefined;

  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    console.log(currentUser)
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] || null;
      form.setFieldsValue(obj);
    });

    if (currentUser.uAvatar){
      this.setState({
        avatar: currentUser.uAvatar,
      });
    }
    else{
      this.setState({
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      });
    }
  };

  changeAvatar=(response)=>{
    this.setState({
      avatar:response.url,
    })
  }

  getViewDom = ref => {
    this.view = ref;
  };

  handlerSubmit = event => {
    event.preventDefault();
    const { form, dispatch, currentUser } = this.props;
    console.log(this.props)
    form.validateFieldsAndScroll((err,values) => {
      values.uId = currentUser.uId
      values.uAvatar = currentUser.uAvatar
      console.log(values)
      if (!err) {
        dispatch({
          type: 'currentUser/UpdateUser',
          payload: values,
        });
        message.success("更新基本信息成功!");
      }
    });
  };

  onChange = e => {
    console.log(e);
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {avatar}=this.state;
    return (
      <Card bordered={false}>
        <div className={styles.title}>基本设置</div>
        <div className={styles.baseView} ref={this.getViewDom}>
          <div className={styles.left}>
            <Form layout="vertical" hideRequiredMark>
              <FormItem
                label={
                  <span>
                    昵称&nbsp;
                <Tooltip title="想让别人如何称呼你?">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >{getFieldDecorator('uName', {
                rules: [
                  {
                    required: true,
                    message: "请输入你的昵称！"
                  },
                ],
              })(<Input />)}
              </FormItem>

              <FormItem
                label= "性别"
              >{getFieldDecorator('uSex')(<Input />)}
              </FormItem>

              <FormItem
                label={
                  <span>
                    个性签名&nbsp;
                </span>
                }
              >{getFieldDecorator('uTitle')(<TextArea rows={4} allowClear onChange={this.onChange}/>)}
              </FormItem>

              {/* <FormItem
              label= "邮箱"
            >
              {getFieldDecorator('uEmail', {
                rules: [
                  {
                    required: true,
                    message: "请输入您的邮箱!"
                  },
                ],
              })(<Input />)}
            </FormItem>
         
            <FormItem
              label="联系电话"
            >
              {getFieldDecorator('uPhone', {
                rules: [
                  {
                    required: true,
                    message: "请输入您的联系电话!",
                  },
                ],
              })(<PhoneView />)}
            </FormItem> */}
              <Button type="primary" onClick={this.handlerSubmit}>
                更新基本信息
              </Button>
            </Form>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={avatar} changeAvatar={this.changeAvatar} />
          </div>
        </div>
        <Divider />
        <SecurityView />
      </Card>
    );
  }
}

export default Form.create()(BaseView);
