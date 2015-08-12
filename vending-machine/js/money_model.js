var nts = nts || {};
nts.vendingMachine = nts.vendingMachine || {};
nts.vendingMachine.model = nts.vendingMachine.model || {};
nts.vendingMachine.model.MoneyModel = jindo.$Class({
    $init : function(htMoneyInfo){
        this._sMoneyType = htMoneyInfo.sMoneyType;
        this._nPrice = htMoneyInfo.nPrice;
    },
    getMoneyType : function(){
        return this._sMoneyType;
    },
    getPrice : function(){
        return this._nPrice;
    },
    isPaper : function(){
        return this._sMoneyType === "w4";
        //return this._nPrice === 1000;
    }
});