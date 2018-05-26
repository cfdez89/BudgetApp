import _ from 'lodash';
import './styles/style.css';
//constants
var itemTypes = {
    INC: 'inc',
    EXP: 'exp'
};

//revealing module pattern
var IndexCtl = (function() {
    //constants
    

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

var UICtl = (function() {

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

    function getInput(){
        return {
            type: document.querySelector(DOMStrings.inputType).value,
            description: document.querySelector(DOMStrings.inputDescription).value,
            value: document.querySelector(DOMStrings.inputValue).value
        };
    }
    //formats a number using fixed-point notation
    //input 23510, output 23,510
    function formatNumber(num, type){
        num = Math.abs(num);
        num = num.toFixed(2);
        var numSplit = num.split('.');
        var int = numSplit[0];
        var dec = numSplit[1];

        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
    }

    function changedType(){

    }

    function displayMonth(){
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        var now = new Date();
        var month = now.getMonth();
        var year = now.getFullYear();
        document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
    }

    function displayBudget(data){
        var type;
        data.budget > 0 ? type = itemTypes.INC :type = itemTypes.EXP;
                   
        document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(data.budget, type);
        document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(data.totalInc, itemTypes.INC);
        document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(data.totalExp, itemTypes.EXP);

        if(data.percentage > 0){
            document.querySelector(DOMStrings.percentageLabel).textContent = data.percentage + '%';
        }
        else{
            document.querySelector(DOMStrings.percentageLabel).textContent = '---';
        }
    }

    return {
        getDOMStrings: getDOMStrings,
        getInput: getInput,
        displayMonth: displayMonth,
        displayBudget: displayBudget
    };

})();

var AppCtl = (function(_IndexCtl, _UICtl) {

    var DOM = _UICtl.getDOMStrings();

    document.querySelector(DOM.inputBtn).onclick = ctlAddItem;
    document.onkeypress = function(event) {
        if(event.keyCode === 13 || event.which === 13) {
            ctlAddItem();
        }
    };
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);    
    document.querySelector(DOM.inputType).addEventListener('change', _UICtl.changedType);   
    function ctlAddItem() {
        console.log('hola');
        //if(){

        //}
    }

    function ctrlDeleteItem(){

    }
    function init() {
        var defaultValues = {
            budget: 0,
            totalInc: 0,
            totalExp: 0,
            percentage: -1
        };
        _UICtl.displayMonth();
        _UICtl.displayBudget(defaultValues);
    }

    return {
        init: init
    };

})(IndexCtl, UICtl);

AppCtl.init();