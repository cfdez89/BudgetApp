import _ from 'lodash';
import './styles/style.css';


var indexCtl = (function() {

})();

var uiCtl = (function() {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    function getDOMStrings() {
        return DOMStrings;
    }

    return {
        getDOMStrings: getDOMStrings
    };

})();

var appCtl = (function(_indexCtl, _uiCtl) {

    var DOM = _uiCtl.getDOMStrings();

    document.querySelector(DOM.inputBtn).onclick = ctlAddItem;
    document.onkeypress = function(event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctlAddItem();
        }
    };

    function ctlAddItem() {
        console.log('hola');
    }
    function init() {
    }

    return {
        init: init
    };

})(indexCtl, uiCtl);
