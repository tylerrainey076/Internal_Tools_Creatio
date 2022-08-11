/**
*
* Purpose: To grab the ID of a lookup and have access to it in a callback making it synchronous.
* Tyler Rainey
**/
getLookupValue: function(lookup, text, cb) {
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
