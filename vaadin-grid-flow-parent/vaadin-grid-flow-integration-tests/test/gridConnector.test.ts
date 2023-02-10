import './env-setup.ts';
import '../../vaadin-grid-flow/src/main/resources/META-INF/resources/frontend/gridConnector.js';
import { expect, fixtureSync, nextFrame } from '@open-wc/testing';
import type {} from '@web/test-runner-mocha';
import sinon from 'sinon';

// TODO: Cleanup
type Vaadin = {
  Flow: {
    gridConnector: any;
  };
};

const Vaadin = window.Vaadin as Vaadin;
const gridConnector = Vaadin.Flow.gridConnector;

describe('grid connector', () => {
  let grid, connector;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column path="name"></vaadin-grid-column>
      </vaadin-grid>
    `);
    // Stub the necessary server-side methods
    grid.$server = {}
    grid.$server.confirmUpdate = sinon.stub();

    gridConnector.initLazy(grid);
    connector = grid.$connector;
  });

  it('should not reinitialize the connector', () => {
    gridConnector.initLazy(grid);
    expect(grid.$connector).to.equal(connector);
  });

  it('should add root level items', async () => {
    connector.updateSize(1);
    connector.set(0, [{ name: 'foo' }], null);
    connector.confirm(0);
    await nextFrame();

    // TODO: add helpers
    expect(grid.$.items.childElementCount).to.equal(1);
  });
});
