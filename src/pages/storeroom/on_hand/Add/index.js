import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Form, Input, Button, Card, message, Transfer } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;

@connect(({ role, permissions, loading }) => ({
  role,
  permissions,
  submitting: loading.effects['role/edit'],
}))
@Form.create()
class Add extends PureComponent {
  componentDidMount() {
    const {
      match: { params = {} },
      dispatch,
    } = this.props;

    dispatch({
      type: 'role/edit',
      payload: params,
    });
    dispatch({
      type: 'permissions/getAll',
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'role/save',
          payload: values,
          callback: response => {
            if (response.type === 'success') {
              message.success(response.content);
              router.push('/role');
            } else {
              message.error(response.content);
            }
          },
        });
      }
    });
  };

  renderPermissionItem = item => {
    const customLabel = (
      <span className="custom-item">
        {item.name} - {item.menuName}
      </span>
    );

    return {
      label: customLabel,
      value: item.url,
    };
  };

  render() {
    const {
      submitting,
      role: { values = {} },
      permissions: { getAllData = [] },
    } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            {getFieldDecorator('id', {
              initialValue: values.id || '',
            })(<Input type="hidden" />)}
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name', {
                initialValue: values.name || '',
                rules: [
                  {
                    required: true,
                    message: '必填',
                  },
                ],
              })(<Input autoComplete="off" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="描述">
              {getFieldDecorator('description', {
                initialValue: values.description || '',
              })(
                <Input.TextArea autosize={{ minRows: 4, maxRows: 6 }} style={{ resize: 'none' }} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="权限">
              {getFieldDecorator('permissions', {
                valuePropName: 'targetKeys',
                initialValue: values.permissions || [],
                rules: [{ required: true, message: '至少拥有一个权限' }],
              })(
                <Transfer
                  listStyle={{
                    width: '44%',
                    height: 300,
                  }}
                  showSearch
                  rowKey={record => record.url}
                  dataSource={getAllData}
                  render={this.renderPermissionItem}
                  filterOption={(inputValue, option) =>
                    option.name.indexOf(inputValue) >= 0 || option.menuName.indexOf(inputValue) >= 0
                  }
                />
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.save" />
              </Button>
              <Link to="/role">
                <Button style={{ marginLeft: 8 }}>返回</Button>
              </Link>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Add;
