var Draggable = jindo.$Class({
    $init : function(el){
        this._elDrag = el;
        this._welBase = jindo.$Element(window.document);

        this._welDraggableElement = null;    // 드래그 되는 요소
        this._bIsDragging = false;  // 드래깅 여부
        this._welDragHelper = null;   // 드래그 복사본

        // 요소 사이의 오차 간격
        this._nGapX = 0;
        this._nGapY= 0;

        this._findDraggableElement();   // 드래그 요소 찾기

        this._wfnOnMouseDown = jindo.$Fn(this._onMouseDown, this);
        this._wfnOnMouseUp = jindo.$Fn(this._onMouseUp, this);
        this._wfnOnMouseMove = jindo.$Fn(this._onMouseMove, this);

        this.activate();
    },
    isDragging : function(){
        return this._bIsDragging;
    },
    getDraggingElement: function(){
        return this._welDragHelper;
    },
    _onActivate : function(){
        this._wfnOnMouseDown.attach(this._welDraggableElement, "mousedown");
    },
    _onDeactivate : function(){
        this._wfnOnMouseDown.detach(this._welDraggableElement, "mousedown");
    },
    _findDraggableElement : function(){
        if(typeof this._elDrag === "string"){
            this._welDraggableElement = jindo.$Element(this._welBase.query(this._elDrag));
        }else if(typeof this._elDrag === "object"){
            this._welDraggableElement = this._elDrag;
        }else{
            this._welDraggableElement = null;
        }
    },
    _calculateBetweenElementGap : function(oPos){
        var htOffset = this._welDraggableElement.offset();
        this._nGapX = parseInt(oPos.pageX, 10) - parseInt(htOffset.left, 10);
        this._nGapY = parseInt(oPos.pageY, 10) - parseInt(htOffset.top, 10);
    },
    _cloneDraggableElement : function(){
        this._welDragHelper = jindo.$Element(this._welDraggableElement.$value()).clone().attr("id","dragging_layer");
    },
    _removeDragHelper : function(){
        jindo.$Element(document.body).remove(this._welDragHelper);
    },
    _appendDragHelper : function(){
        this._welDragHelper.css({zIndex:9999, position:"absolute"});
        jindo.$Element(document.body).append(this._welDragHelper);
    },
    _setDraggingElementsPosition : function(oPos){
        this._welDragHelper.css({
            'top' : parseInt(oPos.pageY - this._nGapY, 10),
            'left' : parseInt(oPos.pageX - this._nGapX, 10)
        });
    },
    _onMouseDown : function(we){
        var oPos = we.pos();

        if(null === this._welDraggableElement){
            return false;
        }

        this._bIsDragging = true;

        this._calculateBetweenElementGap(oPos);
        this._cloneDraggableElement();
        this._appendDragHelper();
        this._wfnOnMouseMove.attach(this._welBase, "mousemove");
        this._wfnOnMouseUp.attach(this._welBase, "mouseup");
        this.fireEvent("dragStart", we);
    },
    _onMouseUp : function(we){
        var oPos = we.pos();

        if(null === this._welDraggableElement){
            return false;
        }

        this._wfnOnMouseMove.detach(this._welBase, "mousemove");
        this._wfnOnMouseUp.detach(this._welBase, "mouseup");
        this._bIsDragging = false;
        this._removeDragHelper();
        this.fireEvent("dragEnd", we);
    },
    _onMouseMove : function(we){
        var oPos = we.pos();

        if(false === this._bIsDragging){
            return false;
        }

        this._setDraggingElementsPosition(oPos);

        this.fireEvent("drag", we);
    }
}).extend(jindo.UIComponent);