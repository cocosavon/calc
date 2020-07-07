import MyData from './my_data.json'
new Vue({
    el: "#vue_component",
    data: {
        options_oil: ['olive', 'canora',],
        selection: null,
    },
    created: function(){
        console.log('in created')
    },
    mounted: function(){
        console.log('in mounted')
    },
})
