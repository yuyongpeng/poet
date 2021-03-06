import * as React from 'react';
import { Route } from 'react-router';

import PageLoader, { ReducerDescription } from '../../../components/PageLoader';
import { IntegrationsLayout } from './Layout';

export class Integrations extends PageLoader<undefined, Object> {

  component = IntegrationsLayout;

  initialState(): undefined {
    return undefined;
  }

  routeHook(key: string) {
    return [<Route path="/documentation/integrations" key={key} component={this.container()} />]
  }

  reducerHook<State>(): ReducerDescription<undefined> {
    return null;
  }

  sagaHook(): any {
    return null;
  }

  select(state: any, ownProps: any): Object {
    return {};
  }
}
