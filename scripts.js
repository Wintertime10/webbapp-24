document.getElementById("itemForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from submitting

    // Get all checkboxes
    const checkboxes = document.querySelectorAll('input[name="items"]:checked');
    let selectedValues = Array.from(checkboxes).map(cb => cb.value);

    // Display the image if "banana" and "duck" are selected
    if (selectedValues.includes("banana") && selectedValues.includes("duck")) {
        document.getElementById("imageContainer").style.display = "block";
    } else {
        document.getElementById("imageContainer").style.display = "none";
        alert("Please select both 'banana' and 'duck' to see the image!");
    }
});