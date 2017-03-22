import * as React from 'react';
const classNames = require('classnames');

import { ClassNameProps } from '../../common';
import { clearTimeout } from 'timers';

export interface CopyableTextProps extends ClassNameProps {
  readonly text: string;
}

interface CopyableTextState {
  readonly tooltipVisible: boolean;
  readonly tooltipPositionLeft?: number;
  readonly tooltipPositionTop?: number;
}

export class CopyableText extends React.Component<CopyableTextProps, CopyableTextState> {
  private readonly styleTranslate = {
    transform: 'translate(-50%, -100%)'
  };
  private input: HTMLInputElement;
  private timeout: number;

  constructor() {
    super(...arguments);
    this.state = {
      tooltipVisible: false
    };
  }

  render() {
    return (
      <div className={classNames(this.props.className, this.state.tooltipVisible && 'tooltip-visible')}>
        <input
          type="text"
          value={this.props.text}
          ref={input => this.input = input}
          readOnly />
        <button onClick={this.onClick}>COPY</button>
        <div className="value">{this.props.children || this.props.text}</div>
        <div className="tooltip" style={{...this.styleTranslate, ...this.stylePosition()}} >Copied</div>
      </div>
    );
  }

  private onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.input.select();
    document.execCommand('copy');

    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }

    this.setState({ tooltipVisible: true, tooltipPositionLeft: event.clientX, tooltipPositionTop: event.clientY });
    this.timeout = window.setTimeout(() => this.setState({ tooltipVisible: false }), 2000);
  };

  private stylePosition = () => ({left: this.state.tooltipPositionLeft, top: this.state.tooltipPositionTop})
}