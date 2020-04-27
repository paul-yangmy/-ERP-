import React, { Fragment, PureComponent } from 'react';
import { Input, Tooltip} from 'antd';
import styles from './PhoneView.less';


class PhoneView extends PureComponent {
  render() {
    console.log(this.props)
    const { value, onChange } = this.props;
    let values = '';
    return (
      <Fragment>
        <Input
          className={styles.phone_number}
          onChange={e => {
            if (onChange) {
              onChange(`${e.target.value}`);
            }
          }}
          value={value}
        />
      </Fragment>
    );
  }
}

export default PhoneView;
