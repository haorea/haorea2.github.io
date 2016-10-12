/**
 * Created by wen on 2016/9/2.
 */
var width = window.innerWidth;
var height = window.innerHeight;


//构造函数
function Resume(opts){
    //构造函数需要的参数
    this.outer = opts.outer;

    //构造三步奏
    this.init();
    this.renderDOM();
    this.bindDOM();
}

//第一步 -- 初始化
Resume.prototype.init = function() {
    this.divs = this.outer.getElementsByTagName('li');
    this.len = this.divs.length;

    //设定初始的索引值
    this.idx = 0;
};

//第二步 -- 渲染DOM
Resume.prototype.renderDOM = function() {
    for (var i = 0; i < this.len; i++) {
        this.divs[i].style.height = height;
        this.divs[i].style.webkitTransform = 'translate3d(0px, '+ (i)*height +'px, 0px)';
    }
};

//第三步 -- 绑定 DOM 事件
Resume.prototype.bindDOM = function(){
    var self = this;
    var scaleW = height;
    var outer = self.outer;
    var len = self.len;

    //手指按下的处理事件
    var startHandler = function(evt){

        //记录刚刚开始按下的时间
        self.startTime = new Date() * 1;

        //记录手指按下的坐标
        self.startY = evt.touches[0].pageY;

        //清除偏移量
        self.offsetY = 0;

        //事件对象
        var target = evt.target;
        while(target.nodeName != 'LI' && target.nodeName != 'BODY'){
            target = target.parentNode;
        }
        self.target = target;

    };

    //手指移动的处理事件
    var moveHandler = function(evt){
        //兼容chrome android，阻止浏览器默认行为
        evt.preventDefault();

        //计算手指的偏移量
        self.offsetY = evt.touches[0].pageY - self.startY;

        var lis = outer.getElementsByTagName('li');
        //起始索引
        var i = self.idx - 1;
        //结束索引
        var m = i + 3;

        //最小化改变DOM属性
        for(i; i < m; i++){
            lis[i] && (lis[i].style.webkitTransition = '-webkit-transform 0s ease-out');
            lis[i] && (lis[i].style.webkitTransform = 'translate3d(0, '+ ((i-self.idx)*height + self.offsetY) +'px, 0)');
        }
    };

    //手指抬起的处理事件
    var endHandler = function(evt){
        evt.preventDefault();

        //边界就翻页值
        var boundary = height/6;

        //手指抬起的时间值
        var endTime = new Date() * 1;

        //所有列表项
        var lis = outer.getElementsByTagName('li');

        //当手指移动时间超过300ms 的时候，按位移算
        if(endTime - self.startTime > 300){
            if(self.offsetY >= boundary){
                //进入上一页
                self.goIndex('-1');
                AddAnimation(self.idx);
            }else if(self.offsetY < 0 && self.offsetY < -boundary){
                //进入下一页
                self.goIndex('+1');
                AddAnimation(self.idx);
            }else{
                self.goIndex('0');
            }
        }else{
            //优化
            //快速移动也能使得翻页
            if(self.offsetY > 50){
                self.goIndex('-1');
                AddAnimation(self.idx);
            }else if(self.offsetY < -50){
                self.goIndex('+1');
                AddAnimation(self.idx);
            }else{
                self.goIndex('0');
            }
        }
    };

    //绑定事件
    outer.addEventListener('touchstart', startHandler);
    outer.addEventListener('touchmove', moveHandler);
    outer.addEventListener('touchend', endHandler);
}

Resume.prototype.goIndex = function(n){
    var idx = this.idx;
    var lis = this.outer.getElementsByTagName('li');
    var len = lis.length;
    var cidx;

    //如果传数字 2,3 之类可以使得直接滑动到该索引
    if(typeof n == 'number'){
        cidx = idx;
        //如果是传字符则为索引的变化
    }else if(typeof n == 'string'){
        cidx = idx + n*1;
    }


    //当索引右超出
    if(cidx > len-1){
        cidx = len - 1;
        //当索引左超出
    }else if(cidx < 0){
        cidx = 0;
    }

    //保留当前索引值
    this.idx = cidx;

    //改变过渡的方式，从无动画变为有动画
    lis[cidx].style.webkitTransition = '-webkit-transform 0.2s ease-out';
    lis[cidx-1] && (lis[cidx-1].style.webkitTransition = '-webkit-transform 0.2s ease-out');
    lis[cidx+1] && (lis[cidx+1].style.webkitTransition = '-webkit-transform 0.2s ease-out');

    //改变动画后所应该的位移值
    lis[cidx].style.webkitTransform = 'translate3d(0, 0, 0)';
    lis[cidx-1] && (lis[cidx-1].style.webkitTransform = 'translate3d(0, -'+ height +'px, 0)');
    lis[cidx+1] && (lis[cidx+1].style.webkitTransform = 'translate3d(0, '+ height +'px, 0)');
};



//初始化Resume 实例
new Resume({
    outer : document.getElementById('outer')
});


//About Me 页面，根据屏幕大小调整间距
var aboutme_detail = document.getElementById('aboutme-detail');
var aboutme_tds = document.getElementById('aboutme-detail').getElementsByTagName('td'); //要调整的元素
var h_aboutme_title = document.getElementById('aboutme-title').offsetHeight;
var h_aboutme_detail_head = aboutme_detail.getElementsByTagName('p')[0].offsetHeight;
var h_aboutme_detail_table = aboutme_detail.getElementsByTagName('table')[0].offsetHeight;
var len = aboutme_tds.length;
var td_padding = Math.floor((height - h_aboutme_title - h_aboutme_detail_head - h_aboutme_detail_table) / 20);

for (var i=0; i < len; i++) {
    aboutme_tds[i].style.paddingTop = td_padding + 'px';
    aboutme_tds[i].style.paddingBottom = td_padding + 'px';
}

//教育经历页面，根据屏幕大小调整位置
var education_detail = document.getElementById('education-detail');
var h_education_title = document.getElementById('education-title').offsetHeight;
education_detail.style.paddingTop = (window.innerHeight - h_education_title - education_detail.offsetHeight) / 2 + 'px';


//专业技能页面
var ability_detail_canvas = document.getElementById('ability-detail').getElementsByTagName('canvas');
var h_ability_title = document.getElementById('ability-title').offsetHeight;
var h_ability_detail_canvas = (height - h_ability_title) / 9;

var len = ability_detail_canvas.length;
for (var i = 0; i < len; i++) {
    ability_detail_canvas[i].width = width - document.getElementById('canvas-td').offsetWidth - 40;
    ability_detail_canvas[i].height = h_ability_detail_canvas;
};

function drawAbility(mycanvas, value, color) {
    var canvas = document.getElementById(mycanvas);
    var ctx = canvas.getContext('2d');

    // console.log(canvas.offsetWidth);
    var RectW = Math.floor(value / 100 * canvas.offsetWidth);

    ctx.fillStyle = color;
    ctx.fillRect(0,14,RectW,h_ability_detail_canvas / 2 - 5);
}

drawAbility('canvas-php', 90, '#5c9beb');

drawAbility('canvas-mysql', 50, '#eb86c0');

drawAbility('canvas-html', 60, '#ec5463');

drawAbility('canvas-js', 40, '#e5e8ed');

drawAbility('canvas-mvc', 60, '#9fd367');

drawAbility('canvas-linux', 50, '#fecd54');

drawAbility('canvas-ds', 60, '#f69292');

drawAbility('canvas-cpp', 70, '#e1a34e');

//项目经验页面
// var experience_detail = document.getElementById('experience-detail');
// var h_experience_title = document.getElementById('experience-title').offsetHeight;
// experience_detail.style.paddingTop = (window.innerHeight - h_experience_title - experience_detail.offsetHeight) / 2 + 'px';


// console.log(document.getElementById('aboutme-detail').style.top);
// console.log(document.getElementById('aboutme-detail').left);


//动画效果
function AddAnimation(index){
    switch (index) {
        case 0:
            AnimationPage0();
            break;
        case 1:
            AnimationPage1();
            break;
        case 2:
            AnimationPage2();
            break;
        case 3:
            AnimationPage3();
            break;
        case 4:
            AnimationPage4();
            break;
        default:
            AnimationPage0();
    }
}
//第一页动画 - 封面
function AnimationPage0() {
    if (document.getElementById('cover-img').style.webkitAnimation == 'ani-cover-img 1s') {
        document.getElementById('cover-img').style.webkitAnimation = 'ani-cover-img2 1s';
        document.getElementById('cover-title').style.webkitAnimation = 'ani-cover-title2 1s';
        document.getElementById('cover-title').style.webkitAnimation = 'ani-cover-title2 1s';
        document.getElementById('cover-subtitle').style.webkitAnimation = 'ani-cover-subtitle2 1s';
    } else {
        document.getElementById('cover-img').style.webkitAnimation = 'ani-cover-img 1s';
        document.getElementById('cover-title').style.webkitAnimation = 'ani-cover-title 1s';
        document.getElementById('cover-subtitle').style.webkitAnimation = 'ani-cover-subtitle 1s';
    }
}
//第二页动画 - 关于
function AnimationPage1() {
    if (document.getElementById('aboutme-title-cn').style.webkitAnimation == 'ani-page-title-cn 1s') {
        document.getElementById('aboutme-title-cn').style.webkitAnimation = 'ani-page-title-cn2 1s';
        document.getElementById('aboutme-title-en').style.webkitAnimation = 'ani-page-title-en2 1s';
        document.getElementById('aboutme-detail').style.webkitAnimation = 'ani-page-detail2 1s';
    } else {
        document.getElementById('aboutme-title-cn').style.webkitAnimation = 'ani-page-title-cn 1s';
        document.getElementById('aboutme-title-en').style.webkitAnimation = 'ani-page-title-en 1s';
        document.getElementById('aboutme-detail').style.webkitAnimation = 'ani-page-detail 1s';
    }
}
//第三页动画 - 教育经历
function AnimationPage2() {
    if (document.getElementById('education-title-cn').style.webkitAnimation == 'ani-page-title-cn 1s') {
        document.getElementById('education-title-cn').style.webkitAnimation = 'ani-page-title-cn2 1s';
        document.getElementById('education-title-en').style.webkitAnimation = 'ani-page-title-en2 1s';
        document.getElementById('education-text1').style.webkitAnimation = 'ani-education-detail2 1s';
        document.getElementById('education-text2').style.webkitAnimation = 'ani-education-detail-dx2 1.8s';
        document.getElementById('education-text3').style.webkitAnimation = 'ani-education-detail-yjs2 2.5s';
        document.getElementById('education-img1').style.webkitAnimation = 'ani-education-detail2 1s';
        document.getElementById('education-img2').style.webkitAnimation = 'ani-education-detail-dx2 1.8s';
        document.getElementById('education-img3').style.webkitAnimation = 'ani-education-detail2-yjs2 2.5s';
    } else {
        document.getElementById('education-title-cn').style.webkitAnimation = 'ani-page-title-cn 1s';
        document.getElementById('education-title-en').style.webkitAnimation = 'ani-page-title-en 1s';
        document.getElementById('education-text1').style.webkitAnimation = 'ani-education-detail 1s';
        document.getElementById('education-text2').style.webkitAnimation = 'ani-education-detail-dx 1.8s';
        document.getElementById('education-text3').style.webkitAnimation = 'ani-education-detail-yjs 2.5s';
        document.getElementById('education-img1').style.webkitAnimation = 'ani-education-detail 1s';
        document.getElementById('education-img2').style.webkitAnimation = 'ani-education-detail-dx 1.8s';
        document.getElementById('education-img3').style.webkitAnimation = 'ani-education-detail-yjs 2.5s';
    }
}
//第四页动画 - 专业技能
function AnimationPage3() {
    if (document.getElementById('ability-title-cn').style.webkitAnimation == 'ani-page-title-cn 1s') {
        document.getElementById('ability-title-cn').style.webkitAnimation = 'ani-page-title-cn2 1s';
        document.getElementById('ability-title-en').style.webkitAnimation = 'ani-page-title-en2 1s';
        document.getElementById('canvas-php').style.webkitAnimation = 'ani-ability-canvasphp2 0.8s';
        document.getElementById('canvas-mysql').style.webkitAnimation = 'ani-ability-canvasmysql2 1.2s';
        document.getElementById('canvas-html').style.webkitAnimation = 'ani-ability-canvashtml2 1.5s';
        document.getElementById('canvas-js').style.webkitAnimation = 'ani-ability-canvasjs2 1.8s';
        document.getElementById('canvas-mvc').style.webkitAnimation = 'ani-ability-canvasmvc2 2.1s';
        document.getElementById('canvas-linux').style.webkitAnimation = 'ani-ability-canvaslinux2 2.4s';
        document.getElementById('canvas-ds').style.webkitAnimation = 'ani-ability-canvasds2 2.7s';
        document.getElementById('canvas-cpp').style.webkitAnimation = 'ani-ability-canvascpp2 3s';
    } else {
        document.getElementById('ability-title-cn').style.webkitAnimation = 'ani-page-title-cn 1s';
        document.getElementById('ability-title-en').style.webkitAnimation = 'ani-page-title-en 1s';
        document.getElementById('canvas-php').style.webkitAnimation = 'ani-ability-canvasphp 0.8s';
        document.getElementById('canvas-mysql').style.webkitAnimation = 'ani-ability-canvasmysql 1.2s';
        document.getElementById('canvas-html').style.webkitAnimation = 'ani-ability-canvashtml 1.5s';
        document.getElementById('canvas-js').style.webkitAnimation = 'ani-ability-canvasjs 1.8s';
        document.getElementById('canvas-mvc').style.webkitAnimation = 'ani-ability-canvasmvc 2.1s';
        document.getElementById('canvas-linux').style.webkitAnimation = 'ani-ability-canvaslinux 2.4s';
        document.getElementById('canvas-ds').style.webkitAnimation = 'ani-ability-canvasds 2.7s';
        document.getElementById('canvas-cpp').style.webkitAnimation = 'ani-ability-canvascpp 3s';
    }
}
//第五页动画 - 专业技能
function AnimationPage4() {
    if (document.getElementById('experience-title-cn').style.webkitAnimation == 'ani-page-title-cn 1s') {
        document.getElementById('experience-title-cn').style.webkitAnimation = 'ani-page-title-cn2 1s';
        document.getElementById('experience-title-en').style.webkitAnimation = 'ani-page-title-en2 1s';
        document.getElementById('experience-detail').style.webkitAnimation = 'ani-page-detail2 1s';
    } else {
        document.getElementById('experience-title-cn').style.webkitAnimation = 'ani-page-title-cn 1s';
        document.getElementById('experience-title-en').style.webkitAnimation = 'ani-page-title-en 1s';
        document.getElementById('experience-detail').style.webkitAnimation = 'ani-page-detail 1s';
    }
}

AddAnimation(0);