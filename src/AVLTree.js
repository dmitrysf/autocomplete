var head = null;

class AVLTree {
	
  constructor(parent, term, exist) {
  	this.parent = parent;
    this.left = null;
    this.right = null;
    this.term = term;
    this.balance = 0;
    this.exist = exist;
  }
  
  print() {
      var left = this.left ? this.left.print() : "EMPTY";
      var right = this.right ? this.right.print(): "EMPTY";
      return "(" + this.term + "," + left + "," +  right + ")";
  }
  
    rightRotation() {
        var q = this, 
        	p = this.left, 
            b, ah, bh, ch;
      	if (!p) { return this; }   // No change
      	b = p.right;
        // Alter tree structure
        if (q.parent) {
            p.parent = q.parent;
            if (q.parent.left === q) { 
                q.parent.left = p; 
            } else { 
                q.parent.right = p; 
            }
        } else {
            p.parent = null;
        }
        p.right = q;
        q.parent = p;
        q.left = b;
        if (b) { 
        	b.parent = q; 
        }
        return p;
    }
  
    leftRotation() {
        var p = this, 
        	q = this.right, 
            b, ah, bh, ch;
        if (!q) { return this; }   // No change
        b = q.left;
        // Alter tree structure
        if (p.parent) {
            q.parent = p.parent;
            if (p.parent.left === p) { 
                p.parent.left = q; 
            } else { 
                p.parent.right = q; 
            }
        } else {
          q.parent = null;
        }
        q.left = p;
        p.parent = q;
        p.right = b;
        if (b) { b.parent = p; }
        return q;
    };
  
  static search(term) {
    var p = head;
  	while (p!=null) {
  	    if (term.length >= p.term.length && term.indexOf(p.term)==0 && p.exist==false) {
  	        return p;
  	    } 
        var cmp = p.term.slice(0, term.length).localeCompare(term);
        if (cmp == 0) {
            return p;
        } else if (cmp < 0) {
            p = p.left;
        } else {
          	p = p.right;
        }
    }
    return null;
  }
  
  static insert(term, exist) {
  	if (!head) {
    	head = new AVLTree(null, term, exist);
    } else {
      var currentNode = head;
      var retrace = false;
      var newNode;
      while (true) {
        var cmp = currentNode.term.localeCompare(term);
        if (cmp==0) {
            break;
        } else if (cmp < 0) {
          if (!currentNode.left) {
          	newNode = new AVLTree(currentNode, term, exist);
            currentNode.left = newNode;
            if (!currentNode.right) {
            	retrace = true;
            }
            break;
          } else {
            currentNode = currentNode.left;
          }
        } else {
          if (!currentNode.right) {
          	newNode = new AVLTree(currentNode, term, exist);
            currentNode.right = newNode;
            if (!currentNode.left) {
            	retrace = true;
            }
            break;
          } else {
            currentNode = currentNode.right;
          }
        }
      }
        if (retrace) {
    	    AVLTree.retrace(currentNode, newNode);
        }
    }
    
  }
  
  static retrace(p, n) {
  	// N is the child of P whose height increases by 1.
  	do {
     // p.balance has not yet been updated!
         if (n == p.left) { // the left subtree increases
           if (p.balance == 1) { 
             // ==> the temporary balance_factor(P) == 2 ==> rebalancing is required.
             if (n.balance == -1) { // Left Right Case
                n.leftRotation(); // Reduce to Left Left Case
             }
             // Left Left Case
             p.rightRotation();
             if (head == p) {
                 head = p.parent;
             }
             break; // Leave the loop
           }
           if (p.balance == -1) {
                p.balance = 0; // N’s height increase is absorbed at P.
                break; // Leave the loop
           }
           p.balance = 1;
         } else { // N == right_child(P), the child whose height increases by 1.
           if (p.balance == -1) { 
             // ==> the temporary balance_factor(P) == -2 ==> rebalancing is required.
             if (n.balance == 1) { // Right Left Case
                n.rightRotation(); // Reduce to Right Right Case
             }
             // Right Right Case
             p.leftRotation();
             if (head == p) {
                 head = p.parent;
             }
             break; // Leave the loop
           }
           if (p.balance == 1) {
             p.balance = 0; // N’s height increase is absorbed at P.
             break; // Leave the loop
           }
           p.balance = -1;
         }
         n = p;
         p = p.parent;
       } while (p != null);
  }
  
}

export default AVLTree;