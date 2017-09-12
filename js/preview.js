
//Hammer.plugins.fakeMultitouch();

class PreviewWindow {

    constructor(HTMLElement, options) {
        if (!HTMLElement) return new Error('HTMLElement is not specify');
        if (!(HTMLElement instanceof Array) && typeof HTMLElement !== 'string' && !(HTMLElement instanceof HTMLDivElement)) return new Error('Type of HTMLElement is not correct')

        this.all = options.all || false;

        this.windowsLimit = options.windowsLimit || 1;
        this.actionTriggerType = options ? options.actionTriggerType : 1;
        this.windowsCount = 0;
        this.metaData = new Map();
        this.windows = [];

        this.initEventHandlers(HTMLElement);

    }

    initEventHandlers(HTMLElement) {
        if (typeof HTMLElement === 'string') {
            let target = this.all ? document.querySelectorAll(HTMLElement) : document.querySelector(HTMLElement);
            if (this.all) target.forEach(element=>this.showWindowAction(element));
            else this.showWindowAction(target);

        }
    }

    showWindowAction(HTMLObject) {
        let _self = this;
        if (this.actionTriggerType) HTMLObject.onclick = function (event) {
            _self.clickEventHandler();
        };
        else {
            let hammer = new Hammer.Manager(HTMLObject);
            hammer.add(new Hammer.Press());
            hammer.on('press', event => {
                _self.clickEventHandler()
            });
        }
    };

    clickEventHandler() {

        if (this.windows.length === this.windowsLimit) return console.log('No more windows are available. Please, close any opened');

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
        this.windows[windowsCount].element.innerHTML = `<svg height="100%" width="100%">
  <polyline points="20,20 40,25 60,40 80,120 120,140 200,180" style="fill:none;stroke:black;stroke-width:3" />
  Sorry, your browser does not support inline SVG.
</svg>`;

        document.body.appendChild(this.windows[windowsCount].element);
        let mc = new Hammer(this.windows[windowsCount].element);

        mc.add(new Hammer.Pan({direction: Hammer.DIRECTION_ALL, threshold: 0}));
        let _self = this;
        mc.on("pan", event => {
            _self.handleDragWindow(event, this.windows[windowsCount])
        });
    };

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
}

let previewWindow  = new PreviewWindow('.clickme',{all:true, windowsLimit:3});

