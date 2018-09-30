import cn from 'classnames';
import { computed, observable } from "mobx"
import { inject, observer } from "mobx-react"
import React, {ReactNode} from 'react';
import Measure, {ContentRect} from 'react-measure';
import MenuModel from './../../stores/Menu';
import Item from './Item';
import * as styles from './styles.scss';

export interface IMenuSliderProps {
  menu?: MenuModel;
}

@inject('menu')
@observer
class MenuSlider extends React.Component<IMenuSliderProps,{}> {
  @observable private widths: Map<string, number> = new Map();
  @observable private bodyWidth: number | null = null;

  private arrowLeftRef = React.createRef<HTMLDivElement>();
  private arrowRightRef = React.createRef<HTMLDivElement>();

  @computed get range() {
    const { bodyWidth, widths, props } = this;
  

    if(!props.menu || !bodyWidth) {
      return [];
    }

    const { selected, items } = props.menu;
    let widthLeft = bodyWidth;
    
    let from = selected;
    let to = selected;

    let afterChilds = items.slice(selected);
    let beforeChilds = items.slice(0, selected);
    
    const decrementWidth = (child: string, direction: 'to' | 'from') => {
      const width = widths.get(child) || 0;
      
      if (!width || widthLeft >= width) {
        widthLeft -= width;

        const index = items.indexOf(child);
        if(direction === 'to') {
          to = index;
        } else {
          from = index;
        }
      } else {
        beforeChilds = [];
        afterChilds = [];
      }
    }
    
    // Поочереди берем элементы меню справа затем слева
    while(beforeChilds.length > 0 || afterChilds.length > 0) {
      if(afterChilds.length > 0) { 
        const item = afterChilds.shift();
        if(item) { decrementWidth(item, 'to'); } 
      }
      if(beforeChilds.length > 0) {
        const item = beforeChilds.pop();
        if(item) { decrementWidth(item, 'from'); } 
      }
    }

    return props.menu.items.slice(from, to+1)
  }

  public render() {
    const { range } = this;
    const { menu } = this.props;

    let availableItems: ReactNode[] = [];
    if(range) { // this.bodyWidth
      availableItems = range.map(this.renderItem); 
    }
    
    return (
      <Measure bounds={true} onResize={this.onResize}>
        {({ measureRef }) => (
          <div className={styles.body} ref={measureRef}>
            <div className={cn(styles.button)} 
                ref={this.arrowLeftRef}
                onClick={menu && menu.prev}><div className={cn(styles.arrow, styles.arrowLeft)} /></div>

            {availableItems}

            <div className={cn(styles.button)} 
                ref={this.arrowRightRef}
                onClick={menu && menu.next}><div className={cn(styles.arrow, styles.arrowRight)}/></div>
          </div>
        )}
      </Measure>
    );
  }

  private selectItem = (item: string) => () => {
    const menu = this.props.menu;
    if(menu) { menu.select(item); }
  }

  private renderItem = (item: string) => {
    const { menu } = this.props;
    
    return (
      <Item key={item}
            text={item} 
            selected={ !!menu && menu.selectedItem === item }
            doResizeReturn={this.doResizeReturn(item)}
            onClick={this.selectItem(item)}
      />
    );
  }

  // Подсчитывает ширину доступной области
  private onResize = ({ entry }: ContentRect) => {
    let totalWidth = entry.width;
    const arrowLeft = this.arrowLeftRef.current;
    const arrowRight = this.arrowRightRef.current;

    if(arrowLeft) {
      console.log(arrowLeft.getBoundingClientRect().width)
      totalWidth -= arrowLeft.getBoundingClientRect().width; 
    }
    if(arrowRight) {
      totalWidth -= arrowRight.getBoundingClientRect().width; 
    }
    this.bodyWidth = totalWidth; 
  }

  private doResizeReturn = (item: string) => (width: number) => {
    this.widths.set(item, width);
  }
}

export default MenuSlider;
