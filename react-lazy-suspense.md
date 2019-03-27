背景：

**1.静态加载(es6 import)**

```
import { add } from './math'; 
console.log(add(1,2));
```

缺点：

-  必须在编译的时候就指定import和exports的模块，不能在运行时动态加载；
- 只能在代码的最上部声明；
- 会连同引用模块一起打成一个bundle。

**2.动态加载**

```
import("./math").then(math => {
  console.log(math.add(1,2));
});
```
遵循promise规范。webpack已支持动态import，webpack遇到import() 语法会自动进行代码拆分。 目前动态 import 仍旧是 ECMAScript 的提案，并没有纳入规范。

优点：

 - 可以在延迟加载、条件加载和按需加载（用户操作）的情景下使用动态导入，降低首次加载的代码量。
 - 动态import()可以在脚本的任何地方使用。
 - import()能够传递字符串，可以根据需求构造匹配符。
 
***



使用import条件加载组件举例：

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

- 对父组件有侵入性。
- 布局有抖动体验不好。

结论：动态 import 主要应用场景是延迟加载方法，对于组件来说并不是很适用，但是 React.lazy 对于组件的加载则是有比较大的帮助。


##### React.lazy:
-  把条件渲染细节挪到了框架层，允许把动态导入的组件当作普通组件一样渲染。
-  React.lazy方法通过调用动态import()加载一个函数，返回一个Promise，并解析(resolve)为一个带有包含React组件的默认导出的模块。

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
const OtherComponent = React.lazy(() => import('./OtherComponent'));
function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

这样只会在组件渲染的时候才会去加载包含OtherComponent的bundle，而且OtherComponent是单独打包的（使用）。



###### Suspense 
 
-  该组件在加载bundle过程中提供加载标识，比如loading。  有一个属性fallback, 接收任何react元素。 Suspense可以放在lazy组件只上的任何位置，也可以包含多个lazy组件。没被Suspense包起来的Lazy组件会报错。
- 提供Error boundaries功能，在由于网络等原因失败的情况下，可以自定义Error boundaries组件处理错误。Error boundaries组件需要在lazy组件之上。

##### react-loadable:
- (核心思路为: 高阶组件 + webpack dynamic import)

2.异同：

- 代码分割：React.lazy和react-loadable打出的包及大小都是一样的。 
- 服务端渲染支持：React.lazy还不支持服务端渲染。react-loadble支持的比较好。

3.使用React.lazy的好处

- 减少对第三方库的依赖，降低潜在风险
- react-loadable经过gzip压缩后约2k,可以减少2k的包大小。
- 使用react库可以方便更新和维护。
