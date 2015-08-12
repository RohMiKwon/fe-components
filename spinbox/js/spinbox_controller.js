/**
* @fileOverview Spinbox 컨트롤러 클래스 파일
* @name spinbox_controller.js
*/

/**
* @extends jindo.UIComponent
* @class
* @example
var oInstance = new SpinboxController("sId", {"option_1", ..});
*/
var SpinboxController;
SpinboxController = jindo.$Class({
    /**
     * @constructor
     * @param {Element} el. DOM Element
     * @param {HashTable} htOption. 해쉬로 작성된 Spinbox옵션의 정보
     */
    $init : function (el, htOption) {
        this._el = jindo.$(el);
        this._elBaseElement = jindo.$(window.document);

        this.option({
            bInputReadOnly : false,
            sClassPrefix : "sbx_",
            bActivateOnload : true,
            nDefaultValue : 0,
            nMax : 100,
            nMin: 0,
            nStep : 1
        });

        this.option(htOption || {});
        this._assignHTMLElements();

        this._oSpinbox = new Spinbox({
            nDefaultValue : this.option("nDefaultValue"),
            nMax : this.option("nMax"),
            nMin : this.option("nMin"),
            nStep : this.option("nStep")
        });

        this._elCurrentElement = null;
        this._wfWatchInputTimer = null;
        this._wfRunTimer = null;
        this._bIsRunning = false;

        this._wfOnMouseDown = jindo.$Fn(this._onMouseDown, this);
        this._wfOnMouseUp = jindo.$Fn(this._onMouseUp, this);
        this._wfOnAllMouseUp = jindo.$Fn(this._onAllMouseUp, this);
        this._wfOnFocus = jindo.$Fn(this._onFocus, this);
        this._wfOnBlur = jindo.$Fn(this._onBlur, this);

        this._isActive();
    },
    _isActive : function () {
        if(true === this.option("bActivateOnload")){
            this.activate();
        }
    },
    _assignHTMLElements : function () {
        var sPrefix = this.option("sClassPrefix");
        this._elInput = jindo.$$.getSingle("." + sPrefix + "input", this._el);
        this._elPlus = jindo.$$.getSingle("." + sPrefix + "plus", this._el);
        this._elMinus = jindo.$$.getSingle("." + sPrefix + "minus", this._el);
    },
    _isNotModify : function () {
        if("" === this._elInput.value){
            return true;
        }
    },
    _hasTimer : function (){
        if(null !== this._wfWatchInputTimer){
            return true;
        }
    },
    _createTimer : function (bStatus) {
        this._bIsRunning = bStatus;
        this._wfRunTimer.setInterval(0.1);
    },
    _run : function () {
        if(this._elCurrentElement === this._elPlus){
            this._oSpinbox.increase();
        }else{
            this._oSpinbox.decrease();
        }

        this._oSpinbox.limitRangeValue();
        this._showCurrentValue();
    },
    _stop : function () {
        this._bIsRunning = false;
        this._wfWatchInputTimer.stopDelay();
        this._wfRunTimer.stopRepeat();
    },
    _showCurrentValue : function () {
        this._elInput.value = this._oSpinbox.getValue();
    },
    _onActivate : function () {
        this._elInput.readOnly = this.option("bInputReadOnly");

        this._wfOnMouseDown.attach(this._elPlus, "mousedown");
        this._wfOnMouseDown.attach(this._elMinus, "mousedown");
        this._wfOnMouseUp.attach(this._elPlus, "mouseup");
        this._wfOnMouseUp.attach(this._elMinus, "mouseup");
        this._wfOnAllMouseUp.attach(this._elBaseElement, "mouseup");

        this._wfOnFocus.attach(this._elInput, "focus");
        this._wfOnBlur.attach(this._elInput, "blur");

        this._oSpinbox.reset();
        this._showCurrentValue();
    },
    _onDeactivate : function () {
        this._wfOnMouseDown.detach(this._elPlus, "mataousedown");
        this._wfOnMouseDown.detach(this._elMinus, "mousedown");
        this._wfOnMouseUp.detach(this._elPlus, "mouseup");
        this._wfOnMouseUp.detach(this._elMinus, "mouseup");
        this._wfOnAllMouseUp.detach(this._elBaseElement, "mouseup");

        this._wfOnFocus.detach(this._elMinus, "focus");
        this._wfOnBlur.detach(this._elInput, "blur");
    },
    _onMouseDown : function (we) {
        this._elCurrentElement = we.element;
        this._wfWatchInputTimer =  jindo.$Fn(this._createTimer, this);
        this._wfRunTimer =  jindo.$Fn(this._run, this);

        this._wfWatchInputTimer.delay(0.5, [true]);
    },
    _onMouseUp : function () {
        this._run();
        this._stop();
    },
    _onAllMouseUp : function () {
        if(true === this._hasTimer()){
            this._stop();
        }
    },
    _onFocus : function () {
        if(true === this._elInput.readOnly){
            return false;
        }

        this._oSpinbox.setValue(this._elInput.value);
        this._elInput.value = "";
    },
    _onBlur : function () {
        if(true === this._isNotModify()){
            this._showCurrentValue();
        }

        this._oSpinbox.setValue(this._elInput.value);
        this._oSpinbox.convertToNumber();
        this._oSpinbox.limitRangeValue();

        this._showCurrentValue();
    }
}).extend(jindo.UIComponent);


