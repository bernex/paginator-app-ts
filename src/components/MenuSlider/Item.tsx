import cn from 'classnames';
import React from 'react';
import Measure, {ContentRect} from 'react-measure';
import {compose, onlyUpdateForKeys, withHandlers} from 'recompose';
import * as styles from './styles.scss';

export interface IProps {
  text: string;
  selected: boolean;
  doResizeReturn: (width: number) => void;
  onClick: () => void;
}

interface IPropsInternal extends IProps {
  onResize: ({ entry }: ContentRect) => {},
  doClick: (event: React.MouseEvent<HTMLDivElement>) => {}
}

export default compose<IProps, IProps>(
  onlyUpdateForKeys(['text', 'selected']),
  withHandlers({
    doClick: ({ onClick }: IProps) => (event: React.MouseEvent<HTMLDivElement>) => onClick(),
    onResize: ({ doResizeReturn }: IProps) => ({ entry }: ContentRect) => doResizeReturn(entry.width)
  }),
)(
  ({text, selected, onResize, doClick}: IPropsInternal) => {
    const className = cn(
      styles.button, 
      { [styles.selected]: selected } 
    );
    
    return (
      <Measure bounds={true} onResize={onResize}>
        {({ measureRef }) => (
          <span ref={measureRef}>
            <div className={className} onClick={doClick}><div>{text}</div></div>
          </span>
        )}
      </Measure>
    );
  }
);
