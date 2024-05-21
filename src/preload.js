const { app } = require('electron');
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
      replaceText(`app-version`, app.getVersion())
  })