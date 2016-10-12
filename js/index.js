/**
 * Created by wen on 2016/9/2.
 */
var width = window.innerWidth;
var height = window.innerHeight;


//���캯��
function Resume(opts){
    //���캯����Ҫ�Ĳ���
    this.outer = opts.outer;

    //����������
    this.init();
    this.renderDOM();
    this.bindDOM();
}

//��һ�� -- ��ʼ��
Resume.prototype.init = function() {
    this.divs = this.outer.getElementsByTagName('li');
    this.len = this.divs.length;

    //�趨��ʼ������ֵ
    this.idx = 0;
};

//�ڶ��� -- ��ȾDOM
Resume.prototype.renderDOM = function() {
    for (var i = 0; i < this.len; i++) {
        this.divs[i].style.height = height;
        this.divs[i].style.webkitTransform = 'translate3d(0px, '+ (i)*height +'px, 0px)';
    }
};

//������ -- �� DOM �¼�
Resume.prototype.bindDOM = function(){
    var self = this;
    var scaleW = height;
    var outer = self.outer;
    var len = self.len;

    //��ָ���µĴ����¼�
    var startHandler = function(evt){

        //��¼�ոտ�ʼ���µ�ʱ��
        self.startTime = new Date() * 1;

        //��¼��ָ���µ�����
        self.startY = evt.touches[0].pageY;

        //���ƫ����
        self.offsetY = 0;

        //�¼�����
        var target = evt.target;
        while(target.nodeName != 'LI' && target.nodeName != 'BODY'){
            target = target.parentNode;
        }
        self.target = target;

    };

    //��ָ�ƶ��Ĵ����¼�
    var moveHandler = function(evt){
        //����chrome android����ֹ�����Ĭ����Ϊ
        evt.preventDefault();

        //������ָ��ƫ����
        self.offsetY = evt.touches[0].pageY - self.startY;

        var lis = outer.getElementsByTagName('li');
        //��ʼ����
        var i = self.idx - 1;
        //��������
        var m = i + 3;

        //��С���ı�DOM����
        for(i; i < m; i++){
            lis[i] && (lis[i].style.webkitTransition = '-webkit-transform 0s ease-out');
            lis[i] && (lis[i].style.webkitTransform = 'translate3d(0, '+ ((i-self.idx)*height + self.offsetY) +'px, 0)');
        }
    };

    //��ָ̧��Ĵ����¼�
    var endHandler = function(evt){
        evt.preventDefault();

        //�߽�ͷ�ҳֵ
        var boundary = height/6;

        //��ָ̧���ʱ��ֵ
        var endTime = new Date() * 1;

        //�����б���
        var lis = outer.getElementsByTagName('li');

        //����ָ�ƶ�ʱ�䳬��300ms ��ʱ�򣬰�λ����
        if(endTime - self.startTime > 300){
            if(self.offsetY >= boundary){
                //������һҳ
                self.goIndex('-1');
                AddAnimation(self.idx);
            }else if(self.offsetY < 0 && self.offsetY < -boundary){
                //������һҳ
                self.goIndex('+1');
                AddAnimation(self.idx);
            }else{
                self.goIndex('0');
            }
        }else{
            //�Ż�
            //�����ƶ�Ҳ��ʹ�÷�ҳ
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

    //���¼�
    outer.addEventListener('touchstart', startHandler);
    outer.addEventListener('touchmove', moveHandler);
    outer.addEventListener('touchend', endHandler);
}

Resume.prototype.goIndex = function(n){
    var idx = this.idx;
    var lis = this.outer.getElementsByTagName('li');
    var len = lis.length;
    var cidx;

    //��������� 2,3 ֮�����ʹ��ֱ�ӻ�����������
    if(typeof n == 'number'){
        cidx = idx;
        //����Ǵ��ַ���Ϊ�����ı仯
    }else if(typeof n == 'string'){
        cidx = idx + n*1;
    }


    //�������ҳ���
    if(cidx > len-1){
        cidx = len - 1;
        //�������󳬳�
    }else if(cidx < 0){
        cidx = 0;
    }

    //������ǰ����ֵ
    this.idx = cidx;

    //�ı���ɵķ�ʽ�����޶�����Ϊ�ж���
    lis[cidx].style.webkitTransition = '-webkit-transform 0.2s ease-out';
    lis[cidx-1] && (lis[cidx-1].style.webkitTransition = '-webkit-transform 0.2s ease-out');
    lis[cidx+1] && (lis[cidx+1].style.webkitTransition = '-webkit-transform 0.2s ease-out');

    //�ı䶯������Ӧ�õ�λ��ֵ
    lis[cidx].style.webkitTransform = 'translate3d(0, 0, 0)';
    lis[cidx-1] && (lis[cidx-1].style.webkitTransform = 'translate3d(0, -'+ height +'px, 0)');
    lis[cidx+1] && (lis[cidx+1].style.webkitTransform = 'translate3d(0, '+ height +'px, 0)');
};



//��ʼ��Resume ʵ��
new Resume({
    outer : document.getElementById('outer')
});


//About Me ҳ�棬������Ļ��С�������
var aboutme_detail = document.getElementById('aboutme-detail');
var aboutme_tds = document.getElementById('aboutme-detail').getElementsByTagName('td'); //Ҫ������Ԫ��
var h_aboutme_title = document.getElementById('aboutme-title').offsetHeight;
var h_aboutme_detail_head = aboutme_detail.getElementsByTagName('p')[0].offsetHeight;
var h_aboutme_detail_table = aboutme_detail.getElementsByTagName('table')[0].offsetHeight;
var len = aboutme_tds.length;
var td_padding = Math.floor((height - h_aboutme_title - h_aboutme_detail_head - h_aboutme_detail_table) / 20);

for (var i=0; i < len; i++) {
    aboutme_tds[i].style.paddingTop = td_padding + 'px';
    aboutme_tds[i].style.paddingBottom = td_padding + 'px';
}

//��������ҳ�棬������Ļ��С����λ��
var education_detail = document.getElementById('education-detail');
var h_education_title = document.getElementById('education-title').offsetHeight;
education_detail.style.paddingTop = (window.innerHeight - h_education_title - education_detail.offsetHeight) / 2 + 'px';


//רҵ����ҳ��
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

//��Ŀ����ҳ��
// var experience_detail = document.getElementById('experience-detail');
// var h_experience_title = document.getElementById('experience-title').offsetHeight;
// experience_detail.style.paddingTop = (window.innerHeight - h_experience_title - experience_detail.offsetHeight) / 2 + 'px';


// console.log(document.getElementById('aboutme-detail').style.top);
// console.log(document.getElementById('aboutme-detail').left);


//����Ч��
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
//��һҳ���� - ����
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
//�ڶ�ҳ���� - ����
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
//����ҳ���� - ��������
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
//����ҳ���� - רҵ����
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
//����ҳ���� - רҵ����
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