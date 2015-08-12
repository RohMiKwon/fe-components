var nts = nts || {};
nts.vendingMachine = nts.vendingMachine || {};
nts.vendingMachine.view = nts.vendingMachine.view || {};
nts.vendingMachine.view.View = jindo.$Class({
    TEMPLATE_FOR_GOODS : '{for good in goods}\n<li class={=good.getId().replace(/p/g,"item")}><button><span class="blind">{=good.getName()}</span></button><span>{=good.getPrice()}원</span></li>{/for}\n',
    TEMPLATE_FOR_EMPTY_GOODS : '<span class="soldout_msg" id="_goods_empty">품절</span>',
    TEMPLATE_FOR_MY_WALLET : '지금 내 돈: <span>{=nPrice}</span>원',
    TEMPLATE_FOR_REMAINDER : '<span>{=nPrice}</span>원',
    $init : function(htElements){
        this._elConsole = htElements.elConsole;
        this._elGoodsArea = htElements.elGoodsArea;
        this._elMyWallet = htElements.elMyWallet;
        this._elRemainder = htElements.elRemainder;
    },
    appendMessage : function(sMessage){
        var elMessage = jindo.$("<p class='message'>" + sMessage + "</p>");
        this._elConsole.append(elMessage);
    },
    appendGoodsEmpty : function(sId){
        var className = this._findClassName(sId),
            elGood = jindo.$Element(this._elGoodsArea.query("." + className));
        elGood.append(this.TEMPLATE_FOR_EMPTY_GOODS);
    },
    _createGoods : function(waGoods){
        var oData = { goods : waGoods.$value() };
        return jindo.$Template(this.TEMPLATE_FOR_GOODS).process(oData);
    },
    appendGoods : function(waGoods){
        this._elGoodsArea.html(this._createGoods(waGoods));
    },
    _updateWallet : function(nPrice){
        return jindo.$Template(this.TEMPLATE_FOR_MY_WALLET).process({nPrice : nPrice});
    },
    appendMyWallet : function(nPrice){
        this._elMyWallet.html(this._updateWallet(nPrice));
    },
    _updateRemainder : function(nPrice){
        return jindo.$Template(this.TEMPLATE_FOR_REMAINDER).process({nPrice : nPrice});
    },
    appendRemainder : function(nPrice){
        this._elRemainder.html(this._updateRemainder(nPrice));
    },
    _findClassName : function(sId){
        var className = sId.replace(/p/g,"item");
        return className;
    }
});