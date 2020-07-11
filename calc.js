new Vue({
    el: "#vue_component",
    data: {
        oils_array: [],
        ratio_koh_to_naoh: 120.0 / 168,
        unit_g: 'g',
        unit_cc: 'cc',
        oil_specific_weiht: 0.9,
        percentage_of_water: 34, // [%] 30 to 40,
        purity_of_naoh: 98, // [%] 95 to 100
        saponification_rate: 92, // [%] 85 to 95
        configurationShown: null,
    },
    created: function(){
        console.log('in created')
    },
    watch: {
        configurationShown: function(){
            let el_config = $('#configuration')
            if (this.configurationShown){
                el_config.slideDown()
            } else {
                el_config.slideUp()
            }
        }
    },
    computed: {
        oil_amount_g: function() {
            let oil_amount_g = 0
            for (let i=0; i<this.oils_array.length; i++){
                if (this.oils_array[i].selected){
                    let quantity = this.oils_array[i].quantity
                    if (this.oils_array[i].unit == this.unit_cc){
                        quantity = quantity * oil_specific_weight
                    }
                    oil_amount_g = oil_amount_g + parseFloat(quantity)
                }
            }
            return oil_amount_g
        },
        naoh_amount_g: function() {
            let naoh_amount_g = 0
            for (let i=0; i<this.oils_array.length; i++){
                if (this.oils_array[i].selected){
                    let quantity_g = this.oils_array[i].quantity
                    if (this.oils_array[i].unit == this.unit_cc){
                        quantity_g = quantity_g * oil_specific_weight
                    }
                    naoh_amount_g = naoh_amount_g + parseFloat(quantity_g) * this.oils_array[i].saponification_number / 1000.0 * this.ratio_koh_to_naoh
                }
            }
            return naoh_amount_g / (this.purity_of_naoh / 100.0) * (this.saponification_rate / 100.0)
        },
        water_amount_g: function() {
            let water_amount_g = this.oil_amount_g * this.percentage_of_water / 100.0
            return water_amount_g
        }
    },
    methods: {
        configurationClicked: function() {
            this.configurationShown = !this.configurationShown
        },
        oilClicked: function(e, oil){
            console.log('oilClicked')
            console.log(oil)
            //oil.selected = !oil.selected
            Vue.set(oil, 'selected', !oil.selected)

        },
        containsObject: function(obj, arr) {
            var i;
            for (i = 0; i < arr.length; i++) {
                if (arr[i].name === obj.name) {
                    return true;
                }
            }
            return false;
        },
    },
    created: function(){
        console.log('in mounted')
        let vm = this

        let docRef = db.collection("oils").orderBy("category")
        docRef.get().then(function(res) {
            res.forEach(doc => {
                let oil = doc.data()
                oil.selected = false
                oil.quantity = 0
                oil.id = doc.id
                oil.unit = vm.unit_g
                vm.oils_array.push(oil)

                console.log(oil)
            });
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    },
    mounted: function(){
        this.configurationShown = false
    }
})
