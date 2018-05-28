import _ from 'lodash';
import './styles/style.css';
//npm run start

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
        console.log(data.totals[type]);
    };

    var newItemId = function(type){
        var lastItemIndex;
        if(data.allItems[type].length > 0){
            lastItemIndex = data.allItems[type].length-1;
            return data.allItems[type][lastItemIndex].id+1;
        }
        else {
            return 0;
        }
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
        calculateTotal(itemTypes.EXP);
        calculateTotal(itemTypes.INC);

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

    function clearFields(){
        var fields = document.querySelectorAll(DOMStrings.inputDescription+','+DOMStrings.inputValue);
        var fieldsArray = Array.prototype.slice.call(fields);
        fieldsArray.forEach(function(current, index, array){
            current.value = "";
        });
        fieldsArray[0].focus();
    }

    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    function addListItem(obj, type){
        var element;
        var html;
        var newHtml;

        if(type === itemTypes.INC){
            element = DOMStrings.incomeContainer;
            html = '<div class="item clearfix" id="inc-%id%">'+
                        '<div class="item__description">'+
                            '%description%'+
                        '</div>'+
                        '<div class="right clearfix">'+
                            '<div class="item__value">'+
                                '%value%'+
                            '</div>'+
                            '<div class="item__delete">'+
                                '<button class="item__delete--btn">'+
                                    '<i class="ion-ios-close-outline"></i>'+
                                '</button>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
        }
        else if(type === itemTypes.EXP){
            element = DOMStrings.expensesContainer;
            html =  '<div class="item clearfix" id="exp-%id%">'+
                        '<div class="item__description">'+
                            '%description%'+
                        '</div>'+
                        '<div class="right clearfix">'+
                            '<div class="item__value">'+
                                '%value%'+
                            '</div>'+
                            '<div class="item__percentage">'+
                                '00%'+
                            '</div>'+
                            '<div class="item__delete">'+
                                '<button class="item__delete--btn">'+
                                    '<i class="ion-ios-close-outline"></i>'+
                                '</button>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
        }
        // Replace the placeholder text with some actual data
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
       
        // Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    }

    function deleteListItem(selectorId){
        var el = document.getElementById(selectorId);
        el.parentNode.removeChild(el);
    }
    //formats a number using fixed-point notation
    //input 23510, output 23,510
    function formatNumber(num, type){
        var numSplit;
        var int;
        var dec;
        var sign;
        var formatResult;

        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        dec = numSplit[1];

        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        sign = type === itemTypes.EXP ? '-' : '+';
        formatResult = sign+' ' + int + '.' + dec;
        return formatResult;
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

    function displayPercentages(percentages){
        var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
        nodeListForEach(fields, function(current, index){      
            if (percentages[index] > 0) {
                current.textContent = percentages[index] + '%';
            } else {
                current.textContent = '---';
            }
        });
    }

    return {
        getDOMStrings: getDOMStrings,
        getInput: getInput,
        clearFields: clearFields,
        addListItem: addListItem,
        displayMonth: displayMonth,
        displayBudget: displayBudget,
        displayPercentages: displayPercentages
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
    document.querySelector(DOM.container).addEventListener('click', ctlDeleteItem);    
    document.querySelector(DOM.inputType).addEventListener('change', _UICtl.changedType);   
    
    function updateBudget(){
        _IndexCtl.calculateBudget();
        var budget = _IndexCtl.getBudget();
        _UICtl.displayBudget(budget);
    }

    function updatePercentages(){
        _IndexCtl.calculatePercentages();
        var percentages = _IndexCtl.getPercentages();
        _UICtl.displayPercentages(percentages);
    }

    function ctlAddItem() {
        var newItem;
        var input = _UICtl.getInput();
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            newItem = _IndexCtl.addItem(input.type, input.description, input.value);
            _UICtl.addListItem(newItem, input.type);
            _UICtl.clearFields();
            updateBudget();
            updatePercentages();
        }
    }

    function ctlDeleteItem(){
        var itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        var splitId;
        var type;
        var Id;

        if (itemId) {
            
            //inc-1
            splitId = itemId.split('-');
            type = splitId[0];
            Id = parseInt(splitId[1]);
            _IndexCtl.deleteItem(type, Id);
            _UICtl.deleteListItem(itemId);
            updateBudget();
            updatePercentages();
        }

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