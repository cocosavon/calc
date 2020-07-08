new Vue({
    el: "#vue_component",
    data: {
        options_oil: [],
        selection: null,
    },
    created: function(){
        console.log('in created')
    },
    methods: {
        saveToFirebase: function(name) {
            console.log('in saveToFirebase')
            var obj = {
                'name': name
            };
        }
    },
    mounted: function(){
        console.log('in mounted')
        let vm = this

        //axios.get("https://cocosavon.github.io/calc/my_data.json")
        //    .then(response => {
        //        vm.options_oil = response.oils
        //    })

        let docRef = db.collection("oils")
        console.log(docRef)
        docRef.get().then(function(res) {
            res.forEach(doc => {
                console.log(doc.id, " => ", doc.data());
                vm.options_oil.push(doc.data())
            });
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    },
})
