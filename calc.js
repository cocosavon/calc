new Vue({
    el: "#vue_component",
    data: {
        oils_array: [],
    },
    created: function(){
        console.log('in created')
    },
    computed: {
        //useThisButtonDisabledText: function(){
        //    if(this.selected_oil && this.selected_oil.name){
        //        return false
        //    } else {
        //        return true
        //    }
        //}
    },
    methods: {
        oilClicked: function(e, oil){
            console.log('oilClicked')
            console.log(oil)
            //oil.selected = !oil.selected
            Vue.set(oil, 'selected', !oil.selected)

        },
        //useThisOilClicked: function(){
        //    if (!this.containsObject(this.selected_oil, this.oils_array)){
        //        let oil_copied = JSON.parse(JSON.stringify(this.selected_oil))
        //        oil_copied.quantity = 0
        //        this.oils_array.push(oil_copied)
        //    } else {
        //        console.log('this oil is already added')
        //    }
        //},
        containsObject: function(obj, arr) {
            var i;
            for (i = 0; i < arr.length; i++) {
                if (arr[i].name === obj.name) {
                    return true;
                }
            }
            return false;
        },
        //deleteThisOilClicked: function(e, item){
        //    console.log('delete: ')
        //    console.log(item)
        //    this.oils_array.splice(this.oils_array.indexOf(item), 1 );
        //},
    },
    mounted: function(){
        console.log('in mounted')
        let vm = this

        let docRef = db.collection("oils")
        console.log(docRef)
        docRef.get().then(function(res) {
            res.forEach(doc => {
                let oil = doc.data()
                oil.selected = false
                oil.quantity = 0
                oil.id = doc.id
                vm.oils_array.push(oil)

                console.log(oil)
            });
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    },
})
