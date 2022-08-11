/**
    Purpose: To grab the ID of a lookup and have access to it in a callback making it synchronous.

    Tyler Rainey
**/
export const getLookupValue = function(lookup, text, cb) {
    var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
        rootSchemaName: lookup
    });
    esq.addColumn("Id");
    esq.addColumn("Name");
    
    var nameFilter = esq.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, "Name", text);
    
    esq.filters.add("nameFilter", nameFilter);

    esq.getEntityCollection(function (result) {
        if (result.success) {
            cb(result.collection.collection.items[0].values.Id);
        }
    }, this);
}

/**
    Purpose: To sum the field of a desired lookup.

    Usage: 
    
    this.getSum({ "Opportunity": opportunityId }, "OpportunityProductInterest", "Amount", function(amount) {
        const discountDollar = self.get("UsrDiscountDollar");
        
        const newAmount = amount - discountDollar;

        if (newAmount !== amount) {
            self.validateSetAndSave("Amount", newAmount);
        }
    });

    Tyler Rainey
**/
export const getSum = function(filter, obj, sumColumn, cb) {
    let sum = 0;
    filter = Object.prototype.toString.call(filter) === "[object Object]" ? filter : { "Id": filter };
    

    var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
        rootSchemaName: obj
    });
    esq.addColumn("Id");
    esq.addColumn(sumColumn);
    

    Object.keys(filter).forEach(function(key) {
        var customFilter = esq.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, key, filter[key]);
        esq.filters.add(`${key}:${filter[key]}`, customFilter);
    });

    esq.getEntityCollection(function (result) {
        if (result.success) {
            
            result.collection.each(function (item) {
                sum += item.values[sumColumn];
            });
            
            cb(sum);
            
        }
    }, this);
}

/**
    Purpose: Get value(s) easily when you only have the Id.

    Usage:

    this.getValue(accountId, "Account", ["Name", "Web", "Phone"], function(obj) {
        const name = obj.Name;		
        const web = obj.Web;
        const phone = obj.Phone;   	
    });

    Tyler Rainey
**/
export const getValue = function(id, obj, value, cb) {
    value = Array.isArray(value) ? value : [value];
    
    
    let returnObj = {};
    
    var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
        rootSchemaName: obj
    });
    esq.addColumn("Id");
    
    value.forEach(function(column) {
        esq.addColumn(column);
    });
    
    var idFilter = esq.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, "Id", id);
    
    esq.filters.add("idFilter", idFilter);

    esq.getEntityCollection(function (result) {
        if (result.success) {
            
            value.forEach(function(column) {
                returnObj[column] = result.collection.collection.items[0].values[column];
            });            
            cb(returnObj);
        }
    }, this);
}


/**
    Purpose: To reduce the amount of saves when setting a value from a repetitive trigger.

    Tyler Rainey
**/
export const validateSetAndSave = function(dbName, newValue) {
    const oldValue = this.get(dbName);
    
    if (oldValue !== newValue) {
        
        this.set(dbName, newValue);
        this.save();
    }
}
