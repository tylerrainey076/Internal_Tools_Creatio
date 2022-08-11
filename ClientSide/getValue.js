/**
*
* Purpose: Get value(s) easily when you only have the Id.
* Tyler Rainey
**/
getValue: function(id, obj, value, cb) {
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



// Example 1

this.getValue(accountId, "Account", "Name", function(obj) {
    const name = obj.Name;			
});

// Example 2
this.getValue(accountId, "Account", ["Name", "Web", "Phone"], function(obj) {
    const name = obj.Name;		
    const web = obj.Web;
    const phone = obj.Phone;   	
});