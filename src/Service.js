import AVLTree from './AVLTree';
import $ from 'jquery';

class Service {
    
    constructor(callback) {
      	this.resultCallback = callback;
      	this.outgoingRequests = {};
    }
  
	findTerm(input) {
        var result = AVLTree.search(input);
        if (!result) {
            if (!this.outgoingRequests[input]) {
                this.outgoingRequests[input] = true;
                var that = this;
                $.ajax({
                    url:  '/words/complete?query=' + input,
                    crossDomain: true,
                    dataType: 'json',
                }).done(function(data) {
                    delete that.outgoingRequests[input];
                    if (data.word) {
                        AVLTree.insert(data.word, true);
                    } else {
                        AVLTree.insert(input, false);
                    }
                    if (Object.keys(that.outgoingRequests).length == 0) {
                        that.resultCallback();
                    }
                }).fail(function(error) {
                    delete that.outgoingRequests[input];
                });
            }
        } else if (result.exist) {
        	return result.term;
        }
        return null;
	}
}

export default Service;