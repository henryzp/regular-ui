var BaseComponent = require('../src/js/core/base.js');
var template = require('./app.html');
var SelectEx = require('../src/js/core/selectEx.js');
var Modal = require('../src/js/core/modal.js');

var App = BaseComponent.extend({
    name: 'app',
    template: template,
    data: {
        selectExOptions: [
            {id: 1, name: '111'},
            {id: 2, name: '222'},
            {id: 3, name: '333'}
        ],
        selectExValue: 2
    },
    config: function() {

    },
    init: function() {
        //Modal.confirm('模拟一个Alert');
    }
});

var app = new App().$inject('#app');