var Droppable = jindo.$Class({
    $init : function(el){
        this._elDrag = el;
        this._welBase = jindo.$Element(window.document);

        this._welDroppableElement = null;  // 드롭 요소

        this._findDroppableElement();   // 드래그 요소 찾기
    },
    isMouseOverDropArea : function(pos){
        var welDrop = this._welDroppableElement,
            weDropOffset = this._welDroppableElement.offset(),
            nLeft = weDropOffset.left,
            nRight = weDropOffset.left + welDrop.width(),
            nTop = weDropOffset.top,
            nBottom = weDropOffset.top + welDrop.height();

        if(pos.pageX >= nLeft &&
            pos.pageX <= nRight &&
            pos.pageY >= nTop &&
            pos.pageY <= nBottom){
            return true;
        }else{
            return false;
        }
    },
    _findDroppableElement : function(){
        if(typeof this._elDrag === "string"){
            this._welDroppableElement = jindo.$Element(this._welBase.query(this._elDrag));
        }else if(typeof this._elDrag === "object"){
            this._welDroppableElement = this._elDrag;
        }else{
            this._welDroppableElement = null;
        }
    },
    getDroppableElement : function(){
        return this._welDroppableElement;
    }
});