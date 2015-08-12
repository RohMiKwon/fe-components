/**
 * @fileOverview 자동판매기 컨트롤러 클래스 파일
 * @name vending_machine.js
 */

/**
 * @class
 * @example
 var oInstance = new nts.vendingMachine.controller.VendingMachine(id);
 */
var nts = nts || {};
nts.vendingMachine = nts.vendingMachine || {};
nts.vendingMachine.controller = nts.vendingMachine.controller || {};
nts.vendingMachine.controller.VendingMachine = jindo.$Class({
    /**
     * @constructor
     * @param {Elements} 뷰에 넘겨줄 HTML 요소들
     */
    $init : function(el){
        this._wel = jindo.$Element(el);
        this._assignHTMLElements();

        //선택된 상품의 정보
        this._sSelectedGoodName = "";
        this._nSelectedGoodPrice = 0;
        this._nSelectedGoodQuantity = 0;

        this._nPaperCounter = 0;

        this._oView = new nts.vendingMachine.view.View({
            elConsole : this._elConsole,
            elGoodsArea : this._elGoodsArea,
            elMyWallet : this._elMyWallet,
            elRemainder : this._elRemainder
        });

        this._oGoodsCollection = new nts.vendingMachine.model.GoodsCollection();

        this._oWalletModel = new nts.vendingMachine.model.WalletModel(10000);
        this._oView.appendMessage("내 지갑 초기화");
        this._oMoneyRemainderCollection = new nts.vendingMachine.model.MoneyRemainderCollection();
        this._oView.appendMessage("현재 금액 초기화");
        this._logCurrentMoney();

        this._initMoney();
        this._initGoods();

        this._wfnOnGoodClick = jindo.$Fn(this._onGoodClick, this);
        this._wfnOnReturnButtonClick = jindo.$Fn(this._onReturnButtonClick, this);

        this._oDraggableMoneyFifty = new Draggable(this._elFifty);
        this._oDraggableMoneyHundred = new Draggable(this._elHundred);
        this._oDraggableMoneyFiveHundred = new Draggable(this._elFiveHundred);
        this._oDraggableMoneyThousand = new Draggable(this._elThousand);

        this._oDroppableInsertCoin = new Droppable(this._elInsertCoin);
        this._oDroppableInsertPaperMoney = new Droppable(this._elInsertPaperMoney);

        this.activate();
    },
    _initMoney : function(){
        this._oMoneyFifty = new nts.vendingMachine.model.MoneyModel({sMoneyType : "w1", nPrice : 50});
        this._oMoneyHundred = new nts.vendingMachine.model.MoneyModel({sMoneyType : "w2", nPrice : 100});
        this._oMoneyFiveHundred = new nts.vendingMachine.model.MoneyModel({sMoneyType : "w3", nPrice : 500});
        this._oMoneyThousand = new nts.vendingMachine.model.MoneyModel({sMoneyType : "w4", nPrice : 1000});
    },
    _assignHTMLElements : function(){
        this._elConsole = jindo.$Element(this._wel.query(".console_area"));
        this._elGoodsArea = jindo.$Element(jindo.$$.getSingle(".product_area > ul", this._wel));
        this._elMyWallet = jindo.$Element(this._wel.query(".my_money"));
        this._elRemainder = jindo.$Element(this._wel.query(".insert"));
        this._elReturnButton = jindo.$Element(jindo.$("_btn_money_return"));

        this._elInsertCoin = jindo.$Element(this._wel.query(".insert_coin"));
        this._elInsertPaperMoney = jindo.$Element(this._wel.query(".insert_papermoney"));

        this._elFifty = jindo.$Element(this._wel.query(".w50"));
        this._elHundred = jindo.$Element(this._wel.query(".w100"));
        this._elFiveHundred = jindo.$Element(this._wel.query(".w500"));
        this._elThousand = jindo.$Element(this._wel.query(".w1000"));
    },
    _initGoods : function(){
        var waUniqueGoods = null;
        this._oGoodsCollection.addGood(new nts.vendingMachine.model.GoodModel({sId : "p1", sName : "펩시", nPrice : 300}), this._setQuantity());
        this._oGoodsCollection.addGood(new nts.vendingMachine.model.GoodModel({sId : "p2", sName : "V10", nPrice : 200}), this._setQuantity());
        this._oGoodsCollection.addGood(new nts.vendingMachine.model.GoodModel({sId : "p3", sName : "칸타타", nPrice : 700}), this._setQuantity());
        this._oGoodsCollection.addGood(new nts.vendingMachine.model.GoodModel({sId : "p4", sName : "2%", nPrice : 500}), this._setQuantity());
        this._oGoodsCollection.addGood(new nts.vendingMachine.model.GoodModel({sId : "p5", sName : "환타", nPrice : 800}), this._setQuantity());
        this._oGoodsCollection.addGood(new nts.vendingMachine.model.GoodModel({sId : "p6", sName : "식혜", nPrice : 100}), this._setQuantity());
        this._oGoodsCollection.addGood(new nts.vendingMachine.model.GoodModel({sId : "p7", sName : "비타500", nPrice : 500}), this._setQuantity());
        this._oGoodsCollection.addGood(new nts.vendingMachine.model.GoodModel({sId : "p8", sName : "박카스", nPrice : 500}), this._setQuantity());

        this._oGoodsCollection.sortRandomGoods();

        waUniqueGoods = jindo.$A(this._oGoodsCollection.getGoods().$value()).unique();
        this._oView.appendGoods(waUniqueGoods);
        this._oView.appendMessage("음료 초기화");
    },
    _setQuantity : function(){
        return Math.floor(Math.random() * 3) + 1;
    },
    _onActivate : function(){
        var _oSelf = this;
        this._wfnOnGoodClick.attach(this._elGoodsArea, "click");
        this._wfnOnReturnButtonClick.attach(this._elReturnButton, "click");

        this._oDraggableMoneyFifty.attach({
            dragEnd : function(oCustomEvent){
                if(true === _oSelf._oDroppableInsertCoin.isMouseOverDropArea(oCustomEvent.pos())){
                    _oSelf._insertMoney(_oSelf._oMoneyFifty);
                }else{
                    _oSelf._oWalletModel.extractHoldMoney(_oSelf._oMoneyFifty.getPrice());
                    _oSelf._logCurrentMoney();
                }
            }
        });

        this._oDraggableMoneyHundred.attach({
            dragEnd : function(oCustomEvent){
                if(true === _oSelf._oDroppableInsertCoin.isMouseOverDropArea(oCustomEvent.pos())){
                    _oSelf._insertMoney(_oSelf._oMoneyHundred);
                }else{
                    _oSelf._oWalletModel.extractHoldMoney(_oSelf._oMoneyHundred.getPrice());
                    _oSelf._logCurrentMoney();
                }
            }
        });

        this._oDraggableMoneyFiveHundred.attach({
            dragEnd : function(oCustomEvent){
                if(true === _oSelf._oDroppableInsertCoin.isMouseOverDropArea(oCustomEvent.pos())){
                    _oSelf._insertMoney(_oSelf._oMoneyFiveHundred);
                }else{
                    _oSelf._oWalletModel.extractHoldMoney(_oSelf._oMoneyFiveHundred.getPrice());
                    _oSelf._logCurrentMoney();
                }
            }
        });

        this._oDraggableMoneyThousand.attach({
            dragEnd : function(oCustomEvent){
                if(true === _oSelf._oDroppableInsertPaperMoney.isMouseOverDropArea(oCustomEvent.pos())){
                    _oSelf._insertMoney(_oSelf._oMoneyThousand);
                }else{
                    _oSelf._oWalletModel.extractHoldMoney(_oSelf._oMoneyThousand.getPrice());
                    _oSelf._logCurrentMoney();
                }
            }
        });

    },
    _onDeactivate : function(){
        this._wfnOnGoodClick.detach(this._elGoodsArea, "click");
        this._wfnOnReturnButtonClick.detach(this._elReturnButton, "click");
    },
    _onGoodClick : function(we){
        if(we.element.tagName === "BUTTON"){
            var nIndex = parseInt(we.element.parentNode.className.replace("item", ""), 10),
                sId = "p" + nIndex;
            this._extractGood(sId);
        }
    },
    _onReturnButtonClick : function(){
        var nRemainderPrice = this._oMoneyRemainderCollection.getRemainder();
        this._oWalletModel.addReturnMoney(nRemainderPrice);
        this._oMoneyRemainderCollection.extractMoney(nRemainderPrice);
        this._nPaperCounter = 0;
        this._logCurrentMoney();
    },
    _insertMoney : function(oMoney){
        var oMoneyRemainderCollection = this._oMoneyRemainderCollection,
            oWalletModel = this._oWalletModel;

        // 지갑에 돈이 없는 경우
        if(true === oWalletModel.isOverHoldMoney(oMoney.getPrice())){
            console.log("지갑에 돈이 없는 경우");
            return false;
        }

        // 3000원까지만 들어가는 구문...
        if(true === oMoneyRemainderCollection.isOverMaxMoney(oMoney.getPrice())){
            console.log("넘침");
            return false;
        }

        // 지폐일 경우 최대 지폐 수를 넘기면 투입할 수 없다.
        if(true === oMoney.isPaper()){
            console.log("지폐인경우");
            this._nPaperCounter += 1;
        }

        // 지폐일 경우 최대 지폐 수를 넘기면 지폐는 투입할 수 없다.
        if(true === oMoneyRemainderCollection.isOverMaxPaper(this._nPaperCounter)){
            console.log("최대 지폐수를 넘긴 경우");
            this._nPaperCounter = oMoneyRemainderCollection.getMaxPaper();
            return false;
        }

        oMoneyRemainderCollection.addMoney(oMoney.getPrice());
        oWalletModel.extractHoldMoney(oMoney.getPrice());
        this._logCurrentMoney();
    },
    _extractGood : function(sId){
        var oSelectedGoodInfo = this._oGoodsCollection.findGoods(sId),
            oMoneyRemainderCollection = this._oMoneyRemainderCollection,
            oGoodsCollection = this._oGoodsCollection;

        //정보가 없는 경우...(품절이후에 배열접근시 정보가 없다.)
        if(null === oSelectedGoodInfo){
            return false;
        }

        //선택된 상품의 정보
        this._sSelectedGoodId = oSelectedGoodInfo.sId;
        this._sSelectedGoodName = oSelectedGoodInfo.sName;
        this._nSelectedGoodPrice = oSelectedGoodInfo.nPrice;
        this._nSelectedGoodQuantity = oSelectedGoodInfo.nQuantity;

        // 상품 금액이 남아있는 금액보다 큰 경우 구매 안됨
        if(this._nSelectedGoodPrice > oMoneyRemainderCollection.getRemainder()){
            this._oView.appendMessage((this._nSelectedGoodPrice - oMoneyRemainderCollection.getRemainder()) + "원이 부족합니다.");
            return false;
        }

        //구매
        oGoodsCollection.extractGood(this._sSelectedGoodId);
        oMoneyRemainderCollection.extractMoney(this._nSelectedGoodPrice);
        this._oView.appendMessage(this._sSelectedGoodName  + " 구매");
        this._logCurrentMoney();

        //품절일 경우
        if(true === oGoodsCollection.isEmptyGoods(this._nSelectedGoodQuantity)){
            this._oView.appendGoodsEmpty(this._sSelectedGoodId);
        }
    },
    _logCurrentMoney : function(){
        this._oView.appendMyWallet(this._oWalletModel.getHoldMoney());
        this._oView.appendRemainder(this._oMoneyRemainderCollection.getRemainder());
    }
}).extend(jindo.UIComponent);
