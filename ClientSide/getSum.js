/**
*
* Purpose: To sum the field of a desired lookup.
* Tyler Rainey
**/
getSum: function(filter, obj, sumColumn, cb) {
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


// Example
this.getSum({ "Opportunity": opportunityId }, "OpportunityProductInterest", "Amount", function(amount) {
    const discountDollar = self.get("UsrDiscountDollar");
    
    const newAmount = amount - discountDollar;

    if (newAmount !== amount) {
        self.validateSetAndSave("Amount", newAmount);
    }
});