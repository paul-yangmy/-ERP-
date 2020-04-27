import { Alert, Checkbox, Icon ,message} from 'antd';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import styles from './style.less';
import moment from 'moment';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class Login extends Component {
  loginForm = undefined;

  state = {
    type: 'account',
    autoLogin: true,
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    console.log(values)

    if (!err) {
      const { dispatch } = this.props;
      const lastTime = moment().valueOf();
      localStorage.setItem('logInDate', lastTime);
      dispatch({
        type: 'login/login',
        payload: { ...values, type }, 
        callback: response => {
          console.log(response.status)
          if (response.status == true) {
            message.success("欢迎!");
          }
          else {
            message.error("登陆失败!");
          }
        }
      });   
    }
  };

  onTabChange = type => {
    this.setState({
      type,
    });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      if (!this.loginForm) {
        return;
      }

      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  renderMessage = content => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {
    const { login, submitting } = this.props;
    const { status, type: loginType } = login;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab
            key="account"
            tab="登陆界面"
          >
            {status === false &&
              loginType === 'account' &&
              !submitting &&
              this.renderMessage(
                "账户或密码错误!"
              )}
            <UserName
              name="userName"
              placeholder={`用户名`}
              rules={[
                {
                  required: true,
                  message: "请输入用户名",
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`密码`}
              rules={[
                {
                  required: true,
                  message: "请输入密码",
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
          </Tab>
          <Tab
            key="mobile"
            tab="手机登录"
          >
            {status === 'error' &&
              loginType === 'mobile' &&
              !submitting &&
              this.renderMessage(
                "验证码错误!"
              )}
            <Mobile
              name="mobile"
              placeholder={`手机号`}
              rules={[
                {
                  required: true,
                  message: "请输入手机号码",
                },
                {
                  pattern: /^1\d{10}$/,
                  message: "请输入正确的手机号",
                },
              ]}
            />
            <Captcha
              name="captcha"
              placeholder={`验证码`}
              countDown={120}
              onGetCaptcha={this.onGetCaptcha}
              getCaptchaButtonText={`获取验证码`}
              getCaptchaSecondText={`秒`}
              rules={[
                {
                  required: true,
                  message: "请输入验证码",
                },
              ]}
            />
          </Tab>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              记住我
            </Checkbox>
            <a
              style={{
                float: 'right',
              }}
              href=""
            >
              忘记密码
            </a>
          </div>
          <Submit loading={submitting}>
            登录
          </Submit>
        </LoginComponents>
      </div>
    );
  }
}

export default Login;
