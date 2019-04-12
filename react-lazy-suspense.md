### React.lazy & Suspense目的：代码拆分

#### 文件加载方式

**1. 静态加载(es6 import)**

```
import { add } from './math'; 
console.log(add(1,2));
```

特点：

*  必须在编译的时候就指定import和exports的模块，不能在运行时动态加载；
* 只能在代码的最上部声明；
* 会连同引用模块一起打成一个bundle。

**2. 动态加载**

```
import("./math").then(math => {
  console.log(math.add(1,2));
});
```
遵循promise规范。webpack已支持动态import，webpack遇到import() 语法会自动进行代码拆分。 目前动态 import 仍旧是 ECMAScript 的提案，还没有纳入规范。

特点：

 - 可以在延迟加载、条件加载和按需加载（用户操作）的情景下使用import()，降低首次加载的代码量。
 - 可以在代码的任何地方使用。
 - import()能够传递字符串，可以根据需求构造匹配符。
 
条件渲染:

```
class MyComponent extends Component {
  constructor() {
    super();
    this.state = {};
    // 动态加载
    import('./OtherComponent').then(({ default: OtherComponent }) => {
      this.setState({ OtherComponent });
    });
  }
  
  render() {
    const { OtherComponent } = this.state;
    return (
      <div>
        {/* 条件渲染 */}
        { OtherComponent && <OtherComponent /> }
      </div>
    );
  }
}
```

缺点：

 * 对父组件有侵入性（state.OtherComponent）
 * 布局有抖动体验不好（需要对不同组件加很多loading）。
 

结论：动态 import 主要应用场景是延迟加载方法，对于组件来说并不是很适用， React.lazy 可以解决组件的懒加载。


## React.lazy & Suspense

### React.lazy

-  React.lazy方法接受一个函数作为参数，函数内部调用动态import()方法，返回一个Promise，并解析(resolve)为一个带有包含React组件的默认导出的模块（export default）。
-  把条件渲染细节挪到了框架层，允许把动态导入的组件当作普通组件一样渲染。
-  实现延迟加载/按需加载，和代码分割。

**before:**

```
import OtherComponent from './OtherComponent';
function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

**after:**

```
import React from 'react';
const OtherComponent = React.lazy(() => import('./OtherComponent'));
function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

这样只会在组件渲染的时候才会去加载包含OtherComponent的bundle，（webpack编译时已基于import()自动对代码进行了分割）。

P.S.   React.lazy目前仅支持默认导出。如果要导入的模块使用命名导出，则可以创建一个中间模块，将其重新导出为默认模块。

```
// ManyComponents.js
export const MyComponent = /* ... */;
export const MyUnusedComponent = /* ... */;
```
```
// MyComponent.js
export { MyComponent as default } from "./ManyComponents.js";
```
```
// MyApp.js
import React, { lazy } from 'react';
const MyComponent = lazy(() => import("./MyComponent.js"));
```

### Suspense 
 
-  该组件在加载bundle过程中提供加载标识，比如loading。  有一个必填属性fallback，接收任何react元素。 Suspense可以放在lazy组件之上的任何位置，也可以包含多个lazy组件。没被Suspense包起来的lazy组件会报错。
- 在由于网络等原因失败的情况下，可以结合使用自定义Error boundaries组件处理错误。

* Error boundaries 错误边界组件

	如果懒加载模块加载失败会触发error。可以通过使用Error boundaries来处理这些错误，显示更友好的错误界面。一旦创建好Error boundaries组件，可以在懒加载组件上方任何位置使用它。
	
	只要一个组件内部定义了静态getDerivedStateFromError()或者 componentDidCatch()方法，这个组件就是错误边界组件。getDerivedStateFromError用来渲染错误提示UI，componentDidCatch用来记录错误信息。

```
import MyErrorBoundary from './MyErrorBoundary';
const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </MyErrorBoundary>
  </div>
);
```
	

### 结合路由的代码分割
```
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

/**
 * 基于路由的代码分割，可以替换react-loadable
 * */
const Home = lazy(() => import('./Home'));
const Page1 = lazy(() => import('./Page1'));
const Page2 = lazy(() => import('./Page2'));


const App = () => {
  return (
      <Router>
          <Suspense fallback={<div className='loading'>loading...</div>}>
              <div>
                  <Route path="/" component={Home} />
                  <Route path="/Page1" component={Page1} />
                  <Route path="/Page2" component={Page2} />
              </div>
          </Suspense>
      </Router>
  )
};

```

### 与react-loadable的比较
react-loadable核心原理为: 高阶组件 + webpack dynamic import

1. 异同：

- React.lazy & Suspense属于react框架，react-loadable是第三方库。 
- 代码分割：React.lazy和react-loadable打出的包及大小都是一样的。 
- 服务端渲染支持：React.lazy还不支持服务端渲染。react-loadble支持的比较好。

2. 使用React.lazy & Suspense的好处

- 减少对第三方库的依赖，降低潜在风险。
- react-loadable经过gzip压缩后约2k,可以减少2k的包大小。
- 使用react库可以方便更新和维护。