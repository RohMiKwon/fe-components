var nts = nts || {};
nts.vendingMachine = nts.vendingMachine || {};
nts.vendingMachine.model = nts.vendingMachine.model || {};
nts.vendingMachine.model.GoodModel = jindo.$Class({
    $init : function(htGoodInfo){
        this._sId = htGoodInfo.sId;
        this._sName = htGoodInfo.sName;
        this._nPrice = htGoodInfo.nPrice;
    },
    getId : function(){
        return this._sId;
    },
    getName : function(){
        return this._sName;
    },
    getPrice : function(){
        return this._nPrice;
    }
});