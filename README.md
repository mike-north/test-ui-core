# @test-ui/core

[![Build Status](https://travis-ci.org/mike-north/test-ui-core.svg?branch=master)](https://travis-ci.org/mike-north/test-ui-core)
[![Version](https://img.shields.io/npm/v/@test-ui/core.svg)](https://www.npmjs.com/package/@test-ui/core)

A utility that facilitates controlling a remote software test suite (i.e., running QUnit or Mocha tests in an `<iframe>`).

## Setup

```sh
npm install --save-dev @test-ui/core
```

## Use

This library involves setting up a client and a server, each with a respective "connection" that handles the particulars of communication. Support for `postMessage` as a communication channel is built-in, but it's possible to implement support for other technologies (i.e., WebSockets, XHR, etc...)

### The Server

First, you must extend the abstract `Server` class, and implement all abstract methods. 

```ts
import { Server } from '@test-ui/core'

class MyServer extends Server {

  /**
   * Handle the particulars of setting up the test server's connection.
   * Optionally, a unique "session id" may be returned. If the server
   * has to restart for one reason or another, this id may be used
   * to retrieve some state from the `Client`.
   */
  protected async boot(): Promise<{ id: string } | undefined> {
    
    // Somewhere, sometime, notify the client that the server booted
    (await this.conn).notifyIsBooted(stateRef);
  }

  /**
   * Handle the particulars of preparing the test environment in preparation
   * for a test run. This might include setting filters/options as appropriate
   * 
   * The return value's promise resolves to an object with a `ready` property.
   * If this has a `true` value, the test run will proceed. If `false` it
   * will not.
   * 
   * @param state a simple object containing an id, and options for the test run
   */
  protected async prepareEnvironment(state: State): Promise<{ ready: boolean }> {

    // Somewhere, sometime, notify the client that the server is prepared
    (await this.conn).notifyIsPrepared(state);
  }

  /**
   * Run the tests, as described by the optional filter
   * 
   * @param moduleFilter Filter describing test modules that should be run
   */
  protected async runTests(moduleFilter?: PredicateObject<TestModule>): 
  Promise<void> {

    // Emit send test results back to the client
    this.sendTestData(...)
  }

}
```

Before we instantiate the server, we need a connection. You can either create your own connection type or use the built-in `IFrameConnectionServer` type.

```ts
import MyServer from './my-server';
import { IFrameConnectionServer } from '@test-ui/core';

const myServer = new MyServer({
  connection: new IFrameConnectionServer();
});

myServer.start(); // start the server
```


### The Client

You must create a subclass of the `Client` type
```ts
import { Client } from '@test-ui/core';

class MyClient extends Client {

  /**
   * Handle anything specific that must be done on the client, before we
   * instruct the server to get ready for a test run
   */
  protected async prepareServerFrame(moduleFilter?: PredicateObject<TestModule>): Promise<any> {}
}

```

In order to instantate the client, you'll need to pass it a connection. You can either create your own connection class, or use the built-in `IFrameConnectionClient` type.

```ts
const frame: HTMLIFrameElement = document.querySelector('iframe');
const client = new MyClient({
  connection: new IFrameConnectionClient({
    frame,
    baseUrl: '/tests' // URL of the iframe src
  })
});
```

## Copyright

(c) 2018 LinkedIn