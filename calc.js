new Vue({
    el: "#vue_component",
    data: {
        loading: false,
        oils_array: [],
        ratio_koh_to_naoh: 120.0 / 168,
        unit_g: 'g',
        unit_cc: 'cc',
        oil_specific_weiht: 0.9,
        percentage_of_water: 34, // [%] 30 to 40,
        purity_of_naoh: 98, // [%] 95 to 100
        saponification_rate: 92, // [%] 85 to 95

        // Other configurations
        configurationShown: null,
        selected_percentage_of_water: false,
        selected_purity_of_naoh: false,
        selected_saponification_rate: false,
        percentage_of_water_range: [30, 40],
        purity_of_naoh_range: [95, 100],
        saponification_rate_range: [85, 95],
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
        configPlus1: function(e, config_name){
            if (config_name === 'percentage_of_water'){
                this.percentage_of_water += 1
                if (this.percentage_of_water > Math.max(...this.percentage_of_water_range)){
                    this.percentage_of_water = Math.max(...this.percentage_of_water_range)
                }
            } else if (config_name === 'purity_of_naoh'){
                this.purity_of_naoh += 1
                if (this.purity_of_naoh > Math.max(...this.purity_of_naoh_range)){
                    this.purity_of_naoh= Math.max(...this.purity_of_naoh_range)
                }
            } else if (config_name === 'saponification_rate'){
                this.saponification_rate += 1
                if (this.saponification_rate > Math.max(...this.saponification_rate_range)){
                    this.saponification_rate= Math.max(...this.saponification_rate_range)
                }
            }
        },
        configMinus1: function(e, config_name){
            if (config_name === 'percentage_of_water'){
                this.percentage_of_water -= 1
                if (this.percentage_of_water < Math.min(...this.percentage_of_water_range)){
                    this.percentage_of_water = Math.min(...this.percentage_of_water_range)
                }
            } else if (config_name === 'purity_of_naoh'){
                this.purity_of_naoh -= 1
                if (this.purity_of_naoh < Math.min(...this.purity_of_naoh_range)){
                    this.purity_of_naoh= Math.min(...this.purity_of_naoh_range)
                }
            } else if (config_name === 'saponification_rate'){
                this.saponification_rate -= 1
                if (this.saponification_rate < Math.min(...this.saponification_rate_range)){
                    this.saponification_rate= Math.min(...this.saponification_rate_range)
                }
            }
        },
        plus100: function(e, oil){
            oil.quantity = oil.quantity + 100
        },
        plus10: function(e, oil){
            oil.quantity = oil.quantity + 10
        },
        plus1: function(e, oil){
            oil.quantity = oil.quantity + 1
        },
        minus100: function(e, oil){
            oil.quantity = oil.quantity - 100
            if (oil.quantity < 0){
                oil.quantity = 0
            }
        },
        minus10: function(e, oil){
            oil.quantity = oil.quantity - 10
            if (oil.quantity < 0){
                oil.quantity = 0
            }
        },
        minus1: function(e, oil){
            oil.quantity = oil.quantity - 1
            if (oil.quantity < 0){
                oil.quantity = 0
            }
        },
        confClicked: function(para) {
            if(para === 'percentage_of_water'){
                this.selected_percentage_of_water = !this.selected_percentage_of_water
            } else if (para === 'purity_of_naoh'){
                this.selected_purity_of_naoh = !this.selected_purity_of_naoh
            } else if (para === 'saponification_rate'){
                this.selected_saponification_rate = !this.selected_saponification_rate
            }
        },
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
        let vm = this

        vm.loading = true
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
            vm.loading = false
        }).catch(function(error) {
            console.log("Error getting document:", error);
            vm.loading = false
        });
    },
    mounted: function(){
        this.configurationShown = false
    }
})
