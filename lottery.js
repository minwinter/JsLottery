/*
 * @desc 跑马灯抽奖
 * @author shimin
 * @date 2017.6.6
 * @version 0.0.1
 * */
;(function ($, window) {

    //本身默认的参数设置
    var fixs = {
        index: 0, //开始的位置
        prevIndex: 0, //前一个位置
        speed: 300, //初始速度
        time: null,
        flag: false, //是否开始减慢的一个标志
        quick: 0, //走了几格
        cycle: 0, //跑了几圈
        endIndex: 0, //开始减慢的位置
        arr: null, //有奖品的二维数组
        endCycle: 0, //开始减慢的圈数
        isTable: true
    };

    $.fn.JsLottery = function (options) {
        //默认参数，可被重写
        var _this = this;

        var defaults = {
            scroll_dom: '', //外框的dom
            scroll_item: '', //奖项的class
            new_class: '', //中奖需要加的class
            square: 3, // N*N的方格
            prizeIndex: 1, //中奖的序号
            isCycle: true, //是否需要转动
            callback: function () { //转动结束后，回调函数

            }
        }

        _this.settings = $.extend(defaults, options);

        var _init = function () {
            var scroll_item = _this.settings.scroll_item;
            if (!_this.settings.scroll_dom || !scroll_item || !_this.settings.new_class) {
                return;
            }
            var items = $('.' + scroll_item).length;

            if (!(typeof ($('.' + scroll_item).attr('data-id')) == 'undefined')) {
                fixs.isTable = false;
            }
            fixs.endIndex = Math.floor(Math.random() * items);
            fixs.arr = fixs.isTable ? _getTableSide(_this.settings.square, _this.settings.square) : _getSide(_this.settings.square, _this.settings.square);
            fixs.endCycle = items / 2;
            _startGame();
        };

        //私有函数
        var _getTableSide = function (m, n) {
            var arr = [];
            for (var i = 0; i < m; i++) {
                arr[i] = [];
                for (var j = 0; j < n; j++) {
                    arr[i][j] = i * n + j;
                }
            }
            //获取数组最外圈
            var resultArr = [];
            var tempX = 0,
                tempY = 0,
                direction = "Along",
                count = 0;
            while (tempX >= 0 && tempX < n && tempY >= 0 && tempY < m && count < m * n) {
                count++;
                resultArr.push([tempY, tempX]);
                if (direction == "Along") {
                    if (tempX == n - 1)
                        tempY++;
                    else
                        tempX++;
                    if (tempX == n - 1 && tempY == m - 1)
                        direction = "Inverse";
                } else {
                    if (!tempX)
                        tempY--;
                    else
                        tempX--;
                    if (!tempX && !tempY)
                        break;
                }
            }
            return resultArr;
        }

        //如果不是table布局，获取数组
        var _getSide = function (m, n) {
            var newArray = [];
            var items = $('.' + _this.settings.scroll_item);
            for (var k = 0, len = items.length; k < len; k++) {
                newArray.push($(items[k]).attr('data-id'));
            }
            return newArray;
        }

        var _startGame = function () {
            clearInterval(fixs.time);
            //数值分布
            // settings.prizeIndex = 2;
            if (_this.settings.isCycle) {
                fixs.time = setInterval(_star, fixs.speed);
            }
        }

        var _star = function () {
            //ID或者class的判断
            var halfItem = fixs.endCycle + 1;
            var lotList = $('#' + _this.settings.scroll_dom);
            if (!lotList.get(0)) {
                lotList = $('.' + _this.settings.scroll_dom)
            }
            if (fixs.index >= fixs.arr.length) {
                fixs.index = 0;
                fixs.cycle++;
            }
            if (fixs.isTable) {
                lotList.get(0).rows[fixs.arr[fixs.index][0]].cells[fixs.arr[fixs.index][1]].className = _this.settings.scroll_item + ' ' + _this.settings.new_class;
            } else {
                $('.' + _this.settings.scroll_item + '[data-id=' + (fixs.index + 1) + ']', lotList).addClass('on');
            }
            if (fixs.index > 0)
                fixs.prevIndex = fixs.index - 1;
            else {
                fixs.prevIndex = fixs.arr.length - 1;
            }
            if (fixs.isTable) {
                lotList.get(0).rows[fixs.arr[fixs.prevIndex][0]].cells[fixs.arr[fixs.prevIndex][1]].className = _this.settings.scroll_item;
            } else {
                $('.' + _this.settings.scroll_item + '[data-id=' + (fixs.prevIndex + 1) + ']', lotList).removeClass('on');
            }
            if (fixs.flag && fixs.index === _this.settings.prizeIndex - 1) {
                fixs.quick = 0;
                fixs.cycle = 0;
                fixs.flag = false;
                clearInterval(fixs.time);
                setTimeout(function () {
                    _this.settings.callback();
                }, 350);
            }
            fixs.index++;
            fixs.quick++;
            if (!fixs.flag) {
                //走五格开始加速
                if (fixs.quick == halfItem) {
                    clearInterval(fixs.time);
                    fixs.speed = 50;
                    fixs.time = setInterval(_star, fixs.speed);
                }
                //跑N圈减速
                if (fixs.cycle >= halfItem && fixs.index == fixs.endIndex + 1) {
                    clearInterval(fixs.time);
                    fixs.speed = 300;
                    fixs.flag = true; //触发结束
                    fixs.time = setInterval(_star, fixs.speed);
                }
            }
        }
        _init();
        return this;
    }

})(jQuery, window);