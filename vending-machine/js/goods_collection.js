var nts = nts || {};
nts.vendingMachine = nts.vendingMachine || {};
nts.vendingMachine.model = nts.vendingMachine.model || {};
nts.vendingMachine.model.GoodsCollection = jindo.$Class({
    $init : function(){
        this._waGoods = jindo.$A();
        this._nTotalInSelectedGoodsIndex = [];
    },
    addGood : function(oGoods, nQuantity){
        console.log("입고 수량 :" + oGoods.getName(), nQuantity);
        for(var i = 0; i < nQuantity; i++){
            //this._waGoods.push(new nts.vendingMachine.model.GoodModel({sId : htGoodInfo.sId, sName : htGoodInfo.sName, nPrice: htGoodInfo.nPrice}));
            // 안에서 넣어줄 경우 _array에 typeClass가 들어감... unique 실행 안됨
            this._waGoods.push(oGoods);
        }
    },
    // 상품 구매시 상품리스트에서 삭제 - 아이디로 찾아서 삭제해주는 방식으로 다시 구현
    extractGood : function(sId){
        this._waGoods.splice(this._nTotalInSelectedGoodsIndex[0],1);
    },
    getGoods : function(){
        return this._waGoods;
    },
//    getSelectedGoodsQuantity : function(){
//        return this._waselectedGoods.length();
//    },
    isEmptyGoods : function(nQuantity){
        return nQuantity <= 1;
    },
    sortRandomGoods : function(){
        this._waGoods.shuffle();
    },
    findGoods : function(sId){
        var waSelectedGoods , nTotalInSelectedGoodsIndex = [], waGoods = this._waGoods;

        //콜백 필터 적용 안됨.
        waSelectedGoods = waGoods.filter(function(value, index, array){
            if(sId === value.getId()){
                nTotalInSelectedGoodsIndex.push(index); // 현재 선택된 상품의 배열에 인덱스를 뽑아낼 수 있다.
                return true;
            }else{
                return false;
            }
        });

        this._nTotalInSelectedGoodsIndex = nTotalInSelectedGoodsIndex;

        if(waSelectedGoods.length() === 0) {
            console.log("수량없음");
            return null;
        }

        return {
            sId : waSelectedGoods.get(0).getId(),
            sName : waSelectedGoods.get(0).getName(),
            nPrice : waSelectedGoods.get(0).getPrice(),
            nQuantity : waSelectedGoods.length()
        };

    }
});