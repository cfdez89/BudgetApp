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
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value/totalIncome)*100);
        }
        else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
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


    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(current){
            sum += current.value;
        });
        data.totals[type] = sum;
    };

    var newItemId = function(type){
        var lastItemIndex = data.allItems[type].length-1;
        return data.allItems[type][lastItemIndex].id+1;
    };

    function addItem(type, description , value){ 
        var newItem = null;
        var newId = -1;

        if(type === itemTypes.EXP){
            newId = newItemId(type);
            newItem = new Expense(newId, description, value);
        }
        else if(type === itemTypes.INC){
            newId = newItemId(type);
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
        calculateTotal(itemTypes.exp);
        calculateTotal(itemTypes.inc);

        data.budget = data.totals.inc - data.totals.exp;
        if(data.totals.inc > 0){
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        }
        else {
            data.percentage = -1;
        }
    }

    function calculatePercentages(){
        data.allItems.exp.forEach(function(exp){
            exp.calcPercentage(data.totals.inc);
        });
    }

    function getPercentages(){
        var allPercentage = data.allItems.exp.map(function(exp){
            return exp.getPercentage();
        });
        return allPercentage;
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
