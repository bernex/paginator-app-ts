import React, { ReactNode } from 'react';

import * as styles from './styles.scss';

export interface IProps {
  children: ReactNode;
}

export default ({ children }: IProps) => (
  <div className={styles.container}>
    <div className={styles.wrap}>
      {children}
    </div>
  </div>
);
