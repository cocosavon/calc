new Vue({
    el: "#vue_component",
    data: {
        options_oil: [],
        selection: null,
    },
    created: function(){
        console.log('in created')
    },
    mounted: function(){
        console.log('in mounted')
        
        let vm = this

        axios.get("https://cocosavon.github.io/calc/my_data.json")
            .then(response => {
                console.log(response)

                vm.options_oil = response.oils
            })
    },
})
