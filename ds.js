class Queue 
{ 
    // Array is used to implement a Queue 
    constructor() 
    { 
        this.items = []; 
    } 
                  
    enqueue(element) 
	{     
		// adding element to the queue 
		this.items.push(element); 
	} 
	
	dequeue() 
	{ 
		// removing element from the queue 
		// returns underflow when called  
		// on empty queue 
		if(this.isEmpty())
		{			
			return null; 
		}
		return this.items.shift(); 
	} 
	
	front() 
	{ 
		// returns the Front element of  
		// the queue without removing it. 
		if(this.isEmpty()) 
			return "No elements in Queue"; 
		return this.items[0]; 
	} 
	
	isEmpty() 
	{ 
		// return true if the queue is empty. 
		return this.items.length == 0; 
	} 
} 

class Stack {
  constructor(...items){
    this._items = []

    if(items.length > 0)
	{
		items.forEach(item => this._items.push(item) )	
	}
  }

  push(...items){
    //push item to the stack
     items.forEach(item => this._items.push(item) )
     return this._items;

  }

  pop(count=0){
    //pull out the topmost item (last item) from stack
    if(count===0)
      return this._items.pop()
     else
       return this._items.splice( -count, count )
  }

  pop_end(count=1){
    return this._items.splice(0, count)
  }

  peek(){
    // see what's the last item in stack
    return this._items[this._items.length-1]
  }

  size(){
    //no. of items in stack
    return this._items.length
  }

  isEmpty(){
    // return whether the stack is empty or not
    return this._items.length==0
  }

  toArray(){
    return this._items;
  }
}