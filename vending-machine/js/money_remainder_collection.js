var nts = nts || {};
nts.vendingMachine = nts.vendingMachine || {};
nts.vendingMachine.model = nts.vendingMachine.model || {};
nts.vendingMachine.model.MoneyRemainderCollection = jindo.$Class({
    $init : function(){
        this._nMoneyRemainder = 0;
        this._nMaxMoney = 3000;
        this._nMaxPaper = 2;
    },
    addMoney : function(nPrice){
        this._nMoneyRemainder += nPrice;
    },
    extractMoney : function(nPrice){
        this._nMoneyRemainder -= nPrice;
    },
    getMaxPaper : function(){
        return this._nMaxPaper;
    },
    getRemainder : function(){
        return this._nMoneyRemainder;
    },
    isOverMaxMoney : function(nPrice){
        return (this._nMoneyRemainder + nPrice) > this._nMaxMoney;
    },
    isOverMaxPaper : function(nPaper){
        return this._nMaxPaper < nPaper;
    }
});