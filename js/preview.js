
let svg_example = `
  <div class="preview-window__header">
    <div></div>
    <div>Name</div>
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 212.982 212.982" style="enable-background:new 0 0 212.982 212.982;" xml:space="preserve" width="25px" height="25px">
        <g>
	      <path style="fill-rule:evenodd;clip-rule:evenodd;" d="M131.804,106.491l75.936-75.936c6.99-6.99,6.99-18.323,0-25.312   c-6.99-6.99-18.322-6.99-25.312,0l-75.937,75.937L30.554,5.242c-6.99-6.99-18.322-6.99-25.312,0c-6.989,6.99-6.989,18.323,0,25.312   l75.937,75.936L5.242,182.427c-6.989,6.99-6.989,18.323,0,25.312c6.99,6.99,18.322,6.99,25.312,0l75.937-75.937l75.937,75.937   c6.989,6.99,18.322,6.99,25.312,0c6.99-6.99,6.99-18.322,0-25.312L131.804,106.491z"/>
          X
        </g>
      </svg>
    </div>
  </div>
  <div class="preview-window__main">
    <svg height="100%" width="100%">
      <polyline points="20,20 40,25 60,40 80,120 120,140 200,180" style="fill:none;stroke:black;stroke-width:3" />
      Sorry, your browser does not support inline SVG.
    </svg>
  </div>
  <div class="preview-window__footer">
      <div></div>
      <div>
        <button>Open</button>
        <button>Close</button>
      </div>
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 25 25" enable-background="new 0 0 26.1 26.1" height="25px" width="25px">
      <g>
        <path d="m16,25.042v-2c0-0.6 0.4-1 1-1h1c0.4,0 0.7-0.5 0.4-0.9l-4-4c-0.4-0.4-0.4-1 0-1.4l1.4-1.4c0.4-0.4 1-0.4 1.4,0l4,4c0.3,0.3 0.9,0.1 0.9-0.4v-1c0-0.6 0.4-1 1-1h2c0.6,0 1,0.4 1,1v8c0,0.6-0.4,1-1,1h-8c-0.7,0.1-1.1-0.3-1.1-0.9z"/>
        <path d="m8.9,11.742l-4-4c-0.3-0.3-0.9-0.1-0.9,0.4v1c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1v-8c0-0.6 0.4-1 1-1h8c0.6,0 1,0.4 1,1v2c0,0.6-0.4,1-1,1h-1c-0.4,0-0.7,0.5-0.4,0.9l4,4c0.4,0.4 0.4,1 0,1.4l-1.4,1.4c-0.3,0.3-0.9,0.3-1.3-0.1z"/>
      </g>
    </svg>
  </div>`;


class previewWindow {

    constructor() {

        this.windows = [];
    }


    createMouseOverWindow(HTMLobject) {
        let element = this.windows[0] = document.createElement('div');

        element.className = "preview-window";
        let coord = this.newCoords(element);

        element.style.display = 'block';
        element.style.top = coord.lastPosY + "px";
        element.style.left = coord.lastPosX + "px";

        element.innerHTML = svg_example;
        document.body.appendChild(element);

    }

    createClickWindow() {

        if (this.windows.length === this.options.windowsLimit) return console.log('No more windows are available. Please, close any opened');



        return this._createWindow();






    }

    _createWindow(){
        let windowsCount = this.windows.length;
        this.windows[windowsCount] = {
            element : document.createElement('div'),
            isDragging : true
        };

        this.windows[windowsCount].element.className = "preview-window";
        let coord = this.newCoords(this.windows[windowsCount].element);

        this.windows[windowsCount].element.style.display = 'block';
        this.windows[windowsCount].element.style.top = coord.lastPosY+"px";
        this.windows[windowsCount].element.style.left = coord.lastPosX+"px";

        Object.assign(this.windows[windowsCount], coord);
        this.windows[windowsCount].element.innerHTML = svg_example;
        document.body.appendChild(this.windows[windowsCount].element);
        //windows[windowsCount].element.querySelector(':after');
        let header = this.windows[windowsCount].element.querySelector('.preview-window__header');
        let mHeader = new Hammer(header);

        mHeader.add(new Hammer.Pan({direction: Hammer.DIRECTION_ALL, threshold: 0}));
        let _self = this;
        mHeader.on("pan", event => {
            _self.handleDragWindow(event, this.windows[windowsCount])
        });

        let footer = this.windows[windowsCount].element.querySelector('.preview-window__footer:last-child');
        let mFooter = new Hammer(footer);

        mFooter.add(new Hammer.Pan({direction: Hammer.DIRECTION_ALL, threshold: 0}));
        mFooter.on("pan", event => {
            _self.handleResizeWindow(event, this.windows[windowsCount])
        });

        let closeCross = this.windows[windowsCount].element.querySelector('.preview-window__header > div:nth-child(3)');
        let closeButton = this.windows[windowsCount].element.querySelector('.preview-window__footer > div:nth-child(2) > button:nth-child(2)');

        closeCross.onclick = closeButton.onclick = ()=>{
            this.closeWindow(windowsCount);
        }

    }


    closeWindow(windowIndex){
        document.body.removeChild(this.windows[windowIndex].element);
        this.windows = this.windows.filter(window => window.element !== this.windows[windowIndex].element);
    }


    newCoords(element){
        return {
            lastPosX : Math.floor(Math.random()*window.innerWidth),
            lastPosY : Math.floor(Math.random()*window.innerHeight)
        }
    }


    handleDragWindow(ev, window) {

        let {lastPosX = 0, lastPosY = 0, isDragging = false} = window;

        let elem = window.element;


        if (!isDragging) {
            isDragging = true;
            elem.style.zIndex = 1000;
            lastPosX = elem.offsetLeft;
            lastPosY = elem.offsetTop;
            Object.assign(window,{lastPosX, lastPosY, isDragging});
        }

        let posX = ev.deltaX + lastPosX;
        let posY = ev.deltaY + lastPosY;

        elem.style.left = posX + "px";
        elem.style.top = posY + "px";

        if (ev.isFinal) {
            elem.style.zIndex = "";
            window.isDragging= false

        }
    }

    handleResizeWindow(ev, window) {

        let {lastPosX = 0, lastPosY = 0, isDragging = false} = window;

        let elem = window.element;


        if (!isDragging) {
            isDragging = true;
            lastPosX = elem.clientWidth;
            lastPosY = elem.clientHeight;
            Object.assign(window,{lastPosX, lastPosY, isDragging});
        }

        let posX = ev.deltaX + lastPosX;
        let posY = ev.deltaY + lastPosY;

        elem.style.width = posX + "px";
        elem.style.height = posY + "px";

        if (ev.isFinal) {
            elem.style.zIndex = "";
            window.isDragging= false

        }

    }


}



class PreviewWindowsGenerator extends previewWindow{

    constructor(HTMLElement, _options) {
        super();
        let options = _options || {};
        //check arguments
        if (!HTMLElement && !options) return new Error('HTMLElement is not specify');
        if (!(HTMLElement instanceof Array) && typeof HTMLElement !== 'string' && !(HTMLElement instanceof HTMLDivElement)) return new Error('Type of HTMLElement is not correct');

        this.options = {};
        this.options.all = options.all || false;
        this.options.windowsLimit = options.windowsLimit || 1;
        this.options.mouseTriggerType = options.mouseTriggerType !== null ? options.mouseTriggerType :  1;
        this.options.mouseOverShowTime = options.mouseOverShowTime*1000 || 2000;
        this.mouseOverWindowActive = false;
        let mdCheck = new MobileDetect(window.navigator.userAgent || navigator.vendor || window.opera);
        this.options.mobile = mdCheck.mobile() || mdCheck.tablet() ? true : false;
        this.windowsCount = 0;

        this.initEventHandlers(HTMLElement);

    }

    initEventHandlers(HTMLElement) {
        let _self = this;
        if (typeof HTMLElement === 'string') {
            if (this.options.all) {
                let target = document.querySelectorAll(HTMLElement);
                target.forEach(element => _self.showWindowAction(element));
            } else {
                let target = document.querySelector(HTMLElement);
                this.showWindowAction(target);
            }
        }

        if (HTMLElement instanceof Array) {
            HTMLElement.forEach((item, index)=>{
                if (item instanceof HTMLDivElement) this.showWindowAction(item);
                if (typeof item === 'string') this.showWindowAction(document.querySelector(item));
                return console.log(`${item} at ${index} position is not correct`);
            })
        }

        if (HTMLElement instanceof HTMLDivElement) this.showWindowAction(HTMLElement);

    }

    showWindowAction(HTMLObject) {
        if (this.options.mobile && this.options.mouseTriggerType === 0) this.clickEventHandler(HTMLObject);

        if (!this.options.mobile && this.options.mouseTriggerType === 0) this.mouseOverEventHander(HTMLObject);

        if (this.options.mouseTriggerType === 1) this.clickEventHandler(HTMLObject);

        if (this.options.mouseTriggerType === 2) this.pressEventHandler(HTMLObject);
    }

    pressEventHandler(HTMLObject){
        let hammer = new Hammer.Manager(HTMLObject);
        hammer.add(new Hammer.Press());
        hammer.on('press', event => {
            this.createClickWindow(HTMLObject)
        });
    }

    mouseOverEventHander(HTMLObject) {
        let timer = null;
        let _self = this;
        HTMLObject.onmouseenter = function () {
            if (_self.mouseOverWindowActive === false) {
                _self.mouseOverWindowActive = true;
                timer = setTimeout(() => {
                    _self.createMouseOverWindow(HTMLObject);
                }, _self.options.mouseOverShowTime);
            }
        };

        HTMLObject.onmouseleave = () => {
            clearTimeout(timer);
            if (_self.windows[0]){
                document.body.removeChild(_self.windows[0]);
                _self.windows.pop();
            }
            _self.mouseOverWindowActive = false;
        }

    }

    clickEventHandler(HTMLObject) {
        let _self = this;
        HTMLObject.onclick = function () {
            _self.createClickWindow(HTMLObject);
        }
    };

}








let previewWindowsGenerator  = new PreviewWindowsGenerator('.hoverme',{all:true, windowsLimit:1, mouseTriggerType: 0, mouseOverShowTime:1});
let previewWindowsGenerator1  = new PreviewWindowsGenerator('.clickme',{all:true, windowsLimit:1, mouseTriggerType: 1});
let previewWindowsGenerator2  = new PreviewWindowsGenerator('.pressme',{all:false, windowsLimit:1, mouseTriggerType: 2});

