/**
*
* Purpose: To reduce the amount of saves when setting a value from a repetitive trigger.
* Tyler Rainey
**/
validateSetAndSave: function(dbName, newValue) {
    const oldValue = this.get(dbName);
    
    if (oldValue !== newValue) {
        
        this.set(dbName, newValue);
        this.save();
    }
},