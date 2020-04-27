import React, { Component, Fragment } from 'react';
import { List , Modal, Form, Input,message } from 'antd';
import styles from './BaseView.less';
import { connect } from 'dva';

class ChangePwd extends Component {
  handleSubmit=(e)=>{
    e.preventDefault();
    console.log(this.props)
    const {form} = this.props.props;
    const { onOk } = this.props;
    // console.log(form)
    form.validateFieldsAndScroll((err,values)=>{
      if(!err){
        onOk(values);
      }
    })
  }
  onCancel = (e) => {
    e.preventDefault();
  }

  checkPwd = (rule, value,callback)=>{
    const { form } = this.props.props;
    const newPassword=form.getFieldValue("newPassword")
    console.log(newPassword)
    if(value!==newPassword){
        callback("请输入相同的密码!");
    } else {
        callback()
    }
  }
  render(){
    // console.log(this)
    const { getFieldDecorator } = this.props.props.form;
    const { visible:changePwdVisible,onCancel } = this.props;

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
        title="修改登录密码"
        visible={changePwdVisible}
        destroyOnClose
        maskClosable={false}
        onOk={this.handleSubmit}
        onCancel={onCancel}
      >
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="当前密码">
            {getFieldDecorator('oldPassword',{
              rules:[
                {required:true,message:'必填'}
              ]
            })(<Input.Password />)}
          </Form.Item>
          <Form.Item label="新的密码">
            {getFieldDecorator('newPassword', {
              rules: [
                { required: true, message: '必填' }
              ]
            })(<Input.Password />)}
          </Form.Item>
          <Form.Item label="确认密码">
            {getFieldDecorator('rePassword', {
              rules: [
                { required: true, message: '必填' },
                { validator:this.checkPwd}
              ]
            })(<Input.Password />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}


@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class SecurityView extends Component {
  state={
    changePwdVisible:false,
    changeEmailVisible: false,
    changePhoneVisible: false,
  }

  changePwd =(e)=>{
    e.preventDefault();
    this.setState({ changePwdVisible: true, })
  }
  changeEmail = (e) => {
    e.preventDefault();
    this.setState({ changeEmailVisible: true, })
  }
  changePhone = (e) => {
    e.preventDefault();
    this.setState({ changePhoneVisible: true, })
  }

  onOk = (data)=>{
    console.log(data)
    //后端交互
    console.log(this.props)
    const { dispatch, currentUser } = this.props;
    // console.log(dispatch)
    data.uId=currentUser.uId
    dispatch({
      type: "user/changePwd",
      payload: data,
      callback: response => {
        if (response === true) {
          console.log(1)
          message.success("修改密码成功！");
          this.setState({ changePwdVisible: false });
        }
        else {
          message.error("请输入正确的密码！");
        }
      }
    })
  }
  onCancel=()=>{
    this.setState({
      changePwdVisible:false,
      changeEmailVisible:false,
      changePhoneVisible:false,})
  }

  getData = (currentUser)=> {
    const phone = currentUser.uPhone.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")
    console.log(phone)
    return([
    {
      title:"账户密码",
      actions: [
        <a key="Modify" onClick={this.changePwd}>
          修改
        </a>,
      ],
    },
    {
      title:"密保手机",
      description: `关联手机号：` + phone,
      actions: [
        <a key="Modify" onClick={this.changePhone}>
          修改
        </a>,
      ],
    },

    {
      title: '密保邮箱',
      description: `关联邮箱：` + currentUser.uEmail,
      actions: [
        <a key="Modify" onClick={this.changeEmail}>
          修改
        </a>,
      ],
    },
  ])
}

  render() {
    // console.log(this.props.uId)
    // console.log(currentUserID)
    // console.log(this.props)
    const { currentUser } = this.props;
    // console.log(currentUser)
    const { changePwdVisible} = this.state;
    const data = this.getData(currentUser);
    return (
      <Fragment>
        <div className={styles.title}>安全设置</div>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
        <ChangePwd props={this.props} visible={ changePwdVisible } onOk={this.onOk} onCancel={this.onCancel} />
        
      </Fragment>
    );
  }
}
const SecurityView2 = Form.create({})(SecurityView);
export default SecurityView2;
