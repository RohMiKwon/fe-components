var nts = nts || {};
nts.vendingMachine = nts.vendingMachine || {};
nts.vendingMachine.model = nts.vendingMachine.model || {};
nts.vendingMachine.model.WalletModel = jindo.$Class({
    $init : function(nMoney){
        this._nHoldMoney = nMoney;
    },
    getHoldMoney : function(){
        return this._nHoldMoney;
    },
    isOverHoldMoney : function(nPrice){
        return this._nHoldMoney < nPrice;
    },
    extractHoldMoney : function(nPrice){
        this._nHoldMoney -= nPrice;
    },
    addReturnMoney : function(nPrice){
        this._nHoldMoney += nPrice;
    }
});