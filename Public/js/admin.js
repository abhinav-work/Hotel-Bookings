var value = true;
var count= 0;
var likeIN;
const deleteHotel = (btn) => {
    const hotelID = btn.parentNode.querySelector('[name = hotelID]').value;
    const csrf = document.getElementById("_csrf").value
    const blogElement = btn.closest('.grid')
    console.log("Deleting")
    console.log(hotelID)
    fetch('/admin/delete-hotel/' + hotelID, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
        .then(result => {
            return result.json();
        })
        .then(data => {
            console.log(data);
            blogElement.parentNode.removeChild(blogElement)
        })
        .catch(err => console.log(err))
}
 
  