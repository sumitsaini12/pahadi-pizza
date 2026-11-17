'use client';

import { Component, type ReactNode } from 'react';

/** If WebGL fails for any reason, drop the 3D layer and keep the photo poster. */
export default class CanvasBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
