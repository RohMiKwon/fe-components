/**
 * @fileOverview Spinbox 코어 클래스 파일
 * @name spinbox.js
 */

/**
 * @class
 * @example
 var oInstance = new Spinbox({"option_1", ..});
 */
var Spinbox;
Spinbox = jindo.$Class({
    /**
     * @constructor
     * @param {HashTable} htOption. 해쉬로 작성된 Spinbox옵션의 정보
     */
    $init: function (htOption) {
        this._nDefaultValue = htOption.nDefaultValue;
        this._nMax = htOption.nMax;
        this._nMin = htOption.nMin;
        this._nStep = htOption.nStep;

        this._nValue = 0;
    },
    reset : function () {
        this._nValue = this._nDefaultValue;
    },
    increase : function () {
        this._nValue = this._nValue + this._nStep;
    },
    decrease : function () {
        this._nValue = this._nValue - this._nStep;
    },
    isMaxValue : function () {
        if(this._nValue >= this._nMax){
            return true;
        }
    },
    isMinValue : function () {
        if(this._nValue <= this._nMin){
            return true;
        }
    },
    limitRangeValue : function () {
        if(true === this.isMaxValue()){
            this._nValue = this._nMax;
        }
        if(true === this.isMinValue()){
            this._nValue = this._nMin;
        }
    },
    convertToNumber : function () {
        if("number" !== typeof this._nValue){
            this._nValue = this._getFormattedValue(this._nValue);
        }
    },
    _getFormattedValue : function (sText) {
        var sSignfilter = new RegExp('^[-]');
        var sNumberfilter = new RegExp('[^0-9]', 'g');
        if(true === sSignfilter.test(sText)){
            return this._nMin;
        }else{
            return parseInt(sText.replace(sNumberfilter, ''), 10);
        }
    },
    getValue : function () {
        return parseInt(this._nValue, 10);
    },
    setValue : function (nValue) {
        this._nValue = nValue;
    }
});