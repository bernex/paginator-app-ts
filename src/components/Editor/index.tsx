import { inject, observer } from "mobx-react"
import React, { ChangeEvent } from 'react';
import {compose, withHandlers} from 'recompose';
import MenuModel from './../../stores/Menu';
import * as styles from './styles.scss';

interface IProps {
  menu?: MenuModel,
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => {}
}

export default compose<IProps, {}>(
  inject('menu'),
  withHandlers({
    onChange: ({ menu }: IProps) => ({ target }: ChangeEvent<HTMLTextAreaElement>) => {
      const values = target.value.split(',').map(item => item.trim());
    
      if(menu) { 
        menu.items.replace(values);  
      }
    }
  }),
  observer,
)(
  ({menu, onChange}: IProps) => (
    <div className={styles.editor}>
      <textarea value={menu && menu.items.join(',')} onChange={onChange} />
    </div>
  )
);
