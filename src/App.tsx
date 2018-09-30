import { Provider } from 'mobx-react';
import React, {Component, Fragment} from 'react';
import Container from './components/Container';
import Editor from './components/Editor';
import MenuSlider from './components/MenuSlider';
import MenuModel from './stores/Menu';

const initialItems = [ 
  'Все', 'Новые', 'Популярное', 'Кено', 
  'Настольные', 'Лотерея', 'NOvomatic', 'Netent', 'Playtech', 'Aristocrat', 'Egt', 'Igt'
];

export default () => (
  <Provider menu={ new MenuModel(initialItems) }>
    <Fragment>
      <Container>
        <MenuSlider/>
      </Container>

      <Editor/>
    </Fragment>
  </Provider>
);
