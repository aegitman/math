

function generateTable(evt) {

    let obj = getRequest();

    let $t = $('#table');

    $t.empty();

    let bag = fillEquations(obj);


    for(let i of bag) {
        $t.append($('<div>').append(generateTd(i)));
    }    
}

function getRequest() {
    let numbers = [];

    $('div.checkboxDiv input[type=checkbox]').each(function() {
       if ($(this).is(":checked")) {
            numbers.push($(this).attr('data-value'));
       }
    });

     return {'n': numbers, 'a': $('#operationSel').find('option:selected').val(), 'q': $('#quantity').val()};
}


function generateTd(bag) {
    let $eq = $("<span>").addClass('eqSpan').text(bag.a + " " + bag.op + " "+ bag.b + " = ");

    return $("<div>").addClass('equationDiv').append($eq);
}

function fillEquations(obj) {
    let objCount = Number(obj.n.length);
    // in case we do not want repetitions
    let thMax = objCount * 12;

    let bag = [];
    let max = Number(obj.q) < 10 ? 10 : Number(obj.q);
    max = max > 40 ? 40 : max;
    

    for(let m=0; m < Math.floor(max/objCount); m++) {
        // add at least one equation with every number     
        for(let i of obj.n) {
            bag.push({a:i, b:randomTo12(), op:obj.a[0]});
        }
    }

    for(let m=0; m < Math.floor(max%objCount); m++) {
        // add the rest of the equations with every number         
        bag.push({a:obj.n[Math.floor(Math.random() * obj.n.length)], b:randomTo12(), op:obj.a[0]});        
    }

    return bag;
}


function validateUniqueness(bog){

    let unique = []

    for(let b of bog) {
        for(let i in unique) {

        }
    }


}

/**
 * Generates a random integer between 1 and 12 (inclusive).
 *
 * @returns {number} A random integer between 1 and 12.
 */
function randomTo12(){
    return Math.floor(Math.random() * 12 + 1);
}