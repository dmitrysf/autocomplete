import React from 'react';
import Service from './Service'



var AutocompleteEditor = React.createClass({
  getInitialState: function() {
    return {
        service: new Service(this.processCompletion),
        suggestingWord: false
    };
  },
  getCurrentWord: function() {
      var $inputElement = this.refs.textarea;
      var selectionStart = $inputElement.selectionStart;
      var selectionEnd = $inputElement.selectionEnd;
      var text = $inputElement.value;
      if (text.length != selectionEnd && text.charAt(selectionEnd) != ' ') {
          return '';
      }
      var wordStart =  text.substring(0, selectionStart).lastIndexOf(' ') + 1;
      return text.substring(wordStart, selectionEnd);
  },
  getSelection: function() {
    var el = this.refs.textarea;
    var result = el.value.substr(el.selectionStart, el.selectionEnd);
    return result;
  },
  cursorPosition: function() {
  	var el = this.refs.textarea;
  	return el.selectionStart;
  },
  moveSelectionStart: function(amount) { 
     this.refs.textarea.selectionStart += amount;
  },
  select: function (startPos, endPos) {
  	var el = this.refs.textarea;
    el.selectionStart = startPos;
    el.selectionEnd = endPos;
 	return;
  }, 
  //returns true if update completed and no default actions required
  processCompletion: function(keyup) {
    var preventDefault   = false;
    var $inputElement = this.refs.textarea;
    var curPos	= this.cursorPosition();
    var inputValue = this.refs.textarea.value;
    var	currentWord     = this.getCurrentWord().toLowerCase();
    if (currentWord.length<3) {
        return preventDefault;
    }
    var foundTerm = this.state.service.findTerm(currentWord);
    if (foundTerm !== null && foundTerm != currentWord) {
        var beforeCursor = inputValue.substr(0, curPos),
        afterCursor  = inputValue.substr(curPos, inputValue.length),
        curPosInWord = curPos - (inputValue.substr(0, curPos).lastIndexOf(' ') + 1);
		var foundWord = foundTerm.substr(curPosInWord, foundTerm.length);
        $inputElement.value = beforeCursor + foundWord + afterCursor;
        this.select(curPos, curPos + foundWord.length);
        preventDefault = true;
        this.state.suggestingWord = true;
    } else if (!keyup) {
        this.state.suggestingWord = false;
    }
    return preventDefault;
  },
  removeSelection: function(removePosition, postRemoveCursorPosition) {
        var $inputElement = this.refs.textarea;
        var start = $inputElement.selectionStart > 0 ? $inputElement.selectionStart + removePosition : 0;
        var end = $inputElement.selectionEnd;
        var currentValue = $inputElement.value
        $inputElement.value = currentValue.slice(0, start) + currentValue.slice(end);
        var pos = start > 0 ? start + postRemoveCursorPosition: 0;
        $inputElement.selectionStart =  pos;
        $inputElement.selectionEnd = pos;
  },
  onMouseDown: function(event) {
      if (this.state.suggestingWord) {
        this.removeSelection(0,0);
        this.state.suggestingWord = false;
      }
  }
  ,
  performComplete: function(event) {
  	var preventDefault   = false;
  	var $inputElement = this.refs.textarea;
  	if ($inputElement.selectionStart == $inputElement.selectionEnd) {
  	    this.state.suggestingWord = false;
  	}
  	if (event.which == 8 // Backspace
        ) {
        if (this.state.suggestingWord) {
            this.removeSelection(-1,0);
            preventDefault = true;
        }
        this.state.suggestingWord = false;
    } else if (event.which == 46) { // Delete
        this.state.suggestingWord = false;
    } else if (event.which == 9) { // TAB character
        if (this.state.suggestingWord) {
            preventDefault = true;
            $inputElement.selectionStart = $inputElement.selectionEnd;
            this.state.suggestingWord = false;
        }
    } else if (event.which == 37) { // left button
        if (this.state.suggestingWord) {
            this.removeSelection(0,-1);
            preventDefault = true;
        }
    } else if (event.which == 39) { // right button
        if ($inputElement.selectionStart != $inputElement.selectionEnd && this.state.suggestingWord) {
            if (event.type == 'keydown') {
                this.moveSelectionStart(1);
            }
            preventDefault = true;
        }
        
    } else if (event.which == 16 || 
        event.ctrlKey || event.which == 17 // Ctrl + Letter, or Ctrl
        ) {
        //do nothing
    } else {
        var	currentWord     = this.getCurrentWord().toLowerCase();
        if (currentWord != '' && currentWord.length>2) {
         	if (event.type == 'keydown') {
                // Move selection
                var selection = this.getSelection(),
                letter = String.fromCharCode(event.which);
                if (letter == '') {
                    return;
                // String.fromCharCode returns uppercase...
                } 
                if (!event.shiftKey) {
                    letter = letter.toLowerCase();
                }
                if (letter == selection.substr(0, 1)) {
                    this.moveSelectionStart(1);
                    preventDefault = true;
                    if ($inputElement.selectionStart == $inputElement.selectionEnd) {
                        this.state.suggestingWord = false;
                    }
             	}
            } else if(event.type == 'keyup') {
                preventDefault = this.processCompletion(true);
            }
        }
    }
    if (preventDefault) {
     	event.preventDefault()
    }
  },
  render: function() {
    return ( <textarea 
      onKeyUp = {
      	this.performComplete
      }
      onKeyDown = {
      	this.performComplete
      }
      onMouseDown = {
        this.onMouseDown
      }
      ref = "textarea"
      defaultValue = {
        this.state.value
      }
      />
    );
  }
});

export default AutocompleteEditor;