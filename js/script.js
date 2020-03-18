// total cost value
let totalCost = 0;

// activities counter
let activityCount = 0;

//Error messages to show when user fills out parts incorrectly
let errorMessageName = $('<label></label>').text("");
errorMessageName.css('color','red');

let errorMessageMail = $('<label></label>').text("");
errorMessageMail.css('color','red');

let errorMessageCreditCardNum = $('<label></label>').text("");
errorMessageCreditCardNum.css('color','red');

let errorMessageCreditCardZip = $('<label></label>').text("");
errorMessageCreditCardZip.css('color','red');

let errorMessageCreditCardCvv = $('<label></label>').text("");
errorMessageCreditCardCvv.css('color','red');

const errorMessageActivity = $('<label></label>').text("");
errorMessageActivity.css('color','red');
$('.activities').append(errorMessageActivity);

// creating a headline for the total display
const totalDisplay = $('<label></label>').text("");
$('.activities').append(totalDisplay);

// perform the following actions when the page loads
$(document).ready(function() {
    
  

    // hide 'other title' by default
    $('#other-title').hide();

    // hide the "Select Theme" message once user clicks design drop-down list
    $('#design').find('option:contains("Select Theme")').hide();

    // hide colors from color drop-down list
    $('#color option').hide();

    // hide color label and drop-down list
    $('div #colors-js-puns').hide();

    // show a message to the user in the color drop-down list
    const optionMessage = $('<option></option>').text("Please select a T-shirt theme");
    $('#color').append(optionMessage);
    $('#color').val(optionMessage.val());

    // hide the "Select Payment Method" message once user clicks payment drop-down list
    $('#payment option[value="select_method"]').hide();

    // make credit card the default payment option
    $('#payment').val("credit card");

    // hide the text related to paypal and bitcoin payment options
    $('#credit-card').next().hide();
    $('#credit-card').next().next().hide();
});




// # Setting focus on the first text field-----------------------------------------
// Done in index.html, since it's not JS and is desired behavior regardless of JS enablement




// # ”Job Role” section of the form-----------------------------------------------------
// A text field that will be revealed when the "Other" option is selected from the "Job Role" drop down menu.

// Give the field an id of “other-title,” and add the placeholder text of "Your Job Role" to the field.
// Done in HTML

$('#title').change(function() {
    ($('#title').val() === 'other') ? $('#other-title').show() : $('#other-title').hide(); 
});







//T-Shirt Section---------------------------------------- 
// Respond to changes when a different design has been picked
$('#design').change(function() {

    // showing color label and drop-down list.
    $('div #colors-js-puns').show();
    
    // filtering colors of the selected design.
    if ($('#design').val() === 'js puns')
        showColors("JS Puns");
    else if ($('#design').val() === 'heart js')
        showColors("I ♥ JS"); 
});

// This function recieves a shirt category and show colors associated with it in the colors drop-down list
function showColors(shirtCategory)
{
    // select the color options
    $options = $('#color option');

    // if the option value(color) equals one of the parameters, show it in the drop-down list. 
    $options.each( function(index, element) {
        if (element.text.includes(shirtCategory))
            $options.eq(index).show();
        else
            $options.eq(index).hide();    
    });

    // make first color the default choice from color drop-down list.
    $options.each( function(index, element) {
        if (element.text.includes(shirtCategory))  // color belongs to shirt category
        {
            $('#color').val(element.value);
            return false; // break out of the loop once a color has been found.
        }
    });  
}






//Register for Activities--------------------------------------------
// Respond to changes in activity selection when a box is checked/unchecked
$('input[type="checkbox"]').change(function() {

   
    const description = $(this).parent().text();

    // Declaring variables to store information from activity description
    const dollarIndex = description.indexOf('$');
    const dashIndex = description.indexOf('—');
    const commaIndex = description.indexOf(',');
    const time = description.slice(dashIndex + 2, commaIndex);
    const spaceIndex = time.indexOf(" "); 
    const day = time.slice(0,spaceIndex);
    const hours = time.slice(spaceIndex + 1);

    // The cost of the chosen activity
    const cost = parseInt(description.slice(dollarIndex + 1));

    // The activity that has been clicked 
    const chosenActivity = this;

    // Update activity count and total cost of the checked boxes
    if (chosenActivity.checked)
    {
        totalCost += cost;
        activityCount++;
    }
    else
    {
        totalCost -= cost;
        activityCount--;
    }
    
    //Update  total cost    
    if (totalCost > 0)    
        totalDisplay.text("Total: $" + totalCost);
    else     
        totalDisplay.text("");



    // Disable conflictiong activities
    $('input[type="checkbox"]').each(function() {

        // iterated actitivity description
        const otherDescription = $(this).parent().text();

        // boolean variables to decide whether a checkbox should be turned on/off.
        const sameActivity = (description !== otherDescription);
        const includesDay = (otherDescription).includes(day);
        const includesHours =  (otherDescription).includes(hours);

        // conditional to regulate conflicting activities
        if (sameActivity && includesDay && includesHours)
        {
            // if the chosen activity has been checked, grey out conflicting activities.
            if (chosenActivity.checked) {
                $(this).attr("disabled", true);
                $(this).parent()[0].style.color = "grey";               
            }
            else {
                $(this).attr("disabled", false);
                $(this).parent()[0].style.color = "black";
            }
        }  
    });

    // make sure at least one activity has been checked (requires a seperate event handler)
    $('input[type="checkbox"]').focusout();    
});

// Respond to changes in the quantity of checked activities
$('input[type="checkbox"]').focusout(function() {
    
    if (isValidActivityChecked())  // at least one activity has been checked
    {
        errorMessageActivity.text(""); 
        this.style.border = ""; 
    }
    else 
    {
        errorMessageActivity.text("Please choose at least one activity.");
        this.style.border = "solid 3px red";
    }
});






//Payment Info--------------------------------------------------------------
// Respond to changes in payment option
$('#payment').change(function() {

    // Declaring variables to store payment options
    const $creditCard = $('#credit-card');
    const $payPal = $creditCard.next();
    const $bitcoin = $payPal.next();
    
    // Hide all the descriptive text content that is related to payment options
    $creditCard.hide();
    $payPal.hide();
    $bitcoin.hide();

    // Show descriptive text content with respect to the user's choice of payment
    if ($('#payment').val() === "credit card")
        $creditCard.show();        
    else if ($('#payment').val() === "paypal")
        $payPal.show();        
    else 
        $bitcoin.show();
});







//Form validation and  messages----------------------------------------------------------------


// Dynamically respond to changes in the name text field.
$('input#name').on('keyup focusout' , function() {
    
    // creating an error message
    const value = $('input#name').val();
    errorMessageName.insertAfter($('input#name')); 


    //check the name for validity
    if (isValidName(value)) 
    {
        errorMessageName.text("");
        this.style.border = "";
    }
    else  
    {
        errorMessageName.text("Please fill out a name.");
        this.style.border = "solid 3px red";
    }
});




// Dynamically respond to changes in the email text field.
$('input#mail').on('keyup focusout' , function() {

    // creating an error message
    const value = $('input#mail').val();
    errorMessageMail.insertAfter($('input#mail'));


    //checking thw email for vaslidity 
    if (isValidEmail(value)) 
    {
        errorMessageMail.text("");
        this.style.border = "";
    }
    else
    {
        if (value === "")
            errorMessageMail.text("Please fill out an Email.");
        else   
            errorMessageMail.text("'"  + value + "' is not a valid Email address.");
        this.style.border = "solid 3px red";
    }
});



// Dynamically respond to changes in the credit card number text field.
$('input#cc-num').on('keyup focusout' , function() {

    // creating an error message
    const value = $('input#cc-num').val();
    errorMessageCreditCardNum.insertAfter($('input#cc-num'));

    //checking the credit card number for validity
    if (isValidCreditCardNum(value))  
    {
        errorMessageCreditCardNum.text("");
        this.style.border = "";
    }
    else 
    {
        if (value === "")
            errorMessageCreditCardNum.text("Please fill out a credit card number.");
        else
            errorMessageCreditCardNum.text("Please fill out a number that is between 13 and 16 digits long.");
        this.style.border = "solid 3px red";
    }
});



// Dynamically respond to changes in the zip code text field.
$('input#zip').on('keyup focusout' , function() {

    // creating an error message
    const value = $('input#zip').val();
    errorMessageCreditCardZip.insertAfter($('input#zip'));


    //checking zip code for validity
    if (isValidZipCode(value)) 
    {
        errorMessageCreditCardZip.text("");
        this.style.border = "";
    }
    else   
    {
        if (value === "")
            errorMessageCreditCardZip.text("Please fill out a zip code.");
        else
            errorMessageCreditCardZip.text("Zip Code must be a 5-digit number.");
        this.style.border = "solid 3px red";
    }
});

// Dynamically respond to changes in the CVV text field.
$('input#cvv').on('keyup focusout' , function() {

    // creating an error message
    const value = $('input#cvv').val();
    errorMessageCreditCardCvv.insertAfter($('input#cvv'));


    //checking the CVV code for validity
    if (isValidCvv(value))  
    {
        errorMessageCreditCardCvv.text("");
        this.style.border = "";
    }
    else  
    {
        if (value === "")
            errorMessageCreditCardCvv.text("Please fill out a CVV value.");
        else
            errorMessageCreditCardCvv.text("CVV value must be a 3-digit number.");
        this.style.border = "solid 3px red";
    }
});



// Respond to clicks on the "register" button
$('form').submit(function(event) {

    // show the error messages if such exist.
    $('input#mail').focusout();
    $('input#name').focusout();
    $('input[type="checkbox"]').focusout();
    $('input#cc-num').focusout();
    $('input#zip').focusout();
    $('input#cvv').focusout();

    // if the form has been filled incorrectly, prevent it from being sent
    if (!isValidForm())
        event.preventDefault();    
});






//function that validates name
function isValidName(name)
{
    return !( /^[\s]*$/.test(name) );
}

//function that validates email
function isValidEmail(email)
{
    return /^[^@]+@[^@.]+\.[a-z]+$/i.test(email);
}

//function that validates activities quantity
function isValidActivityChecked()
{
    return (activityCount > 0);
}

//function that validates credit card number 
function isValidCreditCardNum(number)
{
    return /^\d{13,16}$/.test(number);
}

//function that validates zip code
function isValidZipCode(number)
{
    return /^\d{5}$/.test(number);
} 	

//function that validates CVV value
function isValidCvv(number)
{
    return /^\d{3}$/.test(number);
} 








//Form Validation----------------------------------------------------------------



//function that validates the all form
function isValidForm()
{
    //variables to store name and mail values
    const nameValue = $('input#name').val();
    const mailValue = $('input#mail').val();

    //boolean variables
    const invalidName = !isValidName(nameValue);
    const invalidMail = !isValidEmail(mailValue);

    // if name, email address or activity count is invalid, the form is invalid. 
    if (invalidName || invalidMail || activityCount === 0)
        return false;

    // if payement option is not credit card, skip the following    
    if ($('#payment').val() === "credit card")
    {
        //variables to store credit card details
        const ccNumValue = $('input#cc-num').val();
        const zipCodevalue = $('input#zip').val();
        const cvvValue = $('input#cvv').val();

        //boolean variables
        const invalidCardNum = !isValidCreditCardNum(ccNumValue);
        const invalidZipCode = !isValidZipCode(zipCodevalue);
        const invalidCvv = !isValidCvv(cvvValue);

        //if either one of the credit card details is invalid, the form is invalid.
        if (invalidCardNum || invalidZipCode || invalidCvv)
            return false;
    }

    return true;
}
