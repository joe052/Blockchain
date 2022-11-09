document.forms['myFormId'].addEventListener('submit', (event) => {
  event.preventDefault();
  // TODO do something here to show user that form is being submitted
  fetch(event.target.action, {
    method: 'POST',
    body: new URLSearchParams(new FormData(event.target)) // event.target is the form
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json(); // or response.text() or whatever the server sends
  }).then((body) => {
    // TODO handle body
    if (body.message) {
      alert(body.message);
    }
    location.reload();
  }).catch((error) => {
    // TODO handle error
    alert(error);
  });
});

function getBalance() {
  //fetch balance from api
  fetch('/balance').then(async (response) => {
    return response.json();
  }).then((data) => {
    console.log(data);    
    document.getElementById('amount').innerText = data.balance;
  }); 
}