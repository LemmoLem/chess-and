function showPopup(options, x, y) {
  return new Promise((resolve) => {
    const popup = document.getElementById('popup');
    const popupOptions = document.getElementById('popupOptions');
    popUpActive = true;
    // Clear any existing options
    popupOptions.innerHTML = '';

    // Create the options list
    options.forEach((optionText) => {
      const div = document.createElement('div');
      div.innerHTML = optionText;
      div.classList.add('option');

      // Add a click event listener to each option
      // USE UNICODE BASED ON COLOUR TO SHOW OPTIONS
      div.addEventListener('click', function () {
        console.log(`You selected: ${optionText}`);
        popUpActive = false;
        popup.classList.add('hidden'); // Close the pop-up after selecting an option
        resolve(optionText); // Resolve the Promise with the selected option
      });

      popupOptions.appendChild(div);
    });

    // Show the pop-up at the specified position
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    popup.classList.remove('hidden');
  });
}