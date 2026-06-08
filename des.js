 let currentStep = 1;

// oblige the validate step to be done if a user is directly clicking on button without entering fields 
function goToStep(step) {
  if (step > currentStep && !validateStep(currentStep)) return;

  // Hide the current section using Bootstrap's d-none
  // to know in which section we are ex:section 1, then change its state to none yo disappear
  const currentSection = document.getElementById('section-' + currentStep);
  currentSection.classList.remove('active');
  currentSection.classList.add('d-none');

  // change current step to the next step
  currentStep = step;

  // go to the next section by removing d-none and making it visible bs n7ot active
  // Reveal the next section by removing d-none
  const nextSection = document.getElementById('section-' + currentStep);
  nextSection.classList.add('active');
  nextSection.classList.remove('d-none');

  updateProgress();
  //btroo7 to the top of page to avoid scrolling
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

//checks if currentstep 1 y3ne active eza la2 y3ne display none to remoe section

function updateProgress() {
  for (let i = 1; i <= 3; i++) {
    const ind = document.getElementById('step' + i +'-ind');
    if (ind) {
      ind.classList.remove('active', 'done');
      if (i === currentStep) ind.classList.add('active');
      else if (i < currentStep) ind.classList.add('done');
    }
  }

  //highlight stepnumber above the form to show meen l active
  for (let i = 1; i <= 2; i++) {
    const line = document.getElementById('line' + i);
    if (line) {
      // Changed to 'filled' to match our responsive CSS step connector tracking line style rule
      line.classList.toggle('filled', i < currentStep); 
    }
  }
}



function formatCardNumber(input) {
  let val = input.value.replace(/\D/g, '').substring(0, 16); //remove other characters
  input.value = val.replace(/(.{4})/g, '$1 ').trim(); //mn7ot space between each 4 to get the exact form of card no
}


function formatExpiry(input) {
  let val = input.value.replace(/\D/g, '').substring(0, 4);
  if (val.length >= 2) val = val.substring(0, 2) + ' / ' + val.substring(2);
  input.value = val;
}

//assign the values into variables 

//fena nsta3mln bl mirroring seciton to display them on the card 
function updatePreview() {
  const num = document.getElementById('cardNumber').value || '';
  const name = document.getElementById('cardName').value || '';
  const exp = document.getElementById('cardExpiry').value || '';
  const padded = num.padEnd(16, '•').replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
 
}

//validate all the fields 
function validateStep(step) {
  let ok = true;
  if (step === 1) {
    ok = validate('firstName', v => v.length >= 2, 'First name is required') && ok;
    ok = validate('lastName', v => v.length >= 2, 'Last name is required') && ok;
    ok = validate('email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Enter a valid email address') && ok;
    ok = validate('phone', v => v.replace(/\D/g, '').length >= 7, 'Enter a valid phone number') && ok;
  }
  if (step === 2) {
    ok = validate('billingStreet', v => v.length >= 5, 'Street address is required') && ok;
    ok = validate('billingCity', v => v.length >= 2, 'City is required') && ok;
    ok = validate('billingState', v => v.length >= 2, 'State / Region is required') && ok;
    ok = validate('billingZip', v => v.length >= 4, 'Enter a valid postal code') && ok;
    ok = validate('billingCountry', v => v !== '', 'Please select a country') && ok;
   
  }
  if (step === 3) {
    ok = validate('cardName', v => v.length >= 3, 'Name on card is required') && ok;
    ok = validate('cardNumber', v => v.replace(/\s/g, '').length === 16, 'Enter a valid 16-digit card number') && ok;
    ok = validate('cardExpiry', v => /^\d{2}\s\/\s\d{2}$/.test(v), 'Enter a valid expiry (MM / YY)') && ok;
    ok = validate('cardCvv', v => v.length >= 3, 'Enter a valid CVV') && ok;
  }
  return ok;
}


function validate(id, rule, msg) {
  const el = document.getElementById(id); //see the box with the id example email
  const errEl = document.getElementById('err-' + id); //put errr before it ex err-email
  if (!el) return true; //eza msh mwjodi bl form y3ne kllo fine its true 

  const ok = rule(el.value.trim()); //mnakhd l inout box content trim it and assign it to ok variable to be tested 
  
  // Uses Bootstrap's native validation feedback borders
  el.classList.toggle('is-invalid', !ok); //change border colors red
  el.classList.toggle('is-valid', ok);
  
  //if there is no error put '' y3ne true eza la2 display error message 
  if (errEl) {
    errEl.textContent = ok ? '' : msg;
  }
  //return the state to validation step
  return ok;
}

// Clear error on input
//bs ykon fe error w nrj3 nktob the invalid state is removed to wait the new response 
document.querySelectorAll('input, select').forEach(el => {
  el.addEventListener('input', () => {
    el.classList.remove('is-invalid');
    const errEl = document.getElementById('err-' + el.id);
    if (errEl) errEl.textContent = '';
  });
});

function submitPayment() {
  if (!validateStep(3)) return;
  
  const btn = document.getElementById('payBtn');
  const spinner = document.getElementById('paymentSpinner');
  const errDiv = document.getElementById('paymentError');
  
  // Show Bootstrap alert cleanly by removing d-none
  errDiv.classList.add('d-none');
  
  // Activate layout spinner mechanism
  spinner.classList.remove('d-none');
  btn.disabled = true;

  setTimeout(() => {
    spinner.classList.add('d-none');
    btn.disabled = false;

    // 80% success / 20% failure simulation
    //failure is done by math.random state la2nu ma fee cases nsht8l 3lyha 
    if (Math.random() > 0.2) {
      document.getElementById('section-3').classList.add('d-none');
      document.getElementById('section-3').classList.remove('active');
      
      //success case
      const successScreen = document.getElementById('success-screen');
      successScreen.classList.remove('d-none');
      successScreen.classList.add('active');
      
      const ref = 'BEP-' + Math.floor(100000 + Math.random() * 900000);
      document.getElementById('orderRef').textContent = 'ORDER #' + ref;
    } else {
      // Reveal Bootstrap error container layout block

      //error case
      errDiv.classList.remove('d-none');
      document.getElementById('paymentErrorMsg').textContent =
        'Your card was declined. Please try another payment method or contact your bank.';
    }
  }, 2800);
}