function autoAnswer() {
  correction = document.getElementsByClassName("leading-none")
  for (let item of correction) {
    item.click()
  }
  setTimeout(function() {
    check = document.getElementsByClassName("bg-success-05")
    for (let item of check) {
      item.click()
    }
  }, 200) //ne pas baisser

  setTimeout(function() {
    popup = document.getElementsByClassName("text-neutral-20")
    if (popup.length != 0) {
      popup[0].click()
    }
    setTimeout(function() {
      skip = document.getElementsByClassName("button-solid-primary-large")
      if (skip.length != 0) {
        skip[0].click()
      } else {
        skip = document.getElementsByClassName("button-outline-primary-large")
        if (skip.length != 0) {
          skip[0].click()
        } else {
          skip = document.getElementsByClassName("button-solid-primary-medium")
          if (skip.length != 0) {
            skip[0].click()
          } else {
            console.log("Erreur : Go skip a la main / retour au menu principal");
          }
        }
      }

    }, 900) //ne pas baisser
  }, 2500) //ne pas baisser

  setTimeout(function() {
    autoAnswer()
  }, 5000) //temps réponse en ms
}
autoAnswer()