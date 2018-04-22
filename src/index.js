import _ from 'lodash';
import './styles/style.css';

//revealing module pattern
var indexCtl = (function() {
    //constants
    var itemTypes = {
        INC: 'inc',
        EXP: 'exp'
    };

    //function constructor's
    var Expense =  function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.precentage = -1;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //data structure
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };


    var calculateTotal = function(){

    };

    var createItemId = function(type){
        return data.allItems[type][data.allItems[type].length-1].id+1;
    };

    function addItem(type, description , value){ 
        var newItem = null;
        var newId;

        if(type === itemTypes.EXP){
            newId = createItemId(type);
            newItem = new Expense(newId, description, value);
        }
        else if(type === itemTypes.INC){
            newId = createItemId(type);
            newItem = new Income(newId, description, value);
        }

        data.allItems[type].push(newItem);
        return newItem;
    }

    function deleteItem(type, id){
        //create new array with the result of calling a provided function 
        //on every element in the calling array
        var ids = data.allItems[type].map(function(current){//revisar
            return current.id;
        });

        var index = ids.indexOf(id);
        if(index !== -1){
            data.allItems[type].splice(index, 1);
        }
    }

    function calculateBudget(){
    }

    function calculatePercentages(){

    }

    function getPercentages(){

    }

    function getBudget(){
        return {
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage 
        };
    }

    return {
        addItem: addItem,
        deleteItem: deleteItem,
        calculateBudget: calculateBudget,
        calculatePercentages: calculatePercentages,
        getPercentages: getPercentages,
        getBudget: getBudget
    }
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
        //if(){

        //}
    }
    function init() {
    }

    return {
        init: init
    };

})(indexCtl, uiCtl);
