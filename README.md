JS抽奖类库<br/>
---------------------------
@author Topthinking

### 1.参数说明
global 对象全局this<br/>


### 2.调用(下面显示的都是必填项)
```J
$(this).JsLottery({
            scroll_dom: 'lot-list', //外框的dom,可以是id或者class
            scroll_item: 'lot-item', //奖项的class
            new_class: 'on', //中奖需要加的class
            square: 3, //N*N的方格
            prizeIndex:5, //中奖的序号
            isCycle: true, //是否跑着循环
            callback: function () { //结束后的回调
                alert('抽奖结束啦');
            }
        });
```
## 演示
[Demo](https://codepen.io/minwinter/pen/GEwPGv)